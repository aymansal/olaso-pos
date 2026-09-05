import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  deleteLocalCategory,
  deleteLocalProduct,
  saveLocalCategory,
  saveLocalProduct,
  setLocalProductStatus,
} from '../src/data/localCatalog.ts';
import { saveLocalRecipeVersion } from '../src/data/localRecipes.ts';
import {
  copyLocalChoiceSections,
  deleteLocalProductSize,
  saveLocalChoiceSection,
  saveLocalProductSize,
} from '../src/data/localProductConfiguration.ts';
import { queueProductSizeSaves } from '../src/features/products/queueProductSizeSaves.ts';
import { localMigrations } from '../src/data/schema.ts';
import { pruneStaleOperationalCatalog } from '../src/data/operationalCache.ts';
import {
  CATEGORY_ARTWORK_OPTIONS,
  categoryArtworkKey,
  categoryArtworkUrl,
} from '../src/lib/categoryArtwork.ts';

const upgrade = new DatabaseSync(':memory:');
for (const migration of localMigrations.filter((item) => item.toVersion <= 16)) {
  for (const statement of migration.statements) upgrade.exec(statement);
}
upgrade.prepare(`INSERT INTO categories
  (id, key, name, sort_order, status, revision, updated_at)
  VALUES (?, ?, ?, ?, 'active', 1, 1)`).run(
  'existing-coffee', 'coffee', 'Renamed coffee', 10,
);
upgrade.prepare(`INSERT INTO categories
  (id, key, name, sort_order, status, revision, updated_at)
  VALUES (?, ?, ?, ?, 'active', 1, 1)`).run(
  'existing-custom', 'summer-specials', 'Summer specials', 20,
);
for (const statement of localMigrations.find(
  (item) => item.toVersion === 17,
).statements) upgrade.exec(statement);
assert.equal(upgrade.prepare(
  'SELECT artwork_key FROM categories WHERE id = ?',
).get('existing-coffee').artwork_key, 'coffee');
assert.equal(upgrade.prepare(
  'SELECT artwork_key FROM categories WHERE id = ?',
).get('existing-custom').artwork_key, 'neutral');
upgrade.close();

const database = new DatabaseSync(':memory:');
database.exec('PRAGMA foreign_keys = ON');
for (const migration of localMigrations) for (const statement of migration.statements) database.exec(statement);
const adapter = {
  query(statement, values = []) { return { values: database.prepare(statement).all(...values) }; },
  run(statement, values = []) { return database.prepare(statement).run(...values); },
};
const transaction = async (operation) => {
  database.exec('BEGIN');
  try { const result = await operation(adapter); database.exec('COMMIT'); return result; }
  catch (error) { database.exec('ROLLBACK'); throw error; }
};
database.prepare(`INSERT INTO ingredients
  (id, name, base_unit, current_stock_quantity, low_stock_threshold, status,
   revision, updated_at, inventory_value_centimes, cost_status, valuation_revision)
  VALUES ('ingredient:test', 'Test ingredient', 'gram', 1000, 100, 'active', 1, 1, 10000, 'complete', 1)`).run();
const context = { deviceId: 'tablet-test', actor: { staffProfileId: 'manager-test', name: 'Manager', role: 'manager' } };
const category = await saveLocalCategory(context, {
  name: 'Offline category', artworkKey: 'cold-drinks', sortOrder: 90,
}, transaction);
const photo = 'data:image/webp;base64,' + 'A'.repeat(24000);
const product = await saveLocalProduct(context, {
  name: 'Offline drink', categoryId: category.id, basePriceCentimes: 2200,
  status: 'active', sortOrder: 90, imageJpeg: photo,
}, transaction);
assert.equal(
  database.prepare('SELECT image_jpeg FROM products WHERE id = ?').get(product.id).image_jpeg,
  photo,
);
assert.deepEqual(
  { ...database.prepare(
    `SELECT product_id, key, name, price_centimes, is_default, status
     FROM product_sizes WHERE product_id = ?`,
  ).get(product.id) },
  {
    product_id: product.id,
    key: 'regular',
    name: 'Regular',
    price_centimes: 2200,
    is_default: 1,
    status: 'active',
  },
  'A newly created product must be immediately sellable.',
);
const createdProductOperations = database.prepare(
  `SELECT operation_id, operation_type, depends_on_operation_id
   FROM outbox WHERE local_record_id IN (?, ?) ORDER BY rowid`,
).all(product.id, `${product.id}:size:regular`);
assert.equal(createdProductOperations[0].operation_type, 'management.product.save');
assert.deepEqual(
  { ...createdProductOperations[1] },
  {
    operation_id: createdProductOperations[1].operation_id,
    operation_type: 'management.product-size.save',
    depends_on_operation_id: createdProductOperations[0].operation_id,
  },
  'The automatic Regular size must synchronize after its product.',
);
await assert.rejects(() => saveLocalProduct(context, {
  name: 'Huge photo', categoryId: category.id, basePriceCentimes: 1,
  status: 'active', sortOrder: 92,
  imageJpeg: `data:image/jpeg;base64,${'A'.repeat(40_000)}`,
}, transaction));
const managedProduct = {
  id: product.id, key: product.id, categoryId: category.id, name: 'Offline drink',
  receiptName: 'Offline drink', basePriceCentimes: 2200, status: 'active',
  sortOrder: 90, revision: product.revision,
  updatedAt: 1,
};
const recipe = await saveLocalRecipeVersion(context, managedProduct, [
  { ingredientId: 'ingredient:test', quantity: 18 },
], transaction);
assert.equal(recipe.productRevision, 2);
const sourceSize = await saveLocalProductSize(context, {
  productId: product.id, name: 'Large', priceCentimes: 2600, sortOrder: 20,
  isDefault: false, status: 'active',
}, transaction);
const removableSize = await saveLocalProductSize(context, {
  productId: product.id, name: 'Trial', priceCentimes: 2300, sortOrder: 30,
  isDefault: false, status: 'active',
}, transaction);
await deleteLocalProductSize(context, {
  id: removableSize.id, revision: removableSize.revision,
}, transaction);
assert.equal(database.prepare('SELECT status FROM product_sizes WHERE id = ?')
  .get(removableSize.id).status, 'archived');
const destination = await saveLocalProduct(context, {
  name: 'Offline copy', categoryId: category.id, basePriceCentimes: 2400,
  status: 'active', sortOrder: 91,
}, transaction);
const destinationSize = await saveLocalProductSize(context, {
  productId: destination.id, name: 'Large', priceCentimes: 2800, sortOrder: 20,
  isDefault: true, status: 'active',
}, transaction);
const section = await saveLocalChoiceSection(context, {
  productId: product.id, name: 'Cream', selectionMode: 'single', required: false,
  minimumSelections: 0, maximumSelections: 1, sortOrder: 10, status: 'active',
  productSizeIds: [sourceSize.id],
  values: [{
    name: 'Oat cream', priceDeltaCentimes: 100, isDefaultSelected: false,
    sortOrder: 10, status: 'active',
    sizeRules: [{ productSizeId: sourceSize.id, available: true, priceDeltaCentimes: 150 }],
    effects: [{
      effectType: 'add', ingredientId: 'ingredient:test', quantity: 4, sortOrder: 10,
      sizeQuantities: [{ productSizeId: sourceSize.id, quantity: 6 }],
    }],
  }],
}, transaction);
const copied = await copyLocalChoiceSections(
  context,
  product.id,
  destination.id,
  {
    [`${product.id}:size:regular`]: `${destination.id}:size:regular`,
    [sourceSize.id]: destinationSize.id,
  },
  transaction,
);
assert.equal(copied.sectionIds.length, 1);
assert.equal(database.prepare('SELECT COUNT(*) count FROM product_choice_value_effects').get().count, 2);
const sourceValue = database.prepare(
  `SELECT value.name FROM product_choice_values value
   JOIN product_choice_sections section ON section.id = value.section_id
   WHERE section.id = ?`,
).get(section.id).name;
database.prepare(
  `UPDATE product_choice_values SET name = 'Edited copy'
   WHERE section_id = ?`,
).run(copied.sectionIds[0]);
assert.equal(database.prepare(
  `SELECT name FROM product_choice_values WHERE section_id = ?`,
).get(section.id).name, sourceValue, 'Editing a copied choice must not mutate the source.');
assert.equal(database.prepare('SELECT COUNT(*) count FROM categories').get().count, 1);
assert.equal(database.prepare(
  'SELECT artwork_key FROM categories WHERE id = ?',
).get(category.id).artwork_key, 'cold-drinks');
assert.equal(JSON.parse(database.prepare(
  'SELECT payload_json FROM management_operations WHERE operation_type = ? LIMIT 1',
).get('management.category.save').payload_json).artworkKey, 'cold-drinks');
assert.equal(database.prepare('SELECT COUNT(*) count FROM products').get().count, 2);
assert.equal(database.prepare('SELECT COUNT(*) count FROM recipe_items').get().count, 1);
const queue = database.prepare(`SELECT operation_id, operation_type, depends_on_operation_id
  FROM outbox ORDER BY rowid`).all();
assert.ok(queue.length >= 9);
assert.equal(queue[0].operation_type, 'management.category.save');
assert.equal(queue[1].depends_on_operation_id, queue[0].operation_id);
assert.equal(queue[2].depends_on_operation_id, queue[1].operation_id);
await setLocalProductStatus(context, { id: product.id, revision: 2 }, 'unavailable', transaction);
assert.equal(database.prepare('SELECT status FROM products WHERE id = ?').get(product.id).status, 'unavailable');
await assert.rejects(
  saveLocalProduct(context, { name: 'Broken', categoryId: 'missing', basePriceCentimes: 1,
    status: 'active', sortOrder: 1 }, transaction),
  /Category is unavailable/,
);
assert.equal(database.prepare("SELECT COUNT(*) count FROM products WHERE name = 'Broken'").get().count, 0);
await assert.rejects(
  saveLocalCategory(context, {
    name: 'Invalid artwork', artworkKey: 'Not Valid', sortOrder: 100,
  }, transaction),
  /artwork is invalid/,
);
database.prepare(`INSERT INTO sales
  (local_sale_id, device_id, actor_profile_id, receipt_number, status,
   service_type, subtotal_centimes, tax_centimes, total_centimes, currency,
   business_date, receipt_snapshot_json, sync_state, created_at)
  VALUES ('catalog-sale', 'tablet-test', 'manager-test', '0826-0100',
    'completed', 'take-away', 2200, 0, 2200, 'MAD', '2026-08-25',
    '{"lines":[]}', 'pending', 1)`).run();
database.prepare(`INSERT INTO sale_items
  (id, local_sale_id, product_id, quantity, product_name_snapshot,
   unit_price_centimes, modifier_snapshot_json, recipe_snapshot_json,
   line_total_centimes, category_id_snapshot, category_name_snapshot)
  VALUES ('catalog-sale-item', 'catalog-sale', ?, 1, 'Offline drink', 2200,
    '[]', '[]', 2200, ?, 'Offline category')`).run(product.id, category.id);
database.prepare(`INSERT INTO outbox
  (operation_id, device_id, operation_type, local_record_id, state,
   created_at, available_at)
  VALUES ('catalog-sale-operation', 'tablet-test', 'sale-completed',
    'catalog-sale', 'pending', 2, 0)`).run();
const removedCategory = await deleteLocalCategory(
  context, { id: category.id, revision: category.revision }, transaction,
);
assert.equal(database.prepare('SELECT COUNT(*) count FROM categories').get().count, 0);
assert.equal(database.prepare('SELECT category_id FROM products WHERE id = ?')
  .get(product.id).category_id, null);
assert.equal(database.prepare(
  'SELECT depends_on_operation_id FROM outbox WHERE operation_id = ?',
).get(removedCategory.operationId).depends_on_operation_id, 'catalog-sale-operation');
const uncategorized = await saveLocalProduct(context, {
  ...managedProduct, categoryId: '', status: 'unavailable',
  expectedRevision: 4,
}, transaction);
assert.equal(database.prepare('SELECT category_id FROM products WHERE id = ?')
  .get(product.id).category_id, null);
const removedProduct = await deleteLocalProduct(
  context, { id: product.id, revision: uncategorized.revision }, transaction,
);
assert.equal(database.prepare('SELECT COUNT(*) count FROM products').get().count, 1);
assert.equal(database.prepare('SELECT COUNT(*) count FROM recipe_versions').get().count, 1);
assert.equal(database.prepare('SELECT COUNT(*) count FROM sale_items').get().count, 1);
assert.equal(database.prepare(
  'SELECT depends_on_operation_id FROM outbox WHERE operation_id = ?',
).get(removedProduct.operationId).depends_on_operation_id, uncategorized.operationId,
'Later product deletion must wait for every earlier change descended from its pending sale.');
database.close();

const pruneDatabase = new DatabaseSync(':memory:');
pruneDatabase.exec('PRAGMA foreign_keys = ON');
for (const migration of localMigrations) {
  for (const statement of migration.statements) pruneDatabase.exec(statement);
}
pruneDatabase.exec(`
  INSERT INTO categories
    (id, key, name, artwork_key, sort_order, status, revision, updated_at)
  VALUES
    ('category-current', 'current', 'Current', 'neutral', 1, 'active', 1, 2),
    ('category-stale', 'stale', 'Stale', 'neutral', 2, 'archived', 1, 2);
  INSERT INTO products
    (id, key, category_id, name, receipt_name, price_centimes, status,
     sort_order, revision, updated_at)
  VALUES
    ('product-current', 'current', 'category-current', 'Current', 'Current',
     100, 'active', 1, 1, 2),
    ('product-stale', 'stale', 'category-stale', 'Stale', 'Stale',
     100, 'archived', 2, 1, 2);
  INSERT INTO ingredients
    (id, name, base_unit, current_stock_quantity, low_stock_threshold, status,
     revision, updated_at)
  VALUES
    ('ingredient-stale', 'Old milk', 'millilitre', 10, 0, 'archived', 1, 2),
    ('ingredient-pending', 'Pending milk', 'millilitre', 10, 0, 'archived', 1, 1);
  INSERT INTO recipe_versions
    (id, product_id, product_name_snapshot, version, is_active, created_at)
  VALUES ('recipe-stale', 'product-stale', 'Stale', 1, 1, 1);
  INSERT INTO recipe_items
    (recipe_version_id, ingredient_id, ingredient_name_snapshot,
     ingredient_base_unit_snapshot, quantity)
  VALUES ('recipe-stale', 'ingredient-stale', 'Old milk', 'millilitre', 5);
  INSERT INTO staff_profiles
    (id, name, role, status, revision, updated_at, identity_revision)
  VALUES
    ('staff-stale', 'Former worker', 'cashier', 'archived', 1, 2, 1),
    ('staff-pending', 'Pending worker', 'cashier', 'archived', 1, 1, 1);
  INSERT INTO compensation_periods
    (id, staff_profile_id, staff_name_snapshot, staff_role_snapshot,
     monthly_amount_centimes, effective_start_month, revision, created_at)
  VALUES ('staff-stale-wages', 'staff-stale', 'Former worker', 'cashier',
    350000, '2026-08', 1, 1);
  INSERT INTO sales
    (local_sale_id, device_id, actor_profile_id, receipt_number, status,
     service_type, subtotal_centimes, tax_centimes, total_centimes, currency,
     business_date, receipt_snapshot_json, sync_state, created_at)
  VALUES ('stale-history-sale', 'tablet-test', 'staff-pending', '0826-0101',
    'completed', 'take-away', 100, 0, 100, 'MAD', '2026-08-25',
    '{"lines":[]}', 'pending', 1);
  INSERT INTO stock_movements
    (id, ingredient_id, ingredient_name_snapshot,
     ingredient_base_unit_snapshot, local_sale_id, quantity_delta,
     movement_type, reason, business_date, created_at)
  VALUES
    ('stale-movement', 'ingredient-stale', 'Old milk', 'millilitre',
     NULL, 5, 'received', 'History', '2026-08-25', 1),
    ('pending-movement', 'ingredient-pending', 'Pending milk', 'millilitre',
     'stale-history-sale', -5, 'sale', 'Sale', '2026-08-25', 1);
  INSERT INTO outbox
    (operation_id, device_id, operation_type, local_record_id, state,
     created_at, available_at)
  VALUES ('stale-pending-sale', 'tablet-test', 'sale-completed',
    'stale-history-sale', 'failed', 1, 1);
`);
await pruneStaleOperationalCatalog({
  run(statement, values = []) {
    return pruneDatabase.prepare(statement).run(...values);
  },
}, 2);
assert.deepEqual(
  pruneDatabase.prepare('SELECT id FROM categories ORDER BY id').all().map((row) => row.id),
  ['category-current'],
);
assert.deepEqual(
  pruneDatabase.prepare('SELECT id FROM products ORDER BY id').all().map((row) => row.id),
  ['product-current'],
);
assert.deepEqual(
  pruneDatabase.prepare('SELECT id FROM ingredients ORDER BY id').all()
    .map((row) => row.id),
  ['ingredient-pending'],
);
assert.deepEqual(
  pruneDatabase.prepare('SELECT id FROM staff_profiles ORDER BY id').all()
    .map((row) => row.id),
  ['staff-pending'],
);
assert.deepEqual({ ...pruneDatabase.prepare(
  'SELECT product_name_snapshot, is_active FROM recipe_versions WHERE id = ?',
).get('recipe-stale') }, { product_name_snapshot: 'Stale', is_active: 0 });
assert.equal(pruneDatabase.prepare(
  'SELECT ingredient_name_snapshot FROM recipe_items WHERE recipe_version_id = ?',
).get('recipe-stale').ingredient_name_snapshot, 'Old milk');
assert.equal(pruneDatabase.prepare(
  'SELECT ingredient_name_snapshot FROM stock_movements WHERE id = ?',
).get('stale-movement').ingredient_name_snapshot, 'Old milk');
assert.equal(pruneDatabase.prepare(
  'SELECT staff_name_snapshot FROM compensation_periods WHERE id = ?',
).get('staff-stale-wages').staff_name_snapshot, 'Former worker');
assert.deepEqual(pruneDatabase.prepare('PRAGMA foreign_key_check').all(), []);
pruneDatabase.close();
assert.equal(CATEGORY_ARTWORK_OPTIONS.length, 6);
assert.equal(categoryArtworkKey('future-asset'), 'neutral');
assert.equal(categoryArtworkUrl('future-asset'), categoryArtworkUrl('neutral'));
for (const option of CATEGORY_ARTWORK_OPTIONS) {
  const path = fileURLToPath(option.image);
  assert.equal(path.endsWith('.webp'), true);
  assert(statSync(path).size < 40_000, `${option.key} artwork is not right-sized.`);
}
const localSalesSource = readFileSync('src/data/localSales.ts', 'utf8');
const reconnectSource = readFileSync('src/data/reconnectContext.tsx', 'utf8');
const productHookSource = readFileSync('src/data/useProductManagement.ts', 'utf8');
const operationalCacheSource = readFileSync('src/data/operationalCache.ts', 'utf8');
assert.match(
  operationalCacheSource,
  /image_jpeg = COALESCE\(excluded\.image_jpeg, products\.image_jpeg\)/,
);
assert.match(localSalesSource, /depends_on_operation_id/);
assert.match(localSalesSource, /latestPendingManagementOperationIdFromDatabase/);
assert.ok(
  reconnectSource.indexOf('syncPendingCatalogOperations')
    < reconnectSource.indexOf('syncPendingSales('),
  'Catalog parents must synchronize before dependent sales.',
);
assert.match(reconnectSource, /resolveCloudRecordId\('product'/);
assert.match(reconnectSource, /resolveCloudRecordId\(\s*'recipe-version'/);
assert.match(reconnectSource, /resolveCloudRecordId\(\s*'choice-value'/);
assert.doesNotMatch(productHookSource, /useMutation|useQuery_experimental/);
assert.match(productHookSource, /saveLocalCategory/);
assert.match(productHookSource, /saveLocalProduct/);
assert.match(productHookSource, /saveLocalChoiceSection/);
assert.match(productHookSource, /saveLocalProductSize/);
assert.match(productHookSource, /saveLocalRecipeVersion/);
assert.match(productHookSource, /section\.status !== 'archived'/);
const productScreenSource = readFileSync(
  'src/features/products/ProductsScreen.tsx',
  'utf8',
);
assert.match(productScreenSource, /product\.status !== 'archived'/);
assert.match(productScreenSource, /selectedCategory\?\.status === 'active'/);
assert.match(productScreenSource, /UNCATEGORIZED_ID = 'uncategorized'/);
assert.match(productScreenSource, /!product\.categoryId/);
assert.match(
  readFileSync(
    'src/features/products/components/CategorySidebar/CategorySidebar.tsx',
    'utf8',
  ),
  /name: t\('Uncategorized'\)/,
);
assert.match(
  readFileSync(
    'src/features/products/components/ProductEditorPanel/ProductEditorPanel.module.css',
    'utf8',
  ),
  /flex: 0 0 28px/,
);
assert.doesNotMatch(
  readFileSync(
    'src/features/products/components/ProductEditorPanel/ProductEditorPanel.tsx',
    'utf8',
  ),
  /formatMad\(size\.priceCentimes\) · \{size\.status\}/,
);
assert.ok(
  [...operationalCacheSource.matchAll(/CASE WHEN status = 'archived'/g)].length >= 4,
  'Bounded catalog reads must prioritize live records over archived history.',
);
assert.match(operationalCacheSource, /ORDER BY is_active DESC, created_at DESC/);
const categoryMapping = operationalCacheSource.match(
  /categories: \(categories\.values[\s\S]*?products: \(products\.values/,
)?.[0] ?? '';
const modifierMapping = operationalCacheSource.match(
  /modifierOptions: \(modifierOptions\.values[\s\S]*?productModifierGroups:/,
)?.[0] ?? '';
assert.match(categoryMapping, /artworkKey: String\(row\.artwork_key/);
assert.doesNotMatch(modifierMapping, /artworkKey/);
const savedSizes = [
  { id: 'size:small', productId: 'product:1', name: 'Small', priceCentimes: 1600,
    sortOrder: 10, isDefault: true, status: 'active', revision: 1 },
  { id: 'size:medium', productId: 'product:1', name: 'Medium', priceCentimes: 1800,
    sortOrder: 20, isDefault: false, status: 'active', revision: 1 },
];
assert.deepEqual(
  queueProductSizeSaves([
    ...savedSizes,
    { productId: 'product:1', name: 'Large', priceCentimes: 2200, sortOrder: 30,
      isDefault: false, status: 'active' },
  ], savedSizes).map((size) => size.name),
  ['Large'],
  'Adding a size must not rewrite already saved sizes.',
);
assert.deepEqual(
  queueProductSizeSaves([
    { ...savedSizes[0], isDefault: false },
    { ...savedSizes[1], isDefault: true },
  ], savedSizes).map((size) => size.name),
  ['Small', 'Medium'],
  'A moved default must save after the size it replaces.',
);
console.log('Local-first catalog and recipe transaction checks passed.');
