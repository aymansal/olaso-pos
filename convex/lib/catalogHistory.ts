import type { GenericDatabaseReader, GenericDataModel } from 'convex/server';
import type { Doc, Id, TableNames } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { captureCatalogQuote, catalogQuoteFingerprint, type CatalogQuote } from '../../src/lib/catalogQuote';

export type CatalogHistoryRows = { [K in keyof CatalogQuote]: Array<Doc<Extract<K, TableNames>>> } & {
  ingredients: Array<Pick<Doc<'ingredients'>, '_id' | 'name' | 'baseUnit'>>;
};

async function read<T extends TableNames>(ctx: Pick<QueryCtx, 'db'>, table: T,
  index: string, field: string, id: string, limit: number): Promise<Array<Doc<T>>> {
  const rows = await (ctx.db as unknown as GenericDatabaseReader<GenericDataModel>).query(table)
    .withIndex(index, (q) => q.eq(field, id)).take(limit + 1);
  if (rows.length > limit) throw new Error('Product configuration exceeds its safe history limit.');
  return rows as Array<Doc<T>>;
}

export function historyQuote(rows: CatalogHistoryRows): CatalogQuote {
  const mapped = Object.fromEntries(Object.entries(rows).filter(([key]) => key !== 'ingredients').map(([key, entries]) => [key,
    entries.map((entry) => {
      const row = entry as unknown as Record<string, unknown>;
      return { ...row, id: row._id,
        ...(key === 'products' ? { categoryId: row.categoryId ?? '', priceCentimes: row.basePriceCentimes } : {}),
        ...(key === 'recipeVersions' ? { version: row.versionNumber } : {}),
        ...(key === 'productChoiceSections' ? { minimumSelections: row.minSelections, maximumSelections: row.maxSelections } : {}),
        ...(key === 'productChoiceValueSizes' ? { priceDeltaCentimes: row.priceDeltaCentimes ?? null } : {}),
      };
    }),
  ])) as unknown as CatalogQuote;
  return captureCatalogQuote(mapped, String(rows.products[0]._id));
}

export async function loadCatalogHistoryRows(ctx: Pick<QueryCtx, 'db'>, productId: Id<'products'>): Promise<CatalogHistoryRows | undefined> {
  const product = await ctx.db.get(productId);
  if (!product) return undefined;
  const category = product.categoryId ? await ctx.db.get(product.categoryId) : null;
  const recipe = product.currentRecipeVersionId ? await ctx.db.get(product.currentRecipeVersionId) : null;
  const sizes = await read(ctx, 'productSizes', 'by_product', 'productId', productId, 100);
  const sections = await read(ctx, 'productChoiceSections', 'by_product', 'productId', productId, 100);
  const activeSections = sections.filter((row) => row.status === 'active');
  const values = (await Promise.all(activeSections.map((row) => read(ctx, 'productChoiceValues', 'by_section', 'sectionId', row._id, 30)))).flat().filter((row) => row.status === 'active');
  const effects = (await Promise.all(values.map((row) => read(ctx, 'productChoiceValueEffects', 'by_value', 'valueId', row._id, 10)))).flat();
  const recipeItems = recipe ? await read(ctx, 'recipeItems', 'by_recipe_version', 'recipeVersionId', recipe._id, 100) : [];
  const ingredientIds = new Set([...recipeItems.map((row) => row.ingredientId), ...effects.flatMap((row) => [row.ingredientId, ...(row.replacementIngredientId ? [row.replacementIngredientId] : [])])]);
  const ingredients = (await Promise.all([...ingredientIds].map((id) => ctx.db.get(id)))).flatMap((row) => row ? [{ _id: row._id, name: row.name, baseUnit: row.baseUnit }] : []);
  const { imageJpeg: _image, imageAssetKey: _asset, ...withoutImage } = product;
  return {
    products: [withoutImage], categories: category ? [category] : [], recipeVersions: recipe ? [recipe] : [],
    recipeItems, productSizes: sizes.filter((row) => row.status !== 'archived'),
    recipeSizeQuantities: recipe ? await read(ctx, 'recipeSizeQuantities', 'by_recipe_version', 'recipeVersionId', recipe._id, 800) : [],
    productChoiceSections: activeSections,
    productChoiceSectionSizes: (await Promise.all(activeSections.map((row) => read(ctx, 'productChoiceSectionSizes', 'by_section', 'sectionId', row._id, 8)))).flat(),
    productChoiceValues: values,
    productChoiceValueSizes: (await Promise.all(values.map((row) => read(ctx, 'productChoiceValueSizes', 'by_value', 'valueId', row._id, 8)))).flat(),
    productChoiceValueEffects: effects,
    productChoiceValueEffectSizes: (await Promise.all(effects.map((row) => read(ctx, 'productChoiceValueEffectSizes', 'by_effect', 'effectId', row._id, 8)))).flat(),
    ingredients,
  };
}

/** Called inside the authorized mutation, before its first catalog write. */
export async function retainProductCatalog(ctx: MutationCtx, productId: Id<'products'>) {
  const rows = await loadCatalogHistoryRows(ctx, productId);
  if (!rows || rows.products[0].status !== 'active') return;
  const fingerprint = await catalogQuoteFingerprint(historyQuote(rows));
  const existing = await ctx.db.query('productCatalogHistory').withIndex('by_product_fingerprint',
    (q) => q.eq('productId', productId).eq('fingerprint', fingerprint)).unique();
  if (existing) return;
  const snapshotJson = JSON.stringify(rows);
  if (new TextEncoder().encode(snapshotJson).length > 900_000) throw new Error('Product configuration exceeds its safe history size.');
  await ctx.db.insert('productCatalogHistory', { productId, fingerprint, snapshotJson, retainedAt: Date.now() });
}

export async function resolveCatalogHistory(ctx: Pick<QueryCtx, 'db'>, productId: Id<'products'>, fingerprint: string) {
  if (!/^[a-f0-9]{64}$/.test(fingerprint)) throw new Error('The saved catalog reference is invalid.');
  const saved = await ctx.db.query('productCatalogHistory').withIndex('by_product_fingerprint',
    (q) => q.eq('productId', productId).eq('fingerprint', fingerprint)).unique();
  if (saved) return JSON.parse(saved.snapshotJson) as CatalogHistoryRows;
  const live = await loadCatalogHistoryRows(ctx, productId);
  if (live && await catalogQuoteFingerprint(historyQuote(live)) === fingerprint) return live;
  throw new Error('The agreed product configuration could not be verified.');
}

export async function retainCategoryCatalog(ctx: MutationCtx, categoryId: Id<'categories'>) {
  const products = await read(ctx, 'products', 'by_category', 'categoryId', categoryId, 500);
  for (const product of products) await retainProductCatalog(ctx, product._id);
}

export async function retainIngredientCatalog(ctx: MutationCtx, ingredientId: Id<'ingredients'>) {
  // Deletion can also affect choice effects, which have no reverse ingredient index.
  const products = await ctx.db.query('products').withIndex('by_updated_at').take(501);
  if (products.length > 500) throw new Error('Catalog exceeds its safe history limit.');
  for (const product of products) {
    if (product.status !== 'active') continue;
    const rows = await loadCatalogHistoryRows(ctx, product._id);
    if (rows?.ingredients.some((row) => row._id === ingredientId)) await retainProductCatalog(ctx, product._id);
  }
}
