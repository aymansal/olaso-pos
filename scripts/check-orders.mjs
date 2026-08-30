import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import {
  countLocalOrders,
  loadLocalOrderPage,
  makeLocalSaleRetryAvailable,
} from '../src/data/orderHistory.ts';
import { listPendingOutboxFromDatabase } from '../src/data/outbox.ts';
import {
  recordSalePrintAttempt,
  recordSalePrintFailure,
  recordSalePrintSuccess,
} from '../src/data/printState.ts';
import { attemptSaleReceiptPrint } from '../src/data/receiptPrinting.ts';
import { localMigrations } from '../src/data/schema.ts';

const database = new DatabaseSync(':memory:');
database.exec('PRAGMA foreign_keys = ON');
for (const migration of localMigrations) {
  for (const statement of migration.statements) database.exec(statement);
  database.exec(`PRAGMA user_version = ${migration.toVersion}`);
}

const receipt = (number, completedAt, productName) =>
  JSON.stringify({
    receiptNumber: number,
    completedAt,
    cashierName: 'Amina',
    serviceType: 'take-away',
    customerName: 'Amal',
    lines: [{
      productName,
      receiptName: productName,
      quantity: 1,
      unitPriceCentimes: 1500,
      lineTotalCentimes: 1500,
      modifiers: [],
    }],
    subtotalCentimes: 1500,
    discountCentimes: 0,
    taxCentimes: 0,
    totalCentimes: 1500,
    taxPolicyLabel: 'Temporary 0% — owner confirmation pending',
    paymentMethod: 'Pending owner confirmation',
  });
const firstAt = Date.parse('2026-07-28T09:00:00.000Z');
const secondAt = Date.parse('2026-07-28T10:00:00.000Z');
const insertSale = database.prepare(
  `INSERT INTO sales
    (local_sale_id, device_id, receipt_number, status, service_type,
     subtotal_centimes, tax_centimes, total_centimes, currency, business_date,
     receipt_snapshot_json, sync_state, created_at)
   VALUES (?, 'orders-check-device', ?, 'completed', 'take-away',
     1500, 0, 1500, 'MAD', '2026-07-28', ?, ?, ?)`,
);
insertSale.run(
  'sale-1',
  'CHECK-001',
  receipt('CHECK-001', firstAt, 'Brioche'),
  'synced',
  firstAt,
);
insertSale.run(
  'sale-2',
  'CHECK-002',
  receipt('CHECK-002', secondAt, 'Butter Croissant'),
  'failed',
  secondAt,
);
database.prepare(
  `INSERT INTO outbox
    (operation_id, device_id, operation_type, local_record_id, state,
     attempt_count, last_error, created_at, available_at)
   VALUES ('outbox-2', 'orders-check-device', 'sale-completed', 'sale-2',
     'failed', 2, 'Offline', ?, ?)`,
).run(secondAt, secondAt + 60_000);

const adapter = {
  query(statement, values = []) {
    return { values: database.prepare(statement).all(...values) };
  },
  run(statement, values = []) {
    const result = database.prepare(statement).run(...values);
    return { changes: { changes: Number(result.changes) } };
  },
};

const firstPage = await loadLocalOrderPage({ limit: 1 }, adapter);
assert.equal(firstPage.page.length, 1);
assert.equal(firstPage.page[0].localSaleId, 'sale-2');
assert.equal(firstPage.page[0].receipt.lines[0].productName, 'Butter Croissant');
assert.equal(firstPage.page[0].cashierName, 'Amina');
assert.equal(firstPage.page[0].syncState, 'failed');
assert.equal(firstPage.page[0].syncAttemptCount, 2);
assert.equal(firstPage.page[0].printState, 'pending');
assert.equal(firstPage.page[0].printAttemptCount, 0);
assert.equal(firstPage.isDone, false);
assert(firstPage.continueCursor);

const secondPage = await loadLocalOrderPage(
  { limit: 1, cursor: firstPage.continueCursor },
  adapter,
);
assert.equal(secondPage.page.length, 1);
assert.equal(secondPage.page[0].localSaleId, 'sale-1');
assert.equal(secondPage.isDone, true);
assert.notEqual(firstPage.page[0].key, secondPage.page[0].key);
await assert.rejects(
  loadLocalOrderPage({ limit: 21 }, adapter),
  /integer from 1 to 20/,
);
assert.equal(await countLocalOrders(undefined, adapter), 2);
const offsetPage = await loadLocalOrderPage({ limit: 1, offset: 1 }, adapter);
assert.equal(offsetPage.page.length, 1);
assert.equal(offsetPage.page[0].localSaleId, 'sale-1');
assert.equal(offsetPage.isDone, true);
const cancelledOnly = await countLocalOrders({ status: 'cancelled' }, adapter);
assert.equal(cancelledOnly, 0);
await assert.rejects(
  loadLocalOrderPage({ limit: 1, cursor: firstPage.continueCursor, offset: 0 }, adapter),
  /cursor and an offset/,
);

await makeLocalSaleRetryAvailable('sale-2', adapter);
const retriedOutbox = database.prepare(
  `SELECT state, available_at, last_error
   FROM outbox WHERE operation_id = 'outbox-2'`,
).get();
assert.equal(retriedOutbox.state, 'pending');
assert.equal(retriedOutbox.available_at, 0);
assert.equal(retriedOutbox.last_error, null);
assert.equal(
  database.prepare(
    `SELECT sync_state FROM sales WHERE local_sale_id = 'sale-2'`,
  ).get().sync_state,
  'pending',
);

const invariantCounts = () => database.prepare(
  `SELECT
    (SELECT COUNT(*) FROM sales) AS sales,
    (SELECT COUNT(*) FROM sale_items) AS items,
    (SELECT COUNT(*) FROM stock_movements) AS movements,
    (SELECT COUNT(*) FROM outbox) AS outbox`,
).get();
const beforeReprint = invariantCounts();
const successfulReprint = await attemptSaleReceiptPrint(
  {
    localSaleId: firstPage.page[0].localSaleId,
    receipt: firstPage.page[0].receipt,
  },
  {
    recordAttempt: (localSaleId) =>
      recordSalePrintAttempt(localSaleId, secondAt + 1, adapter),
    loadSettings: async () => ({
      printerHost: '192.0.2.10',
      printerPort: 9100,
    }),
    sendReceipt: async () => ({
      bytesWritten: 700,
      connectMs: 2,
      writeMs: 1,
      totalMs: 3,
      paperConfirmed: false,
    }),
    recordSuccess: (localSaleId, result) =>
      recordSalePrintSuccess(localSaleId, result, adapter),
    recordFailure: (localSaleId, failure) =>
      recordSalePrintFailure(localSaleId, failure, adapter),
  },
);
assert.equal(successfulReprint.state, 'printed');
let savedPrint = database.prepare(
  `SELECT print_state, print_attempt_count, last_print_bytes_written
   FROM sales WHERE local_sale_id = 'sale-2'`,
).get();
assert.equal(savedPrint.print_state, 'printed');
assert.equal(savedPrint.print_attempt_count, 1);
assert.equal(savedPrint.last_print_bytes_written, 700);
assert.deepEqual({ ...invariantCounts() }, { ...beforeReprint });

const failedReprint = await attemptSaleReceiptPrint(
  {
    localSaleId: firstPage.page[0].localSaleId,
    receipt: firstPage.page[0].receipt,
  },
  {
    recordAttempt: (localSaleId) =>
      recordSalePrintAttempt(localSaleId, secondAt + 2, adapter),
    loadSettings: async () => ({
      printerHost: '192.0.2.11',
      printerPort: 9100,
    }),
    sendReceipt: async () => {
      throw Object.assign(new Error('timeout'), { code: 'TIMEOUT' });
    },
    recordSuccess: (localSaleId, result) =>
      recordSalePrintSuccess(localSaleId, result, adapter),
    recordFailure: (localSaleId, failure) =>
      recordSalePrintFailure(localSaleId, failure, adapter),
  },
);
assert.equal(failedReprint.state, 'failed');
savedPrint = database.prepare(
  `SELECT print_state, print_attempt_count, last_print_error_code
   FROM sales WHERE local_sale_id = 'sale-2'`,
).get();
assert.equal(savedPrint.print_state, 'failed');
assert.equal(savedPrint.print_attempt_count, 2);
assert.equal(savedPrint.last_print_error_code, 'TIMEOUT');
assert.deepEqual({ ...invariantCounts() }, { ...beforeReprint });
database.close();

const chained = new DatabaseSync(':memory:');
chained.exec('PRAGMA foreign_keys = ON');
for (const migration of localMigrations) {
  for (const statement of migration.statements) chained.exec(statement);
  chained.exec(`PRAGMA user_version = ${migration.toVersion}`);
}
const chainedAdapter = {
  query(statement, values = []) {
    return { values: chained.prepare(statement).all(...values) };
  },
  run(statement, values = []) {
    const result = chained.prepare(statement).run(...values);
    return { changes: { changes: Number(result.changes) } };
  },
};
const insertChainedSale = chained.prepare(
  `INSERT INTO sales
    (local_sale_id, device_id, receipt_number, status, service_type,
     subtotal_centimes, tax_centimes, total_centimes, currency, business_date,
     receipt_snapshot_json, sync_state, created_at)
   VALUES (?, 'orders-check-device', ?, 'completed', 'take-away',
     1500, 0, 1500, 'MAD', '2026-07-28', ?, 'failed', ?)`,
);
insertChainedSale.run(
  'sale-failed-parent',
  'CHECK-006A',
  receipt('CHECK-006A', secondAt, 'Latte'),
  secondAt,
);
insertChainedSale.run(
  'sale-pending-parent',
  'CHECK-006B',
  receipt('CHECK-006B', secondAt + 1, 'Mocha'),
  secondAt + 1,
);
const enqueueChained = chained.prepare(
  `INSERT INTO outbox
    (operation_id, device_id, operation_type, local_record_id, state,
     depends_on_operation_id, attempt_count, last_error, created_at, available_at)
   VALUES (?, 'orders-check-device', ?, ?, ?, ?, 1, NULL, ?, 0)`,
);
enqueueChained.run(
  'parent-failed', 'management.category.save', 'cat-failed', 'failed', null, secondAt,
);
enqueueChained.run(
  'sale-of-failed', 'sale-completed', 'sale-failed-parent', 'failed',
  'parent-failed', secondAt + 1,
);
enqueueChained.run(
  'parent-pending', 'management.category.save', 'cat-pending', 'pending', null,
  secondAt + 2,
);
enqueueChained.run(
  'sale-of-pending', 'sale-completed', 'sale-pending-parent', 'failed',
  'parent-pending', secondAt + 3,
);
await makeLocalSaleRetryAvailable('sale-failed-parent', chainedAdapter);
await makeLocalSaleRetryAvailable('sale-pending-parent', chainedAdapter);
const listed = (await listPendingOutboxFromDatabase(chainedAdapter, 10, 10)).map(
  (row) => row.operationId,
);
assert.deepEqual(
  listed.filter((id) => id === 'sale-of-failed' || id === 'parent-failed'),
  ['sale-of-failed'],
  'Orders retry must list a sale whose management parent is still failed in outbox.',
);
assert.deepEqual(
  listed.filter((id) => id === 'sale-of-pending' || id === 'parent-pending'),
  ['parent-pending'],
  'A still-pending management parent must hide its sale after Orders retry.',
);
chained.close();

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const localEnv = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const convexUrl = localEnv.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(convexUrl, 'VITE_CONVEX_URL is missing from .env.local');
const client = new ConvexHttpClient(convexUrl);
const ownerPin = process.env.OLASO_OWNER_PIN;
assert(/^\d{6}$/.test(ownerPin ?? ''), 'OLASO_OWNER_PIN must be a six-digit test restore PIN');
const seeded = JSON.parse(execSync('npx convex run seed:verify', {
  cwd: projectRoot,
  stdio: 'pipe',
  encoding: 'utf8',
}));
const owner = await client.action(api.identity.signIn, {
  staffProfileId: seeded.ownerProfileId,
  pin: ownerPin,
  deviceId: 'orders-check-device',
});
assert.equal(owner.kind, 'authenticated');
const sessionArgs = { sessionToken: owner.token, deviceId: 'orders-check-device' };
const cloudFirst = await client.query(api.sales.listOrders, { ...sessionArgs, limit: 6 });
assert(cloudFirst.page.length > 0);
assert(cloudFirst.page[0].receiptSnapshot.lines.length > 0);
if (!cloudFirst.isDone) {
  assert(cloudFirst.continueCursor);
  const cloudSecond = await client.query(api.sales.listOrders, {
    ...sessionArgs,
    limit: 6,
    cursor: cloudFirst.continueCursor,
  });
  assert.equal(
    new Set([
      ...cloudFirst.page.map((sale) => sale.localSaleId),
      ...cloudSecond.page.map((sale) => sale.localSaleId),
    ]).size,
    cloudFirst.page.length + cloudSecond.page.length,
  );
}
await assert.rejects(
  client.query(api.sales.listOrders, { ...sessionArgs, limit: 21 }),
  /Order page size/,
);

const ordersHook = readFileSync(
  new URL('../src/data/useOrdersData.ts', import.meta.url),
  'utf8',
);
assert(
  ordersHook.indexOf('setIsLoading(false)')
    < ordersHook.indexOf(
      'Promise.allSettled([cloudHistory])',
    ),
  'Local order history must render before cloud work settles.',
);
assert.match(ordersHook, /attemptSaleReceiptPrint/);
assert.match(ordersHook, /reconnect\.run\('automatic'\)/);
assert.doesNotMatch(ordersHook, /makePendingOutboxAvailable/);
const orderDetail = readFileSync(
  new URL(
    '../src/features/orders/components/OrderDetailPanel/OrderDetailPanel.tsx',
    import.meta.url,
  ),
  'utf8',
);
assert.match(orderDetail, /Reprint/);
assert.match(orderDetail, /Cancel/);
assert.match(orderDetail, /Offert/);
assert.doesNotMatch(orderDetail, /View receipt|ReceiptPreviewDialog|Walk-in|tableLabel|>Tax</);
assert.doesNotMatch(orderDetail, /commitLocalSale|completeLocalSale|stock_movements|outbox/);
assert.doesNotMatch(orderDetail, /Refunded/);
const ordersList = readFileSync(
  new URL(
    '../src/features/orders/components/OrdersListPanel/OrdersListPanel.tsx',
    import.meta.url,
  ),
  'utf8',
);
assert.doesNotMatch(ordersList, /Refunded/);
assert.match(ordersList, /Cancelled/);
const ordersTable = readFileSync(
  new URL(
    '../src/features/orders/components/OrdersTable/OrdersTable.tsx',
    import.meta.url,
  ),
  'utf8',
);
assert.match(ordersTable, /styles\.indicator/);
assert.match(ordersTable, /DATE/);
assert.doesNotMatch(ordersTable, /CUSTOMER/);
assert.doesNotMatch(ordersTable, /tableLabel/);
const ordersTableCss = readFileSync(
  new URL(
    '../src/features/orders/components/OrdersTable/OrdersTable.module.css',
    import.meta.url,
  ),
  'utf8',
);
assert.match(ordersTableCss, /\.indicator \{/);
assert.doesNotMatch(ordersTableCss, /\.indicator::before/);

console.log('Bounded local/cloud order history and recovery checks passed.');
