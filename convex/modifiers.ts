import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { Doc, Id } from './_generated/dataModel';
import {
  boundedInteger,
  cleanKey,
  cleanText,
  conflict,
  expectRevision,
  invalid,
  mutationId,
  notFound,
  requireManagement,
} from './lib/management';

const MAX_GROUPS = 50;
const MAX_OPTIONS = 200;
const MAX_INGREDIENTS = 100;
const activeStatus = v.union(v.literal('active'), v.literal('archived'));
const ingredientEffect = v.object({
  ingredientId: v.id('ingredients'),
  quantityDelta: v.number(),
});
const optionInput = v.object({
  id: v.optional(v.id('modifierOptions')),
  key: v.string(),
  name: v.string(),
  priceDeltaCentimes: v.number(),
  ingredientEffects: v.array(ingredientEffect),
  status: activeStatus,
  sortOrder: v.number(),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireManagement(ctx);
    const [groups, options, ingredients] = await Promise.all([
      ctx.db
        .query('modifierGroups')
        .withIndex('by_updated_at')
        .take(MAX_GROUPS + 1),
      ctx.db
        .query('modifierOptions')
        .withIndex('by_updated_at')
        .take(MAX_OPTIONS + 1),
      ctx.db
        .query('ingredients')
        .withIndex('by_status_name', (index) => index.eq('status', 'active'))
        .take(MAX_INGREDIENTS + 1),
    ]);
    if (
      groups.length > MAX_GROUPS ||
      options.length > MAX_OPTIONS ||
      ingredients.length > MAX_INGREDIENTS
    ) {
      throw new Error('Modifier management result exceeded its bounded limit.');
    }
    return {
      groups: groups.sort(
        (left, right) =>
          left.sortOrder - right.sortOrder ||
          left.name.localeCompare(right.name),
      ),
      options: options.sort(
        (left, right) =>
          left.sortOrder - right.sortOrder ||
          left.name.localeCompare(right.name),
      ),
      ingredients,
    };
  },
});

function sameEffects(
  left: Doc<'modifierOptions'>['ingredientEffects'],
  right: Doc<'modifierOptions'>['ingredientEffects'],
) {
  return (
    left.length === right.length &&
    left.every(
      (effect, index) =>
        effect.ingredientId === right[index]?.ingredientId &&
        effect.quantityDelta === right[index]?.quantityDelta,
    )
  );
}

export const saveGroup = mutation({
  args: {
    id: v.optional(v.id('modifierGroups')),
    key: v.optional(v.string()),
    name: v.string(),
    required: v.boolean(),
    minSelections: v.number(),
    maxSelections: v.number(),
    sortOrder: v.number(),
    expectedRevision: v.optional(v.number()),
    clientMutationId: v.string(),
    options: v.array(optionInput),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx);
    const clientMutationId = mutationId(args.clientMutationId);
    const name = cleanText(args.name, 'Modifier group name', 80);
    const minSelections = boundedInteger(
      args.minSelections,
      'Minimum selections',
      0,
      10,
    );
    const maxSelections = boundedInteger(
      args.maxSelections,
      'Maximum selections',
      1,
      10,
    );
    const sortOrder = boundedInteger(args.sortOrder, 'Sort order', 0, 10_000);
    if (minSelections > maxSelections || (args.required && minSelections < 1)) {
      return invalid('Selection limits do not match the required setting.');
    }
    if (args.options.length > 30) {
      return invalid('A modifier group can contain at most 30 options.');
    }

    const preparedOptions = args.options.map((option) => ({
      ...option,
      key: cleanKey(option.key, 'Modifier option key'),
      name: cleanText(option.name, 'Modifier option name', 80),
      priceDeltaCentimes: boundedInteger(
        option.priceDeltaCentimes,
        'Modifier price',
        -10_000_000,
        10_000_000,
      ),
      sortOrder: boundedInteger(
        option.sortOrder,
        'Modifier option sort order',
        0,
        10_000,
      ),
      ingredientEffects: option.ingredientEffects.map((effect) => ({
        ingredientId: effect.ingredientId,
        quantityDelta: boundedInteger(
          effect.quantityDelta,
          'Ingredient effect',
          -1_000_000,
          1_000_000,
        ),
      })),
    }));
    if (
      new Set(preparedOptions.map((option) => option.key)).size !==
      preparedOptions.length
    ) {
      return invalid('Modifier option keys must be unique.');
    }

    const ingredientIds = [
      ...new Set(
        preparedOptions.flatMap((option) =>
          option.ingredientEffects.map((effect) => effect.ingredientId),
        ),
      ),
    ];
    const ingredients = await Promise.all(
      ingredientIds.map((ingredientId) => ctx.db.get(ingredientId)),
    );
    if (ingredients.some((ingredient) => !ingredient || ingredient.status !== 'active')) {
      return invalid('Modifier effects must use active ingredients.');
    }

    let group: Doc<'modifierGroups'> | null = null;
    if (args.id) {
      group = await ctx.db.get(args.id);
      if (!group) return notFound('Modifier group');
      if (group.lastMutationId === clientMutationId) {
        return { id: group._id, revision: group.revision, created: false };
      }
      expectRevision(args.expectedRevision, group.revision);
    } else {
      const key = cleanKey(args.key, 'Modifier group key');
      const existing = await ctx.db
        .query('modifierGroups')
        .withIndex('by_key', (index) => index.eq('key', key))
        .unique();
      if (existing) {
        if (existing.lastMutationId === clientMutationId) {
          return { id: existing._id, revision: existing.revision, created: false };
        }
        return conflict('A modifier group with this key already exists.');
      }
      const id = await ctx.db.insert('modifierGroups', {
        key,
        name,
        required: args.required,
        minSelections,
        maxSelections,
        status: 'active',
        sortOrder,
        revision: 1,
        updatedAt: Date.now(),
        updatedBy,
        lastMutationId: clientMutationId,
      });
      group = await ctx.db.get(id);
    }
    if (!group) return notFound('Modifier group');

    const [activeOptions, archivedOptions] = await Promise.all([
      ctx.db
        .query('modifierOptions')
        .withIndex('by_group_status_sort_order', (index) =>
          index.eq('groupId', group!._id).eq('status', 'active'),
        )
        .take(51),
      ctx.db
        .query('modifierOptions')
        .withIndex('by_group_status_sort_order', (index) =>
          index.eq('groupId', group!._id).eq('status', 'archived'),
        )
        .take(51),
    ]);
    if (activeOptions.length > 50 || archivedOptions.length > 50) {
      throw new Error('Modifier option group exceeded its bounded limit.');
    }
    const existingOptions = [...activeOptions, ...archivedOptions];
    const existingById = new Map(
      existingOptions.map((option) => [option._id, option]),
    );
    const submittedIds = new Set<Id<'modifierOptions'>>();
    const updatedAt = Date.now();

    for (const option of preparedOptions) {
      if (option.id) {
        const existing = existingById.get(option.id);
        if (!existing) {
          return invalid('A modifier option does not belong to this group.');
        }
        submittedIds.add(option.id);
        if (
          existing.key !== option.key ||
          existing.name !== option.name ||
          existing.priceDeltaCentimes !== option.priceDeltaCentimes ||
          existing.status !== option.status ||
          existing.sortOrder !== option.sortOrder ||
          !sameEffects(existing.ingredientEffects, option.ingredientEffects)
        ) {
          await ctx.db.patch(existing._id, {
            key: option.key,
            name: option.name,
            priceDeltaCentimes: option.priceDeltaCentimes,
            ingredientEffects: option.ingredientEffects,
            status: option.status,
            sortOrder: option.sortOrder,
            revision: existing.revision + 1,
            updatedAt,
            updatedBy,
          });
        }
        continue;
      }

      const duplicate = await ctx.db
        .query('modifierOptions')
        .withIndex('by_group_key', (index) =>
          index.eq('groupId', group!._id).eq('key', option.key),
        )
        .unique();
      if (duplicate) {
        return conflict(`Modifier option key "${option.key}" already exists.`);
      }
      await ctx.db.insert('modifierOptions', {
        groupId: group._id,
        key: option.key,
        name: option.name,
        priceDeltaCentimes: option.priceDeltaCentimes,
        ingredientEffects: option.ingredientEffects,
        status: option.status,
        sortOrder: option.sortOrder,
        revision: 1,
        updatedAt,
        updatedBy,
      });
    }

    for (const option of activeOptions) {
      if (!submittedIds.has(option._id)) {
        await ctx.db.patch(option._id, {
          status: 'archived',
          revision: option.revision + 1,
          updatedAt,
          updatedBy,
        });
      }
    }

    const nextRevision = args.id ? group.revision + 1 : group.revision;
    if (args.id) {
      await ctx.db.patch(group._id, {
        name,
        required: args.required,
        minSelections,
        maxSelections,
        sortOrder,
        revision: nextRevision,
        updatedAt,
        updatedBy,
        lastMutationId: clientMutationId,
      });
    }
    return { id: group._id, revision: nextRevision, created: !args.id };
  },
});

export const setGroupArchived = mutation({
  args: {
    id: v.id('modifierGroups'),
    archived: v.boolean(),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx);
    const clientMutationId = mutationId(args.clientMutationId);
    const group = await ctx.db.get(args.id);
    if (!group) return notFound('Modifier group');
    if (group.lastMutationId === clientMutationId) {
      return { id: group._id, revision: group.revision };
    }
    expectRevision(args.expectedRevision, group.revision);
    await ctx.db.patch(group._id, {
      status: args.archived ? 'archived' : 'active',
      revision: group.revision + 1,
      updatedAt: Date.now(),
      updatedBy,
      lastMutationId: clientMutationId,
    });
    return { id: group._id, revision: group.revision + 1 };
  },
});
