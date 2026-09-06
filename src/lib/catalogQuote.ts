import type { OperationalCacheSnapshot } from '../data/operationalCache.ts';

const fields = {
  products: 'id categoryId name receiptName status currentRecipeVersionId',
  categories: 'id name',
  recipeVersions: 'id productId',
  recipeItems: 'recipeVersionId ingredientId quantity',
  productSizes: 'id productId name priceCentimes status',
  recipeSizeQuantities: 'recipeVersionId ingredientId productSizeId quantity',
  productChoiceSections: 'id productId name selectionMode required minimumSelections maximumSelections status',
  productChoiceSectionSizes: 'sectionId productSizeId',
  productChoiceValues: 'id sectionId name priceDeltaCentimes status',
  productChoiceValueSizes: 'valueId productSizeId available priceDeltaCentimes',
  productChoiceValueEffects: 'id valueId effectType ingredientId replacementIngredientId quantity sortOrder',
  productChoiceValueEffectSizes: 'effectId productSizeId quantity',
} as const;
export type CatalogQuote = Pick<OperationalCacheSnapshot, keyof typeof fields>;

/** Keep only agreed catalog facts; inventory valuation is read at completion. */
export function captureCatalogQuote(menu: CatalogQuote, productId: string): CatalogQuote {
  const products = menu.products.filter((row) => row.id === productId);
  if (products.length !== 1) throw new Error('The quoted product is unavailable.');
  const product = products[0];
  const productSizes = menu.productSizes.filter((row) => row.productId === productId && row.status !== 'archived');
  const productChoiceSections = menu.productChoiceSections.filter((row) => row.productId === productId && row.status === 'active');
  const sections = new Set(productChoiceSections.map((row) => row.id));
  const productChoiceValues = menu.productChoiceValues.filter((row) => sections.has(row.sectionId) && row.status === 'active');
  const values = new Set(productChoiceValues.map((row) => row.id));
  const productChoiceValueEffects = menu.productChoiceValueEffects.filter((row) => values.has(row.valueId));
  const effects = new Set(productChoiceValueEffects.map((row) => row.id));
  return structuredClone({
    products: products.map(({ imageJpeg: _image, imageAssetKey: _asset, ...row }) => row),
    categories: menu.categories.filter((row) => row.id === product.categoryId),
    recipeVersions: menu.recipeVersions.filter((row) => row.id === product.currentRecipeVersionId),
    recipeItems: menu.recipeItems.filter((row) => row.recipeVersionId === product.currentRecipeVersionId),
    productSizes,
    recipeSizeQuantities: menu.recipeSizeQuantities.filter((row) => row.recipeVersionId === product.currentRecipeVersionId),
    productChoiceSections,
    productChoiceSectionSizes: menu.productChoiceSectionSizes.filter((row) => sections.has(row.sectionId)),
    productChoiceValues,
    productChoiceValueSizes: menu.productChoiceValueSizes.filter((row) => values.has(row.valueId)),
    productChoiceValueEffects,
    productChoiceValueEffectSizes: menu.productChoiceValueEffectSizes.filter((row) => effects.has(row.effectId)),
  });
}

/** Metadata revisions may change when an offline record is promoted. Exact
 * prices/rules/IDs/recipe facts, rather than those transport counters, identify it. */
export async function catalogQuoteFingerprint(quote: CatalogQuote): Promise<string> {
  const canonical = Object.entries(fields).map(([table, names]) => [table,
    quote[table as keyof CatalogQuote].map((row) => {
      const record = row as unknown as Record<string, unknown>;
      return names.split(' ').map((key) => record[key] ?? null);
    }).map((row) => JSON.stringify(row)).sort(),
  ]);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(canonical)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function remapCatalogQuote<T extends CatalogQuote>(
  quote: T,
  resolve: (kind: string, id: string) => Promise<string>,
): Promise<T> {
  const ownKinds: Record<string, string> = { products: 'product', categories: 'category',
    recipeVersions: 'recipe-version', productSizes: 'product-size',
    productChoiceSections: 'choice-section', productChoiceValues: 'choice-value',
    productChoiceValueEffects: 'choice-effect', ingredients: 'ingredient', staffProfiles: 'staff-profile' };
  const references: Record<string, string> = { productId: 'product', categoryId: 'category',
    currentRecipeVersionId: 'recipe-version', recipeVersionId: 'recipe-version',
    sizeId: 'product-size', productSizeId: 'product-size', sectionId: 'choice-section',
    valueId: 'choice-value', effectId: 'choice-effect', ingredientId: 'ingredient',
    replacementIngredientId: 'ingredient' };
  return Object.fromEntries(await Promise.all(Object.entries(quote).map(async ([table, rows]) => [table,
    !Array.isArray(rows) ? rows : await Promise.all(rows.map(async (row: Record<string, unknown>) => Object.fromEntries(await Promise.all(
      Object.entries(row).map(async ([key, value]) => {
        const kind = key === 'id' ? ownKinds[table] : references[key];
        return [key, kind && typeof value === 'string' && value ? await resolve(kind, value) : value];
      }),
    )))),
  ]))) as T;
}
