import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { localMigrations } from '../src/data/schema.ts';
import {
  assertBackupHasNoSecrets,
  buildOperationalBackupFromDatabase,
  parseOperationalBackup,
  summarizeOperationalBackup,
} from '../src/data/operationalExport.ts';

const database = new DatabaseSync(':memory:');
for (const migration of localMigrations) {
  for (const statement of migration.statements) database.exec(statement);
}

const adapter = {
  query(statement, values = []) {
    return Promise.resolve({
      values: database.prepare(statement).all(...values),
    });
  },
};

const now = Date.parse('2026-08-25T12:00:00.000Z');
database.prepare(
  `INSERT INTO device_settings (key, value, updated_at) VALUES (?, ?, ?)`,
).run('device_id', 'device-recovery-test', now);
database.prepare(
  `INSERT INTO categories (id, name, sort_order, status, revision, updated_at)
   VALUES ('cat-1', 'Coffee', 1, 'active', 1, ?)`,
).run(now);
database.prepare(
  `INSERT INTO products (
     id, category_id, name, receipt_name, price_centimes, status,
     sort_order, revision, updated_at
   ) VALUES ('prod-1', 'cat-1', 'Espresso', 'Espresso', 1000, 'active', 1, 1, ?)`,
).run(now);
database.prepare(
  `INSERT INTO sales (
     local_sale_id, device_id, receipt_number, status, service_type,
     subtotal_centimes, tax_centimes, total_centimes, currency, business_date,
     receipt_snapshot_json, sync_state, created_at
   ) VALUES (
     'sale-pending', 'device-recovery-test', 'R-1', 'completed', 'dine-in',
     1000, 0, 1000, 'MAD', '2026-08-25', '{}', 'pending', ?
   )`,
).run(now);
database.prepare(
  `INSERT INTO sale_items (
     id, local_sale_id, product_id, quantity, product_name_snapshot,
     unit_price_centimes, line_total_centimes
   ) VALUES ('item-1', 'sale-pending', 'prod-1', 1, 'Espresso', 1000, 1000)`,
).run();

const backup = await buildOperationalBackupFromDatabase(adapter);
const text = JSON.stringify(backup);
assertBackupHasNoSecrets(text);
assert.equal(backup.format, 'olaso-operational-backup');
assert.equal(backup.deviceId, 'device-recovery-test');
assert.equal(backup.counts.sales, 1);
assert.equal(backup.counts.products, 1);
assert.ok(backup.excludes.includes('rawPins'));
assert.ok(!JSON.stringify(backup.data).includes('sessionToken'));
assert.doesNotMatch(JSON.stringify(backup.data), /"pin"\s*:/);

const parsed = parseOperationalBackup(text);
const summary = summarizeOperationalBackup(parsed);
assert.equal(summary.pendingSales, 1);
assert.equal(summary.counts.sales, 1);

const application = readFileSync('src/data/AppDataProvider.tsx', 'utf8');
assert.match(application, /Checkout stays locked until local data opens again/);

const manifest = readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
assert.match(manifest, /android:allowBackup="false"/);
assert.match(manifest, /android:dataExtractionRules="@xml\/data_extraction_rules"/);
assert.match(manifest, /android:fullBackupContent="@xml\/backup_rules"/);

const plugin = readFileSync(
  'android/app/src/main/java/com/olaso/pos/DocumentExportPlugin.kt',
  'utf8',
);
assert.match(plugin, /ACTION_CREATE_DOCUMENT/);
assert.match(plugin, /ACTION_OPEN_DOCUMENT/);
assert.match(plugin, /@ActivityCallback/);

const settings = readFileSync(
  'src/features/settings/components/SettingsContentPanel/SettingsContentPanel.tsx',
  'utf8',
);
assert.match(settings, /Export backup/);
assert.match(settings, /Verify backup/);

console.log('Operational backup export, privacy, corrupt-stop, and Android exclusion checks passed.');
