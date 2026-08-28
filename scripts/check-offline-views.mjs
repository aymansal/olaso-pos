import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { aggregateOfflineSales } from '../src/data/offlineViews.ts';

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

const products = readFileSync('src/data/useProductManagement.ts', 'utf8');
const stock = readFileSync('src/data/useInventoryManagement.ts', 'utf8');
const dashboard = readFileSync('src/data/useDashboardData.ts', 'utf8');
const reports = readFileSync('src/data/useReportsData.ts', 'utf8');
assert.match(products, /loadOperationalCache/);
assert.match(stock, /loadOfflineInventory/);
assert.match(stock, /loadOfflineIngredientDetail/);
assert.match(dashboard, /loadOfflineDashboard/);
assert.doesNotMatch(dashboard, /useState\(localBusinessDate\)/);
assert.match(reports, /loadOfflineReport/);
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
const pos = readFileSync('src/data/usePosData.ts', 'utf8');
assert.match(pos, /topSellingProductIds/);

console.log('Offline Products, Stock, Dashboard, and Reports fallback checks passed.');
