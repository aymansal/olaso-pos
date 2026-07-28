import assert from 'node:assert/strict';
import { execFileSync, execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import {
  commitLocalSale,
  prepareSale,
} from '../src/data/localSales.ts';
import { addProduct } from '../src/features/pos/posSession.ts';
import { localMigrations } from '../src/data/schema.ts';

const database = new DatabaseSync(':memory:');
database.exec('PRAGMA foreign_keys = ON');
for (const migration of localMigrations) {
  database.exec('BEGIN IMMEDIATE');
  try {
    for (const statement of migration.statements) database.exec(statement);
    database.exec(`PRAGMA user_version = ${migration.toVersion}`);
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

const now = Date.parse('2026-07-28T10:00:00.000Z');
database.exec(`
  INSERT INTO categories
    (id, key, name, sort_order, status, revision, updated_at)
  VALUES ('category-coffee', 'coffee', 'Coffee', 10, 'active', 1, ${now});

  INSERT INTO products
    (id, category_id, name, receipt_name, price_centimes, status, sort_order,
     current_recipe_version_id, revision, updated_at)
  VALUES
    ('product-cappuccino', 'category-coffee', 'Cappuccino', 'Cappuccino',
     1700, 'active', 10, 'recipe-cappuccino-1', 3, ${now});

  INSERT INTO modifier_groups
    (id, name, minimum_selections, maximum_selections, status, revision,
     updated_at)
  VALUES
    ('group-size', 'Size', 1, 1, 'active', 1, ${now}),
    ('group-milk', 'Milk', 1, 1, 'active', 1, ${now});

  INSERT INTO ingredients
    (id, name, base_unit, current_stock_quantity, low_stock_threshold, status,
     revision, updated_at)
  VALUES
    ('ingredient-coffee', 'Coffee beans', 'gram', 1000, 100, 'active', 1, ${now}),
    ('ingredient-whole', 'Whole milk', 'millilitre', 100, 100, 'active', 1, ${now}),
    ('ingredient-oat', 'Oat milk', 'millilitre', 500, 100, 'active', 1, ${now}),
    ('ingredient-cup', 'Paper cup', 'piece', 10, 2, 'active', 1, ${now});

  INSERT INTO modifier_options
    (id, modifier_group_id, name, price_delta_centimes, status,
     ingredient_effects_json, sort_order, revision, updated_at)
  VALUES
    ('option-standard', 'group-size', 'Standard', 0, 'active', '[]', 10, 1, ${now}),
    ('option-oat', 'group-milk', 'Oat milk', 400, 'active',
     '[{"ingredientId":"ingredient-whole","quantityDelta":-200},{"ingredientId":"ingredient-oat","quantityDelta":200}]',
     10, 1, ${now});

  INSERT INTO product_modifier_groups
    (product_id, modifier_group_id, sort_order)
  VALUES
    ('product-cappuccino', 'group-size', 10),
    ('product-cappuccino', 'group-milk', 20);

  INSERT INTO recipe_versions
    (id, product_id, version, is_active, created_at)
  VALUES ('recipe-cappuccino-1', 'product-cappuccino', 1, 1, ${now});

  INSERT INTO recipe_items
    (recipe_version_id, ingredient_id, quantity)
  VALUES
    ('recipe-cappuccino-1', 'ingredient-coffee', 18),
    ('recipe-cappuccino-1', 'ingredient-whole', 200),
    ('recipe-cappuccino-1', 'ingredient-cup', 1);

  INSERT INTO device_settings (key, value, updated_at)
  VALUES
    ('device_id', 'device-app06-check', ${now}),
    ('operational_cache_updated_at', '${now}', ${now});
`);

const adapter = {
  query(statement, values = []) {
    return { values: database.prepare(statement).all(...values) };
  },
  run(statement, values = []) {
    const result = database.prepare(statement).run(...values);
    return { changes: { changes: Number(result.changes) } };
  },
};
const input = {
  cart: addProduct(
    [],
    'product-cappuccino',
    ['option-standard', 'option-oat'],
  ),
  serviceType: 'take-away',
  customerName: '  Amal  ',
  tableLabel: '',
  completedAt: now,
};
const ids = ['local-sale-check', 'operation-check', 'sale-item-check'];
let nextId = 0;

database.exec('BEGIN IMMEDIATE');
const completed = await commitLocalSale(
  adapter,
  input,
  () => ids[nextId++] ?? `movement-${nextId}`,
);
database.exec('COMMIT');

assert.equal(completed.receipt.totalCentimes, 2100);
assert.equal(completed.receipt.customerName, 'Amal');
assert.equal(completed.receipt.lines[0].productRevision, 3);
assert.equal(completed.receipt.lines[0].recipeVersionId, 'recipe-cappuccino-1');
assert(
  completed.receipt.lines[0].modifiers.some(
    (modifier) => modifier.optionName === 'Oat milk',
  ),
);
assert.equal(
  database.prepare('SELECT COUNT(*) AS count FROM sales').get().count,
  1,
);
assert.equal(
  database.prepare('SELECT COUNT(*) AS count FROM sale_items').get().count,
  1,
);
assert.equal(
  database.prepare('SELECT COUNT(*) AS count FROM stock_movements').get().count,
  3,
);
assert.equal(
  database
    .prepare(
      `SELECT current_stock_quantity + local_stock_delta AS balance
       FROM ingredients WHERE id = 'ingredient-whole'`,
    )
    .get().balance,
  100,
);
assert.equal(
  database
    .prepare(
      `SELECT current_stock_quantity + local_stock_delta AS balance
       FROM ingredients WHERE id = 'ingredient-oat'`,
    )
    .get().balance,
  300,
);
assert.equal(
  database.prepare('SELECT COUNT(*) AS count FROM outbox').get().count,
  1,
);

const cachedMenu = {
  updatedAt: now,
  categories: [],
  products: [
    {
      id: 'product-cappuccino',
      categoryId: 'category-coffee',
      name: 'Cappuccino',
      receiptName: 'Cappuccino',
      priceCentimes: 1700,
      status: 'active',
      sortOrder: 10,
      currentRecipeVersionId: 'recipe-cappuccino-1',
      revision: 3,
    },
  ],
  modifierGroups: [
    {
      id: 'group-size',
      name: 'Size',
      minimumSelections: 1,
      maximumSelections: 1,
      revision: 1,
    },
  ],
  modifierOptions: [],
  productModifierGroups: [
    {
      productId: 'product-cappuccino',
      modifierGroupId: 'group-size',
      sortOrder: 10,
    },
  ],
  recipeVersions: [],
  recipeItems: [],
  ingredients: [],
};
assert.throws(
  () =>
    prepareSale(
      cachedMenu,
      {
        ...input,
        cart: addProduct([], 'product-cappuccino'),
      },
      'invalid-sale',
    ),
  /Size requires 1 to 1 choices/,
);

const rollbackIds = [
  'rollback-sale',
  'operation-check',
  'rollback-item',
  'rollback-movement-1',
  'rollback-movement-2',
  'rollback-movement-3',
];
let rollbackId = 0;
database.exec('BEGIN IMMEDIATE');
await assert.rejects(
  commitLocalSale(adapter, input, () => rollbackIds[rollbackId++]),
  /UNIQUE constraint failed/,
);
database.exec('ROLLBACK');
assert.equal(
  database
    .prepare(
      `SELECT COUNT(*) AS count FROM sales
       WHERE local_sale_id = 'rollback-sale'`,
    )
    .get().count,
  0,
);
assert.equal(
  database.prepare('SELECT COUNT(*) AS count FROM stock_movements').get().count,
  3,
);
assert.equal(
  database
    .prepare(
      `SELECT current_stock_quantity + local_stock_delta AS balance
       FROM ingredients WHERE id = 'ingredient-oat'`,
    )
    .get().balance,
  300,
);

database.close();

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const convexCli = fileURLToPath(
  new URL('../node_modules/convex/bin/main.js', import.meta.url),
);
const localEnv = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const convexUrl = localEnv.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(convexUrl, 'VITE_CONVEX_URL is missing from .env.local');
const client = new ConvexHttpClient(convexUrl);
const reseed = () =>
  execSync('npm run seed:dev', {
    cwd: projectRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });

reseed();
try {
  const before = await client.query(api.sync.getOperationalSnapshot, {});
  const beforeReport = await client.query(api.reports.getSummary, {
    fromDate: '2026-07-28',
    toDate: '2026-07-28',
  });
  const product = before.products.find((row) => row.name === 'Cappuccino');
  assert(product?.currentRecipeVersionId, 'Seeded Cappuccino is unavailable');
  const sizeGroup = before.modifierGroups.find((row) => row.name === 'Size');
  const milkGroup = before.modifierGroups.find((row) => row.name === 'Milk');
  const standard = before.modifierOptions.find(
    (row) =>
      row.modifierGroupId === sizeGroup?.id && row.name === 'Standard',
  );
  const oat = before.modifierOptions.find(
    (row) => row.modifierGroupId === milkGroup?.id && row.name === 'Oat milk',
  );
  assert(standard && oat, 'Seeded modifier options are unavailable');
  const cloudInput = {
    deviceId: 'device-app06-check',
    localSaleId: 'app06-cloud-idempotency-check',
    receiptNumber: 'DEV-20260728-APP06',
    serviceMode: 'take-away',
    customerName: 'Amal',
    businessDate: '2026-07-28',
    completedAt: Date.parse('2026-07-28T12:00:00.000Z'),
    lines: [
      {
        productId: product.id,
        productRevision: product.revision,
        recipeVersionId: product.currentRecipeVersionId,
        quantity: 1,
        modifierOptionIds: [standard.id, oat.id],
      },
    ],
  };
  await assert.rejects(
    client.mutation(api.sales.accept, {
      ...cloudInput,
      localSaleId: 'app06-invalid-modifier-check',
      lines: [{ ...cloudInput.lines[0], modifierOptionIds: [] }],
    }),
    /Size requires 1 to 1 choices/,
  );
  await assert.rejects(
    client.mutation(api.sales.accept, {
      ...cloudInput,
      localSaleId: 'app06-invalid-date-check',
      businessDate: '2026-02-30',
    }),
    /Business date must use YYYY-MM-DD/,
  );
  const first = await client.mutation(api.sales.accept, cloudInput);
  const retry = await client.mutation(api.sales.accept, cloudInput);
  assert.equal(first.duplicate, false);
  assert.equal(retry.duplicate, true);
  assert.equal(retry.saleId, first.saleId);
  assert.equal(retry.acknowledgedAt, first.acknowledgedAt);

  const verification = JSON.parse(
    execFileSync(
      process.execPath,
      [
        convexCli,
        'run',
        'sales:verifyDevelopmentSale',
        JSON.stringify({
          deviceId: cloudInput.deviceId,
          localSaleId: cloudInput.localSaleId,
        }),
      ],
      {
        cwd: projectRoot,
        encoding: 'utf8',
      },
    ),
  );
  assert.equal(verification.saleId, first.saleId);
  assert.equal(verification.totalCentimes, 2100);
  assert.equal(verification.lineCount, 1);
  assert.equal(verification.movementCount, 3);
  assert.deepEqual(verification.movementDeltas, [-200, -18, -1]);

  const after = await client.query(api.sync.getOperationalSnapshot, {});
  const afterReport = await client.query(api.reports.getSummary, {
    fromDate: '2026-07-28',
    toDate: '2026-07-28',
  });
  const balance = (snapshot, name) =>
    snapshot.ingredients.find((ingredient) => ingredient.name === name)
      ?.currentStockQuantity;
  assert.equal(balance(after, 'Coffee beans'), balance(before, 'Coffee beans') - 18);
  assert.equal(balance(after, 'Whole milk'), balance(before, 'Whole milk'));
  assert.equal(balance(after, 'Oat milk'), balance(before, 'Oat milk') - 200);
  assert.equal(balance(after, 'Paper cups'), balance(before, 'Paper cups') - 1);
  const reportQuantity = (report, name) =>
    report.current.ingredientTotals.find(
      (ingredient) => ingredient.ingredientName === name,
    )?.quantity ?? 0;
  assert.equal(
    afterReport.current.netCentimes,
    beforeReport.current.netCentimes + 2100,
  );
  assert.equal(
    afterReport.current.orderCount,
    beforeReport.current.orderCount + 1,
  );
  assert.equal(
    afterReport.current.itemCount,
    beforeReport.current.itemCount + 1,
  );
  assert.equal(
    afterReport.current.ingredientUsageEventCount,
    beforeReport.current.ingredientUsageEventCount + 3,
  );
  assert.equal(
    reportQuantity(afterReport, 'Coffee beans'),
    reportQuantity(beforeReport, 'Coffee beans') + 18,
  );
  assert.equal(
    reportQuantity(afterReport, 'Oat milk'),
    reportQuantity(beforeReport, 'Oat milk') + 200,
  );
  assert.equal(
    reportQuantity(afterReport, 'Paper cups'),
    reportQuantity(beforeReport, 'Paper cups') + 1,
  );
  assert.equal(
    reportQuantity(afterReport, 'Whole milk'),
    reportQuantity(beforeReport, 'Whole milk'),
  );
} finally {
  reseed();
}

console.log(
  'Atomic local sale, immutable snapshot, and idempotent cloud sync checks passed.',
);
