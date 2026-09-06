import { v } from 'convex/values';
import { retainCategoryCatalog } from './lib/catalogHistory';
import { mutation, query } from './_generated/server';
import {
  boundedInteger,
  cleanKey,
  cleanText,
  conflict,
  expectRevision,
  mutationId,
  notFound,
  requireManagement,
} from './lib/management';
import { sessionArgs } from './lib/session';

const MAX_CATEGORIES = 50;

export const list = query({
  args: { ...sessionArgs },
  handler: async (ctx, args) => {
    await requireManagement(ctx, args);
    const categories = await ctx.db
      .query('categories')
      .withIndex('by_updated_at')
      .take(MAX_CATEGORIES + 1);
    if (categories.length > MAX_CATEGORIES) {
      throw new Error(`Category limit of ${MAX_CATEGORIES} exceeded.`);
    }
    return categories.sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.name.localeCompare(right.name),
    );
  },
});

export const save = mutation({
  args: {
    ...sessionArgs,
    id: v.optional(v.id('categories')),
    key: v.optional(v.string()),
    name: v.string(),
    artworkKey: v.string(),
    sortOrder: v.number(),
    expectedRevision: v.optional(v.number()),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const name = cleanText(args.name, 'Category name', 80);
    const artworkKey = cleanKey(args.artworkKey, 'Artwork key');
    const sortOrder = boundedInteger(args.sortOrder, 'Sort order', 0, 10_000);
    const updatedAt = Date.now();

    if (args.id) {
      const category = await ctx.db.get(args.id);
      if (!category) return notFound('Category');
      if (category.lastMutationId === clientMutationId) {
        return { id: category._id, revision: category.revision, created: false };
      }
      expectRevision(args.expectedRevision, category.revision);
      await retainCategoryCatalog(ctx, category._id);
      await ctx.db.patch(category._id, {
        name,
        artworkKey,
        sortOrder,
        revision: category.revision + 1,
        updatedAt,
        updatedBy,
        lastMutationId: clientMutationId,
      });
      return {
        id: category._id,
        revision: category.revision + 1,
        created: false,
      };
    }

    const key = cleanKey(args.key, 'Category key');
    const existing = await ctx.db
      .query('categories')
      .withIndex('by_key', (index) => index.eq('key', key))
      .unique();
    if (existing) {
      if (existing.lastMutationId === clientMutationId) {
        return { id: existing._id, revision: existing.revision, created: false };
      }
      return conflict('A category with this key already exists.');
    }
    const id = await ctx.db.insert('categories', {
      key,
      name,
      artworkKey,
      sortOrder,
      status: 'active',
      revision: 1,
      updatedAt,
      updatedBy,
      lastMutationId: clientMutationId,
    });
    return { id, revision: 1, created: true };
  },
});

export const setArchived = mutation({
  args: {
    ...sessionArgs,
    id: v.id('categories'),
    archived: v.boolean(),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const category = await ctx.db.get(args.id);
    if (!category) return notFound('Category');
    if (category.lastMutationId === clientMutationId) {
      return { id: category._id, revision: category.revision };
    }
    expectRevision(args.expectedRevision, category.revision);
    await retainCategoryCatalog(ctx, category._id);
    await ctx.db.patch(category._id, {
      status: args.archived ? 'archived' : 'active',
      revision: category.revision + 1,
      updatedAt: Date.now(),
      updatedBy,
      lastMutationId: clientMutationId,
    });
    return { id: category._id, revision: category.revision + 1 };
  },
});

export const remove = mutation({
  args: {
    ...sessionArgs,
    id: v.id('categories'),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const category = await ctx.db.get(args.id);
    if (!category) return { id: args.id, deleted: true as const };
    expectRevision(args.expectedRevision, category.revision);
    await retainCategoryCatalog(ctx, category._id);
    const products = await ctx.db.query('products')
      .withIndex('by_category', (index) => index.eq('categoryId', category._id))
      .take(201);
    if (products.length > 200) {
      throw new Error('Too many products belong to this category.');
    }
    const updatedAt = Date.now();
    for (const product of products) {
      await ctx.db.patch(product._id, {
        categoryId: undefined,
        revision: product.revision + 1,
        updatedAt,
        updatedBy,
        lastMutationId: clientMutationId,
      });
    }
    await ctx.db.delete(category._id);
    return { id: args.id, deleted: true as const };
  },
});
