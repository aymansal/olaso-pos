import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { localMigrations } from '../src/data/schema.ts';
import {
  CONNECTION_SYNC_FAILURE,
  listPendingOutboxFromDatabase,
  makeConnectivityFailuresAvailableInDatabase,
  makePendingOutboxAvailableInDatabase,
} from '../src/data/outbox.ts';
import {
  latestPendingManagementOperationIdFromDatabase,
  latestPendingSaleForRecordFromDatabase,
} from '../src/data/localManagement.ts';
import { operationSessionArgs } from '../src/data/operationSession.ts';

const activeSession = {
  token: 'owner-session-token',
  staffProfileId: 'owner-cloud',
  name: 'Olaso Owner',
  role: 'owner',
  deviceId: 'reconnect-device',
};
const managerSession = {
  token: 'manager-session-token',
  staffProfileId: 'manager-cloud',
  name: 'Original Manager',
  role: 'manager',
};
const sessionServices = {
  resolveProfileId: async (id) => id === 'manager-local' ? 'manager-cloud' : id,
  loadProfileSession: async (id) => id === 'manager-cloud' ? managerSession : undefined,
};
assert.deepEqual(
  await operationSessionArgs({
    staffProfileId: 'manager-local',
    name: 'Original Manager',
    requiredPermission: 'products',
  }, activeSession, sessionServices),
  { sessionToken: 'manager-session-token', deviceId: 'reconnect-device' },
);
assert.deepEqual(
  await operationSessionArgs({
    staffProfileId: 'owner-cloud',
    name: 'Olaso Owner',
    requiredPermission: 'staff',
  }, activeSession, sessionServices),
  { sessionToken: 'owner-session-token', deviceId: 'reconnect-device' },
);
assert.deepEqual(
  await operationSessionArgs({
    name: 'Another cashier',
    requiredPermission: 'pos',
  }, activeSession, sessionServices),
  { sessionToken: 'owner-session-token', deviceId: 'reconnect-device' },
);
await assert.rejects(
  operationSessionArgs({
    staffProfileId: 'cashier-cloud',
    name: 'Cashier',
    requiredPermission: 'products',
  }, activeSession, {
    resolveProfileId: async (id) => id,
    loadProfileSession: async () => ({
      token: 'cashier-session-token',
      staffProfileId: 'cashier-cloud',
      name: 'Cashier',
      role: 'cashier',
    }),
  }),
  /can no longer make this change/i,
);

const database = new DatabaseSync(':memory:');
for (const migration of localMigrations) {
  for (const statement of migration.statements) database.exec(statement);
}
const adapter = {
  query(statement, values = []) {
    return { values: database.prepare(statement).all(...values) };
  },
  run(statement, values = []) {
    return database.prepare(statement).run(...values);
  },
};
const insert = database.prepare(
  `INSERT INTO outbox
    (operation_id, device_id, operation_type, local_record_id, state,
     attempt_count, last_error, created_at, available_at)
   VALUES (?, 'reconnect-device', 'sale-completed', ?, ?, 1, ?, 1, 0)`,
);
insert.run('pending', 'sale-pending', 'pending', null);
insert.run('connection', 'sale-connection', 'failed', CONNECTION_SYNC_FAILURE);
insert.run('business', 'sale-business', 'failed', 'A sale product is no longer available.');
insert.run(
  'schema',
  'sale-schema',
  'failed',
  'Cloud rejected this saved order. Use Sync now to retry.',
);

assert.deepEqual(
  (await listPendingOutboxFromDatabase(adapter, 1, 10)).map((row) => row.operationId),
  ['pending'],
);
await makeConnectivityFailuresAvailableInDatabase(adapter);
assert.deepEqual(
  (await listPendingOutboxFromDatabase(adapter, 1, 10)).map((row) => row.operationId),
  ['pending', 'connection'],
);
assert.equal(
  database.prepare("SELECT state FROM outbox WHERE operation_id = 'business'").get().state,
  'failed',
);
assert.equal(
  database.prepare("SELECT state FROM outbox WHERE operation_id = 'schema'").get().state,
  'failed',
);
await makePendingOutboxAvailableInDatabase(adapter);
assert.equal(
  database.prepare("SELECT COUNT(*) count FROM outbox WHERE state = 'pending'").get().count,
  4,
);
database.close();

const sync02 = new DatabaseSync(':memory:');
for (const migration of localMigrations) {
  for (const statement of migration.statements) sync02.exec(statement);
}
const sync02Adapter = {
  query(statement, values = []) {
    return { values: sync02.prepare(statement).all(...values) };
  },
  run(statement, values = []) {
    return sync02.prepare(statement).run(...values);
  },
};
const enqueueOutbox = sync02.prepare(
  `INSERT INTO outbox
    (operation_id, device_id, operation_type, local_record_id, state,
     depends_on_operation_id, attempt_count, created_at, available_at)
   VALUES (?, 'sync02-device', ?, ?, ?, ?, 0, ?, 0)`,
);
enqueueOutbox.run(
  'parent-pending', 'management.category.save', 'cat-pending', 'pending', null, 1,
);
enqueueOutbox.run(
  'child-of-pending', 'sale-completed', 'sale-pending-parent', 'pending',
  'parent-pending', 2,
);
assert.deepEqual(
  (await listPendingOutboxFromDatabase(sync02Adapter, 10, 10)).map(
    (row) => row.operationId,
  ),
  ['parent-pending'],
  'A still-pending parent must hide its child.',
);
enqueueOutbox.run(
  'parent-failed', 'management.category.save', 'cat-failed', 'failed', null, 3,
);
enqueueOutbox.run(
  'child-of-failed', 'sale-completed', 'sale-failed-parent', 'pending',
  'parent-failed', 4,
);
assert.deepEqual(
  (await listPendingOutboxFromDatabase(sync02Adapter, 10, 10)).map(
    (row) => row.operationId,
  ),
  ['parent-pending', 'child-of-failed'],
  'A failed parent still in outbox must not hide its child.',
);
assert.equal(
  await latestPendingManagementOperationIdFromDatabase(sync02Adapter),
  'parent-pending',
  'New work must pin to a pending management row, not a later failed one.',
);
sync02.prepare(
  "UPDATE outbox SET state = 'failed' WHERE operation_id = 'parent-pending'",
).run();
assert.equal(
  await latestPendingManagementOperationIdFromDatabase(sync02Adapter),
  undefined,
  'New work must not depends_on a failed management row.',
);
enqueueOutbox.run(
  'parent-pending-again', 'management.recipe.save', 'recipe-pending', 'pending',
  null, 5,
);
assert.equal(
  await latestPendingManagementOperationIdFromDatabase(sync02Adapter),
  'parent-pending-again',
);
sync02.exec(`
  INSERT INTO sales
    (local_sale_id, device_id, actor_profile_id, receipt_number, status,
     service_type, subtotal_centimes, tax_centimes, total_centimes, currency,
     business_date, receipt_snapshot_json, sync_state, created_at)
    VALUES
      ('sale-failed-pin', 'sync02-device', 'owner', '0826-9001', 'completed',
       'take-away', 100, 0, 100, 'MAD', '2026-08-29', '{"lines":[]}', 'failed', 1),
      ('sale-pending-pin', 'sync02-device', 'owner', '0826-9002', 'completed',
       'take-away', 100, 0, 100, 'MAD', '2026-08-29', '{"lines":[]}', 'pending', 2);
  INSERT INTO sale_items
    (id, local_sale_id, product_id, quantity, product_name_snapshot,
     unit_price_centimes, modifier_snapshot_json, recipe_snapshot_json,
     line_total_centimes)
    VALUES
      ('item-failed-pin', 'sale-failed-pin', 'product-failed', 1, 'Failed drink',
       100, '[]', '[]', 100),
      ('item-pending-pin', 'sale-pending-pin', 'product-pending', 1, 'Pending drink',
       100, '[]', '[]', 100);
`);
enqueueOutbox.run(
  'sale-failed-pin-op', 'sale-completed', 'sale-failed-pin', 'failed', null, 6,
);
enqueueOutbox.run(
  'sale-pending-pin-op', 'sale-completed', 'sale-pending-pin', 'pending', null, 7,
);
assert.equal(
  await latestPendingSaleForRecordFromDatabase(
    sync02Adapter, 'product', 'product-failed',
  ),
  undefined,
  'A failed sale must not remain the pin target for later deletion.',
);
assert.equal(
  await latestPendingSaleForRecordFromDatabase(
    sync02Adapter, 'product', 'product-pending',
  ),
  'sale-pending-pin-op',
);
sync02.close();

const worker = readFileSync('src/data/reconnectContext.tsx', 'utf8');
const app = readFileSync('src/App.tsx', 'utf8');
const pos = readFileSync('src/data/usePosData.ts', 'utf8');
const orders = readFileSync('src/data/useOrdersData.ts', 'utf8');
const settings = readFileSync('src/data/useSettingsData.ts', 'utf8');
const dashboard = readFileSync('src/data/useDashboardData.ts', 'utf8');
const reports = readFileSync('src/data/useReportsData.ts', 'utf8');
const dataProvider = readFileSync('src/data/AppDataProvider.tsx', 'utf8');
const connection = readFileSync('src/data/connectionContext.tsx', 'utf8');
const main = readFileSync('src/main.tsx', 'utf8');
const html = readFileSync('index.html', 'utf8');
assert.match(worker, /inFlight\.current/);
assert.match(worker, /api\.identity\.checkSession/);
assert.ok(
  worker.indexOf('await checkSession')
    < worker.indexOf('await makeConnectivityFailuresAvailable'),
);
assert.match(worker, /reconcileAuthenticatedStaffProfiles/);
assert.match(worker, /operationSessionArgs/);
assert.match(worker, /actorProfileId/);
assert.match(worker, /await clearStaffSession/);
assert.match(worker, /batch < 10/);
assert.match(worker, /syncPendingSales/);
assert.doesNotMatch(
  worker,
  /staffResult\.processed \+ catalog\.processed \+ inventory\.processed/,
);
assert.match(worker, /makeConnectivityFailuresAvailable/);
assert.match(worker, /mode === 'manual'/);
assert.match(worker, /hasPendingManagementOperations/);
assert.doesNotMatch(worker, /settings\.pendingSyncCount === 0/);
assert.match(worker, /replaceOperationalCache/);
assert.match(worker, /previous !== true/);
assert.ok(app.indexOf('<ReconnectProvider ') > app.indexOf('<StaffSessionProvider'));
assert.match(app, /onSessionUnavailable=\{lock\}/);
assert.doesNotMatch(pos + orders + settings, /syncPendingSales/);
assert.match(dataProvider, /useConnectionStatus\(\)/);
assert.match(dataProvider, /available === false/);
assert.match(dataProvider, /void previous\.close\(\)/);
assert.match(dataProvider, /retiredForOutage\.current/);
assert.match(dataProvider, /addEventListener\('offline', retireConvexClient\)/);
assert.match(worker, /available !== true \|\| !foreground/);
assert.match(connection, /document\.hasFocus\(\)/);
assert.match(connection, /addEventListener\('blur', suspend\)/);
assert.match(worker, /const ready = available === true && foreground/);
assert.match(worker, /requestAnimationFrame/);
assert.match(worker, /requestIdleCallback/);
assert.match(dashboard, /available === undefined \|\| !foreground/);
assert.match(reports, /available === undefined \|\| !foreground/);
assert.match(orders, /available && foreground/);
assert.ok(
  main.indexOf('<ConnectionProvider>') < main.indexOf('<AppDataProvider>'),
  'Android connection truth must exist before the Convex client boundary.',
);
assert.match(html, /<link rel="icon" href="data:," \/>/);
assert.ok(
  orders.indexOf('await refresh();')
    < orders.indexOf("void reconnect.run('automatic')"),
  'Offline cancellation must finish locally before reconnect work starts.',
);

console.log('Single-flight reconnect selection, business-failure retention, and local-first caller checks passed.');
