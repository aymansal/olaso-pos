import { v } from 'convex/values';
import { query } from './_generated/server';
import {
  businessDate,
  requireManagement,
} from './lib/management';
import { sessionArgs } from './lib/session';
import { pendingReportCorrections } from './lib/pendingReportCorrections';

const MAX_SUMMARY_DAYS = 12;
const MAX_INGREDIENTS = 100;
const MAX_WARNINGS = 4;
const MAX_RECENT_ORDERS = 4;
const DAY_MS = 86_400_000;

function shiftBusinessDate(value: string, days: number) {
  return new Date(
    Date.parse(`${value}T00:00:00.000Z`) + days * DAY_MS,
  ).toISOString().slice(0, 10);
}

export const getSnapshot = query({
  args: { ...sessionArgs, businessDate: v.string(), pendingCancelledSaleIds: v.optional(v.array(v.string())) },
  handler: async (ctx, args) => {
    await requireManagement(ctx, args);
    const date = businessDate(args.businessDate);
    const [savedSummaries, ingredients, sales] = await Promise.all([
      ctx.db
        .query('dailyMetrics')
        .withIndex('by_business_date', (index) =>
          index.lte('businessDate', date),
        )
        .order('desc')
        .take(MAX_SUMMARY_DAYS),
      ctx.db
        .query('ingredients')
        .withIndex('by_updated_at')
        .order('desc')
        .take(MAX_INGREDIENTS + 1),
      ctx.db
        .query('sales')
        .withIndex('by_completed_at')
        .order('desc')
        .take(MAX_RECENT_ORDERS),
    ]);

    if (ingredients.length > MAX_INGREDIENTS) {
      throw new Error('Dashboard ingredient result exceeded its bounded limit.');
    }

    const { rows: summaries, cancelledIds } = await pendingReportCorrections(
      ctx, savedSummaries, args.deviceId, args.pendingCancelledSaleIds,
    );
    const byDate = new Map(
      summaries.map((summary) => [summary.businessDate, summary]),
    );
    const today = byDate.get(date);
    const yesterdayDate = shiftBusinessDate(date, -1);
    const yesterday = byDate.get(yesterdayDate);
    const bestSeller = today?.productTotals
      .slice()
      .sort(
        (left, right) =>
          right.quantity - left.quantity
          || right.totalCentimes - left.totalCentimes
          || left.productName.localeCompare(right.productName),
      )[0];

    return {
      businessDate: date,
      updatedAt: today?.updatedAt,
      today: today
        ? {
            grossCentimes: today.grossCentimes,
            netCentimes: today.netCentimes,
            orderCount: today.orderCount,
            itemCount: today.productTotals.reduce(
              (total, product) => total + product.quantity,
              0,
            ),
            ...(bestSeller
              ? {
                  bestSeller: {
                    name: bestSeller.productName,
                    quantity: bestSeller.quantity,
                    totalCentimes: bestSeller.totalCentimes,
                  },
                }
              : {}),
          }
        : undefined,
      yesterday: yesterday
        ? {
            netCentimes: yesterday.netCentimes,
            orderCount: yesterday.orderCount,
          }
        : undefined,
      dailySales: Array.from(
        { length: MAX_SUMMARY_DAYS },
        (_, index) => {
          const businessDate = shiftBusinessDate(
            date,
            index - MAX_SUMMARY_DAYS + 1,
          );
          const summary = byDate.get(businessDate);
          return {
            businessDate,
            netCentimes: summary?.netCentimes ?? 0,
            orderCount: summary?.orderCount ?? 0,
          };
        },
      ),
      warnings: ingredients
        .filter(
          (ingredient) =>
            ingredient.status === 'active'
            && ingredient.currentStockQuantity
              <= ingredient.lowStockThreshold,
        )
        .sort(
          (left, right) =>
            left.currentStockQuantity
              / Math.max(1, left.lowStockThreshold)
            - right.currentStockQuantity
              / Math.max(1, right.lowStockThreshold)
            || left.name.localeCompare(right.name),
        )
        .slice(0, MAX_WARNINGS)
        .map((ingredient) => ({
          id: ingredient._id,
          key: ingredient.key,
          name: ingredient.name,
          baseUnit: ingredient.baseUnit,
          currentStockQuantity: ingredient.currentStockQuantity,
          lowStockThreshold: ingredient.lowStockThreshold,
        })),
      recentOrders: sales.map((sale) => ({
        id: sale._id,
        receiptNumber: sale.receiptNumber,
        status: cancelledIds.has(sale._id) ? 'cancelled' as const : sale.status,
        serviceMode: sale.serviceMode,
        customerName: sale.customerName,
        totalCentimes: sale.totalCentimes,
        completedAt: sale.completedAt,
        itemCount: sale.receiptSnapshot.lines.reduce(
          (total, line) => total + line.quantity,
          0,
        ),
      })),
    };
  },
});
