import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';
import {
  boundedInteger,
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
  categoryId: Id<'categories'>,
  modifierGroupIds: Id<'modifierGroups'>[],
) {
  const category = await ctx.db.get(categoryId);
  if (!category || category.status !== 'active') {
    return invalid('Select an active category.');
  }
  if (modifierGroupIds.length > 20) {
    return invalid('A product can use at most 20 modifier groups.');
  }
  if (new Set(modifierGroupIds).size !== modifierGroupIds.length) {
    return invalid('Modifier groups must be unique.');
  }
  const groups = await Promise.all(
    modifierGroupIds.map((groupId) => ctx.db.get(groupId)),
  );
  if (groups.some((group) => !group || group.status !== 'active')) {
    return invalid('Select only active modifier groups.');
  }
}

export const save = mutation({
  args: {
    ...sessionArgs,
    id: v.optional(v.id('products')),
    key: v.optional(v.string()),
    categoryId: v.id('categories'),
    name: v.string(),
    receiptName: v.string(),
    basePriceCentimes: v.number(),
    status: productStatus,
    imageAssetKey: v.optional(v.string()),
    sortOrder: v.number(),
    modifierGroupIds: v.array(v.id('modifierGroups')),
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
    const basePriceCentimes = boundedInteger(
      args.basePriceCentimes,
      'Base price',
      0,
      10_000_000,
    );
    const sortOrder = boundedInteger(args.sortOrder, 'Sort order', 0, 100_000);
    await validateRelations(ctx, args.categoryId, args.modifierGroupIds);
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
        sortOrder,
        modifierGroupIds: args.modifierGroupIds,
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
      sortOrder,
      modifierGroupIds: args.modifierGroupIds,
      revision: 1,
      updatedAt,
      updatedBy,
      lastMutationId: clientMutationId,
    });
    return { id, revision: 1, created: true };
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
