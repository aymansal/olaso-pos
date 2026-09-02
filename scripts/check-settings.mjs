import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { localMigrations } from '../src/data/schema.ts';
import { serializeLocalTransaction } from '../src/data/localDatabase.ts';
import {
  describeSyncFailure,
  formatPrinterEndpoint,
  loadTerminalSettingsFromDatabase,
  parsePrinterEndpoint,
  savePrinterPreferencesToDatabase,
  saveTerminalPreferencesToDatabase,
  setTerminalLockedInDatabase,
} from '../src/data/terminalSettings.ts';
import { createPrinterTestBytes } from '../src/printing/printerDiagnostic.ts';
import { describePrinterFailure } from '../src/printing/testPrinter.ts';

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
assert.equal(initial.receiptLanguage, 'en');
assert.equal(initial.applicationLanguage, 'en');
assert.equal(initial.isLocked, false);
assert.equal(initial.printerHost, '');
assert.equal(initial.printerPort, 9100);

await saveTerminalPreferencesToDatabase(
  adapter,
  { terminalName: '  Front   Counter  ', clockFormat: '12-hour', receiptLanguage: 'fr', applicationLanguage: 'fr' },
  now + 1,
);
await savePrinterPreferencesToDatabase(
  adapter,
  { printerHost: ' 192.168.11.100 ', printerPort: 9100 },
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
assert.equal(restarted.receiptLanguage, 'fr');
assert.equal(restarted.applicationLanguage, 'fr');
assert.equal(restarted.isLocked, true);
assert.equal(restarted.printerHost, '192.168.11.100');
assert.equal(restarted.printerPort, 9100);
assert.equal(restarted.pendingSyncCount, 1);

database
  .prepare(
    `INSERT INTO outbox
      (operation_id, device_id, operation_type, local_record_id, state,
       created_at, available_at)
     VALUES ('failed-sale-settings', ?, 'sale-completed', 'sale-failed',
       'failed', ?, ?)`,
  )
  .run(initial.deviceId, now, now);
database
  .prepare(
    `INSERT INTO outbox
      (operation_id, device_id, operation_type, local_record_id, state,
       created_at, available_at)
     VALUES ('cancelled-sale-settings', ?, 'sale-cancelled', 'sale-cancelled',
       'pending', ?, ?)`,
  )
  .run(initial.deviceId, now, now);
database
  .prepare(
    `INSERT INTO outbox
      (operation_id, device_id, operation_type, local_record_id, state,
       created_at, available_at)
     VALUES ('category-delete-settings', ?, 'management.category.delete',
       'category-delete', 'pending', ?, ?)`,
  )
  .run(initial.deviceId, now, now);

const mixedQueue = await loadTerminalSettingsFromDatabase(
  adapter,
  () => 'must-not-replace',
  now + 3,
);
assert.equal(
  database.prepare('SELECT COUNT(*) AS count FROM outbox').get().count,
  4,
);
assert.equal(mixedQueue.pendingSyncCount, 3);

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
    { terminalName: ' ', clockFormat: '24-hour', receiptLanguage: 'en', applicationLanguage: 'en' },
  ),
  /1 to 40 characters/,
);
await assert.rejects(
  savePrinterPreferencesToDatabase(
    adapter,
    { printerHost: 'printer.local', printerPort: 9100 },
  ),
  /valid IPv4 address/,
);
await assert.rejects(
  savePrinterPreferencesToDatabase(
    adapter,
    { printerHost: '192.168.11.100', printerPort: 0 },
  ),
  /1 to 65535/,
);

const diagnostic = createPrinterTestBytes();
assert.deepEqual([...diagnostic.subarray(0, 5)], [0x1b, 0x40, 0x1b, 0x74, 0x13]);
assert.match(Buffer.from(diagnostic).toString('ascii'), /OLASO PRINTER TEST/);
assert.match(Buffer.from(diagnostic).toString('ascii'), /NOT A SALE/);
assert.deepEqual([...diagnostic.subarray(-4)], [0x1d, 0x56, 0x42, 0x00]);
assert.equal(diagnostic.indexOf(0x00, 5) >= 0, true);
assert.equal(
  describePrinterFailure(Object.assign(new Error('unavailable'), { code: 'UNAVAILABLE' })),
  'Printer actions are available in the installed Android app.',
);
assert.deepEqual(
  parsePrinterEndpoint('192.168.11.100:9100'),
  { printerHost: '192.168.11.100', printerPort: 9100 },
);
assert.equal(
  formatPrinterEndpoint('192.168.11.100', 9100),
  '192.168.11.100:9100',
);
const printerPanel = readFileSync(
  'src/features/settings/components/SettingsContentPanel/SettingsContentPanel.tsx',
  'utf8',
);
assert.match(printerPanel, /Test printer/);
assert.doesNotMatch(printerPanel, /Restore saved logo/);
assert.doesNotMatch(printerPanel, /Device ID/);
assert.doesNotMatch(printerPanel, /Lock application/);
assert.match(printerPanel, /Application/);
assert.match(printerPanel, /192\.168\.1\.100:9100/);

database.close();
console.log('Terminal and printer setup persistence, validation, and warning checks passed.');
