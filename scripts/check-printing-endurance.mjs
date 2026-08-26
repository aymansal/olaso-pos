import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { commitLocalSale } from '../src/data/localSales.ts';
import {
  recordSalePrintAttempt,
  recordSalePrintFailure,
  recordSalePrintSuccess,
} from '../src/data/printState.ts';
import { attemptSaleReceiptPrint } from '../src/data/receiptPrinting.ts';
import { localMigrations } from '../src/data/schema.ts';
import { addProduct } from '../src/features/pos/posSession.ts';
import { createSavedReceiptBytes } from '../src/printing/printReceipt.ts';

const directory = mkdtempSync(join(tmpdir(), 'olaso-print-endurance-'));
const databasePath = join(directory, 'endurance.sqlite');
let database;

function openDatabase() {
  const next = new DatabaseSync(databasePath);
  next.exec('PRAGMA foreign_keys = ON');
  return next;
}

function adapter() {
  return {
    query(statement, values = []) {
      return { values: database.prepare(statement).all(...values) };
    },
    run(statement, values = []) {
      const result = database.prepare(statement).run(...values);
      return { changes: { changes: Number(result.changes) } };
    },
  };
}

function migrate() {
  for (const migration of localMigrations) {
    for (const statement of migration.statements) database.exec(statement);
    database.exec(`PRAGMA user_version = ${migration.toVersion}`);
  }
}

function seed(now) {
  database.exec(`
    INSERT INTO categories
      (id, key, name, sort_order, status, revision, updated_at)
    VALUES ('category-endurance', 'coffee', 'Coffee', 10, 'active', 1, ${now});

    INSERT INTO products
      (id, category_id, name, receipt_name, price_centimes, status, sort_order,
       current_recipe_version_id, revision, updated_at)
    VALUES
      ('product-endurance', 'category-endurance',
       'Endurance Americano Original', 'Endurance Americano', 1300, 'active',
       10, 'recipe-endurance-1', 1, ${now});

    INSERT INTO product_sizes
      (id, product_id, key, name, price_centimes, sort_order, is_default,
       status, revision, updated_at)
    VALUES
      ('size-endurance-reg', 'product-endurance', 'regular', 'Regular', 1300,
       10, 1, 'active', 1, ${now}),
      ('size-endurance-large', 'product-endurance', 'large', 'Large', 1600,
       20, 0, 'active', 1, ${now});

    INSERT INTO ingredients
      (id, name, base_unit, current_stock_quantity, low_stock_threshold, status,
       revision, updated_at)
    VALUES
      ('ingredient-coffee', 'Coffee beans', 'gram', 100000, 100, 'active', 1, ${now}),
      ('ingredient-cup', 'Paper cup', 'piece', 10000, 10, 'active', 1, ${now});

    INSERT INTO recipe_versions
      (id, product_id, version, is_active, created_at)
    VALUES ('recipe-endurance-1', 'product-endurance', 1, 1, ${now});

    INSERT INTO recipe_items
      (recipe_version_id, ingredient_id, quantity)
    VALUES
      ('recipe-endurance-1', 'ingredient-coffee', 18);

    INSERT INTO recipe_size_quantities
      (recipe_version_id, ingredient_id, product_size_id, size_name_snapshot,
       quantity)
    VALUES
      ('recipe-endurance-1', 'ingredient-coffee', 'size-endurance-reg',
       'Regular', 18),
      ('recipe-endurance-1', 'ingredient-coffee', 'size-endurance-large',
       'Large', 24);

    INSERT INTO device_settings (key, value, updated_at)
    VALUES
      ('device_id', 'device-print-endurance', ${now}),
      ('operational_cache_updated_at', '${now}', ${now});
  `);
}

function assertReceiptBytes(bytes) {
  const buffer = Buffer.from(bytes);
  assert.equal(buffer.indexOf(Buffer.from([0x1d, 0x76, 0x30, 0x00])), -1);
  assert.equal(buffer.indexOf(Buffer.from([0x1d, 0x28, 0x6b])), -1);
  assert.deepEqual([...bytes.subarray(-4)], [0x1d, 0x56, 0x42, 0x00]);
  assert.equal(buffer.indexOf(Buffer.from([0x1c, 0x70, 0x01, 0x00])) >= 0, true);
}

function snapshot(localSaleId) {
  const row = database.prepare(
    'SELECT receipt_snapshot_json FROM sales WHERE local_sale_id = ?',
  ).get(localSaleId);
  return JSON.parse(row.receipt_snapshot_json);
}

function printOperations({ fail = false } = {}) {
  return {
    recordAttempt: (localSaleId) =>
      recordSalePrintAttempt(localSaleId, Date.now(), adapter()),
    loadSettings: async () => ({
      printerHost: '192.0.2.20',
      printerPort: 9100,
    }),
    sendReceipt: async (receipt) => {
      const bytes = createSavedReceiptBytes(receipt);
      assertReceiptBytes(bytes);
      if (fail) {
        throw Object.assign(new Error('offline'), { code: 'UNREACHABLE' });
      }
      return {
        bytesWritten: bytes.length,
        connectMs: 1,
        writeMs: 1,
        totalMs: 2,
        paperConfirmed: false,
      };
    },
    recordSuccess: (localSaleId, result) =>
      recordSalePrintSuccess(localSaleId, result, adapter()),
    recordFailure: (localSaleId, failure) =>
      recordSalePrintFailure(localSaleId, failure, adapter()),
  };
}

const startedAt = Date.parse('2026-08-21T20:00:00.000Z');
const saleIds = [];
let coffeeUsed = 0;

try {
  database = openDatabase();
  migrate();
  seed(startedAt);

  for (let index = 0; index < 20; index += 1) {
    const large = index % 3 === 0;
    const sizeId = large ? 'size-endurance-large' : 'size-endurance-reg';
    const quantity = index % 2 === 0 ? 2 : 1;
    let cart = addProduct([], 'product-endurance', sizeId);
    if (quantity === 2) {
      cart = addProduct(cart, 'product-endurance', sizeId);
    }
    const serviceType = index % 3 === 0
      ? 'dine-in'
      : index % 3 === 1
        ? 'take-away'
        : 'order-online';
    const idPrefix = `S${String(index).padStart(7, '0')}`;
    let id = 0;
    database.exec('BEGIN IMMEDIATE');
    const sale = await commitLocalSale(
      adapter(),
      {
        cart,
        cashierProfileId: 'profile-endurance-cashier',
        cashierName: 'Endurance cashier',
        serviceType,
        paymentMethod: 'Cash',
        receiptLanguage: 'en',
        customerName: serviceType === 'order-online' ? `Customer ${index}` : '',
        tableLabel: serviceType === 'dine-in' ? `T${index + 1}` : '',
        completedAt: startedAt + index * 1000,
      },
      () => `${idPrefix}-${id++}`,
    );
    database.exec('COMMIT');
    saleIds.push(sale.localSaleId);
    coffeeUsed += quantity * (large ? 24 : 18);

    const firstAttempt = await attemptSaleReceiptPrint(
      sale,
      printOperations({ fail: index === 9 }),
    );
    if (index === 9) {
      assert.equal(firstAttempt.state, 'failed');
      database.close();
      database = openDatabase();
      const recovered = await attemptSaleReceiptPrint(
        { localSaleId: sale.localSaleId, receipt: snapshot(sale.localSaleId) },
        printOperations(),
      );
      assert.equal(recovered.state, 'printed');
    } else {
      assert.equal(firstAttempt.state, 'printed');
    }
  }

  database.prepare(
    `UPDATE products
     SET name = 'Changed current product', receipt_name = 'Changed current receipt',
         price_centimes = 9900, revision = revision + 1`,
  ).run();

  for (const localSaleId of saleIds.slice(0, 5)) {
    const saved = snapshot(localSaleId);
    assert.equal(saved.lines[0].receiptName, 'Endurance Americano');
    const reprint = await attemptSaleReceiptPrint(
      { localSaleId, receipt: saved },
      printOperations(),
    );
    assert.equal(reprint.state, 'printed');
  }

  const counts = database.prepare(
    `SELECT
      (SELECT COUNT(*) FROM sales) AS sales,
      (SELECT COUNT(*) FROM sale_items) AS items,
      (SELECT COUNT(*) FROM stock_movements) AS movements,
      (SELECT COUNT(*) FROM outbox) AS outbox,
      (SELECT COUNT(DISTINCT receipt_number) FROM sales) AS receipts,
      (SELECT SUM(print_attempt_count) FROM sales) AS print_attempts,
      (SELECT COUNT(*) FROM sales WHERE print_state = 'printed') AS printed`,
  ).get();
  assert.equal(counts.sales, 20);
  assert.equal(counts.items, 20);
  assert.equal(counts.movements, 20);
  assert.equal(counts.outbox, 20);
  assert.equal(counts.receipts, 20);
  assert.equal(counts.print_attempts, 26);
  assert.equal(counts.printed, 20);

  const balances = Object.fromEntries(
    database.prepare(
      `SELECT id, current_stock_quantity + local_stock_delta AS balance
       FROM ingredients`,
    ).all().map((row) => [row.id, row.balance]),
  );
  assert.equal(balances['ingredient-coffee'], 100000 - coffeeUsed);
  assert.equal(balances['ingredient-cup'], 10000);

  console.log(JSON.stringify({
    sales: counts.sales,
    reprints: 5,
    printAttempts: counts.print_attempts,
    stockMovements: counts.movements,
    outbox: counts.outbox,
  }));
  console.log('20-sale and 5-reprint restart/failure endurance checks passed');
} finally {
  database?.close();
  rmSync(directory, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
}
