import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { mutation, query } from './_generated/server';
import {
  boundedInteger,
  cleanText,
  conflict,
  expectRevision,
  mutationId,
  notFound,
  requireOwner,
  requirePermission,
} from './lib/management';
import { sessionArgs } from './lib/session';

const staffRole = v.union(
  v.literal('owner'),
  v.literal('manager'),
  v.literal('cashier'),
);

function month(value: string, label: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    throw new Error(`${label} must use YYYY-MM.`);
  }
  return value;
}

function date(value: string, label: string) {
  const parsed = Date.parse(`${value}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)
      || !Number.isFinite(parsed)
      || new Date(parsed).toISOString().slice(0, 10) !== value) {
    throw new Error(`${label} must use YYYY-MM-DD.`);
  }
  return value;
}

function previousDate(value: string) {
  return new Date(Date.parse(`${value}T00:00:00.000Z`) - 86_400_000)
    .toISOString().slice(0, 10);
}

export const list = query({
  args: { ...sessionArgs },
  handler: async (ctx, args) => {
    await requireOwner(ctx, args);
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
    const actor = await requireOwner(ctx, args);
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
    const actor = await requireOwner(ctx, args);
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
      ...(row.effectiveStartDate ? { effectiveStartDate: row.effectiveStartDate } : {}),
      ...(row.effectiveEndDate ? { effectiveEndDate: row.effectiveEndDate } : {}),
      revision: row.revision,
    }));
  },
});

export const remove = mutation({
  args: {
    ...sessionArgs,
    id: v.id('staffProfiles'),
    expectedRevision: v.number(),
    clientMutationId: v.string(),
    compensationEndMonth: v.optional(v.string()),
    compensationEndDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args, 'staff');
    mutationId(args.clientMutationId);
    const profile = await ctx.db.get(args.id);
    if (!profile) return { id: args.id, deleted: true as const };
    if (actor.staffProfileId === String(profile._id)) {
      return conflict('You cannot delete the profile you are using.');
    }
    expectRevision(args.expectedRevision, profile.revision);
    if (profile.role === 'owner') {
      const active = await ctx.db.query('staffProfiles')
        .withIndex('by_status_name', (index) => index.eq('status', 'active'))
        .take(101);
      if (active.length > 100) throw new Error('Staff list is too large.');
      if (active.filter((member) => member.role === 'owner').length < 2) {
        return conflict('The last owner cannot be deleted.');
      }
    }
    const [identities, sessions, attempts, compensation] = await Promise.all([
      ctx.db.query('staffIdentities')
        .withIndex('by_staff_profile', (index) => index.eq('staffProfileId', profile._id))
        .take(2),
      ctx.db.query('staffSessions')
        .withIndex('by_staff_profile', (index) => index.eq('staffProfileId', profile._id))
        .take(101),
      ctx.db.query('staffPinAttempts')
        .withIndex('by_staff_device', (index) => index.eq('staffProfileId', profile._id))
        .take(101),
      ctx.db.query('compensationPeriods')
        .withIndex('by_staff_start_month', (index) =>
          index.eq('staffProfileId', profile._id))
        .take(101),
    ]);
    if (identities.length > 1 || sessions.length > 100 || attempts.length > 100
        || compensation.length > 100) {
      throw new Error('Staff history exceeds its safe deletion limit.');
    }
    const endMonth = args.compensationEndMonth
      ? month(args.compensationEndMonth, 'Compensation end month')
      : undefined;
    const endDate = args.compensationEndDate
      ? date(args.compensationEndDate, 'Compensation end date')
      : undefined;
    for (const period of compensation) {
      const closedEnd = endMonth
        && (!period.effectiveEndMonth || period.effectiveEndMonth > endMonth)
        ? endMonth
        : period.effectiveEndMonth;
      await ctx.db.patch(period._id, {
        staffNameSnapshot: profile.name,
        staffRoleSnapshot: profile.role,
        ...(closedEnd && closedEnd !== period.effectiveEndMonth
          ? { effectiveEndMonth: closedEnd }
          : {}),
        ...(endDate && (!period.effectiveEndDate || period.effectiveEndDate > endDate)
          ? { effectiveEndDate: endDate }
          : {}),
      });
    }
    for (const row of [...identities, ...sessions, ...attempts]) {
      await ctx.db.delete(row._id);
    }
    await ctx.db.delete(profile._id);
    return { id: args.id, deleted: true as const };
  },
});

export const listAllCompensation = query({
  args: { ...sessionArgs },
  handler: async (ctx, args) => {
    await requireOwner(ctx, args);
    const rows = await ctx.db.query('compensationPeriods').take(101);
    if (rows.length > 100) {
      throw new Error('Compensation history exceeds the 100-period limit.');
    }
    return rows.map((row) => ({
      id: row._id,
      staffProfileId: row.staffProfileId,
      ...(row.staffNameSnapshot ? { staffNameSnapshot: row.staffNameSnapshot } : {}),
      ...(row.staffRoleSnapshot ? { staffRoleSnapshot: row.staffRoleSnapshot } : {}),
      monthlyAmountCentimes: row.monthlyAmountCentimes,
      effectiveStartMonth: row.effectiveStartMonth,
      ...(row.effectiveEndMonth ? { effectiveEndMonth: row.effectiveEndMonth } : {}),
      ...(row.effectiveStartDate ? { effectiveStartDate: row.effectiveStartDate } : {}),
      ...(row.effectiveEndDate ? { effectiveEndDate: row.effectiveEndDate } : {}),
      revision: row.revision,
    }));
  },
});

export const listAllCompensationPage = query({
  args: { ...sessionArgs, paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireOwner(ctx, args);
    const page = await ctx.db.query('compensationPeriods').paginate(args.paginationOpts);
    return { ...page, page: page.page.map((row) => ({ ...row, id: row._id })) };
  },
});

export const addCompensationPeriod = mutation({
  args: {
    ...sessionArgs,
    staffProfileId: v.id('staffProfiles'),
    monthlyAmountCentimes: v.number(),
    effectiveStartMonth: v.string(),
    effectiveEndMonth: v.optional(v.string()),
    effectiveStartDate: v.optional(v.string()),
    effectiveEndDate: v.optional(v.string()),
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
    const effectiveStartDate = args.effectiveStartDate
      ? date(args.effectiveStartDate, 'Effective start date')
      : `${month(args.effectiveStartMonth, 'Effective start month')}-01`;
    const effectiveEndDate = args.effectiveEndDate
      ? date(args.effectiveEndDate, 'Effective end date')
      : undefined;
    const effectiveStartMonth = effectiveStartDate.slice(0, 7);
    const effectiveEndMonth = args.effectiveEndMonth
      ? month(args.effectiveEndMonth, 'Effective end month')
      : effectiveEndDate?.slice(0, 7);
    if ((effectiveEndDate && effectiveEndDate < effectiveStartDate)
        || (effectiveEndMonth && effectiveEndMonth < effectiveStartMonth)) {
      return conflict('Compensation cannot end before it starts.');
    }
    const periods = await ctx.db
      .query('compensationPeriods')
      .withIndex('by_staff_start_month', (index) => index.eq('staffProfileId', profile._id))
      .take(101);
    if (periods.length > 100) throw new Error('Compensation history exceeds the 100-period limit.');
    const priorDay = previousDate(effectiveStartDate);
    for (const period of periods) {
      const periodStart = period.effectiveStartDate
        ?? `${period.effectiveStartMonth}-01`;
      const periodEnd = period.effectiveEndDate
        ?? (period.effectiveEndMonth ? `${period.effectiveEndMonth}-31` : '9999-12-31');
      if (periodStart >= effectiveStartDate
          && periodStart <= (effectiveEndDate ?? '9999-12-31')) {
        return conflict('Compensation periods cannot overlap.');
      }
      if (periodStart < effectiveStartDate && periodEnd >= effectiveStartDate) {
        await ctx.db.patch(period._id, {
          effectiveEndMonth: priorDay.slice(0, 7),
          effectiveEndDate: priorDay,
          revision: period.revision + 1,
        });
      }
    }
    const id = await ctx.db.insert('compensationPeriods', {
      staffProfileId: profile._id,
      staffNameSnapshot: profile.name,
      staffRoleSnapshot: profile.role,
      monthlyAmountCentimes: boundedInteger(args.monthlyAmountCentimes, 'Monthly compensation', 0, 100_000_000),
      effectiveStartMonth,
      ...(effectiveEndMonth ? { effectiveEndMonth } : {}),
      effectiveStartDate,
      ...(effectiveEndDate ? { effectiveEndDate } : {}),
      revision: 1,
      createdAt: Date.now(),
      updatedBy: actor,
      clientMutationId,
    });
    return { id, revision: 1 };
  },
});

export const removePeriod = mutation({
  args: {
    ...sessionArgs,
    id: v.id('compensationPeriods'),
    expectedRevision: v.number(),
    effectiveEndDate: v.string(),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOwner(ctx, args);
    mutationId(args.clientMutationId);
    const period = await ctx.db.get(args.id);
    if (!period) return { id: args.id, deleted: true as const };
    expectRevision(args.expectedRevision, period.revision);
    const requestedEndDate = date(args.effectiveEndDate, 'Effective end date');
    const savedEndDate = period.effectiveEndDate
      ?? (period.effectiveEndMonth ? `${period.effectiveEndMonth}-31` : undefined);
    const effectiveEndDate = savedEndDate && savedEndDate < requestedEndDate
      ? savedEndDate
      : requestedEndDate;
    await ctx.db.patch(period._id, {
      effectiveEndMonth: effectiveEndDate.slice(0, 7),
      effectiveEndDate,
      revision: period.revision + 1,
    });
    return { id: args.id, stopped: true as const };
  },
});
