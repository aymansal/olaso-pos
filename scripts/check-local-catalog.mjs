import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { saveLocalCategory, saveLocalProduct, setLocalProductStatus } from '../src/data/localCatalog.ts';
import { saveLocalModifierGroup, saveLocalRecipeVersion } from '../src/data/localRecipes.ts';
import { localMigrations } from '../src/data/schema.ts';
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
const modifier = await saveLocalModifierGroup(context, {
  name: 'Offline options', required: false, minSelections: 0, maxSelections: 1,
  status: 'active', sortOrder: 90, options: [{ key: 'extra', name: 'Extra',
    priceDeltaCentimes: 200, ingredientEffects: [{ ingredientId: 'ingredient:test', quantityDelta: 5 }],
    status: 'active', sortOrder: 10 }],
}, transaction);
const product = await saveLocalProduct(context, {
  name: 'Offline drink', categoryId: category.id, basePriceCentimes: 2200,
  status: 'active', sortOrder: 90, modifierGroupIds: [modifier.id],
}, transaction);
const managedProduct = {
  id: product.id, key: product.id, categoryId: category.id, name: 'Offline drink',
  receiptName: 'Offline drink', basePriceCentimes: 2200, status: 'active',
  sortOrder: 90, modifierGroupIds: [modifier.id], revision: product.revision,
  updatedAt: 1,
};
const recipe = await saveLocalRecipeVersion(context, managedProduct, [
  { ingredientId: 'ingredient:test', quantity: 18 },
], transaction);
assert.equal(recipe.productRevision, 2);
assert.equal(database.prepare('SELECT COUNT(*) count FROM categories').get().count, 1);
assert.equal(database.prepare(
  'SELECT artwork_key FROM categories WHERE id = ?',
).get(category.id).artwork_key, 'cold-drinks');
assert.equal(JSON.parse(database.prepare(
  'SELECT payload_json FROM management_operations WHERE operation_type = ? LIMIT 1',
).get('management.category.save').payload_json).artworkKey, 'cold-drinks');
assert.equal(database.prepare('SELECT COUNT(*) count FROM products').get().count, 1);
assert.equal(database.prepare('SELECT COUNT(*) count FROM modifier_options').get().count, 1);
assert.equal(database.prepare('SELECT COUNT(*) count FROM recipe_items').get().count, 1);
const queue = database.prepare(`SELECT operation_id, operation_type, depends_on_operation_id
  FROM outbox ORDER BY rowid`).all();
assert.equal(queue.length, 4);
assert.equal(queue[0].operation_type, 'management.category.save');
assert.equal(queue[1].depends_on_operation_id, queue[0].operation_id);
assert.equal(queue[2].depends_on_operation_id, queue[1].operation_id);
assert.equal(queue[3].depends_on_operation_id, queue[2].operation_id);
const saleDependency = queue[3].operation_id;
assert.equal(
  database.prepare(`SELECT operation_id FROM outbox WHERE operation_type LIKE 'management.%'
    ORDER BY rowid DESC LIMIT 1`).get().operation_id,
  saleDependency,
);
await setLocalProductStatus(context, { id: product.id, revision: 2 }, 'unavailable', transaction);
assert.equal(database.prepare('SELECT status FROM products WHERE id = ?').get(product.id).status, 'unavailable');
await assert.rejects(
  saveLocalProduct(context, { name: 'Broken', categoryId: 'missing', basePriceCentimes: 1,
    status: 'active', sortOrder: 1, modifierGroupIds: [] }, transaction),
  /Category is unavailable/,
);
assert.equal(database.prepare("SELECT COUNT(*) count FROM products WHERE name = 'Broken'").get().count, 0);
await assert.rejects(
  saveLocalCategory(context, {
    name: 'Invalid artwork', artworkKey: 'Not Valid', sortOrder: 100,
  }, transaction),
  /artwork is invalid/,
);
database.close();
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
assert.match(localSalesSource, /depends_on_operation_id/);
assert.match(localSalesSource, /latestPendingManagementOperationIdFromDatabase/);
assert.ok(
  reconnectSource.indexOf('syncPendingCatalogOperations')
    < reconnectSource.indexOf('syncPendingSales('),
  'Catalog parents must synchronize before dependent sales.',
);
assert.match(reconnectSource, /resolveCloudRecordId\('product'/);
assert.match(reconnectSource, /resolveCloudRecordId\(\s*'recipe-version'/);
assert.match(reconnectSource, /resolveCloudRecordId\(\s*'modifier-option'/);
assert.doesNotMatch(productHookSource, /useMutation|useQuery_experimental/);
assert.match(productHookSource, /saveLocalCategory/);
assert.match(productHookSource, /saveLocalProduct/);
assert.match(productHookSource, /saveLocalModifierGroup/);
assert.match(productHookSource, /saveLocalRecipeVersion/);
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
console.log('Local-first catalog and recipe transaction checks passed.');
