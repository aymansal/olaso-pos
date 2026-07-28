import { v } from 'convex/values';
import { query } from './_generated/server';
import { requireOperationalAccess } from './lib/operational';

function withinLimit<T>(rows: T[], limit: number, label: string) {
  if (rows.length > limit) {
    throw new Error(`${label} exceeds the ${limit}-record synchronization limit.`);
  }
  return rows;
}

export const getOperationalSnapshot = query({
  args: { requestId: v.optional(v.string()) },
  handler: async (ctx, { requestId }) => {
    if (requestId && (!requestId.trim() || requestId.length > 64)) {
      throw new Error('Synchronization request ID must contain 1 to 64 characters.');
    }
    await requireOperationalAccess(ctx);
    const [categories, allProducts, modifierGroups, allOptions, ingredients] =
      await Promise.all([
        ctx.db
          .query('categories')
          .withIndex('by_status_sort_order', (q) => q.eq('status', 'active'))
          .take(101),
        ctx.db.query('products').withIndex('by_updated_at').take(501),
        ctx.db
          .query('modifierGroups')
          .withIndex('by_status_sort_order', (q) => q.eq('status', 'active'))
          .take(101),
        ctx.db.query('modifierOptions').withIndex('by_updated_at').take(1001),
        ctx.db
          .query('ingredients')
          .withIndex('by_status_name', (q) => q.eq('status', 'active'))
          .take(1001),
      ]);
    withinLimit(categories, 100, 'Categories');
    withinLimit(allProducts, 500, 'Products');
    withinLimit(modifierGroups, 100, 'Modifier groups');
    withinLimit(allOptions, 1000, 'Modifier options');
    withinLimit(ingredients, 1000, 'Ingredients');

    const products = allProducts
      .filter((product) => product.status !== 'archived')
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const modifierOptions = allOptions
      .filter((option) => option.status === 'active')
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const currentRecipeIds = [
      ...new Set(
        products.flatMap((product) =>
          product.currentRecipeVersionId
            ? [product.currentRecipeVersionId]
            : [],
        ),
      ),
    ];
    const recipeVersions = await Promise.all(
      currentRecipeIds.map((id) => ctx.db.get(id)),
    );
    if (recipeVersions.some((version) => !version)) {
      throw new Error('A synchronized product references a missing recipe.');
    }
    for (const product of products) {
      if (!product.currentRecipeVersionId) continue;
      const recipe = recipeVersions.find(
        (version) => version?._id === product.currentRecipeVersionId,
      );
      if (
        !recipe
        || recipe.productId !== product._id
        || recipe.status !== 'active'
      ) {
        throw new Error('A synchronized product references an inactive recipe.');
      }
    }
    const itemGroups = await Promise.all(
      currentRecipeIds.map((recipeVersionId) =>
        ctx.db
          .query('recipeItems')
          .withIndex('by_recipe_version', (q) =>
            q.eq('recipeVersionId', recipeVersionId),
          )
          .take(101),
      ),
    );
    if (itemGroups.some((items) => items.length > 100)) {
      throw new Error('A recipe exceeds the 100-item synchronization limit.');
    }
    const recipeItems = withinLimit(
      itemGroups.flat(),
      5000,
      'Recipe items',
    );
    const updatedAt = Math.max(
      0,
      ...categories.map((row) => row.updatedAt),
      ...products.map((row) => row.updatedAt),
      ...modifierGroups.map((row) => row.updatedAt),
      ...modifierOptions.map((row) => row.updatedAt),
      ...ingredients.map((row) => row.updatedAt),
      ...recipeVersions.flatMap((row) => row ? [row.updatedAt] : []),
    );

    return {
      updatedAt,
      categories: categories.map((category) => ({
        id: category._id,
        key: category.key,
        name: category.name,
        sortOrder: category.sortOrder,
        revision: category.revision,
      })),
      products: products.map((product) => ({
        id: product._id,
        categoryId: product.categoryId,
        name: product.name,
        receiptName: product.receiptName,
        priceCentimes: product.basePriceCentimes,
        status: product.status,
        ...(product.imageAssetKey
          ? { imageAssetKey: product.imageAssetKey }
          : {}),
        sortOrder: product.sortOrder,
        ...(product.currentRecipeVersionId
          ? { currentRecipeVersionId: product.currentRecipeVersionId }
          : {}),
        revision: product.revision,
      })),
      modifierGroups: modifierGroups.map((group) => ({
        id: group._id,
        name: group.name,
        minimumSelections: group.minSelections,
        maximumSelections: group.maxSelections,
        revision: group.revision,
      })),
      modifierOptions: modifierOptions.map((option) => ({
        id: option._id,
        modifierGroupId: option.groupId,
        name: option.name,
        priceDeltaCentimes: option.priceDeltaCentimes,
        ingredientEffects: option.ingredientEffects.map((effect) => ({
          ingredientId: effect.ingredientId,
          quantityDelta: effect.quantityDelta,
        })),
        sortOrder: option.sortOrder,
        revision: option.revision,
      })),
      productModifierGroups: products.flatMap((product) =>
        product.modifierGroupIds.map((modifierGroupId, index) => ({
          productId: product._id,
          modifierGroupId,
          sortOrder: index * 10 + 10,
        })),
      ),
      recipeVersions: recipeVersions.flatMap((version) =>
        version
          ? [{
              id: version._id,
              productId: version.productId,
              version: version.versionNumber,
              createdAt: version.createdAt,
            }]
          : [],
      ),
      recipeItems: recipeItems.map((item) => ({
        recipeVersionId: item.recipeVersionId,
        ingredientId: item.ingredientId,
        quantity: item.quantity,
      })),
      ingredients: ingredients.map((ingredient) => ({
        id: ingredient._id,
        name: ingredient.name,
        baseUnit: ingredient.baseUnit,
        currentStockQuantity: ingredient.currentStockQuantity,
        lowStockThreshold: ingredient.lowStockThreshold,
        revision: ingredient.revision,
      })),
    };
  },
});
