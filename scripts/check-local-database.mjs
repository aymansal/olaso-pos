import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  LOCAL_SCHEMA_VERSION,
  localMigrations,
} from '../src/data/schema.ts';

function schemaVersion(database) {
  return database.prepare('PRAGMA user_version').get().user_version;
}

function migrate(database, targetVersion = LOCAL_SCHEMA_VERSION) {
  let version = schemaVersion(database);
  for (const migration of localMigrations) {
    if (migration.toVersion <= version || migration.toVersion > targetVersion) {
      continue;
    }
    database.exec('BEGIN IMMEDIATE');
    try {
      for (const statement of migration.statements) database.exec(statement);
      database.exec(`PRAGMA user_version = ${migration.toVersion}`);
      database.exec('COMMIT');
      version = migration.toVersion;
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  }
  return version;
}

function seedRepresentativeRecords(database) {
  const now = 1_785_255_600_000;
  database
    .prepare(
      `INSERT INTO categories
        (id, name, sort_order, status, revision, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run('category-coffee', 'Coffee', 1, 'active', 1, now);
  database
    .prepare(
      `INSERT INTO products
        (id, category_id, name, receipt_name, price_centimes, status,
         sort_order, revision, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      'product-espresso',
      'category-coffee',
      'Espresso',
      'Espresso',
      1000,
      'active',
      1,
      1,
      now,
    );
  database
    .prepare(
      `INSERT INTO ingredients
        (id, name, base_unit, current_stock_quantity, low_stock_threshold,
         status, revision, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run('ingredient-coffee', 'Coffee beans', 'gram', 9000, 1000, 'active', 1, now);
  database
    .prepare(
      `INSERT INTO recipe_versions
        (id, product_id, version, is_active, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run('recipe-espresso-1', 'product-espresso', 1, 1, now);
  database
    .prepare(
      `INSERT INTO recipe_items
        (recipe_version_id, ingredient_id, quantity)
       VALUES (?, ?, ?)`,
    )
    .run('recipe-espresso-1', 'ingredient-coffee', 18);
  database
    .prepare(
      `INSERT INTO sales
        (local_sale_id, device_id, receipt_number, status, service_type,
         subtotal_centimes, tax_centimes, total_centimes, currency,
         business_date, receipt_snapshot_json, sync_state, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      'local-sale-1',
      'test-device',
      'TEST-0001',
      'completed',
      'take-away',
      1000,
      0,
      1000,
      'MAD',
      '2026-07-28',
      '{"totalCentimes":1000}',
      'pending',
      now,
    );
  database
    .prepare(
      `INSERT INTO outbox
        (operation_id, device_id, operation_type, local_record_id, state,
         created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      'outbox-1',
      'test-device',
      'sale-completed',
      'local-sale-1',
      'pending',
      now,
    );
}

const testDirectory = mkdtempSync(join(tmpdir(), 'olaso-local-db-'));
const databasePath = join(testDirectory, 'restart.sqlite');

try {
  let database = new DatabaseSync(databasePath);
  database.exec('PRAGMA foreign_keys = ON');
  assert.equal(migrate(database, 1), 1);
  seedRepresentativeRecords(database);
  database.close();

  database = new DatabaseSync(databasePath);
  database.exec('PRAGMA foreign_keys = ON');
  assert.equal(migrate(database), LOCAL_SCHEMA_VERSION);
  assert.equal(
    database.prepare('SELECT name FROM products WHERE id = ?').get(
      'product-espresso',
    ).name,
    'Espresso',
  );
  assert.equal(
    database.prepare('SELECT total_centimes FROM sales').get().total_centimes,
    1000,
  );
  const printState = database.prepare(
    `SELECT print_state, print_attempt_count, last_print_attempt_at,
      last_print_error_code, last_print_error_message,
      last_print_bytes_written, last_print_total_ms
     FROM sales`,
  ).get();
  assert.equal(printState.print_state, 'pending');
  assert.equal(printState.print_attempt_count, 0);
  assert.equal(printState.last_print_attempt_at, null);
  assert.equal(printState.last_print_error_code, null);
  assert.equal(printState.last_print_error_message, null);
  assert.equal(printState.last_print_bytes_written, null);
  assert.equal(printState.last_print_total_ms, null);
  assert.equal(
    database.prepare('SELECT available_at FROM outbox').get().available_at,
    0,
  );
  assert.equal(
    database.prepare('SELECT key FROM categories').get().key,
    'category-coffee',
  );
  assert.equal(
    database
      .prepare('SELECT ingredient_effects_json FROM modifier_options')
      .get(),
    undefined,
  );
  database
    .prepare(
      `UPDATE ingredients
       SET local_stock_delta = -10000
       WHERE id = 'ingredient-coffee'`,
    )
    .run();
  assert.equal(
    database
      .prepare(
        `SELECT current_stock_quantity + local_stock_delta AS balance
         FROM ingredients`,
      )
      .get().balance,
    -1000,
  );
  assert.equal(
    database.prepare('SELECT COUNT(*) AS count FROM sync_state').get().count,
    1,
  );
  database.close();

  database = new DatabaseSync(databasePath);
  assert.equal(schemaVersion(database), LOCAL_SCHEMA_VERSION);
  assert.equal(
    database.prepare('SELECT COUNT(*) AS count FROM recipe_items').get().count,
    1,
  );
  assert.equal(
    database.prepare('SELECT COUNT(*) AS count FROM outbox').get().count,
    1,
  );
  database.close();
} finally {
  rmSync(testDirectory, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
}

console.log('Local SQLite migration and restart checks passed.');
