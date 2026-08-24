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
await makePendingOutboxAvailableInDatabase(adapter);
assert.equal(
  database.prepare("SELECT COUNT(*) count FROM outbox WHERE state = 'pending'").get().count,
  3,
);
database.close();

const worker = readFileSync('src/data/reconnectContext.tsx', 'utf8');
const app = readFileSync('src/App.tsx', 'utf8');
const pos = readFileSync('src/data/usePosData.ts', 'utf8');
const orders = readFileSync('src/data/useOrdersData.ts', 'utf8');
const settings = readFileSync('src/data/useSettingsData.ts', 'utf8');
assert.match(worker, /inFlight\.current/);
assert.match(worker, /api\.identity\.checkSession/);
assert.ok(
  worker.indexOf('await checkSession')
    < worker.indexOf('await makeConnectivityFailuresAvailable'),
);
assert.match(worker, /reconcileAuthenticatedStaffProfiles/);
assert.match(worker, /await clearStaffSession/);
assert.match(worker, /batch < 10/);
assert.match(worker, /makeConnectivityFailuresAvailable/);
assert.match(worker, /mode === 'manual'/);
assert.match(worker, /hasPendingManagementOperations/);
assert.doesNotMatch(worker, /settings\.pendingSyncCount === 0/);
assert.match(worker, /replaceOperationalCache/);
assert.match(worker, /previous !== true/);
assert.ok(app.indexOf('<ReconnectProvider ') > app.indexOf('<StaffSessionProvider'));
assert.match(app, /onSessionUnavailable=\{lock\}/);
assert.doesNotMatch(pos + orders + settings, /syncPendingSales/);
assert.ok(
  orders.indexOf('await refresh();')
    < orders.indexOf("void reconnect.run('automatic')"),
  'Offline cancellation must finish locally before reconnect work starts.',
);

console.log('Single-flight reconnect selection, business-failure retention, and local-first caller checks passed.');
