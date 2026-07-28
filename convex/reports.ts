import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';
import { query } from './_generated/server';
import {
  businessDate,
  invalid,
  requireManagement,
} from './lib/management';

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

  for (const row of rows) {
    netCentimes += row.netCentimes;
    orderCount += row.orderCount;
    ingredientUsageEventCount += row.ingredientUsageEventCount ?? 0;

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
      const key = String(ingredient.ingredientId);
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
  return {
    netCentimes,
    orderCount,
    itemCount: allProductTotals.reduce(
      (total, product) => total + product.quantity,
      0,
    ),
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
      )
      .slice(0, MAX_DETAIL_ROWS),
  };
}

export const getSummary = query({
  args: {
    fromDate: v.string(),
    toDate: v.string(),
  },
  handler: async (ctx, args) => {
    await requireManagement(ctx);
    const range = checkedRange(args.fromDate, args.toDate);
    const previousTo = shiftBusinessDate(range.from, -1);
    const previousFrom = shiftBusinessDate(previousTo, 1 - range.days);
    const [currentRows, previousRows] = await Promise.all([
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
    const byDate = new Map(
      currentRows.map((row) => [row.businessDate, row]),
    );
    return {
      range,
      comparisonRange: { from: previousFrom, to: previousTo },
      current,
      previous: aggregate(previousRows),
      daily: Array.from({ length: range.days }, (_, index) => {
        const date = shiftBusinessDate(range.from, index);
        const row = byDate.get(date);
        return {
          businessDate: date,
          netCentimes: row?.netCentimes ?? 0,
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
