import type { FunctionReturnType } from 'convex/server';
import type { PaginationOptions } from 'convex/server';
import type { api } from '../../convex/_generated/api';
import type { ReportsSnapshot } from './useReportsData';
import { collectCloudPages } from './collectCloudPages.ts';

type AllSummaryPage = FunctionReturnType<typeof api.reports.getAllSummaryPage>;
type AllSummaryStock = FunctionReturnType<typeof api.reports.getAllSummaryStock>;
type DailyRow = AllSummaryPage['page'][number];

const MAX_DETAIL_ROWS = 20;

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
  const rows = await collectCloudPages(queryPage, isCancelled);
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
  const itemCount = allProductTotals.reduce((total, product) => total + product.quantity, 0);
  const attributed = [...profiles.values()].reduce(
    (total, profile) => ({
      orderCount: total.orderCount + profile.orderCount,
      itemCount: total.itemCount + profile.itemCount,
      netCentimes: total.netCentimes + profile.netCentimes,
    }),
    { orderCount: 0, itemCount: 0, netCentimes: 0 },
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
  const from = rows[0]?.businessDate ?? businessDate;
  const emptyTotals = {
    netCentimes: 0,
    orderCount: 0,
    ingredientCostCentimes: 0,
    incompleteSaleCount: 0,
    itemCount: 0,
    ingredientTypeCount: 0,
    ingredientUsageEventCount: 0,
    profileTotals: [],
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
        .sort((left, right) => left.ingredientName.localeCompare(right.ingredientName))
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
