import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import {
  allocateCentimes,
  consumeValuation,
  receiveValuation,
} from '../src/lib/costs';
import {
  boundedInteger,
  businessDate,
  cleanKey,
  cleanOptionalText,
  cleanText,
  conflict,
  expectRevision,
  invalid,
  mutationId,
  notFound,
  requireManagement,
} from './lib/management';
import { sessionArgs } from './lib/session';

const MAX_INGREDIENTS = 100;
const MAX_DAILY_MOVEMENTS = 500;
const MAX_RECENT_MOVEMENTS = 50;
const MAX_RECIPE_LINKS = 100;
const MAX_TIMESTAMP = 8_640_000_000_000_000;
const MAX_PACKAGE_QUANTITY = 100_000_000;
const baseUnit = v.union(
  v.literal('millilitre'),
  v.literal('gram'),
  v.literal('milligram'),
  v.literal('piece'),
);

function multiplied(left: number, right: number, label: string) {
  const result = BigInt(left) * BigInt(right);
  if (result > BigInt(Number.MAX_SAFE_INTEGER)) {
    return invalid(`${label} exceeds the supported integer range.`);
  }
  return Number(result);
}

function valuationOf(ingredient: {
  currentStockQuantity: number;
  inventoryValueCentimes?: number;
  costStatus?: 'complete' | 'incomplete';
}) {
  return {
    quantity: ingredient.currentStockQuantity,
    ...(ingredient.inventoryValueCentimes === undefined
      ? {}
      : { inventoryValueCentimes: ingredient.inventoryValueCentimes }),
    complete:
      ingredient.costStatus === 'complete' &&
      ingredient.inventoryValueCentimes !== undefined,
  };
}

function valuationFields(
  valuation: ReturnType<typeof valuationOf>,
  revision: number,
) {
  return valuation.complete && valuation.inventoryValueCentimes !== undefined
    ? {
        inventoryValueCentimes: valuation.inventoryValueCentimes,
        costStatus: 'complete' as const,
        valuationRevision: revision,
      }
    : {
        inventoryValueCentimes: undefined,
        costStatus: 'incomplete' as const,
        valuationRevision: revision,
      };
}

function packageInput(args: {
  packageLabel: string;
  packageCount: number;
  quantityPerPackage: number;
  packagePriceCentimes: number;
  receivedAt: number;
  supplierLabel?: string;
  note?: string;
}) {
  const packageCount = boundedInteger(
    args.packageCount,
    'Package count',
    1,
    MAX_PACKAGE_QUANTITY,
  );
  const quantityPerPackage = boundedInteger(
    args.quantityPerPackage,
    'Quantity per package',
    1,
    MAX_PACKAGE_QUANTITY,
  );
  const packagePriceCentimes = boundedInteger(
    args.packagePriceCentimes,
    'Package price',
    1,
    MAX_TIMESTAMP,
  );
  return {
    packageLabel: cleanText(args.packageLabel, 'Package label', 40),
    packageCount,
    quantityPerPackage,
    packagePriceCentimes,
    totalQuantity: multiplied(packageCount, quantityPerPackage, 'Total quantity'),
    totalCostCentimes: multiplied(
      packageCount,
      packagePriceCentimes,
      'Total purchase cost',
    ),
    receivedAt: boundedInteger(args.receivedAt, 'Received time', 0, MAX_TIMESTAMP),
    supplierLabel: cleanOptionalText(args.supplierLabel, 'Supplier label', 100),
    note: cleanOptionalText(args.note, 'Purchase note', 240),
  };
}

export const list = query({
  args: { ...sessionArgs, businessDate: v.string() },
  handler: async (ctx, args) => {
    await requireManagement(ctx, args);
    const date = businessDate(args.businessDate);
    const [ingredients, movements] = await Promise.all([
      ctx.db
        .query('ingredients')
        .withIndex('by_updated_at')
        .take(MAX_INGREDIENTS + 1),
      ctx.db
        .query('stockMovements')
        .withIndex('by_business_date_created_at', (index) =>
          index.eq('businessDate', date),
        )
        .take(MAX_DAILY_MOVEMENTS + 1),
    ]);
    if (
      ingredients.length > MAX_INGREDIENTS ||
      movements.length > MAX_DAILY_MOVEMENTS
    ) {
      throw new Error('Inventory result exceeded its bounded limit.');
    }

    const usedToday = new Map<string, number>();
    for (const movement of movements) {
      if (movement.movementType === 'sale' && movement.quantityDelta < 0) {
        usedToday.set(
          movement.ingredientId,
          (usedToday.get(movement.ingredientId) ?? 0) -
            movement.quantityDelta,
        );
      }
    }
    const sorted = ingredients.sort(
      (left, right) =>
        Number(left.status === 'archived') -
          Number(right.status === 'archived') ||
        left.name.localeCompare(right.name),
    );
    const active = sorted.filter((ingredient) => ingredient.status === 'active');

    return {
      ingredients: sorted.map((ingredient) => ({
        ...ingredient,
        usedToday: usedToday.get(ingredient._id) ?? 0,
      })),
      metrics: {
        ingredientCount: active.length,
        lowStockCount: active.filter(
          (ingredient) =>
            ingredient.currentStockQuantity <= ingredient.lowStockThreshold,
        ).length,
        movementCount: movements.length,
        adjustmentCount: movements.filter(
          (movement) => movement.movementType === 'manual-adjustment',
        ).length,
      },
    };
  },
});

export const getDetail = query({
  args: { ...sessionArgs, ingredientId: v.id('ingredients') },
  handler: async (ctx, args) => {
    await requireManagement(ctx, args);
    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient) return notFound('Ingredient');

    const [movements, recipeItems, purchases] = await Promise.all([
      ctx.db
        .query('stockMovements')
        .withIndex('by_ingredient_created_at', (index) =>
          index.eq('ingredientId', ingredient._id),
        )
        .order('desc')
        .take(MAX_RECENT_MOVEMENTS + 1),
      ctx.db
        .query('recipeItems')
        .withIndex('by_ingredient_created_at', (index) =>
          index.eq('ingredientId', ingredient._id),
        )
        .order('desc')
        .take(MAX_RECIPE_LINKS + 1),
      ctx.db
        .query('inventoryPurchases')
        .withIndex('by_ingredient_received_at', (index) =>
          index.eq('ingredientId', ingredient._id),
        )
        .order('desc')
        .take(MAX_RECENT_MOVEMENTS + 1),
    ]);
    if (
      movements.length > MAX_RECENT_MOVEMENTS ||
      recipeItems.length > MAX_RECIPE_LINKS ||
      purchases.length > MAX_RECENT_MOVEMENTS
    ) {
      throw new Error('Ingredient detail exceeded its bounded limit.');
    }

    const versions = await Promise.all(
      recipeItems.map((item) => ctx.db.get(item.recipeVersionId)),
    );
    const products = await Promise.all(
      versions.map((version) =>
        version ? ctx.db.get(version.productId) : Promise.resolve(null),
      ),
    );
    const linkedRecipes = [];
    const linkedProductIds = new Set<string>();
    for (let index = 0; index < recipeItems.length; index += 1) {
      const version = versions[index];
      const product = products[index];
      if (
        !version ||
        !product ||
        product.status === 'archived' ||
        product.currentRecipeVersionId !== version._id ||
        linkedProductIds.has(product._id)
      ) {
        continue;
      }
      linkedProductIds.add(product._id);
      linkedRecipes.push({
        productId: product._id,
        productName: product.name,
        quantity: recipeItems[index].quantity,
      });
    }

    return {
      ingredient,
      movements,
      purchases,
      linkedRecipes: linkedRecipes.slice(0, 20),
    };
  },
});

export const saveIngredient = mutation({
  args: {
    ...sessionArgs,
    id: v.optional(v.id('ingredients')),
    key: v.optional(v.string()),
    name: v.string(),
    baseUnit,
    lowStockThreshold: v.number(),
    openingQuantity: v.optional(v.number()),
    expectedRevision: v.optional(v.number()),
    businessDate: v.string(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const name = cleanText(args.name, 'Ingredient name', 100);
    const lowStockThreshold = boundedInteger(
      args.lowStockThreshold,
      'Low-stock threshold',
      0,
      100_000_000,
    );
    const date = businessDate(args.businessDate);
    const updatedAt = Date.now();

    if (args.id) {
      const ingredient = await ctx.db.get(args.id);
      if (!ingredient) return notFound('Ingredient');
      if (ingredient.lastMutationId === clientMutationId) {
        return {
          id: ingredient._id,
          revision: ingredient.revision,
          created: false,
        };
      }
      expectRevision(args.expectedRevision, ingredient.revision);
      if (ingredient.status === 'archived') {
        return conflict('Restore this ingredient before editing it.');
      }
      if (ingredient.baseUnit !== args.baseUnit) {
        return conflict('Base unit cannot change after ingredient creation.');
      }
      await ctx.db.patch(ingredient._id, {
        name,
        lowStockThreshold,
        revision: ingredient.revision + 1,
        updatedAt,
        updatedBy,
        lastMutationId: clientMutationId,
      });
      return {
        id: ingredient._id,
        revision: ingredient.revision + 1,
        created: false,
      };
    }

    const key = cleanKey(args.key, 'Ingredient key');
    const existing = await ctx.db
      .query('ingredients')
      .withIndex('by_key', (index) => index.eq('key', key))
      .unique();
    if (existing) {
      if (existing.lastMutationId === clientMutationId) {
        return { id: existing._id, revision: existing.revision, created: false };
      }
      return conflict('An ingredient with this key already exists.');
    }
    const openingQuantity = boundedInteger(
      args.openingQuantity ?? 0,
      'Opening quantity',
      0,
      100_000_000,
    );
    const id = await ctx.db.insert('ingredients', {
      key,
      name,
      baseUnit: args.baseUnit,
      currentStockQuantity: openingQuantity,
      lowStockThreshold,
      status: 'active',
      revision: 1,
      updatedAt,
      updatedBy,
      lastMutationId: clientMutationId,
    });
    if (openingQuantity > 0) {
      await ctx.db.insert('stockMovements', {
        ingredientId: id,
        quantityDelta: openingQuantity,
        movementType: 'stock-addition',
        reason: `Opening stock for ${name}`,
        actorLabel: updatedBy,
        businessDate: date,
        createdAt: updatedAt,
        clientMutationId,
      });
    }
    return { id, revision: 1, created: true };
  },
});

export const setIngredientArchived = mutation({
  args: {
    ...sessionArgs,
    id: v.id('ingredients'),
    archived: v.boolean(),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const ingredient = await ctx.db.get(args.id);
    if (!ingredient) return notFound('Ingredient');
    if (ingredient.lastMutationId === clientMutationId) {
      return { id: ingredient._id, revision: ingredient.revision };
    }
    expectRevision(args.expectedRevision, ingredient.revision);
    await ctx.db.patch(ingredient._id, {
      status: args.archived ? 'archived' : 'active',
      revision: ingredient.revision + 1,
      updatedAt: Date.now(),
      updatedBy,
      lastMutationId: clientMutationId,
    });
    return { id: ingredient._id, revision: ingredient.revision + 1 };
  },
});

export const receivePurchase = mutation({
  args: {
    ...sessionArgs,
    ingredientId: v.id('ingredients'),
    packageLabel: v.string(),
    packageCount: v.number(),
    quantityPerPackage: v.number(),
    packagePriceCentimes: v.number(),
    receivedAt: v.number(),
    businessDate: v.string(),
    supplierLabel: v.optional(v.string()),
    note: v.optional(v.string()),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const actorLabel = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const previous = await ctx.db
      .query('inventoryPurchases')
      .withIndex('by_client_mutation', (index) =>
        index.eq('clientMutationId', clientMutationId),
      )
      .unique();
    if (previous) {
      const ingredient = await ctx.db.get(previous.ingredientId);
      return {
        purchaseId: previous._id,
        stockMovementId: previous.stockMovementId,
        ingredientRevision: ingredient?.revision ?? args.expectedRevision + 1,
        currentStockQuantity: ingredient?.currentStockQuantity ?? 0,
        ...(ingredient?.inventoryValueCentimes === undefined
          ? {}
          : { inventoryValueCentimes: ingredient.inventoryValueCentimes }),
        costStatus: ingredient?.costStatus ?? 'incomplete',
      };
    }

    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient) return notFound('Ingredient');
    if (ingredient.status !== 'active') {
      return conflict('Restore this ingredient before receiving a purchase.');
    }
    expectRevision(args.expectedRevision, ingredient.revision);
    const input = packageInput(args);
    const date = businessDate(args.businessDate);
    const currentStockQuantity = boundedInteger(
      ingredient.currentStockQuantity + input.totalQuantity,
      'Resulting stock quantity',
      0,
      MAX_PACKAGE_QUANTITY,
    );
    const valuation = receiveValuation(
      valuationOf(ingredient),
      input.totalQuantity,
      input.totalCostCentimes,
    );
    const valuationRevision = (ingredient.valuationRevision ?? 0) + 1;
    const stockMovementId = await ctx.db.insert('stockMovements', {
      ingredientId: ingredient._id,
      quantityDelta: input.totalQuantity,
      movementType: 'purchase',
      reason: `Purchase receipt: ${input.packageCount} ${input.packageLabel}`,
      actorLabel,
      businessDate: date,
      createdAt: input.receivedAt,
      clientMutationId,
      costDeltaCentimes: input.totalCostCentimes,
      ...(valuation.inventoryValueCentimes === undefined
        ? {}
        : { inventoryValueAfterCentimes: valuation.inventoryValueCentimes }),
      valuationRevision,
    });
    const purchaseId = await ctx.db.insert('inventoryPurchases', {
      ingredientId: ingredient._id,
      stockMovementId,
      packageLabel: input.packageLabel,
      packageCount: input.packageCount,
      quantityPerPackage: input.quantityPerPackage,
      totalQuantity: input.totalQuantity,
      packagePriceCentimes: input.packagePriceCentimes,
      totalCostCentimes: input.totalCostCentimes,
      receivedAt: input.receivedAt,
      businessDate: date,
      actorLabel,
      ...(input.supplierLabel ? { supplierLabel: input.supplierLabel } : {}),
      ...(input.note ? { note: input.note } : {}),
      transactionType: 'received',
      revision: 1,
      clientMutationId,
    });
    await ctx.db.patch(ingredient._id, {
      currentStockQuantity,
      ...valuationFields(valuation, valuationRevision),
      revision: ingredient.revision + 1,
      updatedAt: input.receivedAt,
      updatedBy: actorLabel,
      lastMutationId: clientMutationId,
    });
    return {
      purchaseId,
      stockMovementId,
      ingredientRevision: ingredient.revision + 1,
      currentStockQuantity,
      ...(valuation.inventoryValueCentimes === undefined
        ? {}
        : { inventoryValueCentimes: valuation.inventoryValueCentimes }),
      costStatus: valuation.complete ? 'complete' : 'incomplete',
    };
  },
});

export const correctPurchase = mutation({
  args: {
    ...sessionArgs,
    purchaseId: v.id('inventoryPurchases'),
    packageLabel: v.string(),
    packageCount: v.number(),
    quantityPerPackage: v.number(),
    packagePriceCentimes: v.number(),
    receivedAt: v.number(),
    businessDate: v.string(),
    supplierLabel: v.optional(v.string()),
    note: v.optional(v.string()),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const actorLabel = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const reversalMutationId = `${clientMutationId}:reversal`;
    const replacementMutationId = `${clientMutationId}:replacement`;
    const previousReversal = await ctx.db
      .query('inventoryPurchases')
      .withIndex('by_client_mutation', (index) =>
        index.eq('clientMutationId', reversalMutationId),
      )
      .unique();
    if (previousReversal) {
      const replacement = await ctx.db
        .query('inventoryPurchases')
        .withIndex('by_client_mutation', (index) =>
          index.eq('clientMutationId', replacementMutationId),
        )
        .unique();
      const ingredient = await ctx.db.get(previousReversal.ingredientId);
      if (!replacement || !ingredient) {
        throw new Error('Purchase correction retry found incomplete history.');
      }
      return {
        reversalPurchaseId: previousReversal._id,
        replacementPurchaseId: replacement._id,
        ingredientRevision: ingredient.revision,
        currentStockQuantity: ingredient.currentStockQuantity,
        ...(ingredient.inventoryValueCentimes === undefined
          ? {}
          : { inventoryValueCentimes: ingredient.inventoryValueCentimes }),
        costStatus: ingredient.costStatus ?? 'incomplete',
      };
    }

    const original = await ctx.db.get(args.purchaseId);
    if (!original) return notFound('Purchase');
    if (original.transactionType !== 'received') {
      return conflict('Only an original received purchase can be corrected.');
    }
    const priorCorrections = await ctx.db
      .query('inventoryPurchases')
      .withIndex('by_correction_of_received_at', (index) =>
        index.eq('correctionOfPurchaseId', original._id),
      )
      .take(1);
    if (priorCorrections.length) {
      return conflict('This purchase already has append-only correction history.');
    }
    const ingredient = await ctx.db.get(original.ingredientId);
    if (!ingredient) return notFound('Ingredient');
    if (ingredient.status !== 'active') {
      return conflict('Restore this ingredient before correcting a purchase.');
    }
    expectRevision(args.expectedRevision, ingredient.revision);
    if (ingredient.currentStockQuantity < original.totalQuantity) {
      return conflict(
        'Cannot reverse this purchase because its quantity is no longer on hand.',
      );
    }

    const input = packageInput(args);
    const date = businessDate(args.businessDate);
    const reversed = consumeValuation(valuationOf(ingredient), original.totalQuantity);
    const replaced = receiveValuation(
      reversed.next,
      input.totalQuantity,
      input.totalCostCentimes,
    );
    const reversalRevision = (ingredient.valuationRevision ?? 0) + 1;
    const replacementRevision = reversalRevision + 1;
    const reversalMovementId = await ctx.db.insert('stockMovements', {
      ingredientId: ingredient._id,
      quantityDelta: -original.totalQuantity,
      movementType: 'purchase-reversal',
      reason: `Purchase correction reversal: ${original.packageCount} ${original.packageLabel}`,
      actorLabel,
      businessDate: date,
      createdAt: input.receivedAt,
      clientMutationId: reversalMutationId,
      ...(reversed.cost.complete
        ? { costDeltaCentimes: -reversed.cost.costCentimes }
        : {}),
      ...(reversed.next.inventoryValueCentimes === undefined
        ? {}
        : { inventoryValueAfterCentimes: reversed.next.inventoryValueCentimes }),
      valuationRevision: reversalRevision,
    });
    const reversalPurchaseId = await ctx.db.insert('inventoryPurchases', {
      ingredientId: ingredient._id,
      stockMovementId: reversalMovementId,
      packageLabel: original.packageLabel,
      packageCount: original.packageCount,
      quantityPerPackage: original.quantityPerPackage,
      totalQuantity: original.totalQuantity,
      packagePriceCentimes: original.packagePriceCentimes,
      totalCostCentimes: original.totalCostCentimes,
      receivedAt: input.receivedAt,
      businessDate: date,
      actorLabel,
      correctionOfPurchaseId: original._id,
      transactionType: 'reversal',
      revision: 1,
      clientMutationId: reversalMutationId,
    });
    const replacementMovementId = await ctx.db.insert('stockMovements', {
      ingredientId: ingredient._id,
      quantityDelta: input.totalQuantity,
      movementType: 'purchase',
      reason: `Purchase correction replacement: ${input.packageCount} ${input.packageLabel}`,
      actorLabel,
      businessDate: date,
      createdAt: input.receivedAt,
      clientMutationId: replacementMutationId,
      costDeltaCentimes: input.totalCostCentimes,
      ...(replaced.inventoryValueCentimes === undefined
        ? {}
        : { inventoryValueAfterCentimes: replaced.inventoryValueCentimes }),
      valuationRevision: replacementRevision,
    });
    const replacementPurchaseId = await ctx.db.insert('inventoryPurchases', {
      ingredientId: ingredient._id,
      stockMovementId: replacementMovementId,
      packageLabel: input.packageLabel,
      packageCount: input.packageCount,
      quantityPerPackage: input.quantityPerPackage,
      totalQuantity: input.totalQuantity,
      packagePriceCentimes: input.packagePriceCentimes,
      totalCostCentimes: input.totalCostCentimes,
      receivedAt: input.receivedAt,
      businessDate: date,
      actorLabel,
      ...(input.supplierLabel ? { supplierLabel: input.supplierLabel } : {}),
      ...(input.note ? { note: input.note } : {}),
      correctionOfPurchaseId: original._id,
      transactionType: 'received',
      revision: 1,
      clientMutationId: replacementMutationId,
    });
    const currentStockQuantity =
      ingredient.currentStockQuantity - original.totalQuantity + input.totalQuantity;
    await ctx.db.patch(ingredient._id, {
      currentStockQuantity,
      ...valuationFields(replaced, replacementRevision),
      revision: ingredient.revision + 1,
      updatedAt: input.receivedAt,
      updatedBy: actorLabel,
      lastMutationId: clientMutationId,
    });
    return {
      reversalPurchaseId,
      replacementPurchaseId,
      ingredientRevision: ingredient.revision + 1,
      currentStockQuantity,
      ...(replaced.inventoryValueCentimes === undefined
        ? {}
        : { inventoryValueCentimes: replaced.inventoryValueCentimes }),
      costStatus: replaced.complete ? 'complete' : 'incomplete',
    };
  },
});

export const recordAdjustment = mutation({
  args: {
    ...sessionArgs,
    ingredientId: v.id('ingredients'),
    mode: v.union(v.literal('receive'), v.literal('set-count')),
    quantity: v.number(),
    reason: v.string(),
    expectedRevision: v.number(),
    businessDate: v.string(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const date = businessDate(args.businessDate);
    const previousAttempt = await ctx.db
      .query('stockMovements')
      .withIndex('by_ingredient_client_mutation', (index) =>
        index
          .eq('ingredientId', args.ingredientId)
          .eq('clientMutationId', clientMutationId),
      )
      .unique();
    if (previousAttempt) {
      const ingredient = await ctx.db.get(args.ingredientId);
      return {
        movementId: previousAttempt._id,
        ingredientRevision: ingredient?.revision ?? args.expectedRevision + 1,
        currentStockQuantity: ingredient?.currentStockQuantity ?? 0,
      };
    }

    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient) return notFound('Ingredient');
    expectRevision(args.expectedRevision, ingredient.revision);
    if (ingredient.status !== 'active') {
      return conflict('Restore this ingredient before changing stock.');
    }
    const quantity = boundedInteger(
      args.quantity,
      args.mode === 'receive' ? 'Received quantity' : 'Counted quantity',
      args.mode === 'receive' ? 1 : 0,
      100_000_000,
    );
    const quantityDelta =
      args.mode === 'receive'
        ? quantity
        : quantity - ingredient.currentStockQuantity;
    if (quantityDelta === 0) {
      return invalid('The counted quantity already matches the current stock.');
    }
    const currentStockQuantity = boundedInteger(
      ingredient.currentStockQuantity + quantityDelta,
      'Resulting stock quantity',
      0,
      100_000_000,
    );
    const currentValuation = valuationOf(ingredient);
    let valuation = currentValuation;
    let costDeltaCentimes: number | undefined;
    if (args.mode === 'receive') {
      valuation = { quantity: currentStockQuantity, complete: false };
    } else if (quantityDelta < 0) {
      const consumed = consumeValuation(currentValuation, -quantityDelta);
      valuation = consumed.next;
      if (consumed.cost.complete) costDeltaCentimes = -consumed.cost.costCentimes;
    } else if (currentValuation.complete && currentValuation.quantity > 0) {
      const increaseCostCentimes = allocateCentimes(
        currentValuation.inventoryValueCentimes!,
        currentValuation.quantity,
        quantityDelta,
      );
      valuation = receiveValuation(
        currentValuation,
        quantityDelta,
        increaseCostCentimes,
      );
      costDeltaCentimes = increaseCostCentimes;
    } else {
      valuation = { quantity: currentStockQuantity, complete: false };
    }
    const reason = cleanText(args.reason, 'Adjustment reason', 160);
    const createdAt = Date.now();
    const valuationRevision = (ingredient.valuationRevision ?? 0) + 1;
    const movementId = await ctx.db.insert('stockMovements', {
      ingredientId: ingredient._id,
      quantityDelta,
      movementType:
        args.mode === 'receive' ? 'stock-addition' : 'manual-adjustment',
      reason,
      actorLabel: updatedBy,
      businessDate: date,
      createdAt,
      clientMutationId,
      ...(costDeltaCentimes === undefined ? {} : { costDeltaCentimes }),
      ...(valuation.inventoryValueCentimes === undefined
        ? {}
        : { inventoryValueAfterCentimes: valuation.inventoryValueCentimes }),
      valuationRevision,
    });
    await ctx.db.patch(ingredient._id, {
      currentStockQuantity,
      ...valuationFields(valuation, valuationRevision),
      revision: ingredient.revision + 1,
      updatedAt: createdAt,
      updatedBy,
      lastMutationId: clientMutationId,
    });
    return {
      movementId,
      ingredientRevision: ingredient.revision + 1,
      currentStockQuantity,
    };
  },
});
