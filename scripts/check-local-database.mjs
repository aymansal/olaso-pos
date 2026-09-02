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
  database.prepare(
    `INSERT INTO sale_items
      (id, local_sale_id, product_id, quantity, product_name_snapshot,
       unit_price_centimes, modifier_snapshot_json, recipe_snapshot_json,
       line_total_centimes)
     VALUES ('sale-item-espresso', 'local-sale-1', 'product-espresso', 1,
       'Espresso', 1000, '[]',
       '[{"ingredientId":"ingredient-coffee","ingredientName":"Coffee beans","quantity":18}]',
       1000)`,
  ).run();
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
let database;

try {
  database = new DatabaseSync(databasePath);
  database.exec('PRAGMA foreign_keys = ON');
  assert.equal(migrate(database, 1), 1);
  seedRepresentativeRecords(database);
  assert.equal(migrate(database, 13), 13);
  database.prepare(
    `INSERT INTO categories
      (id, key, name, sort_order, status, revision, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    'category-coffee-archived-copy',
    'category-coffee',
    'Coffee archived copy',
    99,
    'archived',
    1,
    1_785_255_600_000,
  );
  database.prepare(
    `INSERT INTO modifier_groups
      (id, name, minimum_selections, maximum_selections, status, revision,
       updated_at)
     VALUES ('modifier-milk', 'Milk', 0, 1, 'active', 1, 1)`,
  ).run();
  database.prepare(
    `INSERT INTO product_modifier_groups
      (product_id, modifier_group_id, sort_order)
     VALUES ('product-espresso', 'modifier-milk', 10)`,
  ).run();
  database.prepare(
    `INSERT INTO stock_movements
      (id, ingredient_id, local_sale_id, quantity_delta, movement_type,
       reason, actor_label, business_date, created_at)
     VALUES ('movement-coffee', 'ingredient-coffee', 'local-sale-1', -18,
       'sale', 'Recipe deduction', 'Owner', '2026-07-28', 1)`,
  ).run();
  database.prepare(
    `INSERT INTO stock_movements
      (id, ingredient_id, quantity_delta, movement_type, reason,
       actor_label, business_date, created_at)
     VALUES ('movement-purchase', 'ingredient-coffee', 1000, 'purchase',
       'Coffee purchase', 'Owner', '2026-07-28', 2)`,
  ).run();
  database.prepare(
    `INSERT INTO inventory_purchases
      (id, ingredient_id, stock_movement_id, package_label, package_count,
       quantity_per_package, total_quantity, package_price_centimes,
       total_cost_centimes, received_at, business_date, revision,
       client_mutation_id)
     VALUES ('purchase-coffee', 'ingredient-coffee', 'movement-purchase',
       'Bag', 1, 1000, 1000, 4000, 4000, 2, '2026-07-28', 1,
       'purchase-coffee-mutation')`,
  ).run();
  database.prepare(
    `INSERT INTO staff_profiles
      (id, name, role, status, revision, updated_at, identity_revision)
     VALUES ('staff-manager', 'Samira', 'manager', 'active', 1, 1, 1)`,
  ).run();
  database.prepare(
    `INSERT INTO compensation_periods
      (id, staff_profile_id, monthly_amount_centimes, effective_start_month,
       revision, created_at)
     VALUES ('compensation-manager', 'staff-manager', 250000, '2026-07',
       1, 1)`,
  ).run();
  database.close();

  database = new DatabaseSync(databasePath);
  database.exec('PRAGMA foreign_keys = ON');
  assert.equal(migrate(database), LOCAL_SCHEMA_VERSION);
  assert.equal(LOCAL_SCHEMA_VERSION, 24);
  assert.equal(schemaVersion(database), 24);
  assert.ok(database.prepare("SELECT 1 FROM pragma_table_info('compensation_periods') WHERE name = 'effective_start_date'").get());
  assert.ok(database.prepare("SELECT 1 FROM pragma_table_info('operating_expenses') WHERE name = 'effective_end_date'").get());
  assert.equal(
    database.prepare('SELECT name FROM products WHERE id = ?').get(
      'product-espresso',
    ).name,
    'Espresso',
  );
  assert.deepEqual(
    { ...database.prepare(
      `SELECT id, key, name, is_default, price_centimes
       FROM product_sizes WHERE product_id = ?`,
    ).get('product-espresso') },
    {
      id: 'product-espresso:size:regular',
      key: 'regular',
      name: 'Regular',
      is_default: 1,
      price_centimes: 1000,
    },
  );
  assert.ok(
    database.prepare('SELECT COUNT(*) AS count FROM product_sizes').get().count
      >= 1,
  );
  assert.equal(
    database.prepare('SELECT total_centimes FROM sales').get().total_centimes,
    1000,
  );
  assert.equal(
    database.prepare('SELECT COUNT(*) AS count FROM sales').get().count,
    1,
  );
  assert.equal(
    database.prepare('SELECT COUNT(*) AS count FROM stock_movements').get()
      .count,
    2,
  );
  assert.equal(
    database.prepare('SELECT COUNT(*) AS count FROM product_modifier_groups')
      .get().count,
    1,
  );
  assert.equal(
    database.prepare(
      'SELECT product_name_snapshot FROM recipe_versions WHERE id = ?',
    ).get('recipe-espresso-1').product_name_snapshot,
    'Espresso',
  );
  assert.deepEqual(
    { ...database.prepare(
      `SELECT ingredient_name_snapshot, ingredient_base_unit_snapshot
       FROM stock_movements WHERE id = ?`,
    ).get('movement-coffee') },
    {
      ingredient_name_snapshot: 'Coffee beans',
      ingredient_base_unit_snapshot: 'gram',
    },
  );
  assert.equal(
    database.prepare(
      'SELECT ingredient_name_snapshot FROM inventory_purchases WHERE id = ?',
    ).get('purchase-coffee').ingredient_name_snapshot,
    'Coffee beans',
  );
  assert.deepEqual(
    { ...database.prepare(
      `SELECT staff_name_snapshot, staff_role_snapshot
       FROM compensation_periods WHERE id = ?`,
    ).get('compensation-manager') },
    { staff_name_snapshot: 'Samira', staff_role_snapshot: 'manager' },
  );
  assert.deepEqual(database.prepare('PRAGMA foreign_key_check').all(), []);
  database.exec('SAVEPOINT delete_category');
  database.prepare('DELETE FROM categories WHERE id = ?').run('category-coffee');
  assert.equal(
    database.prepare('SELECT category_id FROM products WHERE id = ?')
      .get('product-espresso').category_id,
    null,
  );
  database.exec('ROLLBACK TO delete_category; RELEASE delete_category');
  database.exec('SAVEPOINT delete_product');
  database.prepare('DELETE FROM products WHERE id = ?').run('product-espresso');
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM recipe_versions')
    .get().count, 1);
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM sale_items')
    .get().count, 1);
  assert.deepEqual(
    { ...database.prepare(
      `SELECT category_id_snapshot, category_name_snapshot
       FROM sale_items WHERE id = ?`,
    ).get('sale-item-espresso') },
    {
      category_id_snapshot: 'category-coffee',
      category_name_snapshot: 'Coffee',
    },
  );
  database.exec('ROLLBACK TO delete_product; RELEASE delete_product');
  database.exec('SAVEPOINT delete_ingredient');
  database.prepare('DELETE FROM ingredients WHERE id = ?').run('ingredient-coffee');
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM recipe_items')
    .get().count, 1);
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM stock_movements')
    .get().count, 2);
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM inventory_purchases')
    .get().count, 1);
  database.exec('ROLLBACK TO delete_ingredient; RELEASE delete_ingredient');
  database.exec('SAVEPOINT delete_staff');
  database.prepare('DELETE FROM staff_profiles WHERE id = ?').run('staff-manager');
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM compensation_periods')
    .get().count, 1);
  database.exec('ROLLBACK TO delete_staff; RELEASE delete_staff');
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
  const valuation = database
    .prepare(
      `SELECT inventory_value_centimes, cost_status, valuation_revision
       FROM ingredients WHERE id = 'ingredient-coffee'`,
    )
    .get();
  assert.equal(valuation.inventory_value_centimes, null);
  assert.equal(valuation.cost_status, 'incomplete');
  assert.equal(valuation.valuation_revision, 0);
  assert.equal(
    database
      .prepare(
        `SELECT COUNT(*) AS count FROM sqlite_master
         WHERE type = 'table' AND name IN
           ('inventory_purchases', 'staff_profiles', 'compensation_periods',
            'operating_expenses', 'management_operations',
            'local_cloud_mappings')`,
      )
      .get().count,
    6,
  );
  assert.ok(
    database
      .prepare("SELECT name FROM pragma_table_info('outbox') WHERE name = ?")
      .get('depends_on_operation_id'),
  );
  assert.ok(
    database
      .prepare("SELECT name FROM pragma_table_info('modifier_options') WHERE name = ?")
      .get('key'),
  );
  assert.ok(
    database
      .prepare("SELECT name FROM pragma_table_info('ingredients') WHERE name = ?")
      .get('key'),
  );
  assert.ok(
    database
      .prepare("SELECT name FROM pragma_table_info('stock_movements') WHERE name = ?")
      .get('client_mutation_id'),
  );
  assert.ok(
    database
      .prepare("SELECT name FROM pragma_table_info('operating_expenses') WHERE name = ?")
      .get('transaction_type'),
  );
  assert.ok(
    database
      .prepare("SELECT name FROM pragma_table_info('sales') WHERE name = ?")
      .get('actor_profile_id'),
  );
  assert.ok(
    database
      .prepare("SELECT name FROM pragma_table_info('sale_items') WHERE name = ?")
      .get('size_id_snapshot'),
  );
  assert.ok(
    database
      .prepare("SELECT name FROM pragma_table_info('sale_items') WHERE name = ?")
      .get('size_name_snapshot'),
  );
  assert.ok(
    database
      .prepare("SELECT name FROM pragma_table_info('sale_corrections') WHERE name = ?")
      .get('actor_profile_id'),
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
  try { database?.close(); } catch { /* already closed */ }
  rmSync(testDirectory, {
    recursive: true,
    force: true,
    maxRetries: 20,
    retryDelay: 250,
  });
}

console.log('Local SQLite migration and restart checks passed.');
