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

const products = readFileSync('src/data/useProductManagement.ts', 'utf8');
const stock = readFileSync('src/data/useInventoryManagement.ts', 'utf8');
const dashboard = readFileSync('src/data/useDashboardData.ts', 'utf8');
const reports = readFileSync('src/data/useReportsData.ts', 'utf8');
assert.match(products, /loadOperationalCache/);
assert.match(stock, /loadOfflineInventory/);
assert.match(stock, /loadOfflineIngredientDetail/);
assert.match(dashboard, /loadOfflineDashboard/);
assert.match(reports, /loadOfflineReport/);
assert.doesNotMatch(products + stock, /useQuery_experimental|useMutation/);
assert.match(stock, /saveLocalIngredient/);
assert.match(stock, /receiveLocalPurchase/);
assert.match(stock, /recordLocalStockAdjustment/);

console.log('Offline Products, Stock, Dashboard, and Reports fallback checks passed.');
