import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import {
  boundedInteger,
  businessDate,
  cleanText,
  conflict,
  expectRevision,
  mutationId,
  notFound,
  requirePermission,
} from './lib/management';
import { sessionArgs } from './lib/session';

const recurrence = v.union(v.literal('one-time'), v.literal('monthly'));

function month(value: string, label: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    throw new Error(`${label} must use YYYY-MM.`);
  }
  return value;
}

function expenseInput(args: {
  category: string;
  description: string;
  amountCentimes: number;
  recurrence: 'one-time' | 'monthly';
  effectiveDate?: string;
  effectiveStartMonth?: string;
  effectiveEndMonth?: string;
}) {
  const result = {
    category: cleanText(args.category, 'Expense category', 60),
    description: cleanText(args.description, 'Expense description', 160),
    amountCentimes: boundedInteger(args.amountCentimes, 'Expense amount', 1, 100_000_000),
    recurrence: args.recurrence,
  };
  if (args.recurrence === 'one-time') {
    if (!args.effectiveDate || args.effectiveStartMonth || args.effectiveEndMonth) {
      throw new Error('One-time expenses require only an effective date.');
    }
    return { ...result, effectiveDate: businessDate(args.effectiveDate) };
  }
  if (!args.effectiveStartMonth || args.effectiveDate) {
    throw new Error('Monthly expenses require an effective start month.');
  }
  const effectiveStartMonth = month(args.effectiveStartMonth, 'Effective start month');
  const effectiveEndMonth = args.effectiveEndMonth
    ? month(args.effectiveEndMonth, 'Effective end month')
    : undefined;
  if (effectiveEndMonth && effectiveEndMonth < effectiveStartMonth) {
    throw new Error('Expense cannot end before it starts.');
  }
  return {
    ...result,
    effectiveStartMonth,
    ...(effectiveEndMonth ? { effectiveEndMonth } : {}),
  };
}

export const list = query({
  args: { ...sessionArgs, limit: v.number() },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args, 'expenses');
    const limit = boundedInteger(args.limit, 'Expense list limit', 1, 100);
    const rows = await ctx.db
      .query('operatingExpenses')
      .withIndex('by_status_created_at', (index) => index.eq('status', 'active'))
      .take(limit + 1);
    if (rows.length > limit) throw new Error('Expense list exceeds its requested limit.');
    return rows.map((row) => ({
      id: row._id,
      category: row.category,
      description: row.description,
      amountCentimes: row.amountCentimes,
      recurrence: row.recurrence,
      ...(row.effectiveDate ? { effectiveDate: row.effectiveDate } : {}),
      ...(row.effectiveStartMonth ? { effectiveStartMonth: row.effectiveStartMonth } : {}),
      ...(row.effectiveEndMonth ? { effectiveEndMonth: row.effectiveEndMonth } : {}),
      transactionType: row.transactionType,
      ...(row.correctionOfExpenseId
        ? { correctionOfExpenseId: row.correctionOfExpenseId }
        : {}),
      revision: row.revision,
    }));
  },
});

export const add = mutation({
  args: {
    ...sessionArgs,
    category: v.string(),
    description: v.string(),
    amountCentimes: v.number(),
    recurrence,
    effectiveDate: v.optional(v.string()),
    effectiveStartMonth: v.optional(v.string()),
    effectiveEndMonth: v.optional(v.string()),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const actor = (await requirePermission(ctx, args, 'expenses')).name;
    const clientMutationId = mutationId(args.clientMutationId);
    const existing = await ctx.db
      .query('operatingExpenses')
      .withIndex('by_client_mutation', (index) => index.eq('clientMutationId', clientMutationId))
      .unique();
    if (existing) return { id: existing._id, revision: existing.revision };
    const input = expenseInput(args);
    const id = await ctx.db.insert('operatingExpenses', {
      ...input,
      status: 'active',
      transactionType: 'recorded',
      revision: 1,
      createdAt: Date.now(),
      updatedBy: actor,
      clientMutationId,
    });
    return { id, revision: 1 };
  },
});

export const correct = mutation({
  args: {
    ...sessionArgs,
    expenseId: v.id('operatingExpenses'),
    expectedRevision: v.number(),
    category: v.string(),
    description: v.string(),
    amountCentimes: v.number(),
    recurrence,
    effectiveDate: v.optional(v.string()),
    effectiveStartMonth: v.optional(v.string()),
    effectiveEndMonth: v.optional(v.string()),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const actor = (await requirePermission(ctx, args, 'expenses')).name;
    const clientMutationId = mutationId(args.clientMutationId);
    const [previousReversal, previousReplacement] = await Promise.all([
      ctx.db
        .query('operatingExpenses')
        .withIndex('by_client_mutation', (index) =>
          index.eq('clientMutationId', `${clientMutationId}:reversal`),
        )
        .unique(),
      ctx.db
        .query('operatingExpenses')
        .withIndex('by_client_mutation', (index) =>
          index.eq('clientMutationId', `${clientMutationId}:replacement`),
        )
        .unique(),
    ]);
    if (previousReversal || previousReplacement) {
      if (!previousReversal || !previousReplacement) {
        throw new Error('Expense correction retry found incomplete history.');
      }
      return {
        reversalId: previousReversal._id,
        replacementId: previousReplacement._id,
      };
    }
    const original = await ctx.db.get(args.expenseId);
    if (!original) return notFound('Operating expense');
    if (original.transactionType !== 'recorded') return conflict('Only recorded expenses can be corrected.');
    expectRevision(args.expectedRevision, original.revision);
    const prior = await ctx.db
      .query('operatingExpenses')
      .withIndex('by_correction_of_created_at', (index) => index.eq('correctionOfExpenseId', original._id))
      .take(1);
    if (prior.length) return conflict('This expense already has correction history.');
    const input = expenseInput(args);
    const reversalId = await ctx.db.insert('operatingExpenses', {
      category: original.category,
      description: `Correction reversal: ${original.description}`,
      amountCentimes: original.amountCentimes,
      recurrence: original.recurrence,
      ...(original.effectiveDate ? { effectiveDate: original.effectiveDate } : {}),
      ...(original.effectiveStartMonth ? { effectiveStartMonth: original.effectiveStartMonth } : {}),
      ...(original.effectiveEndMonth ? { effectiveEndMonth: original.effectiveEndMonth } : {}),
      status: 'active',
      transactionType: 'reversal',
      correctionOfExpenseId: original._id,
      revision: 1,
      createdAt: Date.now(),
      updatedBy: actor,
      clientMutationId: `${clientMutationId}:reversal`,
    });
    const replacementId = await ctx.db.insert('operatingExpenses', {
      ...input,
      status: 'active',
      transactionType: 'recorded',
      correctionOfExpenseId: original._id,
      revision: 1,
      createdAt: Date.now(),
      updatedBy: actor,
      clientMutationId: `${clientMutationId}:replacement`,
    });
    return { reversalId, replacementId };
  },
});
