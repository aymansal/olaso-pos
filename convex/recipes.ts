import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { allocateCentimes } from '../src/lib/costs';
import {
  boundedInteger,
  cleanOptionalText,
  expectRevision,
  invalid,
  mutationId,
  notFound,
  requireManagement,
} from './lib/management';

const MAX_RECIPE_ITEMS = 50;
const MAX_INGREDIENTS = 100;
const MAX_RECIPE_VERSIONS = 20;

function ingredientCost(ingredient: {
  _id: string;
  currentStockQuantity: number;
  inventoryValueCentimes?: number;
  costStatus?: 'complete' | 'incomplete';
}, quantity: number) {
  if (
    ingredient.costStatus !== 'complete' ||
    ingredient.inventoryValueCentimes === undefined ||
    ingredient.currentStockQuantity <= 0
  ) return undefined;
  return allocateCentimes(
    ingredient.inventoryValueCentimes,
    ingredient.currentStockQuantity,
    quantity,
  );
}

export const getCost = query({
  args: { productId: v.id('products') },
  handler: async (ctx, args) => {
    await requireManagement(ctx);
    const product = await ctx.db.get(args.productId);
    if (!product) return notFound('Product');
    if (!product.currentRecipeVersionId) {
      return { complete: false, missingIngredientIds: [], hasRecipe: false, modifierCosts: [] };
    }
    const recipeItems = await ctx.db.query('recipeItems')
      .withIndex('by_recipe_version', (index) => index.eq('recipeVersionId', product.currentRecipeVersionId!))
      .take(MAX_RECIPE_ITEMS + 1);
    if (recipeItems.length > MAX_RECIPE_ITEMS) throw new Error('Recipe cost exceeded its bounded limit.');
    const ingredientIds = new Set(recipeItems.map((item) => item.ingredientId));
    const groups = await Promise.all(product.modifierGroupIds.map((id) => ctx.db.get(id)));
    const options = (await Promise.all(groups.filter(Boolean).map((group) => ctx.db.query('modifierOptions')
      .withIndex('by_group_status_sort_order', (index) => index.eq('groupId', group!._id).eq('status', 'active'))
      .take(101)))).flat();
    for (const option of options) for (const effect of option.ingredientEffects) ingredientIds.add(effect.ingredientId);
    const ingredients = await Promise.all([...ingredientIds].map((id) => ctx.db.get(id)));
    const byId = new Map(ingredients.filter(Boolean).map((ingredient) => [ingredient!._id, ingredient!]));
    const calculate = (effects: Array<{ ingredientId: Id<'ingredients'>; quantity: number }>) => {
      const missingIngredientIds: string[] = [];
      let costCentimes = 0;
      for (const effect of effects) {
        const ingredient = byId.get(effect.ingredientId);
        const cost = ingredient ? ingredientCost(ingredient, Math.abs(effect.quantity)) : undefined;
        if (cost === undefined) missingIngredientIds.push(effect.ingredientId);
        else costCentimes += effect.quantity < 0 ? -cost : cost;
      }
      return missingIngredientIds.length ? { complete: false as const, missingIngredientIds: [...new Set(missingIngredientIds)].sort() } : { complete: true as const, costCentimes };
    };
    const base = calculate(recipeItems.map((item) => ({ ingredientId: item.ingredientId, quantity: item.quantity })));
    return {
      ...base,
      hasRecipe: true,
      modifierCosts: options.map((option) => ({
        optionId: option._id,
        optionName: option.name,
        ...calculate(option.ingredientEffects.map((effect) => ({ ingredientId: effect.ingredientId, quantity: effect.quantityDelta }))),
      })),
    };
  },
});

export const getEditorData = query({
  args: { productId: v.id('products') },
  handler: async (ctx, args) => {
    await requireManagement(ctx);
    const product = await ctx.db.get(args.productId);
    if (!product) return notFound('Product');

    const [ingredients, versions] = await Promise.all([
      ctx.db
        .query('ingredients')
        .withIndex('by_status_name', (index) => index.eq('status', 'active'))
        .take(MAX_INGREDIENTS + 1),
      ctx.db
        .query('recipeVersions')
        .withIndex('by_product_version', (index) =>
          index.eq('productId', product._id),
        )
        .order('desc')
        .take(MAX_RECIPE_VERSIONS + 1),
    ]);
    if (
      ingredients.length > MAX_INGREDIENTS ||
      versions.length > MAX_RECIPE_VERSIONS
    ) {
      throw new Error('Recipe editor result exceeded its bounded limit.');
    }
    if (!product.currentRecipeVersionId) {
      return { recipe: null, items: [], ingredients, versions };
    }

    const recipe = await ctx.db.get(product.currentRecipeVersionId);
    if (!recipe) return { recipe: null, items: [], ingredients, versions };
    const items = await ctx.db
      .query('recipeItems')
      .withIndex('by_recipe_version', (index) =>
        index.eq('recipeVersionId', recipe._id),
      )
      .take(MAX_RECIPE_ITEMS + 1);
    if (items.length > MAX_RECIPE_ITEMS) {
      throw new Error(`Recipe item limit of ${MAX_RECIPE_ITEMS} exceeded.`);
    }
    return { recipe, items, ingredients, versions };
  },
});

export const saveVersion = mutation({
  args: {
    productId: v.id('products'),
    expectedProductRevision: v.number(),
    clientMutationId: v.string(),
    sizeKey: v.optional(v.string()),
    activationAt: v.optional(v.number()),
    items: v.array(
      v.object({
        ingredientId: v.id('ingredients'),
        quantity: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx);
    const clientMutationId = mutationId(args.clientMutationId);
    const previousAttempt = await ctx.db
      .query('recipeVersions')
      .withIndex('by_product_client_mutation', (index) =>
        index
          .eq('productId', args.productId)
          .eq('clientMutationId', clientMutationId),
      )
      .unique();
    if (previousAttempt) {
      const product = await ctx.db.get(args.productId);
      return {
        id: previousAttempt._id,
        versionNumber: previousAttempt.versionNumber,
        productRevision: product?.revision ?? args.expectedProductRevision + 1,
      };
    }

    const product = await ctx.db.get(args.productId);
    if (!product) return notFound('Product');
    expectRevision(args.expectedProductRevision, product.revision);
    if (product.status === 'archived') {
      return invalid('Restore this product before editing its recipe.');
    }
    if (!args.items.length || args.items.length > MAX_RECIPE_ITEMS) {
      return invalid(
        `A recipe must contain 1 to ${MAX_RECIPE_ITEMS} ingredients.`,
      );
    }
    if (
      new Set(args.items.map((item) => item.ingredientId)).size !==
      args.items.length
    ) {
      return invalid('Each ingredient can appear only once in a recipe.');
    }
    const items = args.items.map((item) => ({
      ingredientId: item.ingredientId,
      quantity: boundedInteger(
        item.quantity,
        'Recipe quantity',
        1,
        1_000_000,
      ),
    }));
    const ingredients = await Promise.all(
      items.map((item) => ctx.db.get(item.ingredientId)),
    );
    if (ingredients.some((ingredient) => !ingredient || ingredient.status !== 'active')) {
      return invalid('Recipes can use only active ingredients.');
    }
    const sizeKey = cleanOptionalText(args.sizeKey, 'Recipe size key', 80);
    if (
      args.activationAt !== undefined &&
      (!Number.isSafeInteger(args.activationAt) || args.activationAt < 0)
    ) {
      return invalid('Activation time is invalid.');
    }

    const latest = await ctx.db
      .query('recipeVersions')
      .withIndex('by_product_version', (index) =>
        index.eq('productId', product._id),
      )
      .order('desc')
      .first();
    const now = Date.now();
    const id = await ctx.db.insert('recipeVersions', {
      productId: product._id,
      sizeKey,
      versionNumber: (latest?.versionNumber ?? 0) + 1,
      status: 'active',
      activationAt: args.activationAt ?? now,
      clientMutationId,
      createdAt: now,
      updatedAt: now,
      updatedBy,
    });
    for (const item of items) {
      await ctx.db.insert('recipeItems', {
        recipeVersionId: id,
        ingredientId: item.ingredientId,
        quantity: item.quantity,
        createdAt: now,
      });
    }
    if (product.currentRecipeVersionId) {
      const current = await ctx.db.get(product.currentRecipeVersionId);
      if (current?.status === 'active') {
        await ctx.db.patch(current._id, {
          status: 'superseded',
          updatedAt: now,
          updatedBy,
        });
      }
    }
    await ctx.db.patch(product._id, {
      currentRecipeVersionId: id,
      revision: product.revision + 1,
      updatedAt: now,
      updatedBy,
      lastMutationId: clientMutationId,
    });
    return {
      id,
      versionNumber: (latest?.versionNumber ?? 0) + 1,
      productRevision: product.revision + 1,
    };
  },
});
