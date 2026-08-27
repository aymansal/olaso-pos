import { v } from 'convex/values';
import { query } from './_generated/server';
import { requireOperationalAccess } from './lib/operational';
import { sessionArgs } from './lib/session';

function withinLimit<T>(rows: T[], limit: number, label: string) {
  if (rows.length > limit) {
    throw new Error(`${label} exceeds the ${limit}-record synchronization limit.`);
  }
  return rows;
}

export const getOperationalSnapshot = query({
  args: { ...sessionArgs, requestId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { requestId } = args;
    if (requestId && (!requestId.trim() || requestId.length > 64)) {
      throw new Error('Synchronization request ID must contain 1 to 64 characters.');
    }
    await requireOperationalAccess(ctx, args);
    const [categories, allProducts, ingredients, staffProfiles] =
      await Promise.all([
        ctx.db
          .query('categories')
          .withIndex('by_status_sort_order', (q) => q.eq('status', 'active'))
          .take(101),
        ctx.db.query('products').withIndex('by_updated_at').take(501),
        ctx.db
          .query('ingredients')
          .withIndex('by_status_name', (q) => q.eq('status', 'active'))
          .take(1001),
        ctx.db
          .query('staffProfiles')
          .withIndex('by_status_name', (q) => q.eq('status', 'active'))
          .take(101),
      ]);
    withinLimit(categories, 100, 'Categories');
    withinLimit(allProducts, 500, 'Products');
    withinLimit(ingredients, 1000, 'Ingredients');
    withinLimit(staffProfiles, 100, 'Staff profiles');
    const staffIdentities = await Promise.all(
      staffProfiles.map((profile) =>
        ctx.db
          .query('staffIdentities')
          .withIndex('by_staff_profile', (index) =>
            index.eq('staffProfileId', profile._id),
          )
          .unique(),
      ),
    );
    const identityByProfile = new Map(
      staffIdentities.flatMap((identity) =>
        identity ? [[String(identity.staffProfileId), identity] as const] : [],
      ),
    );

    const products = allProducts
      .filter((product) => product.status !== 'archived')
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
    const [allProductSizes, allChoiceSections, allChoiceValues] =
      await Promise.all([
        ctx.db.query('productSizes').withIndex('by_updated_at').take(4001),
        ctx.db
          .query('productChoiceSections')
          .withIndex('by_updated_at')
          .take(2001),
        ctx.db
          .query('productChoiceValues')
          .withIndex('by_updated_at')
          .take(4001),
      ]);
    withinLimit(allProductSizes, 4000, 'Product sizes');
    withinLimit(allChoiceSections, 2000, 'Product choice sections');
    withinLimit(allChoiceValues, 4000, 'Product choice values');
    const productIdSet = new Set(products.map((product) => product._id));
    const productSizes = allProductSizes
      .filter(
        (size) => size.status !== 'archived' && productIdSet.has(size.productId),
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const productChoiceSections = allChoiceSections
      .filter(
        (section) =>
          section.status === 'active' && productIdSet.has(section.productId),
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const sectionIdSet = new Set(
      productChoiceSections.map((section) => section._id),
    );
    const productChoiceValues = allChoiceValues
      .filter(
        (value) => value.status === 'active' && sectionIdSet.has(value.sectionId),
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const sizeQuantityGroups = await Promise.all(
      currentRecipeIds.map((recipeVersionId) =>
        ctx.db
          .query('recipeSizeQuantities')
          .withIndex('by_recipe_version', (q) =>
            q.eq('recipeVersionId', recipeVersionId),
          )
          .take(8001),
      ),
    );
    const recipeSizeQuantities = withinLimit(
      sizeQuantityGroups.flat(),
      8000,
      'Recipe size quantities',
    );
    const sectionSizeGroups = await Promise.all(
      productChoiceSections.map((section) =>
        ctx.db
          .query('productChoiceSectionSizes')
          .withIndex('by_section', (q) => q.eq('sectionId', section._id))
          .take(4001),
      ),
    );
    const productChoiceSectionSizes = withinLimit(
      sectionSizeGroups.flat(),
      4000,
      'Product choice section sizes',
    );
    const valueSizeGroups = await Promise.all(
      productChoiceValues.map((value) =>
        ctx.db
          .query('productChoiceValueSizes')
          .withIndex('by_value', (q) => q.eq('valueId', value._id))
          .take(8001),
      ),
    );
    const productChoiceValueSizes = withinLimit(
      valueSizeGroups.flat(),
      8000,
      'Product choice value sizes',
    );
    const effectGroups = await Promise.all(
      productChoiceValues.map((value) =>
        ctx.db
          .query('productChoiceValueEffects')
          .withIndex('by_value', (q) => q.eq('valueId', value._id))
          .take(4001),
      ),
    );
    const productChoiceValueEffects = withinLimit(
      effectGroups.flat(),
      4000,
      'Product choice value effects',
    );
    const effectSizeGroups = await Promise.all(
      productChoiceValueEffects.map((effect) =>
        ctx.db
          .query('productChoiceValueEffectSizes')
          .withIndex('by_effect', (q) => q.eq('effectId', effect._id))
          .take(8001),
      ),
    );
    const productChoiceValueEffectSizes = withinLimit(
      effectSizeGroups.flat(),
      8000,
      'Product choice value effect sizes',
    );
    const updatedAt = Math.max(
      0,
      ...categories.map((row) => row.updatedAt),
      ...products.map((row) => row.updatedAt),
      ...ingredients.map((row) => row.updatedAt),
      ...staffProfiles.map((row) => row.updatedAt),
      ...recipeVersions.flatMap((row) => row ? [row.updatedAt] : []),
      ...productSizes.map((row) => row.updatedAt),
      ...productChoiceSections.map((row) => row.updatedAt),
      ...productChoiceValues.map((row) => row.updatedAt),
    );

    return {
      updatedAt,
      categories: categories.map((category) => ({
        id: category._id,
        key: category.key,
        name: category.name,
        artworkKey: category.artworkKey ?? 'neutral',
        sortOrder: category.sortOrder,
        revision: category.revision,
      })),
      products: products.map((product) => ({
        id: product._id,
        key: product.key,
        categoryId: product.categoryId ?? '',
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
        updatedAt: product.updatedAt,
      })),
      modifierGroups: [],
      modifierOptions: [],
      productModifierGroups: [],
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
      productSizes: productSizes.map((size) => ({
        id: String(size._id),
        productId: String(size.productId),
        key: size.key,
        name: size.name,
        priceCentimes: size.priceCentimes,
        sortOrder: size.sortOrder,
        isDefault: size.isDefault,
        status: size.status,
        revision: size.revision,
        updatedAt: size.updatedAt,
      })),
      recipeSizeQuantities: recipeSizeQuantities.map((row) => ({
        recipeVersionId: String(row.recipeVersionId),
        ingredientId: String(row.ingredientId),
        productSizeId: String(row.productSizeId),
        sizeNameSnapshot: row.sizeNameSnapshot,
        quantity: row.quantity,
      })),
      productChoiceSections: productChoiceSections.map((section) => ({
        id: String(section._id),
        productId: String(section.productId),
        key: section.key,
        name: section.name,
        selectionMode: section.selectionMode,
        required: section.required,
        minimumSelections: section.minSelections,
        maximumSelections: section.maxSelections,
        sortOrder: section.sortOrder,
        status: section.status,
        revision: section.revision,
        updatedAt: section.updatedAt,
      })),
      productChoiceSectionSizes: productChoiceSectionSizes.map((row) => ({
        sectionId: String(row.sectionId),
        productSizeId: String(row.productSizeId),
      })),
      productChoiceValues: productChoiceValues.map((value) => ({
        id: String(value._id),
        sectionId: String(value.sectionId),
        key: value.key,
        name: value.name,
        priceDeltaCentimes: value.priceDeltaCentimes,
        isDefaultSelected: value.isDefaultSelected,
        sortOrder: value.sortOrder,
        status: value.status,
        revision: value.revision,
        updatedAt: value.updatedAt,
      })),
      productChoiceValueSizes: productChoiceValueSizes.map((row) => ({
        valueId: String(row.valueId),
        productSizeId: String(row.productSizeId),
        available: row.available,
        priceDeltaCentimes: row.priceDeltaCentimes ?? null,
      })),
      productChoiceValueEffects: productChoiceValueEffects.map((effect) => ({
        id: String(effect._id),
        valueId: String(effect.valueId),
        effectType: effect.effectType,
        ingredientId: String(effect.ingredientId),
        ...(effect.replacementIngredientId
          ? {
              replacementIngredientId: String(effect.replacementIngredientId),
            }
          : {}),
        quantity: effect.quantity,
        sortOrder: effect.sortOrder,
      })),
      productChoiceValueEffectSizes: productChoiceValueEffectSizes.map((row) => ({
        effectId: String(row.effectId),
        productSizeId: String(row.productSizeId),
        quantity: row.quantity,
      })),
      ingredients: ingredients.map((ingredient) => ({
        id: ingredient._id,
        name: ingredient.name,
        baseUnit: ingredient.baseUnit,
        currentStockQuantity: ingredient.currentStockQuantity,
        ...(ingredient.inventoryValueCentimes === undefined
          ? {}
          : { inventoryValueCentimes: ingredient.inventoryValueCentimes }),
        costStatus: ingredient.costStatus ?? 'incomplete',
        valuationRevision: ingredient.valuationRevision ?? 0,
        lowStockThreshold: ingredient.lowStockThreshold,
        revision: ingredient.revision,
      })),
      staffProfiles: staffProfiles.map((staff) => ({
        id: staff._id,
        name: staff.name,
        role: staff.role,
        revision: staff.revision,
        identityRevision:
          identityByProfile.get(String(staff._id))?.credentialVersion ?? 0,
      })),
    };
  },
});
