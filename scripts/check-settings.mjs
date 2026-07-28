import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { localMigrations } from '../src/data/schema.ts';
import { serializeLocalTransaction } from '../src/data/localDatabase.ts';
import {
  describeSyncFailure,
  loadTerminalSettingsFromDatabase,
  saveTerminalPreferencesToDatabase,
  setTerminalLockedInDatabase,
} from '../src/data/terminalSettings.ts';

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
const now = Date.parse('2026-07-28T12:00:00.000Z');
const transactionOrder = [];
let releaseFirst;
const firstGate = new Promise((resolve) => {
  releaseFirst = resolve;
});
const first = serializeLocalTransaction(async () => {
  transactionOrder.push('first:start');
  await firstGate;
  transactionOrder.push('first:end');
});
const second = serializeLocalTransaction(async () => {
  transactionOrder.push('second');
});
await Promise.resolve();
assert.deepEqual(transactionOrder, ['first:start']);
releaseFirst();
await Promise.all([first, second]);
assert.deepEqual(transactionOrder, ['first:start', 'first:end', 'second']);

const initial = await loadTerminalSettingsFromDatabase(
  adapter,
  () => 'settings-check',
  now,
);
assert.equal(initial.deviceId, 'device-settings-check');
assert.equal(initial.terminalName, 'Olaso POS');
assert.equal(initial.clockFormat, '24-hour');
assert.equal(initial.isLocked, false);

await saveTerminalPreferencesToDatabase(
  adapter,
  { terminalName: '  Front   Counter  ', clockFormat: '12-hour' },
  now + 1,
);
await setTerminalLockedInDatabase(adapter, true, now + 1);
database
  .prepare(
    `INSERT INTO outbox
      (operation_id, device_id, operation_type, local_record_id, state,
       created_at, available_at)
     VALUES ('pending-settings', ?, 'sale-completed', 'sale-settings',
       'pending', ?, ?)`,
  )
  .run(initial.deviceId, now, now);
database
  .prepare(
    `UPDATE sync_state
     SET last_success_at = ?, last_error = 'offline'
     WHERE id = 1`,
  )
  .run(now);

const restarted = await loadTerminalSettingsFromDatabase(
  adapter,
  () => 'must-not-replace',
  now + 2,
);
assert.equal(restarted.deviceId, initial.deviceId);
assert.equal(restarted.terminalName, 'Front Counter');
assert.equal(restarted.clockFormat, '12-hour');
assert.equal(restarted.isLocked, true);
assert.equal(restarted.pendingSyncCount, 1);
assert.equal(restarted.lastSyncAt, now);
assert.equal(restarted.lastSyncError, 'offline');
assert.equal(
  describeSyncFailure(new Error('UNAUTHENTICATED: Cashier sign-in is required.')),
  'Synchronization access is unavailable. Restore terminal access and try again.',
);
assert.equal(
  describeSyncFailure(new Error('Failed to fetch')),
  'Cloud connection failed. Check the connection and try again.',
);
await assert.rejects(
  saveTerminalPreferencesToDatabase(
    adapter,
    { terminalName: ' ', clockFormat: '24-hour' },
  ),
  /1 to 40 characters/,
);

database.close();
console.log('Terminal settings persistence and validation checks passed.');
