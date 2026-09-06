import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { catalogQuoteFingerprint } from '../src/lib/catalogQuote.ts';

// Compile actual backend modules in memory; no deployment, filesystem output,
// production credentials or network requests. The fixture implements indexed eq.
async function backend(path) {
  const result = await build({ entryPoints: [path], bundle: true, write: false, format: 'esm', platform: 'browser' });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}
const { accept } = await backend('convex/sales.ts');
const { retainProductCatalog, resolveCatalogHistory, loadCatalogHistoryRows, historyQuote } = await backend('convex/lib/catalogHistory.ts');
const { saveSize, saveSection, removeSize } = await backend('convex/productConfiguration.ts');
const token = 'synthetic_offline_quote_test_token_1234567890';
const hash = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))).toString('base64');
function fixture() {
  let sequence = 0;
  const tables = new Map();
  const put = (table, value) => { const rows = tables.get(table) ?? []; tables.set(table, rows); rows.push(value); };
  put('products', { _id: 'p', _creationTime: 1, name: 'Coffee', receiptName: 'Coffee', key: 'coffee', categoryId: 'c', status: 'active', revision: 1, basePriceCentimes: 1000, currentRecipeVersionId: 'r' });
  put('categories', { _id: 'c', name: 'Coffee', status: 'active' });
  put('productSizes', { _id: 's', productId: 'p', key: 'regular', name: 'Regular', priceCentimes: 1000, sortOrder: 0, isDefault: true, status: 'active', revision: 1 });
  put('recipeVersions', { _id: 'r', productId: 'p', status: 'active', versionNumber: 1 });
  put('recipeItems', { _id: 'ri', recipeVersionId: 'r', ingredientId: 'i', quantity: 10 });
  put('ingredients', { _id: 'i', name: 'Beans', baseUnit: 'gram', status: 'active', currentStockQuantity: 100, inventoryValueCentimes: 1000, costStatus: 'complete', valuationRevision: 1, revision: 1 });
  put('staffProfiles', { _id: 'staff', name: 'Owner', role: 'owner', status: 'active' });
  put('staffIdentities', { _id: 'identity', staffProfileId: 'staff', credentialVersion: 1 });
  put('staffSessions', { _id: 'session', staffProfileId: 'staff', deviceId: 'test-device', tokenHash: hash, credentialVersion: 1 });
  const db = {
    async get(id) { return [...tables.values()].flat().find((row) => row._id === id) ?? null; },
    async insert(table, value) { const id = `${table}-${++sequence}`; put(table, { ...structuredClone(value), _id: id }); return id; },
    async patch(id, value) { const row = await this.get(id); assert(row, `Missing patch ${id}`); Object.assign(row, value); },
    async delete(id) { for (const rows of tables.values()) { const index = rows.findIndex((row) => row._id === id); if (index >= 0) rows.splice(index, 1); } },
    query(table) {
      const filters = [];
      const query = {
        withIndex(_name, callback) { const index = { eq(key, value) { filters.push([key, value]); return index; } }; callback?.(index); return query; },
        order() { return query; },
        async take(n) { return (tables.get(table) ?? []).filter((row) => filters.every(([key, value]) => row[key] === value)).slice(0, n); },
        async unique() { const rows = await query.take(2); assert(rows.length <= 1); return rows[0] ?? null; },
        async first() { return (await query.take(1))[0] ?? null; },
      }; return query;
    },
  };
  return { db, tables };
}
const argsFor = (fingerprint) => ({
  sessionToken: token, deviceId: 'test-device', localSaleId: 'sale-1', receiptNumber: '0926-0001',
  serviceMode: 'dine-in', paymentMethod: 'Cash', receiptLanguage: 'fr', businessDate: '2026-09-06',
  completedAt: Date.parse('2026-09-06T12:00:00Z'), costStatus: 'complete', ingredientCostCentimes: 200,
  tenders: [{ paymentMethod: 'Cash', dueCentimes: 1000, amountCentimes: 1000, changeCentimes: 0 },
    { paymentMethod: 'Card', dueCentimes: 1000, amountCentimes: 1000, changeCentimes: 0 }],
  lines: [{ productId: 'p', productRevision: 1, recipeVersionId: 'r', quantity: 2, sizeId: 's', choiceValueIds: [],
    costStatus: 'complete', ingredientCostCentimes: 200, valuationRevisions: [{ ingredientId: 'i', revision: 1 }], catalogQuoteFingerprint: fingerprint }],
});

for (const change of ['price', 'deleted-size', 'deleted-product', 'deleted-ingredient']) {
  const ctx = fixture();
  const original = historyQuote(await loadCatalogHistoryRows(ctx, 'p'));
  const fingerprint = await catalogQuoteFingerprint(original);
  await retainProductCatalog(ctx, 'p');
  await retainProductCatalog(ctx, 'p');
  assert.equal(ctx.tables.get('productCatalogHistory').length, 1);
  if (change === 'price') await ctx.db.patch('s', { priceCentimes: 1200, revision: 2 });
  if (change === 'deleted-size') await ctx.db.delete('s');
  if (change === 'deleted-product') await ctx.db.delete('p');
  if (change === 'deleted-ingredient') await ctx.db.delete('i');
  assert.equal(await catalogQuoteFingerprint(historyQuote(await resolveCatalogHistory(ctx, 'p', fingerprint))), fingerprint);
  const args = argsFor(fingerprint);
  if (change === 'deleted-ingredient') {
    delete args.ingredientCostCentimes; args.costStatus = 'incomplete';
    delete args.lines[0].ingredientCostCentimes; args.lines[0].costStatus = 'incomplete'; args.lines[0].valuationRevisions[0].revision = 0;
  }
  const result = await accept._handler(ctx, args);
  assert.equal(ctx.tables.get('sales')[0].totalCentimes, 2000);
  assert.equal(ctx.tables.get('sales')[0].receiptSnapshot.receiptLanguage, 'fr');
  assert.equal(ctx.tables.get('stockMovements')[0].quantityDelta, -20);
  assert.equal((await accept._handler(ctx, args)).duplicate, true);
  assert.equal(ctx.tables.get('sales').length, 1);
  if (change === 'deleted-ingredient') {
    assert.equal(await ctx.db.get('i'), null);
    assert.equal(ctx.tables.get('stockMovements')[0].costDeltaCentimes, undefined);
  } else assert.equal((await ctx.db.get('i')).currentStockQuantity, 80);
  await assert.rejects(accept._handler(ctx, { ...args, sessionToken: 'invalid', localSaleId: 'another' }));
  assert(result.saleId);
}

const ctx = fixture();
const fingerprint = await catalogQuoteFingerprint(historyQuote(await loadCatalogHistoryRows(ctx, 'p')));
await saveSize._handler(ctx, { sessionToken: token, deviceId: 'test-device', id: 's', productId: 'p', key: 'regular', name: 'Regular', priceCentimes: 1200, sortOrder: 0, isDefault: true, status: 'active', expectedRevision: 1, clientMutationId: 'price-change' });
assert.equal(ctx.tables.get('productCatalogHistory')[0].fingerprint, fingerprint);
await accept._handler(ctx, argsFor(fingerprint));
const forged = argsFor('0'.repeat(64)); forged.localSaleId = 'forged';
await assert.rejects(accept._handler(ctx, forged), /could not be verified/);
const badTotal = argsFor(fingerprint); badTotal.localSaleId = 'bad-total'; badTotal.tenders[1].dueCentimes = 1100; badTotal.tenders[1].amountCentimes = 1100;
await assert.rejects(accept._handler(ctx, badTotal), /do not add up/);

const choiceCtx = fixture();
const sectionId = await choiceCtx.db.insert('productChoiceSections', { productId: 'p', key: 'milk', name: 'Milk', selectionMode: 'single', required: false, minSelections: 0, maxSelections: 1, sortOrder: 0, status: 'active', revision: 1 });
const valueId = await choiceCtx.db.insert('productChoiceValues', { sectionId, key: 'less', name: 'Less milk', priceDeltaCentimes: -100, isDefaultSelected: false, sortOrder: 0, status: 'active', revision: 1 });
const choiceFingerprint = await catalogQuoteFingerprint(historyQuote(await loadCatalogHistoryRows(choiceCtx, 'p')));
await saveSection._handler(choiceCtx, { sessionToken: token, deviceId: 'test-device', id: sectionId, productId: 'p', key: 'milk', name: 'Milk', selectionMode: 'single', required: false, minimumSelections: 0, maximumSelections: 1, sortOrder: 0, status: 'active', productSizeIds: [], values: [], expectedRevision: 1, clientMutationId: 'replace-choices' });
assert.equal(await choiceCtx.db.get(valueId), null);
const choiceArgs = argsFor(choiceFingerprint);
choiceArgs.lines[0].choiceValueIds = [valueId];
choiceArgs.tenders.forEach((row) => { row.dueCentimes = 900; row.amountCentimes = 900; });
await accept._handler(choiceCtx, choiceArgs);
assert.equal(choiceCtx.tables.get('sales')[0].totalCentimes, 1800);
assert.equal(choiceCtx.tables.get('sales')[0].receiptSnapshot.lines[0].modifiers[0].priceDeltaCentimes, -100);

const liveCtx = fixture();
const liveFingerprint = await catalogQuoteFingerprint(historyQuote(await loadCatalogHistoryRows(liveCtx, 'p')));
await accept._handler(liveCtx, argsFor(liveFingerprint));
assert.equal(liveCtx.tables.get('productCatalogHistory'), undefined);
const removeCtx = fixture();
await removeSize._handler(removeCtx, { sessionToken: token, deviceId: 'test-device', id: 's', expectedRevision: 1, clientMutationId: 'remove-size' });
assert.equal(removeCtx.tables.get('productCatalogHistory')[0].fingerprint, liveFingerprint);
console.log('Catalog history: actual authorized mutation/archive + old-price sale, deletions, unknown cost, retry, auth and forged quote rejection passed.');
