import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import {
  boundedInteger,
  businessDate,
  cleanKey,
  cleanText,
  conflict,
  expectRevision,
  invalid,
  mutationId,
  notFound,
  requireManagement,
} from './lib/management';

const MAX_INGREDIENTS = 100;
const MAX_DAILY_MOVEMENTS = 500;
const MAX_RECENT_MOVEMENTS = 50;
const MAX_RECIPE_LINKS = 100;
const baseUnit = v.union(
  v.literal('millilitre'),
  v.literal('gram'),
  v.literal('milligram'),
  v.literal('piece'),
);

export const list = query({
  args: { businessDate: v.string() },
  handler: async (ctx, args) => {
    await requireManagement(ctx);
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
  args: { ingredientId: v.id('ingredients') },
  handler: async (ctx, args) => {
    await requireManagement(ctx);
    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient) return notFound('Ingredient');

    const [movements, recipeItems] = await Promise.all([
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
    ]);
    if (
      movements.length > MAX_RECENT_MOVEMENTS ||
      recipeItems.length > MAX_RECIPE_LINKS
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
      linkedRecipes: linkedRecipes.slice(0, 20),
    };
  },
});

export const saveIngredient = mutation({
  args: {
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
    const updatedBy = await requireManagement(ctx);
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
    id: v.id('ingredients'),
    archived: v.boolean(),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx);
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

export const recordAdjustment = mutation({
  args: {
    ingredientId: v.id('ingredients'),
    mode: v.union(v.literal('receive'), v.literal('set-count')),
    quantity: v.number(),
    reason: v.string(),
    expectedRevision: v.number(),
    businessDate: v.string(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx);
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
    const reason = cleanText(args.reason, 'Adjustment reason', 160);
    const createdAt = Date.now();
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
    });
    await ctx.db.patch(ingredient._id, {
      currentStockQuantity,
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
