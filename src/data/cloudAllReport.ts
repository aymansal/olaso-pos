import type { FunctionReturnType } from 'convex/server';
import type { PaginationOptions } from 'convex/server';
import type { api } from '../../convex/_generated/api';
import type { ReportsSnapshot } from './useReportsData';

type AllSummaryPage = FunctionReturnType<typeof api.reports.getAllSummaryPage>;
type AllSummaryStock = FunctionReturnType<typeof api.reports.getAllSummaryStock>;
type DailyRow = AllSummaryPage['page'][number];

const MAX_DETAIL_ROWS = 20;
const PAGE_NUM_ITEMS = 60;

export type CloudAllReportPage = {
  page: DailyRow[];
  isDone: boolean;
  continueCursor: string;
  pageStatus?: 'PageReady' | 'SplitRequired' | 'SplitRecommended' | null;
  splitCursor?: string | null;
};

export async function collectCloudAllReportPages(
  queryPage: (paginationOpts: PaginationOptions) => Promise<CloudAllReportPage>,
  queryStock: () => Promise<AllSummaryStock>,
  businessDate: string,
  isCancelled: () => boolean = () => false,
): Promise<ReportsSnapshot> {
  const rows: DailyRow[] = [];
  const continuationCursors = new Set<string>();
  const splitCursors = new Set<string>();
  let requests = 0;

  const throwIfCancelled = () => {
    if (isCancelled()) {
      throw new Error('All-time report loading was cancelled.');
    }
  };

  // Resolves one cursor interval, replacing incomplete SplitRequired pages
  // with their two ordered halves so every row is aggregated exactly once.
  // An interval is complete when the query reports isDone or its returned
  // cursor reaches the interval's own endCursor.
  async function collectInterval(paginationOpts: PaginationOptions): Promise<void> {
    throwIfCancelled();
    requests += 1;
    const page = await queryPage(paginationOpts);
    if (page.pageStatus === 'SplitRequired') {
      if (!page.splitCursor || splitCursors.has(page.splitCursor)) {
        throw new Error('All-time report page split did not return a usable split cursor.');
      }
      splitCursors.add(page.splitCursor);
      await collectInterval({ ...paginationOpts, endCursor: page.splitCursor });
      await collectInterval({
        ...paginationOpts,
        cursor: page.splitCursor,
        endCursor: paginationOpts.endCursor ?? page.continueCursor,
      });
      if (page.isDone) return;
      if (!page.continueCursor) {
        throw new Error('All-time report pagination did not return a continuation cursor.');
      }
      if (continuationCursors.has(page.continueCursor)) {
        throw new Error('All-time report pagination repeated a continuation cursor.');
      }
      continuationCursors.add(page.continueCursor);
      await collectInterval({ ...paginationOpts, cursor: page.continueCursor });
      return;
    }
    rows.push(...page.page);
    if (page.isDone) return;
    if (!page.continueCursor) {
      throw new Error('All-time report pagination did not return a continuation cursor.');
    }
    if (paginationOpts.endCursor !== undefined
      && page.continueCursor === paginationOpts.endCursor) {
      return;
    }
    if (continuationCursors.has(page.continueCursor)) {
      throw new Error('All-time report pagination repeated a continuation cursor.');
    }
    continuationCursors.add(page.continueCursor);
    await collectInterval({ ...paginationOpts, cursor: page.continueCursor });
  }

  await collectInterval({ numItems: PAGE_NUM_ITEMS, cursor: null });
  throwIfCancelled();
  const stock = await queryStock();
  return buildAllReportSnapshot(rows, stock, businessDate);
}

function buildAllReportSnapshot(
  rows: DailyRow[],
  stock: AllSummaryStock,
  businessDate: string,
) {
  const products = new Map<
    string,
    {
      productId: string;
      productName: string;
      categoryName?: string;
      quantity: number;
      totalCentimes: number;
    }
  >();
  const categories = new Map<
    string,
    { categoryId: string; categoryName: string; quantity: number; totalCentimes: number }
  >();
  const payments = new Map<
    string,
    { paymentMethod: string; totalCentimes: number; orderCount: number }
  >();
  const ingredients = new Map<
    string,
    { ingredientId: string; ingredientName: string; baseUnit: string; quantity: number }
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
    for (const product of row.productTotals) {
      const key = String(product.productId);
      const total = products.get(key) ?? {
        productId: String(product.productId),
        productName: product.productName,
        quantity: 0,
        totalCentimes: 0,
        ...(product.categoryName ? { categoryName: product.categoryName } : {}),
      };
      total.categoryName ??= product.categoryName;
      total.quantity += product.quantity;
      total.totalCentimes += product.totalCentimes;
      products.set(key, total);
    }
    for (const category of row.categoryTotals) {
      const key = String(category.categoryId);
      const total = categories.get(key) ?? {
        categoryId: String(category.categoryId),
        categoryName: category.categoryName,
        quantity: 0,
        totalCentimes: 0,
      };
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
      const total = ingredients.get(key) ?? {
        ingredientId: ingredient.ingredientId,
        ingredientName: ingredient.ingredientName,
        baseUnit: ingredient.baseUnit,
        quantity: 0,
      };
      total.quantity += ingredient.quantity;
      ingredients.set(key, total);
    }
  }

  const stockByName = new Map(
    stock.map((item) => [
      `${item.ingredientName}\0${item.baseUnit}`,
      item.currentStockQuantity,
    ]),
  );
  const allProductTotals = [...products.values()].sort(
    (left, right) =>
      right.totalCentimes - left.totalCentimes
      || right.quantity - left.quantity
      || left.productName.localeCompare(right.productName),
  );
  const from = rows[0]?.businessDate ?? businessDate;
  const emptyTotals = {
    netCentimes: 0,
    orderCount: 0,
    ingredientCostCentimes: 0,
    incompleteSaleCount: 0,
    itemCount: 0,
    ingredientTypeCount: 0,
    ingredientUsageEventCount: 0,
    productTotals: [],
    categoryTotals: [],
    paymentTotals: [],
    ingredientTotals: [],
  };
  // The merged JSON matches the cloud report shape exactly; the branded
  // Convex id types are erased at this boundary.
  return {
    range: { from, to: businessDate, days: rows.length },
    comparisonRange: { from, to: businessDate },
    current: {
      netCentimes,
      orderCount,
      ingredientCostCentimes,
      incompleteSaleCount,
      itemCount: allProductTotals.reduce((total, product) => total + product.quantity, 0),
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
        .sort((left, right) => left.ingredientName.localeCompare(right.ingredientName))
        .slice(0, MAX_DETAIL_ROWS)
        .map((item) => ({
          ...item,
          currentStockQuantity: stockByName.get(
            `${item.ingredientName}\0${item.baseUnit}`,
          ) ?? 0,
        })),
    },
    previous: emptyTotals,
    daily: [],
  } as unknown as ReportsSnapshot;
}
