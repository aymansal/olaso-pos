import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';
import {
  boundedInteger,
  cleanKey,
  cleanOptionalText,
  cleanProductImageJpeg,
  cleanText,
  conflict,
  expectRevision,
  invalid,
  mutationId,
  notFound,
  requireManagement,
} from './lib/management';
import { sessionArgs } from './lib/session';

const MAX_PRODUCTS = 200;
const productStatus = v.union(
  v.literal('active'),
  v.literal('unavailable'),
);

export const list = query({
  args: { ...sessionArgs },
  handler: async (ctx, args) => {
    await requireManagement(ctx, args);
    const products = await ctx.db
      .query('products')
      .withIndex('by_updated_at')
      .take(MAX_PRODUCTS + 1);
    if (products.length > MAX_PRODUCTS) {
      throw new Error(`Product limit of ${MAX_PRODUCTS} exceeded.`);
    }
    return products.sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.name.localeCompare(right.name),
    );
  },
});

async function validateRelations(
  ctx: MutationCtx,
  categoryId: Id<'categories'> | undefined,
) {
  if (categoryId) {
    const category = await ctx.db.get(categoryId);
    if (!category || category.status !== 'active') {
      return invalid('Select an active category.');
    }
  }
}

export const save = mutation({
  args: {
    ...sessionArgs,
    id: v.optional(v.id('products')),
    key: v.optional(v.string()),
    categoryId: v.optional(v.id('categories')),
    name: v.string(),
    receiptName: v.string(),
    basePriceCentimes: v.number(),
    status: productStatus,
    imageAssetKey: v.optional(v.string()),
    imageJpeg: v.optional(v.string()),
    sortOrder: v.number(),
    modifierGroupIds: v.optional(v.array(v.id('modifierGroups'))),
    expectedRevision: v.optional(v.number()),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const name = cleanText(args.name, 'Product name', 100);
    const receiptName = cleanText(args.receiptName, 'Receipt name', 60);
    const imageAssetKey = cleanOptionalText(
      args.imageAssetKey,
      'Image asset key',
      120,
    );
    const imageJpeg = cleanProductImageJpeg(args.imageJpeg);
    const basePriceCentimes = boundedInteger(
      args.basePriceCentimes,
      'Base price',
      0,
      10_000_000,
    );
    const sortOrder = boundedInteger(args.sortOrder, 'Sort order', 0, 100_000);
    await validateRelations(ctx, args.categoryId);
    const updatedAt = Date.now();

    if (args.id) {
      const product = await ctx.db.get(args.id);
      if (!product) return notFound('Product');
      if (product.lastMutationId === clientMutationId) {
        return { id: product._id, revision: product.revision, created: false };
      }
      expectRevision(args.expectedRevision, product.revision);
      if (product.status === 'archived') {
        return conflict('Restore this product before editing it.');
      }
      await ctx.db.patch(product._id, {
        categoryId: args.categoryId,
        name,
        receiptName,
        basePriceCentimes,
        status: args.status,
        imageAssetKey,
        ...(imageJpeg ? { imageJpeg } : {}),
        sortOrder,
        modifierGroupIds: [],
        revision: product.revision + 1,
        updatedAt,
        updatedBy,
        lastMutationId: clientMutationId,
      });
      return {
        id: product._id,
        revision: product.revision + 1,
        created: false,
      };
    }

    const key = cleanKey(args.key, 'Product key');
    const existing = await ctx.db
      .query('products')
      .withIndex('by_key', (index) => index.eq('key', key))
      .unique();
    if (existing) {
      if (existing.lastMutationId === clientMutationId) {
        return { id: existing._id, revision: existing.revision, created: false };
      }
      return conflict('A product with this key already exists.');
    }
    const id = await ctx.db.insert('products', {
      key,
      categoryId: args.categoryId,
      name,
      receiptName,
      basePriceCentimes,
      status: args.status,
      imageAssetKey,
      ...(imageJpeg ? { imageJpeg } : {}),
      sortOrder,
      modifierGroupIds: [],
      revision: 1,
      updatedAt,
      updatedBy,
      lastMutationId: clientMutationId,
    });
    return { id, revision: 1, created: true };
  },
});

export const remove = mutation({
  args: {
    ...sessionArgs,
    id: v.id('products'),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    mutationId(args.clientMutationId);
    const product = await ctx.db.get(args.id);
    if (!product) return { id: args.id, deleted: true as const };
    expectRevision(args.expectedRevision, product.revision);
    const recipes = await ctx.db.query('recipeVersions')
      .withIndex('by_product_version', (index) => index.eq('productId', product._id))
      .take(101);
    if (recipes.length > 100) throw new Error('Product recipe history is too large.');
    for (const recipe of recipes) {
      await ctx.db.patch(recipe._id, {
        productNameSnapshot: product.name,
        ...(recipe.status === 'active'
          ? { status: 'superseded' as const, updatedAt: Date.now(), updatedBy }
          : {}),
      });
    }
    await ctx.db.delete(product._id);
    return { id: args.id, deleted: true as const };
  },
});

export const setStatus = mutation({
  args: {
    ...sessionArgs,
    id: v.id('products'),
    status: v.union(
      v.literal('active'),
      v.literal('unavailable'),
      v.literal('archived'),
    ),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const product = await ctx.db.get(args.id);
    if (!product) return notFound('Product');
    if (product.lastMutationId === clientMutationId) {
      return { id: product._id, revision: product.revision };
    }
    expectRevision(args.expectedRevision, product.revision);
    await ctx.db.patch(product._id, {
      status: args.status,
      revision: product.revision + 1,
      updatedAt: Date.now(),
      updatedBy,
      lastMutationId: clientMutationId,
    });
    return { id: product._id, revision: product.revision + 1 };
  },
});
