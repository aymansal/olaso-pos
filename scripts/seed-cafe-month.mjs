// Development-only, additive review data. Never resets staff identities or app storage.
// OLASO_OWNER_PIN must be supplied transiently; never put it in a command example or file.
// node --env-file=.env.local scripts/seed-cafe-month.mjs --confirm-development
import assert from 'node:assert/strict';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import { resolveProductConfiguration } from '../src/lib/productConfiguration.ts';
import { consumeValuation } from '../src/lib/costs.ts';

assert.equal(process.env.CONVEX_DEPLOYMENT, 'dev:colorful-newt-937', 'Development deployment required');
assert.equal(process.env.VITE_CONVEX_URL, 'https://colorful-newt-937.eu-west-1.convex.cloud');
assert(process.argv.includes('--confirm-development'), 'Explicit development acknowledgement required');
assert(/^\d{6}$/.test(process.env.OLASO_OWNER_PIN ?? ''), 'Owner PIN required');
const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL);
const deviceId = 'olaso-cafe-history';
const runId = 'cafe-month-2026-09-v1';
const fromDate = '2026-08-22';
const toDate = '2026-09-20';
const profiles = await client.query(api.identity.listActiveProfiles, { deviceId });
const owner = profiles.find((profile) => profile.role === 'owner' && profile.name === 'Olaso Owner');
assert(owner, 'Expected owner profile is missing');
const auth = await client.action(api.identity.signIn, {
  deviceId, staffProfileId: owner.id, pin: process.env.OLASO_OWNER_PIN,
});
delete process.env.OLASO_OWNER_PIN;
assert.equal(auth.kind, 'authenticated', 'Owner sign-in failed');
const session = { deviceId, sessionToken: auth.token };
const mutate = (fn, args) => client.mutation(fn, { ...session, ...args });
const snapshot = () => client.query(api.sync.getOperationalSnapshot, session);
let catalog = await snapshot();
const ingredient = (name) => {
  const row = catalog.ingredients.find((item) => item.name === name);
  assert(row, `Missing ingredient: ${name}`);
  return row;
};
const milk = ingredient('Whole milk');
const oat = ingredient('Oat milk');
const beans = ingredient('Coffee beans');
const vanilla = ingredient('Vanilla syrup');
const caramel = ingredient('Caramel syrup');
const milkProducts = catalog.products.filter((product) => product.status === 'active'
  && catalog.recipeItems.some((item) => item.recipeVersionId === product.currentRecipeVersionId
    && item.ingredientId === milk.id));

for (const product of milkProducts) {
  let large = catalog.productSizes.find((size) => size.productId === product.id && size.key === 'large');
  if (!large) {
    const saved = await mutate(api.productConfiguration.saveSize, {
      productId: product.id, key: 'large', name: 'Large', priceCentimes: product.priceCentimes + 600,
      sortOrder: 1, isDefault: false, status: 'active', clientMutationId: `${runId}:size:${product.key}`,
    });
    large = { id: saved.id };
  }
  const items = catalog.recipeItems.filter((item) => item.recipeVersionId === product.currentRecipeVersionId);
  const largeQuantities = items.map((item) => ({ ingredientId: item.ingredientId,
    productSizeId: large.id, quantity: ingredientById(item.ingredientId).baseUnit === 'piece'
      ? item.quantity : Math.round(item.quantity * 1.4) }));
  if (!catalog.recipeSizeQuantities.some((row) => row.recipeVersionId === product.currentRecipeVersionId
    && row.productSizeId === large.id)) {
    await mutate(api.recipes.saveVersion, {
      productId: product.id, expectedProductRevision: product.revision,
      clientMutationId: `${runId}:recipe:${product.key}`,
      activationAt: Date.parse(`${fromDate}T06:00:00+01:00`),
      items: items.map(({ ingredientId, quantity }) => ({ ingredientId, quantity })),
      sizeQuantities: largeQuantities,
    });
  }
  const milkQuantity = items.find((item) => item.ingredientId === milk.id).quantity;
  await section(product, 'milk', 'Milk', true, [
    choice('whole-milk', 'Whole milk', 0, [], true),
    choice('oat-milk', 'Oat milk', 500, [{ effectType: 'replace', ingredientId: milk.id,
      replacementIngredientId: oat.id, quantity: milkQuantity, sortOrder: 0,
      sizeQuantities: [{ productSizeId: large.id, quantity: Math.round(milkQuantity * 1.4) }] }]),
  ]);
  await section(product, 'extras', 'Extras', false, [
    choice('extra-shot', 'Extra espresso shot', 500, [effect(beans.id, 9)]),
    choice('vanilla', 'Vanilla syrup', 300, [effect(vanilla.id, 15)]),
    choice('caramel', 'Caramel syrup', 300, [effect(caramel.id, 15)]),
  ]);
}
for (const product of catalog.products.filter((p) => ['espresso', 'americano', 'cold-brew'].includes(p.key))) {
  await section(product, 'extras', 'Extras', false, [
    choice('extra-shot', 'Extra espresso shot', 500, [effect(beans.id, 9)]),
  ]);
}
for (const product of catalog.products.filter((p) => ['butter-croissant', 'brioche'].includes(p.key))) {
  await section(product, 'serving', 'Serving', true, [
    choice('as-is', 'As is', 0, [], true), choice('warmed', 'Warmed', 0, []),
  ]);
}
catalog = await snapshot();
console.log(`Catalog ready: ${milkProducts.length} drinks with two sizes and milk/extras choices.`);

function ingredientById(id) { return catalog.ingredients.find((row) => row.id === id); }
function effect(ingredientId, quantity) {
  return { effectType: 'add', ingredientId, quantity, sortOrder: 0, sizeQuantities: [] };
}
function choice(key, name, priceDeltaCentimes, effects, isDefaultSelected = false) {
  return { key, name, priceDeltaCentimes, effects, isDefaultSelected, sortOrder: 0,
    status: 'active', sizeRules: [] };
}
async function section(product, key, name, required, values) {
  if (catalog.productChoiceSections.some((row) => row.productId === product.id && row.key === key)) return;
  await mutate(api.productConfiguration.saveSection, {
    productId: product.id, key, name, selectionMode: required ? 'single' : 'multiple', required,
    minimumSelections: required ? 1 : 0, maximumSelections: required ? 1 : values.length,
    sortOrder: required ? 0 : 1, status: 'active', productSizeIds: [],
    clientMutationId: `${runId}:section:${product.key}:${key}`,
    values: values.map((value, sortOrder) => ({ ...value, sortOrder })),
  });
}
function resolve(product, sizeId, choiceValueIds) {
  return resolveProductConfiguration({ sizeId, choiceValueIds,
    sizes: catalog.productSizes.filter((row) => row.productId === product.id),
    recipeItems: catalog.recipeItems.filter((row) => row.recipeVersionId === product.currentRecipeVersionId),
    sizeQuantities: catalog.recipeSizeQuantities.filter((row) => row.recipeVersionId === product.currentRecipeVersionId),
    sections: catalog.productChoiceSections.filter((row) => row.productId === product.id),
    sectionSizeIds: catalog.productChoiceSectionSizes, values: catalog.productChoiceValues,
    valueSizes: catalog.productChoiceValueSizes, effects: catalog.productChoiceValueEffects,
    effectSizes: catalog.productChoiceValueEffectSizes });
}

// Fixed dates and repeatable choices make interrupted runs resumable without another month's sales.
let randomState = 9202026;
function random() { randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0; return randomState / 2 ** 32; }
const choose = (rows) => rows[Math.floor(random() * rows.length)];
const weightedDrinks = ['espresso', 'espresso', 'americano', 'cappuccino', 'cappuccino',
  'latte', 'latte', 'latte', 'mocha', 'iced-coffee-milk', 'cold-brew', 'flat-white',
  'caramel-mac', 'matcha-latte', 'hojicha-latte', 'lemonade'];
const productFor = (key) => {
  const product = catalog.products.find((row) => row.key === key && row.status === 'active');
  assert(product, `Required active product missing: ${key}`);
  return product;
};
function lineFor(key) {
  const product = productFor(key);
  const sizes = catalog.productSizes.filter((row) => row.productId === product.id && row.status === 'active');
  const size = random() < 0.28 ? (sizes.find((row) => row.key === 'large') ?? sizes[0]) : sizes.find((row) => row.isDefault);
  assert(size);
  const choiceValueIds = [];
  for (const section of catalog.productChoiceSections.filter((row) => row.productId === product.id && row.status === 'active')) {
    const values = catalog.productChoiceValues.filter((row) => row.sectionId === section.id && row.status === 'active');
    if (section.required) choiceValueIds.push((random() < 0.24 ? values[1] : values[0]).id);
    else if (random() < 0.3) choiceValueIds.push(choose(values).id);
  }
  return { product, sizeId: size.id, choiceValueIds, quantity: random() < 0.14 ? 2 : 1,
    resolved: resolve(product, size.id, choiceValueIds) };
}
const days = [];
let sequence = 1000;
for (let day = 0; day < 30; day++) {
  const date = new Date(Date.parse(`${fromDate}T12:00:00Z`) + day * 86400000).toISOString().slice(0, 10);
  const weekend = [0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay());
  const count = 24 + Math.floor(random() * 13) + (weekend ? 10 : 0);
  const orders = Array.from({ length: count }, (_, index) => {
    const lines = [lineFor(choose(weightedDrinks))];
    if (random() < 0.42) lines.push(lineFor(choose(['butter-croissant', 'brioche'])));
    if (random() < 0.24) lines.push(lineFor(choose(weightedDrinks)));
    const completedAt = Date.parse(`${date}T08:00:00+01:00`)
      + Math.floor(((index + random() * 0.7) / count) * (day === 29 ? 8 : 13) * 3600000);
    assert(completedAt < Date.now(), 'History must not contain future sales');
    return { localSaleId: `${runId}:${date}:${index}`, receiptNumber: `${date.slice(5, 7)}26-${++sequence}`,
      businessDate: date, completedAt, lines, paymentMethod: random() < 0.72 ? 'Cash' : 'Card',
      split: random() < 0.08, serviceMode: random() < 0.67 ? 'dine-in' : 'take-away' };
  });
  days.push({ date, orders });
}
async function existingOrders() {
  const rows = [];
  let cursor;
  for (let page = 0; page < 250; page++) {
    const result = await client.query(api.sales.listOrders, { ...session, limit: 20, ...(cursor ? { cursor } : {}) });
    rows.push(...result.page);
    if (result.isDone || result.page.at(-1)?.businessDate < fromDate) return rows;
    cursor = result.continueCursor;
  }
  throw Error('Review history exceeds the bounded 5,000-order scan');
}
const existing = await existingOrders();
const saved = new Set(existing.filter((row) => row.deviceId === deviceId).map((row) => row.localSaleId));
const initialReport = await client.query(api.reports.getSummary, { ...session, fromDate, toDate });
let inserted = 0;
let addedRevenue = 0;
let addedCost = 0;
let lastSubmission;
for (const { date, orders } of days) {
  const pending = orders.filter((order) => !saved.has(order.localSaleId));
  if (!pending.length) continue;
  catalog = await snapshot();
  const usage = new Map();
  for (const order of pending) for (const line of order.lines) for (const [id, quantity] of line.resolved.ingredients) {
    usage.set(id, (usage.get(id) ?? 0) + quantity * line.quantity);
  }
  for (const [id, amount] of usage) {
    let stock = ingredientById(id);
    if (stock.costStatus !== 'complete' && stock.currentStockQuantity !== 0) {
      await mutate(api.inventory.recordAdjustment, { ingredientId: id, mode: 'set-count', quantity: 0,
        reason: 'Opening stock count', expectedRevision: stock.revision, businessDate: date,
        clientMutationId: `${runId}:opening:${id}` });
      catalog = await snapshot();
      stock = ingredientById(id);
    }
    if (stock.currentStockQuantity < amount + stock.lowStockThreshold) {
      const pack = stock.baseUnit === 'piece' ? 12 : 1000;
      const unitCost = stock.currentStockQuantity > 0 && stock.inventoryValueCentimes !== undefined
        ? stock.inventoryValueCentimes / stock.currentStockQuantity : stock.baseUnit === 'piece' ? 500 : 2;
      await mutate(api.inventory.receivePurchase, { ingredientId: id,
        packageLabel: stock.baseUnit === 'piece' ? 'tray' : stock.baseUnit === 'gram' ? '1 kg bag' : '1 L bottle',
        packageCount: Math.ceil((amount + stock.lowStockThreshold - stock.currentStockQuantity) / pack),
        quantityPerPackage: pack, packagePriceCentimes: Math.max(1, Math.round(unitCost * pack)),
        receivedAt: Date.parse(`${date}T07:00:00+01:00`), businessDate: date,
        expectedRevision: stock.revision, clientMutationId: `${runId}:purchase:${date}:${id}` });
    }
  }
  catalog = await snapshot();
  for (const order of pending) {
    const valuations = new Map(catalog.ingredients.map((row) => [row.id, {
      quantity: row.currentStockQuantity, inventoryValueCentimes: row.inventoryValueCentimes,
      complete: row.costStatus === 'complete' }]));
    const totalUsage = new Map();
    let cost = 0;
    let total = 0;
    const lines = order.lines.map(({ product, sizeId, choiceValueIds, quantity, resolved }) => {
      let lineCost = 0;
      const valuationRevisions = [];
      for (const [id, perItem] of resolved.ingredients) {
        const amount = perItem * quantity;
        const consumed = consumeValuation(valuations.get(id), amount);
        assert(consumed.cost.complete, 'Every generated order must have known ingredient costs');
        valuations.set(id, consumed.next);
        lineCost += consumed.cost.costCentimes;
        totalUsage.set(id, (totalUsage.get(id) ?? 0) + amount);
        valuationRevisions.push({ ingredientId: id, revision: ingredientById(id).valuationRevision });
      }
      cost += lineCost;
      total += resolved.unitPriceCentimes * quantity;
      return { productId: product.id, productRevision: product.revision,
        recipeVersionId: product.currentRecipeVersionId, sizeId, choiceValueIds, quantity,
        costStatus: 'complete', ingredientCostCentimes: lineCost, valuationRevisions };
    });
    const cashDue = order.split ? Math.floor(total / 200) * 100 : total;
    const cashPaid = Math.ceil(cashDue / 1000) * 1000;
    const tenders = order.split ? [
      { paymentMethod: 'Cash', dueCentimes: cashDue, amountCentimes: cashPaid, changeCentimes: cashPaid - cashDue },
      { paymentMethod: 'Card', dueCentimes: total - cashDue, amountCentimes: total - cashDue, changeCentimes: 0 },
    ] : [{ paymentMethod: order.paymentMethod, dueCentimes: total,
      amountCentimes: order.paymentMethod === 'Cash' ? cashPaid : total,
      changeCentimes: order.paymentMethod === 'Cash' ? cashPaid - total : 0 }];
    const submission = { localSaleId: order.localSaleId, receiptNumber: order.receiptNumber,
      businessDate: order.businessDate, completedAt: order.completedAt,
      serviceMode: order.serviceMode, paymentMethod: order.split ? 'Cash' : order.paymentMethod,
      receiptLanguage: 'en', tenders, costStatus: 'complete', ingredientCostCentimes: cost, lines };
    const result = await mutate(api.sales.accept, submission);
    assert.equal(result.duplicate, false, 'Concurrent seed detected; rerun to refresh saved order IDs');
    // Server consumes each ingredient once per sale, which can round differently from individual lines.
    for (const [id, amount] of totalUsage) {
      const stock = ingredientById(id);
      const next = consumeValuation({ quantity: stock.currentStockQuantity,
        inventoryValueCentimes: stock.inventoryValueCentimes, complete: true }, amount).next;
      stock.currentStockQuantity = next.quantity;
      stock.inventoryValueCentimes = next.inventoryValueCentimes;
      stock.valuationRevision++;
      stock.revision++;
    }
    inserted++; addedRevenue += total; addedCost += cost; lastSubmission = submission;
  }
  console.log(`${date}: ${pending.length} orders saved`);
}

const finalOrders = (await existingOrders()).filter((row) => row.deviceId === deviceId && row.localSaleId.startsWith(runId));
const expected = days.flatMap((day) => day.orders);
assert.equal(finalOrders.length, expected.length);
assert.equal(new Set(finalOrders.map((row) => row.localSaleId)).size, expected.length);
assert.equal(new Set(finalOrders.map((row) => row.businessDate)).size, 30);
const expectedById = new Map(expected.map((order) => [order.localSaleId, order]));
for (const savedOrder of finalOrders) {
  const planned = expectedById.get(savedOrder.localSaleId);
  const receipt = savedOrder.receiptSnapshot;
  assert.equal(savedOrder.status, 'completed');
  assert.equal(receipt.lines.length, planned.lines.length);
  assert.equal(receipt.totalCentimes, planned.lines.reduce(
    (sum, line) => sum + line.resolved.unitPriceCentimes * line.quantity, 0));
  for (const [index, line] of receipt.lines.entries()) {
    const intended = planned.lines[index];
    assert.equal(line.productId, intended.product.id);
    assert.equal(line.sizeId, intended.sizeId);
    assert.equal(line.quantity, intended.quantity);
    assert.deepEqual([...(line.choiceValueIds ?? [])].sort(), [...intended.choiceValueIds].sort());
    assert(!/\b(mock|test|demo)\b/i.test(line.productName));
  }
}
if (lastSubmission) assert.equal((await mutate(api.sales.accept, lastSubmission)).duplicate, true);
const report = await client.query(api.reports.getSummary, { ...session, fromDate, toDate });
assert.equal(report.current.orderCount - initialReport.current.orderCount, inserted);
assert.equal(report.current.netCentimes - initialReport.current.netCentimes, addedRevenue);
assert.equal(report.current.ingredientCostCentimes - initialReport.current.ingredientCostCentimes, addedCost);
assert(report.daily.every((day) => day.netCentimes > 0));
const finalCatalog = await snapshot();
for (const row of finalCatalog.ingredients) {
  const local = ingredientById(row.id);
  assert.equal(row.currentStockQuantity, local.currentStockQuantity, `${row.name}: stock count`);
  assert.equal(row.inventoryValueCentimes, local.inventoryValueCentimes, `${row.name}: stock value`);
  assert(row.currentStockQuantity >= 0, `${row.name}: negative stock`);
}
assert.deepEqual((await client.query(api.identity.listActiveProfiles, { deviceId })).map((p) => [p.id, p.identityRevision]),
  profiles.map((p) => [p.id, p.identityRevision]), 'Staff credentials must remain unchanged');
console.log(JSON.stringify({ inserted, totalGeneratedOrders: finalOrders.length, fromDate, toDate,
  generatedRevenueCentimes: finalOrders.reduce((sum, row) => sum + row.receiptSnapshot.totalCentimes, 0),
  addedRevenueCentimes: addedRevenue, products: finalCatalog.products.length,
  sizes: finalCatalog.productSizes.length, choiceSections: finalCatalog.productChoiceSections.length,
  choices: finalCatalog.productChoiceValues.length, verified: '30 daily totals, revenue, costs, stock, credentials and retry protection' }, null, 2));
