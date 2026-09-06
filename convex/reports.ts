import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';
import { query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import {
  businessDate,
  invalid,
  requireManagement,
  requireOwner,
} from './lib/management';
import { sessionArgs } from './lib/session';
import { pendingReportCorrections } from './lib/pendingReportCorrections';
import { operatingCostsForRange } from '../src/lib/costs';

const MAX_RANGE_DAYS = 31;
const MAX_DETAIL_ROWS = 20;
const DAY_MS = 86_400_000;

function shiftBusinessDate(value: string, days: number) {
  return new Date(
    Date.parse(`${value}T00:00:00.000Z`) + days * DAY_MS,
  ).toISOString().slice(0, 10);
}

function checkedRange(fromValue: string, toValue: string) {
  const from = businessDate(fromValue);
  const to = businessDate(toValue);
  const days =
    Math.floor(
      (
        Date.parse(`${to}T00:00:00.000Z`)
        - Date.parse(`${from}T00:00:00.000Z`)
      ) / DAY_MS,
    ) + 1;
  if (days < 1 || days > MAX_RANGE_DAYS) {
    return invalid(`Report periods must contain 1 to ${MAX_RANGE_DAYS} days.`);
  }
  return { from, to, days };
}

function aggregate(rows: Doc<'dailyMetrics'>[]) {
  const products = new Map<
    string,
    {
      productId: Doc<'dailyMetrics'>['productTotals'][number]['productId'];
      productName: string;
      categoryName?: string;
      quantity: number;
      totalCentimes: number;
    }
  >();
  const categories = new Map<
    string,
    {
      categoryId: Doc<'dailyMetrics'>['categoryTotals'][number]['categoryId'];
      categoryName: string;
      quantity: number;
      totalCentimes: number;
    }
  >();
  const payments = new Map<
    string,
    { paymentMethod: string; totalCentimes: number; orderCount: number }
  >();
  const profiles = new Map<
    string,
    {
      staffProfileId?: string;
      profileName: string;
      orderCount: number;
      itemCount: number;
      netCentimes: number;
    }
  >();
  const ingredients = new Map<
    string,
    {
      ingredientId: NonNullable<
        Doc<'dailyMetrics'>['ingredientTotals']
      >[number]['ingredientId'];
      ingredientName: string;
      baseUnit: 'millilitre' | 'gram' | 'milligram' | 'piece';
      quantity: number;
    }
  >();
  let netCentimes = 0;
  let orderCount = 0;
  let ingredientUsageEventCount = 0;
  let ingredientCostCentimes = 0;
  let incompleteSaleCount = 0;

  for (const row of rows) {
    netCentimes += row.netCentimes;
    orderCount += row.orderCount;
    ingredientUsageEventCount += row.ingredientUsageEventCount ?? 0;
    ingredientCostCentimes += row.ingredientCostCentimes ?? 0;
    incompleteSaleCount += row.incompleteCostSaleCount ?? 0;

    for (const profile of row.profileTotals ?? []) {
      const key = String(profile.staffProfileId);
      const total = profiles.get(key) ?? {
        staffProfileId: key,
        profileName: profile.profileName,
        orderCount: 0,
        itemCount: 0,
        netCentimes: 0,
      };
      total.orderCount += profile.orderCount;
      total.itemCount += profile.itemCount;
      total.netCentimes += profile.netCentimes;
      profiles.set(key, total);
    }

    for (const product of row.productTotals) {
      const key = String(product.productId);
      const total = products.get(key) ?? { ...product, quantity: 0, totalCentimes: 0 };
      total.categoryName ??= product.categoryName;
      total.quantity += product.quantity;
      total.totalCentimes += product.totalCentimes;
      products.set(key, total);
    }
    for (const category of row.categoryTotals) {
      const key = String(category.categoryId);
      const total = categories.get(key) ?? { ...category, quantity: 0, totalCentimes: 0 };
      total.quantity += category.quantity;
      total.totalCentimes += category.totalCentimes;
      categories.set(key, total);
    }
    for (const payment of row.totalsByPaymentMethod) {
      const total = payments.get(payment.paymentMethod) ?? {
        paymentMethod: payment.paymentMethod,
        totalCentimes: 0,
        orderCount: 0,
      };
      total.totalCentimes += payment.totalCentimes;
      total.orderCount += payment.orderCount;
      payments.set(payment.paymentMethod, total);
    }
    for (const ingredient of row.ingredientTotals ?? []) {
      const key = `${ingredient.ingredientName}\0${ingredient.baseUnit}`;
      const total = ingredients.get(key) ?? { ...ingredient, quantity: 0 };
      total.quantity += ingredient.quantity;
      ingredients.set(key, total);
    }
  }

  const allProductTotals = [...products.values()].sort(
    (left, right) =>
      right.totalCentimes - left.totalCentimes
      || right.quantity - left.quantity
      || left.productName.localeCompare(right.productName),
  );
  const attributed = [...profiles.values()].reduce(
    (total, profile) => ({
      orderCount: total.orderCount + profile.orderCount,
      itemCount: total.itemCount + profile.itemCount,
      netCentimes: total.netCentimes + profile.netCentimes,
    }),
    { orderCount: 0, itemCount: 0, netCentimes: 0 },
  );
  const itemCount = allProductTotals.reduce(
    (total, product) => total + product.quantity,
    0,
  );
  if (
    attributed.orderCount !== orderCount
    || attributed.itemCount !== itemCount
    || attributed.netCentimes !== netCentimes
  ) {
    profiles.set('', {
      profileName: 'Unattributed',
      orderCount: orderCount - attributed.orderCount,
      itemCount: itemCount - attributed.itemCount,
      netCentimes: netCentimes - attributed.netCentimes,
    });
  }
  return {
    netCentimes,
    orderCount,
    ingredientCostCentimes,
    incompleteSaleCount,
    itemCount,
    profileTotals: [...profiles.values()]
      .filter((profile) => profile.orderCount > 0)
      .sort((left, right) =>
        right.netCentimes - left.netCentimes
        || left.profileName.localeCompare(right.profileName),
      ),
    ingredientTypeCount: ingredients.size,
    ingredientUsageEventCount,
    productTotals: allProductTotals.slice(0, MAX_DETAIL_ROWS),
    categoryTotals: [...categories.values()]
      .sort(
        (left, right) =>
          right.totalCentimes - left.totalCentimes
          || left.categoryName.localeCompare(right.categoryName),
      )
      .slice(0, MAX_DETAIL_ROWS),
    paymentTotals: [...payments.values()]
      .sort(
        (left, right) =>
          right.totalCentimes - left.totalCentimes
          || left.paymentMethod.localeCompare(right.paymentMethod),
      )
      .slice(0, MAX_DETAIL_ROWS),
    ingredientTotals: [...ingredients.values()]
      .sort((left, right) =>
        left.ingredientName.localeCompare(right.ingredientName),
      ),
  };
}

export const getSummary = query({
  args: {
    ...sessionArgs,
    fromDate: v.string(),
    toDate: v.string(),
    pendingCancelledSaleIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireManagement(ctx, args);
    const range = checkedRange(args.fromDate, args.toDate);
    const previousTo = shiftBusinessDate(range.from, -1);
    const previousFrom = shiftBusinessDate(previousTo, 1 - range.days);
    const [savedCurrentRows, savedPreviousRows] = await Promise.all([
      ctx.db
        .query('dailyMetrics')
        .withIndex('by_business_date', (index) =>
          index
            .gte('businessDate', range.from)
            .lte('businessDate', range.to),
        )
        .take(MAX_RANGE_DAYS + 1),
      ctx.db
        .query('dailyMetrics')
        .withIndex('by_business_date', (index) =>
          index
            .gte('businessDate', previousFrom)
            .lte('businessDate', previousTo),
        )
        .take(MAX_RANGE_DAYS + 1),
    ]);
    const { rows: correctedRows } = await pendingReportCorrections(
      ctx, [...savedCurrentRows, ...savedPreviousRows], args.deviceId, args.pendingCancelledSaleIds,
    );
    const currentRows = correctedRows.slice(0, savedCurrentRows.length);
    const previousRows = correctedRows.slice(savedCurrentRows.length);
    if (
      currentRows.length > range.days
      || previousRows.length > range.days
      || new Set(currentRows.map((row) => row.businessDate)).size
        !== currentRows.length
      || new Set(previousRows.map((row) => row.businessDate)).size
        !== previousRows.length
    ) {
      throw new Error('Report summary data is duplicated or exceeds its range.');
    }

    const current = aggregate(currentRows);
    const liveIngredients = await ctx.db
      .query('ingredients')
      .withIndex('by_status_name', (index) => index.eq('status', 'active'))
      .take(101);
    if (liveIngredients.length > 100) {
      throw new Error('Report ingredient list exceeds its bounded limit.');
    }
    const stockByName = new Map(
      liveIngredients.map((row) => [
        `${row.name}\0${row.baseUnit}`,
        row.currentStockQuantity,
      ]),
    );
    const ingredientTotals = current.ingredientTotals.map((item) => ({
      ...item,
      currentStockQuantity:
        stockByName.get(`${item.ingredientName}\0${item.baseUnit}`) ?? 0,
    }));
    const byDate = new Map(
      currentRows.map((row) => [row.businessDate, row]),
    );
    return {
      range,
      comparisonRange: { from: previousFrom, to: previousTo },
      current: { ...current, ingredientTotals },
      previous: aggregate(previousRows),
      daily: Array.from({ length: range.days }, (_, index) => {
        const date = shiftBusinessDate(range.from, index);
        const row = byDate.get(date);
        return {
          businessDate: date,
          netCentimes: row?.netCentimes ?? 0,
          ingredientCostCentimes: row?.ingredientCostCentimes ?? 0,
          itemCount: row?.productTotals.reduce(
            (total, product) => total + product.quantity,
            0,
          ) ?? 0,
          ingredientUsageEventCount:
            row?.ingredientUsageEventCount ?? 0,
        };
      }),
    };
  },
});

export const getAllSummaryPage = query({
  args: { ...sessionArgs, paginationOpts: paginationOptsValidator, pendingCancelledSaleIds: v.optional(v.array(v.string())) },
  handler: async (ctx, args) => {
    await requireManagement(ctx, args);
    const page = await ctx.db
      .query('dailyMetrics')
      .withIndex('by_business_date')
      .paginate(args.paginationOpts);
    const corrected = await pendingReportCorrections(ctx, page.page, args.deviceId, args.pendingCancelledSaleIds);
    return { ...page, page: corrected.rows };
  },
});

export const getAllSummaryStock = query({
  args: { ...sessionArgs },
  handler: async (ctx, args) => {
    await requireManagement(ctx, args);
    const liveIngredients = await ctx.db
      .query('ingredients')
      .withIndex('by_status_name', (index) => index.eq('status', 'active'))
      .take(101);
    if (liveIngredients.length > 100) {
      throw new Error('Report ingredient list exceeds its bounded limit.');
    }
    return liveIngredients.map((row) => ({
      ingredientName: row.name,
      baseUnit: row.baseUnit,
      currentStockQuantity: row.currentStockQuantity,
    }));
  },
});

export const getMonthlyCosts = query({
  args: { ...sessionArgs, month: v.string() },
  handler: async (ctx, args) => {
    await requireOwner(ctx, args);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(args.month)) {
      return invalid('Month must use YYYY-MM.');
    }
    const from = `${args.month}-01`;
    const [year, calendarMonth] = args.month.split('-').map(Number);
    const to = new Date(Date.UTC(year, calendarMonth, 0))
      .toISOString()
      .slice(0, 10);
    const [daily, staff, expenses] = await Promise.all([
      ctx.db.query('dailyMetrics').withIndex('by_business_date', (i) => i.gte('businessDate', from).lte('businessDate', to)).take(32),
      ctx.db.query('compensationPeriods').take(101),
      ctx.db.query('operatingExpenses').withIndex('by_status_created_at', (i) => i.eq('status', 'active')).take(101),
    ]);
    if (daily.length > 31 || staff.length > 100 || expenses.length > 100) throw new Error('Monthly cost result exceeds its bounded limit.');
    const revenueCentimes = daily.reduce((sum, row) => sum + row.netCentimes, 0);
    const ingredientCostCentimes = daily.reduce((sum, row) => sum + (row.ingredientCostCentimes ?? 0), 0);
    const incompleteSaleCount = daily.reduce((sum, row) => sum + (row.incompleteCostSaleCount ?? 0), 0);
    const {
      compensationCentimes,
      otherExpenseCentimes: expenseCentimes,
    } = operatingCostsForRange(expenses, staff, from, to);
    return {
      month: args.month, revenueCentimes, ingredientCostCentimes, incompleteSaleCount,
      grossProfitCentimes: revenueCentimes - ingredientCostCentimes,
      compensationCentimes, otherExpenseCentimes: expenseCentimes,
      operatingProfitCentimes: revenueCentimes - ingredientCostCentimes - compensationCentimes - expenseCentimes,
      complete: incompleteSaleCount === 0,
    };
  },
});
