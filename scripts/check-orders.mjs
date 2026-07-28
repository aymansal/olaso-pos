import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import {
  loadLocalOrderPage,
  makeLocalSaleRetryAvailable,
} from '../src/data/orderHistory.ts';
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
assert.equal(firstPage.page[0].syncState, 'failed');
assert.equal(firstPage.page[0].syncAttemptCount, 2);
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
database.close();

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const localEnv = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const convexUrl = localEnv.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(convexUrl, 'VITE_CONVEX_URL is missing from .env.local');
execSync('npm run seed:dev', {
  cwd: projectRoot,
  stdio: 'pipe',
  encoding: 'utf8',
});
const client = new ConvexHttpClient(convexUrl);
const cloudFirst = await client.query(api.sales.listOrders, { limit: 6 });
assert.equal(cloudFirst.page.length, 6);
assert.equal(cloudFirst.isDone, false);
assert(cloudFirst.continueCursor);
assert(cloudFirst.page[0].receiptSnapshot.lines.length > 0);
const cloudSecond = await client.query(api.sales.listOrders, {
  limit: 6,
  cursor: cloudFirst.continueCursor,
});
assert.equal(cloudSecond.page.length, 6);
assert.equal(
  new Set([
    ...cloudFirst.page.map((sale) => sale.localSaleId),
    ...cloudSecond.page.map((sale) => sale.localSaleId),
  ]).size,
  12,
);
await assert.rejects(
  client.query(api.sales.listOrders, { limit: 21 }),
  /Order page size/,
);

const ordersHook = readFileSync(
  new URL('../src/data/useOrdersData.ts', import.meta.url),
  'utf8',
);
assert(
  ordersHook.indexOf('setIsLoading(false)')
    < ordersHook.indexOf(
      'Promise.allSettled([cloudHistory, synchronization])',
    ),
  'Local order history must render before cloud work settles.',
);

console.log('Bounded local/cloud order history and recovery checks passed.');
