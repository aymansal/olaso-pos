import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import {
  boundedInteger,
  cleanText,
  conflict,
  expectRevision,
  mutationId,
  notFound,
  requireManagement,
  requireOwner,
} from './lib/management';
import { sessionArgs } from './lib/session';

const staffRole = v.union(
  v.literal('owner'),
  v.literal('manager'),
  v.literal('worker'),
);

function month(value: string, label: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    throw new Error(`${label} must use YYYY-MM.`);
  }
  return value;
}

export const list = query({
  args: { ...sessionArgs },
  handler: async (ctx, args) => {
    await requireManagement(ctx, args);
    const rows = await ctx.db
      .query('staffProfiles')
      .withIndex('by_status_name', (index) => index.eq('status', 'active'))
      .take(101);
    if (rows.length > 100) throw new Error('Staff list exceeds the 100-profile limit.');
    return rows.map((row) => ({
      id: row._id,
      name: row.name,
      role: row.role,
      revision: row.revision,
    }));
  },
});

export const save = mutation({
  args: {
    ...sessionArgs,
    id: v.optional(v.id('staffProfiles')),
    name: v.string(),
    role: staffRole,
    expectedRevision: v.optional(v.number()),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const actor = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const name = cleanText(args.name, 'Staff name', 100);
    const updatedAt = Date.now();
    if (args.id) {
      const profile = await ctx.db.get(args.id);
      if (!profile) return notFound('Staff profile');
      if (profile.lastMutationId === clientMutationId) {
        return { id: profile._id, revision: profile.revision };
      }
      expectRevision(args.expectedRevision, profile.revision);
      await ctx.db.patch(profile._id, {
        name,
        role: args.role,
        revision: profile.revision + 1,
        updatedAt,
        updatedBy: actor,
        lastMutationId: clientMutationId,
      });
      return { id: profile._id, revision: profile.revision + 1 };
    }
    const previous = await ctx.db
      .query('staffProfiles')
      .withIndex('by_client_mutation', (index) => index.eq('lastMutationId', clientMutationId))
      .unique();
    if (previous) return { id: previous._id, revision: previous.revision };
    const id = await ctx.db.insert('staffProfiles', {
      name,
      role: args.role,
      status: 'active',
      revision: 1,
      updatedAt,
      updatedBy: actor,
      lastMutationId: clientMutationId,
    });
    return { id, revision: 1 };
  },
});

export const setArchived = mutation({
  args: {
    ...sessionArgs,
    id: v.id('staffProfiles'),
    archived: v.boolean(),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const actor = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const profile = await ctx.db.get(args.id);
    if (!profile) return notFound('Staff profile');
    if (profile.lastMutationId === clientMutationId) {
      return { id: profile._id, revision: profile.revision };
    }
    expectRevision(args.expectedRevision, profile.revision);
    await ctx.db.patch(profile._id, {
      status: args.archived ? 'archived' : 'active',
      revision: profile.revision + 1,
      updatedAt: Date.now(),
      updatedBy: actor,
      lastMutationId: clientMutationId,
    });
    return { id: profile._id, revision: profile.revision + 1 };
  },
});

export const listCompensation = query({
  args: { ...sessionArgs, staffProfileId: v.id('staffProfiles') },
  handler: async (ctx, args) => {
    await requireOwner(ctx, args);
    const rows = await ctx.db
      .query('compensationPeriods')
      .withIndex('by_staff_start_month', (index) => index.eq('staffProfileId', args.staffProfileId))
      .take(101);
    if (rows.length > 100) throw new Error('Compensation history exceeds the 100-period limit.');
    return rows.map((row) => ({
      id: row._id,
      monthlyAmountCentimes: row.monthlyAmountCentimes,
      effectiveStartMonth: row.effectiveStartMonth,
      ...(row.effectiveEndMonth ? { effectiveEndMonth: row.effectiveEndMonth } : {}),
      revision: row.revision,
    }));
  },
});

export const addCompensationPeriod = mutation({
  args: {
    ...sessionArgs,
    staffProfileId: v.id('staffProfiles'),
    monthlyAmountCentimes: v.number(),
    effectiveStartMonth: v.string(),
    effectiveEndMonth: v.optional(v.string()),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const actor = await requireOwner(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const existing = await ctx.db
      .query('compensationPeriods')
      .withIndex('by_client_mutation', (index) => index.eq('clientMutationId', clientMutationId))
      .unique();
    if (existing) return { id: existing._id, revision: existing.revision };
    const profile = await ctx.db.get(args.staffProfileId);
    if (!profile) return notFound('Staff profile');
    const effectiveStartMonth = month(args.effectiveStartMonth, 'Effective start month');
    const effectiveEndMonth = args.effectiveEndMonth
      ? month(args.effectiveEndMonth, 'Effective end month')
      : undefined;
    if (effectiveEndMonth && effectiveEndMonth < effectiveStartMonth) {
      return conflict('Compensation cannot end before it starts.');
    }
    const periods = await ctx.db
      .query('compensationPeriods')
      .withIndex('by_staff_start_month', (index) => index.eq('staffProfileId', profile._id))
      .take(101);
    if (periods.length > 100) throw new Error('Compensation history exceeds the 100-period limit.');
    if (periods.some((period) =>
      period.effectiveStartMonth <= (effectiveEndMonth ?? '9999-12')
      && (period.effectiveEndMonth ?? '9999-12') >= effectiveStartMonth,
    )) {
      return conflict('Compensation periods cannot overlap.');
    }
    const id = await ctx.db.insert('compensationPeriods', {
      staffProfileId: profile._id,
      monthlyAmountCentimes: boundedInteger(args.monthlyAmountCentimes, 'Monthly compensation', 0, 100_000_000),
      effectiveStartMonth,
      ...(effectiveEndMonth ? { effectiveEndMonth } : {}),
      revision: 1,
      createdAt: Date.now(),
      updatedBy: actor,
      clientMutationId,
    });
    return { id, revision: 1 };
  },
});
