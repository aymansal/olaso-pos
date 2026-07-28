import { v } from 'convex/values';
import type { Doc, Id } from './_generated/dataModel';
import { internalQuery, mutation } from './_generated/server';
import {
  boundedInteger,
  cleanOptionalText,
  cleanText,
  conflict,
  invalid,
} from './lib/management';
import { requireOperationalAccess } from './lib/operational';

declare const process: { env: Record<string, string | undefined> };

const serviceMode = v.union(
  v.literal('dine-in'),
  v.literal('take-away'),
  v.literal('online'),
);
const saleLine = v.object({
  productId: v.id('products'),
  productRevision: v.number(),
  recipeVersionId: v.optional(v.id('recipeVersions')),
  quantity: v.number(),
  modifierOptionIds: v.array(v.id('modifierOptions')),
});
const TAX_POLICY_LABEL = 'Temporary 0% — owner confirmation pending';
const PAYMENT_METHOD = 'Pending owner confirmation';

type PreparedLine = {
  product: Doc<'products'>;
  category: Doc<'categories'>;
  recipe?: Doc<'recipeVersions'>;
  quantity: number;
  unitPriceCentimes: number;
  lineTotalCentimes: number;
  modifiers: Array<{
    groupName: string;
    optionName: string;
    priceDeltaCentimes: number;
  }>;
  ingredientUsage: Map<Id<'ingredients'>, number>;
};

function identifier(value: string, label: string) {
  const cleaned = cleanText(value, label, 128);
  if (!/^[A-Za-z0-9._:-]+$/.test(cleaned)) {
    return invalid(`${label} contains unsupported characters.`);
  }
  return cleaned;
}

function checkedTotal(value: number, label: string) {
  if (!Number.isSafeInteger(value) || value < 0) {
    return invalid(`${label} is outside the supported integer range.`);
  }
  return value;
}

export const accept = mutation({
  args: {
    deviceId: v.string(),
    localSaleId: v.string(),
    receiptNumber: v.string(),
    serviceMode,
    customerName: v.optional(v.string()),
    tableLabel: v.optional(v.string()),
    businessDate: v.string(),
    completedAt: v.number(),
    lines: v.array(saleLine),
  },
  handler: async (ctx, args) => {
    const actor = await requireOperationalAccess(ctx);
    const deviceId = identifier(args.deviceId, 'Device ID');
    const localSaleId = identifier(args.localSaleId, 'Local sale ID');
    const existing = await ctx.db
      .query('sales')
      .withIndex('by_device_local_sale', (q) =>
        q.eq('deviceId', deviceId).eq('localSaleId', localSaleId),
      )
      .unique();
    if (existing) {
      return {
        saleId: existing._id,
        receiptNumber: existing.receiptNumber,
        acknowledgedAt: existing.acknowledgedAt,
        duplicate: true,
      };
    }

    const receiptNumber = cleanText(args.receiptNumber, 'Receipt number', 64);
    const customerName = cleanOptionalText(
      args.customerName,
      'Customer name',
      80,
    );
    const tableLabel = cleanOptionalText(args.tableLabel, 'Table', 40);
    if (args.serviceMode === 'dine-in' && !tableLabel) {
      return invalid('Table is required for dine in.');
    }
    const parsedBusinessDate = Date.parse(
      `${args.businessDate}T00:00:00.000Z`,
    );
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(args.businessDate)
      || !Number.isFinite(parsedBusinessDate)
      || new Date(parsedBusinessDate)
        .toISOString()
        .slice(0, 10) !== args.businessDate
    ) {
      return invalid('Business date must use YYYY-MM-DD.');
    }
    const completedAt = boundedInteger(
      args.completedAt,
      'Completion time',
      0,
      Number.MAX_SAFE_INTEGER,
    );
    if (args.lines.length < 1 || args.lines.length > 50) {
      return invalid('A sale must contain 1 to 50 lines.');
    }

    const preparedLines: PreparedLine[] = [];
    for (const line of args.lines) {
      const quantity = boundedInteger(line.quantity, 'Quantity', 1, 100);
      const product = await ctx.db.get(line.productId);
      if (!product || product.status !== 'active') {
        return conflict('A sale product is no longer available.');
      }
      if (
        boundedInteger(
          line.productRevision,
          'Product revision',
          1,
          Number.MAX_SAFE_INTEGER,
        ) !== product.revision
      ) {
        return conflict(`${product.name} changed after it was added.`);
      }
      if (line.recipeVersionId !== product.currentRecipeVersionId) {
        return conflict(`${product.name} has a newer recipe.`);
      }
      if (product.modifierGroupIds.length > 20) {
        return invalid(`${product.name} has too many modifier groups.`);
      }
      const selectedIds = [...new Set(line.modifierOptionIds)];
      if (
        selectedIds.length !== line.modifierOptionIds.length
        || selectedIds.length > 20
      ) {
        return invalid(`Invalid modifiers for ${product.name}.`);
      }
      const [selectedOptions, groups, category] = await Promise.all([
        Promise.all(selectedIds.map((id) => ctx.db.get(id))),
        Promise.all(product.modifierGroupIds.map((id) => ctx.db.get(id))),
        ctx.db.get(product.categoryId),
      ]);
      if (!category || category.status !== 'active') {
        return conflict(`${product.name}'s category is unavailable.`);
      }
      if (groups.some((group) => !group || group.status !== 'active')) {
        return conflict(`${product.name}'s modifier setup is unavailable.`);
      }
      if (
        selectedOptions.some(
          (option) =>
            !option
            || option.status !== 'active'
            || !product.modifierGroupIds.includes(option.groupId),
        )
      ) {
        return conflict(`A selected modifier for ${product.name} is unavailable.`);
      }
      for (const group of groups) {
        if (!group) return conflict('A modifier group is missing.');
        const count = selectedOptions.filter(
          (option) => option?.groupId === group._id,
        ).length;
        if (count < group.minSelections || count > group.maxSelections) {
          return invalid(
            `${group.name} requires ${group.minSelections} to ${group.maxSelections} choices.`,
          );
        }
      }

      const options = selectedOptions.flatMap((option) => option ? [option] : []);
      const unitPriceCentimes = checkedTotal(
        product.basePriceCentimes
          + options.reduce(
            (sum, option) => sum + option.priceDeltaCentimes,
            0,
          ),
        `${product.name} price`,
      );
      const lineTotalCentimes = checkedTotal(
        unitPriceCentimes * quantity,
        `${product.name} line total`,
      );
      const recipe = product.currentRecipeVersionId
        ? await ctx.db.get(product.currentRecipeVersionId)
        : undefined;
      if (
        product.currentRecipeVersionId
        && (
          !recipe
          || recipe.productId !== product._id
          || recipe.status !== 'active'
        )
      ) {
        return conflict(`${product.name}'s current recipe is unavailable.`);
      }
      const recipeItems = recipe
        ? await ctx.db
            .query('recipeItems')
            .withIndex('by_recipe_version', (q) =>
              q.eq('recipeVersionId', recipe._id),
            )
            .take(101)
        : [];
      if (recipeItems.length > 100) {
        return invalid(`${product.name}'s recipe exceeds 100 ingredients.`);
      }

      const ingredientUsage = new Map<Id<'ingredients'>, number>();
      for (const item of recipeItems) {
        const amount = boundedInteger(
          item.quantity,
          'Recipe quantity',
          1,
          1_000_000,
        );
        ingredientUsage.set(
          item.ingredientId,
          (ingredientUsage.get(item.ingredientId) ?? 0) + amount,
        );
      }
      for (const option of options) {
        for (const effect of option.ingredientEffects) {
          const amount = boundedInteger(
            effect.quantityDelta,
            'Modifier ingredient effect',
            -1_000_000,
            1_000_000,
          );
          ingredientUsage.set(
            effect.ingredientId,
            (ingredientUsage.get(effect.ingredientId) ?? 0) + amount,
          );
        }
      }
      for (const [ingredientId, amount] of ingredientUsage) {
        if (!Number.isSafeInteger(amount) || amount < 0) {
          return invalid(`Modifier effects make ${product.name}'s recipe invalid.`);
        }
        ingredientUsage.set(
          ingredientId,
          checkedTotal(amount * quantity, 'Ingredient usage'),
        );
      }
      preparedLines.push({
        product,
        category,
        ...(recipe ? { recipe } : {}),
        quantity,
        unitPriceCentimes,
        lineTotalCentimes,
        modifiers: options.map((option) => ({
          groupName:
            groups.find((group) => group?._id === option.groupId)?.name
            ?? 'Modifier',
          optionName: option.name,
          priceDeltaCentimes: option.priceDeltaCentimes,
        })),
        ingredientUsage,
      });
    }

    const subtotalCentimes = checkedTotal(
      preparedLines.reduce((sum, line) => sum + line.lineTotalCentimes, 0),
      'Sale subtotal',
    );
    const saleIngredientUsage = new Map<Id<'ingredients'>, number>();
    for (const line of preparedLines) {
      for (const [ingredientId, amount] of line.ingredientUsage) {
        saleIngredientUsage.set(
          ingredientId,
          checkedTotal(
            (saleIngredientUsage.get(ingredientId) ?? 0) + amount,
            'Sale ingredient usage',
          ),
        );
      }
    }
    const ingredientRecords = new Map<Id<'ingredients'>, Doc<'ingredients'>>();
    for (const ingredientId of saleIngredientUsage.keys()) {
      const ingredient = await ctx.db.get(ingredientId);
      if (!ingredient || ingredient.status !== 'active') {
        return conflict('A recipe ingredient is unavailable.');
      }
      ingredientRecords.set(ingredientId, ingredient);
    }

    const acknowledgedAt = Date.now();
    const saleId = await ctx.db.insert('sales', {
      deviceId,
      localSaleId,
      receiptNumber,
      cashierName: actor,
      serviceMode: args.serviceMode,
      ...(customerName ? { customerName } : {}),
      ...(tableLabel ? { tableLabel } : {}),
      subtotalCentimes,
      discountCentimes: 0,
      taxCentimes: 0,
      totalCentimes: subtotalCentimes,
      taxPolicyLabel: TAX_POLICY_LABEL,
      paymentMethod: PAYMENT_METHOD,
      status: 'completed',
      businessDate: args.businessDate,
      completedAt,
      acknowledgedAt,
      receiptSnapshot: {
        receiptNumber,
        completedAt,
        serviceMode: args.serviceMode,
        ...(customerName ? { customerName } : {}),
        ...(tableLabel ? { tableLabel } : {}),
        lines: preparedLines.map((line) => ({
          productName: line.product.receiptName,
          quantity: line.quantity,
          unitPriceCentimes: line.unitPriceCentimes,
          lineTotalCentimes: line.lineTotalCentimes,
          modifiers: line.modifiers,
        })),
        subtotalCentimes,
        discountCentimes: 0,
        taxCentimes: 0,
        totalCentimes: subtotalCentimes,
        taxPolicyLabel: TAX_POLICY_LABEL,
        paymentMethod: PAYMENT_METHOD,
      },
    });
    for (const line of preparedLines) {
      await ctx.db.insert('saleItems', {
        saleId,
        productId: line.product._id,
        productName: line.product.name,
        receiptName: line.product.receiptName,
        unitPriceCentimes: line.unitPriceCentimes,
        quantity: line.quantity,
        modifiers: line.modifiers,
        ...(line.recipe ? { recipeVersionId: line.recipe._id } : {}),
        lineTotalCentimes: line.lineTotalCentimes,
      });
    }
    for (const [ingredientId, amount] of saleIngredientUsage) {
      if (amount === 0) continue;
      const ingredient = ingredientRecords.get(ingredientId);
      if (!ingredient) return conflict('A recipe ingredient is missing.');
      await ctx.db.patch(ingredientId, {
        currentStockQuantity: ingredient.currentStockQuantity - amount,
        revision: ingredient.revision + 1,
        updatedAt: acknowledgedAt,
        updatedBy: actor,
      });
      await ctx.db.insert('stockMovements', {
        ingredientId,
        quantityDelta: -amount,
        movementType: 'sale',
        relatedSaleId: saleId,
        reason: `Recipe deduction for ${receiptNumber}`,
        deviceId,
        actorLabel: actor,
        businessDate: args.businessDate,
        createdAt: completedAt,
        clientMutationId: `${deviceId}:${localSaleId}:${ingredientId}`,
      });
    }
    for (const recipe of new Map(
      preparedLines.flatMap((line) =>
        line.recipe ? [[line.recipe._id, line.recipe] as const] : [],
      ),
    ).values()) {
      if (!recipe.firstUsedAt) {
        await ctx.db.patch(recipe._id, {
          firstUsedAt: completedAt,
          updatedAt: acknowledgedAt,
          updatedBy: actor,
        });
      }
    }

    const metricRows = await ctx.db
      .query('dailyMetrics')
      .withIndex('by_business_date', (q) =>
        q.eq('businessDate', args.businessDate),
      )
      .take(2);
    if (metricRows.length > 1) {
      return conflict('Daily summary data is duplicated.');
    }
    const metric = metricRows[0];
    if (
      metric
      && (
        metric.productTotals.length > 500
        || metric.categoryTotals.length > 100
        || metric.totalsByPaymentMethod.length > 20
        || metric.totalsByServiceMode.length > 10
      )
    ) {
      return invalid('Daily summary data exceeds its supported limits.');
    }
    const totalsByPaymentMethod = metric
      ? metric.totalsByPaymentMethod.map((row) => ({ ...row }))
      : [];
    const payment = totalsByPaymentMethod.find(
      (row) => row.paymentMethod === PAYMENT_METHOD,
    );
    if (payment) {
      payment.totalCentimes += subtotalCentimes;
      payment.orderCount += 1;
    } else {
      totalsByPaymentMethod.push({
        paymentMethod: PAYMENT_METHOD,
        totalCentimes: subtotalCentimes,
        orderCount: 1,
      });
    }
    const totalsByServiceMode = metric
      ? metric.totalsByServiceMode.map((row) => ({ ...row }))
      : [];
    const service = totalsByServiceMode.find(
      (row) => row.serviceMode === args.serviceMode,
    );
    if (service) {
      service.totalCentimes += subtotalCentimes;
      service.orderCount += 1;
    } else {
      totalsByServiceMode.push({
        serviceMode: args.serviceMode,
        totalCentimes: subtotalCentimes,
        orderCount: 1,
      });
    }
    const productTotals = metric
      ? metric.productTotals.map((row) => ({ ...row }))
      : [];
    const categoryTotals = metric
      ? metric.categoryTotals.map((row) => ({ ...row }))
      : [];
    for (const line of preparedLines) {
      const productTotal = productTotals.find(
        (row) => row.productId === line.product._id,
      );
      if (productTotal) {
        productTotal.quantity += line.quantity;
        productTotal.totalCentimes += line.lineTotalCentimes;
      } else {
        productTotals.push({
          productId: line.product._id,
          productName: line.product.name,
          quantity: line.quantity,
          totalCentimes: line.lineTotalCentimes,
        });
      }
      const categoryTotal = categoryTotals.find(
        (row) => row.categoryId === line.category._id,
      );
      if (categoryTotal) {
        categoryTotal.quantity += line.quantity;
        categoryTotal.totalCentimes += line.lineTotalCentimes;
      } else {
        categoryTotals.push({
          categoryId: line.category._id,
          categoryName: line.category.name,
          quantity: line.quantity,
          totalCentimes: line.lineTotalCentimes,
        });
      }
    }
    const metricValue = {
      businessDate: args.businessDate,
      grossCentimes: (metric?.grossCentimes ?? 0) + subtotalCentimes,
      netCentimes: (metric?.netCentimes ?? 0) + subtotalCentimes,
      orderCount: (metric?.orderCount ?? 0) + 1,
      cancelledCentimes: metric?.cancelledCentimes ?? 0,
      refundedCentimes: metric?.refundedCentimes ?? 0,
      totalsByPaymentMethod,
      totalsByServiceMode,
      productTotals,
      categoryTotals,
      updatedAt: acknowledgedAt,
    };
    if (metric) {
      await ctx.db.patch(metric._id, metricValue);
    } else {
      await ctx.db.insert('dailyMetrics', metricValue);
    }

    return {
      saleId,
      receiptNumber,
      acknowledgedAt,
      duplicate: false,
    };
  },
});

export const verifyDevelopmentSale = internalQuery({
  args: {
    deviceId: v.string(),
    localSaleId: v.string(),
  },
  handler: async (ctx, args) => {
    if (process.env.OLASO_ENABLE_DEV_SEED !== 'true') {
      throw new Error('Development verification is disabled.');
    }
    const sale = await ctx.db
      .query('sales')
      .withIndex('by_device_local_sale', (q) =>
        q.eq('deviceId', args.deviceId).eq('localSaleId', args.localSaleId),
      )
      .unique();
    if (!sale) return null;
    const [lines, movements] = await Promise.all([
      ctx.db
        .query('saleItems')
        .withIndex('by_sale', (q) => q.eq('saleId', sale._id))
        .take(51),
      ctx.db
        .query('stockMovements')
        .withIndex('by_related_sale', (q) => q.eq('relatedSaleId', sale._id))
        .take(101),
    ]);
    if (lines.length > 50 || movements.length > 100) {
      throw new Error('Development sale exceeds verification limits.');
    }
    return {
      saleId: sale._id,
      totalCentimes: sale.totalCentimes,
      lineCount: lines.length,
      movementCount: movements.length,
      movementDeltas: movements
        .map((movement) => movement.quantityDelta)
        .sort((a, b) => a - b),
    };
  },
});
