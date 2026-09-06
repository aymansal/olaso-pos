import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import { localMigrations } from '../src/data/schema.ts';
import { loadLocalCostManagementFromDatabase, replaceSavedExpenses, replaceSavedCompensation } from '../src/data/localCostViews.ts';
import { serializeLocalTransaction } from '../src/data/localDatabase.ts';
import { loadDailySalesOverview } from '../src/data/dailyOwnerReport.ts';
import { aggregateOfflineSales, ingredientUsage } from '../src/data/offlineViews.ts';
import { buildPeriodProfit } from '../src/features/reports/reportProfit.ts';
import { collectCloudAllReportPages } from '../src/data/cloudAllReport.ts';
import { collectCloudPages } from '../src/data/collectCloudPages.ts';

const db = new DatabaseSync(':memory:');
for (const migration of localMigrations) for (const sql of migration.statements) db.exec(sql);
const adapter = { query: (sql, args = []) => ({ values: db.prepare(sql).all(...args) }) };
const insert = db.prepare(`INSERT INTO sales
  (local_sale_id, device_id, receipt_number, status, service_type, subtotal_centimes,
   tax_centimes, total_centimes, currency, business_date, receipt_snapshot_json,
   ingredient_cost_centimes, cost_status, sync_state, created_at)
  VALUES (?, 'tablet', ?, 'completed', 'dine-in', 1000, 0, 1000, 'MAD', ?,
   '{"paymentMethod":"Cash","lines":[]}', 100, ?, 'synced', ?)`);
for (let i = 0; i < 1002; i++) insert.run(`s${i}`, `r${i}`, i === 1001 ? '2026-09-06' : '2026-09-05', i % 2 ? 'incomplete' : 'complete', i);
for (let i = 0; i < 121; i++) db.prepare(`INSERT INTO operating_expenses
 (id, category, description, amount_centimes, recurrence, effective_date, status, revision, created_at)
 VALUES (?, 'Rent', 'Expense', 100, 'one-time', '2026-09-06', 'active', 1, ?)`).run(`e${i}`, i);
const costs = await loadLocalCostManagementFromDatabase(adapter, '2026-09', 'owner');
assert.equal(costs.profitability.revenueCentimes, 1002000);
assert.equal(costs.profitability.ingredientCostCentimes, 100200);
assert.equal(costs.profitability.incompleteSaleCount, 501);
assert.equal(costs.expenses.length, 121);
assert.equal(costs.otherExpenseCentimes, 12100);
assert.equal((await loadDailySalesOverview(adapter, '2026-09-06')).salesRows.length, 1);

const snapshot = { current: { netCentimes: 10000, ingredientCostCentimes: 2000, incompleteSaleCount: 0 } };
assert.equal(buildPeriodProfit(snapshot, undefined, '2026-09-06', '2026-09-06', true).costsAvailable, false);
assert.equal(buildPeriodProfit(snapshot, costs, '2026-09-06', '2026-09-06', true, false).costsAvailable, false);
assert.equal(buildPeriodProfit(snapshot, { expenses: [], compensation: [] }, '2026-09-06', '2026-09-06', true).costsAvailable, true);
assert.equal(buildPeriodProfit(snapshot, costs, '2026-09-06', '2026-09-06', true).operatingProfitCentimes, -4100);
const incomplete = aggregateOfflineSales([
  { status: 'completed', costStatus: 'incomplete', totalCentimes: 1000, receipt: { paymentMethod: 'Cash', lines: [] } },
  { status: 'completed', costStatus: 'complete', totalCentimes: 1000, receipt: { paymentMethod: 'Cash', lines: [] } },
  { status: 'cancelled', costStatus: 'incomplete', totalCentimes: 1000, receipt: { paymentMethod: 'Cash', lines: [] } },
], new Map());
assert.equal(incomplete.incompleteSaleCount, 1);

// Complete ingredient detail survives both previous10 and20 row thresholds.
for (let i = 0; i < 21; i++) {
  db.prepare(`INSERT INTO ingredients (id, key, name, base_unit, current_stock_quantity,
    low_stock_threshold, status, revision, updated_at) VALUES (?, ?, ?, 'gram', 100, 1, 'active', 1, 1)`)
    .run(`i${i}`, `i${i}`, `Ingredient ${String(i).padStart(2, '0')}`);
  db.prepare(`INSERT INTO stock_movements (id, ingredient_id, local_sale_id, quantity_delta,
    movement_type, reason, business_date, created_at) VALUES (?, ?, 's1001', -1, 'sale', 'Recipe', '2026-09-06', 1)`)
    .run(`m${i}`, `i${i}`);
  if (i === 10 || i === 20) {
    const usage = await ingredientUsage('2026-09-06', '2026-09-06', adapter);
    assert.equal(usage.ingredientTotals.length, i + 1);
    assert.equal(usage.ingredientTypeCount, i + 1);
  }
}
const ingredients = (await ingredientUsage('2026-09-06', '2026-09-06', adapter)).ingredientTotals;
const row = { businessDate: '2026-09-06', orderCount: 0, netCentimes: 0,
  productTotals: [], categoryTotals: [], totalsByPaymentMethod: [], ingredientTotals: ingredients };
const all = await collectCloudAllReportPages(async () => ({ page: [row], isDone: true, continueCursor: '' }), async () => [], '2026-09-06');
assert.equal(all.current.ingredientTotals.length, 21);

// Execute the real shared reversal and query overlay without contacting Convex.
const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const pure = stripTypeScriptTypes(source('../convex/lib/cancelMetric.ts').replace(/^import .*;\r?\n/gm, '').replaceAll('export function', 'function'));
const cancelMetric = new Function('conflict', `${pure}; return cancelMetric;`)((message) => { throw new Error(message); });
const overlaySource = source('../convex/lib/pendingReportCorrections.ts');
const overlay = new Function('cancelMetric', `${stripTypeScriptTypes(overlaySource.slice(overlaySource.indexOf('export async function')).replace('export async', 'async'))}; return pendingReportCorrections;`)(cancelMetric);
const metric = { _id: 'metric', businessDate: '2026-09-06', grossCentimes: 3000, netCentimes: 3000,
  orderCount: 2, cancelledCentimes: 0, productTotals: [{ productId: 'p', productName: 'P', quantity: 2, totalCentimes: 3000 }],
  categoryTotals: [], profileTotals: [], ingredientTotals: [], ingredientUsageEventCount: 0,
  ingredientCostCentimes: 200, completeCostSaleCount: 2, incompleteCostSaleCount: 0,
  totalsByPaymentMethod: [{ paymentMethod: 'Cash', orderCount: 2, totalCentimes: 3000 }],
  totalsByServiceMode: [{ serviceMode: 'dine-in', orderCount: 2, totalCentimes: 3000 }] };
const sale = { _id: 'sale', localSaleId: 's', deviceId: 'tablet', businessDate: '2026-09-06', status: 'completed',
  totalCentimes: 1000, paymentMethod: 'Cash', serviceMode: 'dine-in', receiptSnapshot: {}, ingredientCostCentimes: 100, costStatus: 'complete' };
const ctx = { db: { query(table) {
  const filters = {};
  return { withIndex(_index, callback) {
    callback({ eq(key, value) { filters[key] = value; return this; } });
    return { unique: async () => filters.deviceId === sale.deviceId && filters.localSaleId === sale.localSaleId ? sale : null,
      take: async () => table === 'saleItems' ? [{ productId: 'p', quantity: 1, lineTotalCentimes: 1000 }] : [] };
  } };
} } };
let result = await overlay(ctx, [metric], 'tablet', ['s', 's']);
assert.equal(result.rows[0].netCentimes, 2000, 'Other-device sale remains; duplicate pending ID subtracts once');
assert.equal(result.rows[0].orderCount, 1);
assert.equal(metric.netCentimes, 3000, 'Overlay is read-only');
sale.status = 'cancelled';
result = await overlay(ctx, [result.rows[0]], 'tablet', ['s']);
assert.equal(result.rows[0].netCentimes, 2000, 'Acknowledged correction is not subtracted twice');
assert.equal((await overlay(ctx, [metric], 'different-tablet', ['s'])).rows[0].netCentimes, 3000);

const pages = Array.from({ length: 121 }, (_, i) => ({ id: i }));
const full = await collectCloudPages(async ({ cursor, numItems }) => {
  const start = Number(cursor ?? 0);
  return { page: pages.slice(start, start + numItems), isDone: start + numItems >= pages.length, continueCursor: String(start + numItems) };
});
assert.equal(full.length, 121);
await assert.rejects(collectCloudPages(async ({ cursor }) => {
  if (cursor) throw new Error('Interrupted');
  return { page: pages.slice(0, 60), isDone: false, continueCursor: '60' };
}), /Interrupted/, 'Interrupted collection never returns a partial replacement snapshot');
// The public reader must hold the existing queue across every page, so a
// concurrent write cannot shift OFFSET rows or expose half a replacement.
const costSource = source('../src/data/localCostViews.ts');
const wrapperSource = costSource.slice(costSource.indexOf('export async function loadLocalCostManagement('),
  costSource.indexOf('export async function pruneSavedExpensesFromDatabase'));
const queuedCosts = new Function('serializeLocalTransaction', 'loadLocalCostManagementFromDatabase', 'openLocalDatabase',
  `${stripTypeScriptTypes(wrapperSource.replace('export async', 'async'))}; return loadLocalCostManagement;`);
let queuedWrite;
const concurrentAdapter = { async query(sql, args = []) {
  const values = db.prepare(sql).all(...args);
  if (!queuedWrite && sql.includes('SELECT e.*')) {
    queuedWrite = serializeLocalTransaction(async () => db.prepare(`INSERT INTO operating_expenses
      (id, category, description, amount_centimes, recurrence, effective_date, status, revision, created_at)
      VALUES ('new-expense', 'Rent', 'New expense', 900, 'one-time', '2026-09-06', 'active', 1, 999)`).run());
  }
  return { values };
} };
const stableCosts = await queuedCosts(serializeLocalTransaction, loadLocalCostManagementFromDatabase,
  async () => concurrentAdapter)('2026-09', 'owner');
await queuedWrite;
assert.equal(stableCosts.otherExpenseCentimes, 12100);
assert.equal(new Set(stableCosts.expenses.map((expense) => expense.id)).size, 121);
assert.equal((await loadLocalCostManagementFromDatabase(adapter, '2026-09', 'owner')).otherExpenseCentimes, 13000);

// Execute the worker's actual current-context guard after a page resolves and
// again after a replacement waits for the database queue.
const reconnectSource = source('../src/data/reconnectContext.tsx');
const guardSource = reconnectSource.slice(reconnectSource.indexOf('    const isCancelled ='),
  reconnectSource.indexOf('    let synced = 0;'));
const currentContext = { current: { available: true, foreground: true, token: 'owner' } };
const mounted = { current: true };
const guards = new Function('currentContext', 'mounted', 'session', 'CONNECTION_SYNC_FAILURE',
  `${guardSource}; return { isCancelled, requireCurrentContext };`)(currentContext, mounted,
  { token: 'owner' }, 'Connection unavailable');
for (const isDone of [false, true]) {
  currentContext.current.foreground = true;
  let requests = 0;
  await assert.rejects(collectCloudPages(async () => {
    requests += 1;
    currentContext.current.foreground = false;
    return { page: [1], isDone, continueCursor: 'next' };
  }, guards.isCancelled), /cancelled/);
  assert.equal(requests, 1);
}
for (const replace of [replaceSavedExpenses, replaceSavedCompensation]) {
  currentContext.current.foreground = true;
  await assert.rejects(replace([], async (operation) => {
    currentContext.current.foreground = false;
    return operation({ query() { assert.fail('Cancelled replacement read database'); },
      run() { assert.fail('Cancelled replacement wrote database'); } });
  }, guards.requireCurrentContext), /Connection unavailable/);
}
currentContext.current.foreground = true;
currentContext.current.token = 'manager';
assert.equal(guards.isCancelled(), true);
currentContext.current.token = 'owner';
mounted.current = false;
assert.equal(guards.isCancelled(), true);
db.close();
console.log('Report audit: monthly volume, cost availability, corrections, cost status, complete usage and finance pagination passed.');
