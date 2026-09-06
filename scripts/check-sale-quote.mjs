import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import { localMigrations } from '../src/data/schema.ts';
import { loadOperationalCache } from '../src/data/operationalCache.ts';
import { prepareSale } from '../src/data/localSales.ts';
import { managementIdentifier, OPERATIONAL_MANAGEMENT_OPERATION_TYPES } from '../src/data/managementOperation.ts';
import { latestPendingManagementOperationIdFromDatabase, resolveCloudRecordIdFromDatabase } from '../src/data/localManagement.ts';
import { captureCatalogQuote, remapCatalogQuote, catalogQuoteFingerprint } from '../src/lib/catalogQuote.ts';

// Actual quote/commit functions, isolated SQLite and an injected local connection.
// No cloud, protected credentials, tablet or production sales.
const sql = new DatabaseSync(':memory:');
for (const migration of localMigrations) for (const statement of migration.statements) sql.exec(statement);
const db = {
  query: async (statement, values = []) => ({ values: sql.prepare(statement).all(...values) }),
  run: async (statement, values = []) => sql.prepare(statement).run(...values),
};
sql.exec(`
  INSERT INTO categories(id,key,name,sort_order,status,revision,updated_at) VALUES ('category','category','Coffee',1,'active',1,1);
  INSERT INTO products(id,category_id,key,name,receipt_name,price_centimes,status,sort_order,revision,updated_at,current_recipe_version_id)
    VALUES ('product','category','product','Coffee','Coffee',1000,'active',1,1,1,'recipe');
  INSERT INTO ingredients(id,name,base_unit,current_stock_quantity,low_stock_threshold,status,revision,updated_at,inventory_value_centimes,cost_status,valuation_revision)
    VALUES ('ingredient','Beans','gram',100,0,'active',1,1,1000,'complete',1);
  INSERT INTO recipe_versions(id,product_id,version,is_active,created_at) VALUES ('recipe','product',1,1,1);
  INSERT INTO recipe_items(recipe_version_id,ingredient_id,quantity) VALUES ('recipe','ingredient',10);
  INSERT INTO product_sizes(id,product_id,key,name,price_centimes,sort_order,is_default,status,revision,updated_at)
    VALUES ('size','product','regular','Regular',1000,1,1,'active',1,1);
`);
const compile = (source) => stripTypeScriptTypes(source).replace(/\bexport /g, '');
const quoteSource = readFileSync('src/data/localSaleQuote.ts', 'utf8').replace(/^import .*;\r?$/gm, '');
const quoteApi = new Function('loadOperationalCache', 'prepareSale', `${compile(quoteSource)}; return {createLocalSaleQuote,readLocalSaleQuote,releaseLocalSaleQuote};`)(
  () => loadOperationalCache(db), prepareSale,
);
const saleSource = readFileSync('src/data/localSales.ts', 'utf8');
const numberSource = saleSource.slice(saleSource.indexOf('function receiptPeriod'), saleSource.indexOf('\ntype SaleValuation'));
const allocateReceiptNumber = new Function(`${compile(numberSource)}; return allocateReceiptNumber;`)();
const commitSource = saleSource.slice(saleSource.indexOf('export async function commitLocalSale'), saleSource.indexOf('export async function completeLocalSale'));
const dependencies = { loadOperationalCache, readLocalSaleQuote: quoteApi.readLocalSaleQuote, remapCatalogQuote,
  resolveCloudRecordIdFromDatabase, managementIdentifier, prepareSale, allocateReceiptNumber, captureCatalogQuote,
  latestPendingManagementOperationIdFromDatabase, OPERATIONAL_MANAGEMENT_OPERATION_TYPES };
const commit = new Function(...Object.keys(dependencies), `${compile(commitSource)}; return commitLocalSale;`)(...Object.values(dependencies));
const cart = [{ id: 'line', productId: 'product', sizeId: 'size', quantity: 2, choiceValueIds: [] }];
const quote = await quoteApi.createLocalSaleQuote(cart);
const quotedFingerprint = await catalogQuoteFingerprint(captureCatalogQuote(quote.menu, 'product'));
// Changing the returned display copy must never authorize a price override.
quote.menu.productSizes[0].priceCentimes = 1;
sql.exec("UPDATE product_sizes SET price_centimes=2000,revision=2; UPDATE recipe_items SET quantity=20; UPDATE ingredients SET inventory_value_centimes=2000,valuation_revision=2");
const input = { cart, quoteId: quote.id, cashierProfileId: 'owner', cashierName: 'Owner', serviceType: 'dine-in', paymentMethod: 'Card',
  tenders: [{ paymentMethod: 'Cash', dueCentimes: 1000, amountCentimes: 1000, changeCentimes: 0 },
    { paymentMethod: 'Card', dueCentimes: 1000, amountCentimes: 1000, changeCentimes: 0 }] };
assert.throws(() => quoteApi.readLocalSaleQuote(quote.id, [{ ...cart[0], quantity: 3 }]), /no longer matches/);
const result = await commit(db, input);
assert.equal(result.receipt.totalCentimes, 2000, 'Every split retains the original price.');
assert.equal(result.receipt.ingredientCostCentimes, 400, 'Completion uses current inventory value with quoted recipe.');
assert.equal(result.receipt.lines[0].recipe[0].quantity, 10);
assert.equal(await catalogQuoteFingerprint(result.receipt.lines[0].catalogQuote), quotedFingerprint);
assert.equal(sql.prepare('SELECT current_stock_quantity+local_stock_delta quantity FROM ingredients').get().quantity, 80);
quoteApi.releaseLocalSaleQuote(quote.id);
assert.throws(() => quoteApi.readLocalSaleQuote(quote.id, cart), /no longer matches/);

// Promotion can replace every local ID while a payment is open. The quote is
// remapped before preparation and its fingerprint follows those same IDs.
const promotedQuote = await quoteApi.createLocalSaleQuote(cart);
const mappings = [['product', 'product'], ['product-size', 'size'], ['ingredient', 'ingredient'],
  ['recipe-version', 'recipe'], ['category', 'category']];
for (const [kind, id] of mappings) sql.prepare('INSERT INTO local_cloud_mappings(record_type,local_record_id,cloud_record_id,acknowledged_at) VALUES (?,?,?,1)').run(kind, id, `${id}-cloud`);
// Real transitional state: acknowledgement writes mappings before the cloud
// cache replaces the old SQLite IDs. Deduct the row that actually exists.
const acknowledged = await commit(db, { ...input, quoteId: promotedQuote.id, tenders: undefined });
assert.equal(acknowledged.receipt.ingredientCostCentimes, 800);
assert.equal(sql.prepare("SELECT current_stock_quantity+local_stock_delta quantity FROM ingredients WHERE id='ingredient'").get().quantity, 40);
assert.equal(sql.prepare('SELECT ingredient_id FROM stock_movements WHERE local_sale_id=?').get(acknowledged.localSaleId).ingredient_id, 'ingredient');
sql.exec(`BEGIN; PRAGMA defer_foreign_keys=ON; UPDATE categories SET id='category-cloud';
  UPDATE products SET id='product-cloud',category_id='category-cloud',current_recipe_version_id='recipe-cloud';
  UPDATE product_sizes SET id='size-cloud',product_id='product-cloud';
  UPDATE recipe_versions SET id='recipe-cloud',product_id='product-cloud';
  UPDATE recipe_items SET recipe_version_id='recipe-cloud',ingredient_id='ingredient-cloud';
  UPDATE ingredients SET id='ingredient-cloud'; COMMIT;`);
const promoted = await commit(db, { ...input, quoteId: promotedQuote.id, tenders: undefined });
assert.equal(promoted.receipt.totalCentimes, 4000);
assert.equal(promoted.receipt.lines[0].productId, 'product-cloud');
assert.equal(promoted.receipt.lines[0].sizeId, 'size-cloud');
assert.equal(promoted.receipt.lines[0].recipe[0].ingredientId, 'ingredient-cloud');
assert.equal(promoted.receipt.ingredientCostCentimes, 800);
assert.equal(sql.prepare("SELECT current_stock_quantity+local_stock_delta quantity FROM ingredients WHERE id='ingredient-cloud'").get().quantity, 0);
const expectedQuote = await remapCatalogQuote(captureCatalogQuote(promotedQuote.menu, 'product'),
  (kind, id) => resolveCloudRecordIdFromDatabase(db, kind, id));
assert.equal(await catalogQuoteFingerprint(promoted.receipt.lines[0].catalogQuote), await catalogQuoteFingerprint(expectedQuote));
const payloadSource = saleSource.slice(saleSource.indexOf('async function loadSaleSyncPayload('), saleSource.indexOf('async function loadSaleCancellationPayload('));
const loadPayload = new Function('openLocalDatabase', `${compile(payloadSource)}; return loadSaleSyncPayload;`)(async () => db);
const reconnectSource = readFileSync('src/data/reconnectContext.tsx', 'utf8');
const mapperSource = reconnectSource.slice(reconnectSource.indexOf('async function toConvexSaleArgs('), reconnectSource.indexOf('export function ReconnectProvider('));
const cloudArgs = new Function('resolveCloudRecordId', 'catalogQuoteFingerprint', 'remapCatalogQuote',
  `${compile(mapperSource)}; return toConvexSaleArgs;`,
)((kind, id) => resolveCloudRecordIdFromDatabase(db, kind, id), catalogQuoteFingerprint, remapCatalogQuote);
const transmitted = await cloudArgs(await loadPayload(promoted.localSaleId));
assert.equal(transmitted.lines[0].catalogQuoteFingerprint, await catalogQuoteFingerprint(expectedQuote));
assert.equal('catalogQuote' in transmitted.lines[0], false, 'Only the catalog fingerprint crosses the cloud boundary.');
assert.equal('unitPriceCentimes' in transmitted.lines[0], false, 'No client price override is sent.');
quoteApi.releaseLocalSaleQuote(promotedQuote.id);

// A deleted size stays valid for an already-started payment, while new payment
// validation uses the live catalog. Ingredient removal retains unknown costs.
const promotedCart = [{ ...cart[0], productId: 'product-cloud', sizeId: 'size-cloud' }];
const deletedQuote = await quoteApi.createLocalSaleQuote(promotedCart);
sql.exec('DELETE FROM product_sizes; DELETE FROM ingredients;');
const deleted = await commit(db, { ...input, cart: promotedCart, quoteId: deletedQuote.id, tenders: undefined });
assert.equal(deleted.receipt.totalCentimes, 4000);
assert.equal(deleted.receipt.costStatus, 'incomplete');
await assert.rejects(quoteApi.createLocalSaleQuote(promotedCart));
assert.equal(sql.prepare('SELECT COUNT(*) total FROM ingredients').get().total, 0);
quoteApi.releaseLocalSaleQuote(deletedQuote.id);
sql.close();
console.log('Payment quotes preserve trusted prices/recipes across edits, use fresh costs, reject changed carts, and cannot be changed through display data.');
