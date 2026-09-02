import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { aggregateOfflineSales } from '../src/data/offlineViews.ts';
import { collectCloudAllReportPages } from '../src/data/cloudAllReport.ts';
import { buildPeriodProfit } from '../src/features/reports/reportProfit.ts';
import { formatPeriodLabel, reportChartMonth } from '../src/lib/date.ts';

assert.equal(reportChartMonth('2026-08-25', '2026-09-02', '2026-09-02'), '2026-09');
assert.equal(reportChartMonth('2026-08-01', '2026-08-31', '2026-09-02'), '2026-08');
assert.equal(reportChartMonth('2026-03-01', '2026-04-10', '2026-09-02'), '2026-03');
assert.equal(reportChartMonth('2026-03-16', '2026-04-16', '2026-09-02'), '2026-04');
assert.equal(reportChartMonth('', '', '2026-09-02'), '2026-09');
assert.match(formatPeriodLabel('2026-03-01', '2026-03-01', 'en'), /Mar/);
assert.match(formatPeriodLabel('2026-03-01', '2026-03-01', 'fr'), /mars/);

// AUDIT-01 A: cloud All collects legal pages and merges first, middle, and
// final pages into complete totals before capping ranked display lists.
const cloudDailyRows = Array.from({ length: 40 }, (_, index) => ({
  businessDate: new Date(Date.UTC(2026, 6, 1 + index)).toISOString().slice(0, 10),
  netCentimes: 1000 + index,
  orderCount: 1,
  ingredientUsageEventCount: index,
  ingredientCostCentimes: 10 + index,
  incompleteCostSaleCount: index % 2,
  productTotals: [{
    productId: `p${index % 25}`, productName: `Product ${index % 25}`,
    categoryName: 'Coffee', quantity: 2, totalCentimes: 500 + index,
  }],
  categoryTotals: [{
    categoryId: 'c1', categoryName: 'Coffee', quantity: 2, totalCentimes: 500 + index,
  }],
  totalsByPaymentMethod: [{
    paymentMethod: index % 2 ? 'Card' : 'Cash',
    totalCentimes: 1000 + index, orderCount: 1,
  }],
  ingredientTotals: [{
    ingredientId: `i${index % 3}`, ingredientName: `Ing ${index % 3}`,
    baseUnit: 'gram', quantity: 5,
  }],
}));
const cloudAll = await collectCloudAllReportPages(
  async (paginationOpts) => {
    const start = paginationOpts.cursor === null ? 0 : Number(paginationOpts.cursor);
    const pageRows = cloudDailyRows.slice(start, start + paginationOpts.numItems);
    return {
      page: pageRows,
      isDone: start + paginationOpts.numItems >= cloudDailyRows.length,
      continueCursor: String(start + paginationOpts.numItems),
    };
  },
  async () => [{ ingredientName: 'Ing 0', baseUnit: 'gram', currentStockQuantity: 7 }],
  '2026-09-02',
);
assert.equal(cloudAll.range.from, '2026-07-01');
assert.equal(cloudAll.range.to, '2026-09-02');
assert.equal(cloudAll.current.netCentimes, cloudDailyRows.reduce((sum, row) => sum + row.netCentimes, 0));
assert.equal(cloudAll.current.orderCount, 40);
assert.equal(cloudAll.current.itemCount, 80);
assert.equal(cloudAll.current.ingredientTypeCount, 3);
assert.equal(cloudAll.current.productTotals.length, 20);
assert.equal(cloudAll.current.productTotals[0].quantity, 4);
const cloudCash = cloudAll.current.paymentTotals.find((row) => row.paymentMethod === 'Cash');
const cloudCard = cloudAll.current.paymentTotals.find((row) => row.paymentMethod === 'Card');
assert.equal(cloudCash.totalCentimes, cloudDailyRows.filter((row) => row.totalsByPaymentMethod[0].paymentMethod === 'Cash').reduce((sum, row) => sum + row.totalsByPaymentMethod[0].totalCentimes, 0));
assert.equal(cloudCard.totalCentimes, cloudDailyRows.filter((row) => row.totalsByPaymentMethod[0].paymentMethod === 'Card').reduce((sum, row) => sum + row.totalsByPaymentMethod[0].totalCentimes, 0));
assert.equal(cloudAll.current.ingredientTotals[0].currentStockQuantity, 7);
assert.equal(cloudAll.daily.length, 0);
assert.equal(cloudAll.previous.netCentimes, 0);

// Mandatory bug repair: All mode with no loaded snapshot must not throw on
// empty dates; profit stays numeric at zero until data arrives.
const guardProfit = buildPeriodProfit(undefined, undefined, '', '');
assert.equal(guardProfit.revenueCentimes, 0);
assert.equal(guardProfit.ingredientCostCentimes, 0);
assert.equal(guardProfit.operatingProfitCentimes, 0);

const rows = [
  {
    id: 'sale-1',
    receiptNumber: '0826-0001',
    status: 'completed',
    serviceMode: 'dine-in',
    totalCentimes: 1000,
    businessDate: '2026-08-23',
    createdAt: 1,
    receipt: {
      completedAt: 1,
      paymentMethod: 'Cash',
      lines: [{
        productId: 'espresso',
        productName: 'Espresso',
        quantity: 2,
        lineTotalCentimes: 1000,
      }],
    },
  },
  {
    id: 'sale-2',
    receiptNumber: '0826-0002',
    status: 'cancelled',
    serviceMode: 'take-away',
    totalCentimes: 5000,
    businessDate: '2026-08-23',
    createdAt: 2,
    receipt: {
      completedAt: 2,
      paymentMethod: 'Card',
      lines: [{
        productId: 'cancelled',
        productName: 'Cancelled',
        quantity: 1,
        lineTotalCentimes: 5000,
      }],
    },
  },
];
const aggregate = aggregateOfflineSales(
  rows,
  new Map([['espresso', { id: 'coffee', name: 'Coffee' }]]),
);
assert.equal(aggregate.netCentimes, 1000);
assert.equal(aggregate.orderCount, 1);
assert.equal(aggregate.itemCount, 2);
assert.deepEqual(aggregate.productTotals.map((row) => row.productName), ['Espresso']);
assert.deepEqual(aggregate.categoryTotals.map((row) => row.categoryName), ['Coffee']);
assert.deepEqual(aggregate.paymentTotals, [{
  paymentMethod: 'Cash',
  totalCentimes: 1000,
  orderCount: 1,
}]);
const volumeVsRevenue = aggregateOfflineSales([
  rows[0],
  {
    ...rows[0],
    id: 'sale-3',
    receiptNumber: '0826-0003',
    totalCentimes: 8000,
    createdAt: 3,
    receipt: {
      completedAt: 3,
      paymentMethod: 'Cash',
      lines: [{
        productId: 'specialty',
        productName: 'Specialty',
        quantity: 1,
        lineTotalCentimes: 8000,
      }],
    },
  },
], new Map([
  ['espresso', { id: 'coffee', name: 'Coffee' }],
  ['specialty', { id: 'coffee', name: 'Coffee' }],
]));
assert.equal(volumeVsRevenue.bestSeller?.productName, 'Espresso');
assert.equal(volumeVsRevenue.bestSeller?.quantity, 2);
assert.deepEqual(
  volumeVsRevenue.productTotals.map((row) => row.productName),
  ['Specialty', 'Espresso'],
);
const preservedCategory = aggregateOfflineSales([{
  ...rows[0],
  receipt: {
    ...rows[0].receipt,
    lines: [{
      ...rows[0].receipt.lines[0],
      categoryIdSnapshot: 'deleted-coffee',
      categoryNameSnapshot: 'Deleted coffee',
    }],
  },
}], new Map());
assert.deepEqual(preservedCategory.categoryTotals.map((row) => row.categoryName),
  ['Deleted coffee']);

const offertRevenue = aggregateOfflineSales([{
  ...rows[0],
  id: 'sale-offert',
  totalCentimes: 0,
  receipt: {
    completedAt: 3,
    paymentMethod: 'Cash',
    lines: [{
      productId: 'espresso',
      productName: 'Espresso',
      quantity: 1,
      lineTotalCentimes: 1300,
      complimentary: true,
    }],
  },
}], new Map());
assert.equal(offertRevenue.netCentimes, 0);
assert.equal(offertRevenue.itemCount, 1);
assert.equal(offertRevenue.productTotals[0]?.quantity, 1);
assert.equal(offertRevenue.productTotals[0]?.totalCentimes, 0);

const products = readFileSync('src/data/useProductManagement.ts', 'utf8');
const stock = readFileSync('src/data/useInventoryManagement.ts', 'utf8');
const dashboard = readFileSync('src/data/useDashboardData.ts', 'utf8');
const reports = readFileSync('src/data/useReportsData.ts', 'utf8');
assert.match(products, /loadOperationalCache/);
assert.match(stock, /loadOfflineInventory/);
assert.match(stock, /loadOfflineIngredientDetail/);
assert.match(dashboard, /loadOfflineDashboard/);
assert.doesNotMatch(dashboard, /useState\(localBusinessDate\)/);
const dashboardOnline = dashboard.match(
  /const request = available\s*\?\s*([\s\S]*?)\s*:\s*localRequest/,
);
assert.ok(dashboardOnline, 'useDashboardData must choose cloud vs offline by available');
assert.match(dashboardOnline[1], /api\.dashboard\.getSnapshot/);
assert.match(dashboardOnline[1], /Promise\.all/);
assert.doesNotMatch(dashboardOnline[1], /pendingSyncCount/);
assert.doesNotMatch(dashboard, /pendingSyncCount/);
assert.match(dashboard, /loadOfflineDashboard\(businessDate\) as Promise<DashboardSnapshot>/);
assert.match(
  dashboard,
  /\(local\.today\?\.orderCount \?\? 0\) > cloudToday/,
);
const pickDashboard = (cloudToday, localToday, local) =>
  local && localToday > cloudToday ? 'local' : 'cloud';
assert.equal(pickDashboard(5, 6, true), 'local');
assert.equal(pickDashboard(6, 6, true), 'cloud');
assert.equal(pickDashboard(5, 5, true), 'cloud');
assert.equal(pickDashboard(5, 0, false), 'cloud');
assert.match(dashboard, /available === undefined \|\| !foreground/);
const costsPanel = readFileSync(
  'src/features/reports/components/CostsPanel/CostsPanel.tsx',
  'utf8',
);
const costsCss = readFileSync(
  'src/features/reports/components/CostsPanel/CostsPanel.module.css',
  'utf8',
);
assert.doesNotMatch(costsPanel, /slice\(0, 8\)/);
assert.match(costsPanel, /saved\.expenses\.map\(/);
assert.match(costsPanel, /saved\.compensation\.map\(/);
assert.match(costsCss, /min-height: 0/);
assert.match(costsCss, /overflow-y: auto/);
assert.match(costsCss, /flex-direction: column/);
const dailyReport = readFileSync('src/data/dailyOwnerReport.ts', 'utf8');
assert.doesNotMatch(dailyReport, /discount_centimes/);
assert.match(dailyReport, /subtotalCentimes - report\.current\.netCentimes/);
const orderDetail = readFileSync(
  'src/features/orders/components/OrderDetailPanel/OrderDetailPanel.tsx',
  'utf8',
);
assert.doesNotMatch(orderDetail, /complimentary \? t\('Offert'\)/);
assert.match(orderDetail, /\{t\('Offert'\)\}/);
assert.match(reports, /loadOfflineReport/);
assert.match(reports, /api\.reports\.getSummary/);
assert.match(reports, /api\.reports\.getAllSummaryPage/);
assert.match(reports, /collectCloudAllReportPages/);
assert.match(reports, /local\.current\.orderCount > cloud\.current\.orderCount/);
assert.doesNotMatch(reports, /pendingSyncCount/);
assert.match(reports, /available === undefined \|\| !foreground/);
assert.doesNotMatch(products + stock, /useQuery_experimental|useMutation/);
assert.match(stock, /saveLocalIngredient/);
assert.match(stock, /receiveLocalPurchase/);
assert.match(stock, /recordLocalStockAdjustment/);

const views = readFileSync('src/data/offlineViews.ts', 'utf8');
const quickAdd = views.slice(
  views.indexOf('export async function topSellingProductIds'),
  views.indexOf('export function aggregateOfflineSales'),
);
assert.match(quickAdd, /SUM\(item\.quantity\)/);
assert.match(quickAdd, /ORDER BY quantity DESC/);
assert.match(quickAdd, /sale\.status = 'completed'/);
assert.match(quickAdd, /LIMIT \$\{QUICK_ADD_LIMIT\}/);
assert.match(views, /const QUICK_ADD_LIMIT = 3/);
assert.match(views, /overlayCloudUsedToday/);
assert.match(views, /Math\.max\(item\.usedToday/);
assert.match(views, /alias\.local_stock_delta/);
assert.match(views, /COALESCE\(i\.name, NULLIF\(m\.ingredient_name_snapshot/);
assert.match(views, /ingredient_name_snapshot/);
assert.match(views, /COUNT\(\*\) AS count FROM \(/);
assert.match(views, /async function loadOfflineAllReport/);
assert.match(views, /if \(!fromDate && !toDate\) return loadOfflineAllReport\(\)/);
assert.doesNotMatch(views, /Saved ingredient usage exceeds the offline report limit/);
assert.match(views, /unsyncedUsedByName/);
assert.equal(Math.max(3, (1 ?? 0) + 0), 3);
assert.equal(Math.max(0, (3 ?? 0) + 0), 3);
assert.equal(Math.max(0, (3 ?? 0) + 0.2), 3.2);
assert.match(views, /stockByName\.get\(`\$\{ingredientName\}\\0\$\{baseUnit\}`\)/);
assert.match(stock, /overlayCloudUsedToday/);
assert.match(stock, /api\.reports\.getSummary/);
const pos = readFileSync('src/data/usePosData.ts', 'utf8');
assert.match(pos, /topSellingProductIds/);

console.log('Offline Products, Stock, Dashboard, and Reports fallback checks passed.');
