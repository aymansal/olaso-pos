import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

// The one rule that keeps the Products list highlight, the selection and the editor in step
// with the displayed page. Exercised from the real source rather than re-implemented here.
const source = readFileSync(
  new URL('../src/features/products/ProductsScreen.tsx', import.meta.url),
  'utf8',
);
const from = source.indexOf('export function resolvePageSelection(');
const to = source.indexOf('export function ProductsScreen(');
assert(from > 0 && to > from, 'resolvePageSelection must be exported from ProductsScreen.tsx');
const resolvePageSelection = new Function(
  `${stripTypeScriptTypes(source.slice(from, to).replace(/^export /, ''))}; return resolvePageSelection;`,
)();

const page = (...ids) => ids.map((id) => ({ id }));
const firstPage = page('hojicha', 'matcha', 'caramel', 'flatWhite', 'icedCoffee', 'mocha', 'latte');
const secondPage = page('cappuccino', 'espresso', 'americano');

// Zero rows: the selection clears so the editor shows its existing empty state.
assert.equal(resolvePageSelection([], 'espresso'), undefined);
assert.equal(resolvePageSelection([], undefined), undefined);

// One row.
assert.equal(resolvePageSelection(page('only'), 'only'), 'only');
assert.equal(resolvePageSelection(page('only'), 'espresso'), 'only');
assert.equal(resolvePageSelection(page('only'), undefined), 'only');

// Many rows: a selection that is on the displayed page is retained.
for (const row of firstPage) assert.equal(resolvePageSelection(firstPage, row.id), row.id);

// Many rows: an off-page, unknown or absent selection takes the first displayed row.
assert.equal(resolvePageSelection(firstPage, 'espresso'), 'hojicha');
assert.equal(resolvePageSelection(firstPage, 'removed'), 'hojicha');
assert.equal(resolvePageSelection(firstPage, undefined), 'hojicha');

// Category switch: the previous category's product is not on the new category's page.
assert.equal(resolvePageSelection(secondPage, 'hojicha'), 'cappuccino');

// Page two: a selection that is on that page is kept, one from page one is replaced.
assert.equal(resolvePageSelection(secondPage, 'espresso'), 'espresso');
assert.equal(resolvePageSelection(secondPage, 'latte'), 'cappuccino');

// Dynamic categories: an empty new or Uncategorized page clears, a populated one selects.
assert.equal(resolvePageSelection([], 'espresso'), undefined);
assert.equal(resolvePageSelection(page('fresh'), undefined), 'fresh');
assert.equal(resolvePageSelection(page('fresh'), 'espresso'), 'fresh');

// Category change: the destination page's first row wins even when the previously selected
// product is also displayed there. This is the owner's All -> Coffee -> All and second-row
// Matcha counterexample: Coffee picked Caramel Mac, and returning to All must restart at All's
// first row instead of keeping Caramel Mac only because it is on the All page.
assert.equal(resolvePageSelection(firstPage, 'caramel', true), 'hojicha');
assert.equal(resolvePageSelection(firstPage, 'matcha', true), 'hojicha');
assert.equal(resolvePageSelection(firstPage, undefined, true), 'hojicha');

// ... and the same for a populated Uncategorized list, a new category and an empty destination.
assert.equal(resolvePageSelection(page('fresh', 'mocha'), 'fresh', true), 'fresh');
assert.equal(resolvePageSelection(page('fresh'), 'hojicha', true), 'fresh');
assert.equal(resolvePageSelection([], 'hojicha', true), undefined);

// The first row is the destination's own filtered and sorted first row, not the raw
// management.products order: with the current sort the page already reflects it.
const nameSorted = page('latte', 'mocha', 'caramel');
assert.equal(resolvePageSelection(nameSorted, 'caramel', true), 'latte');

// A category change that lands on page two still takes that page's first row, and an unchanged
// category (the default) still retains an on-page selection and its pagination behaviour.
assert.equal(resolvePageSelection(secondPage, 'espresso', true), 'cappuccino');
assert.equal(resolvePageSelection(firstPage, 'caramel'), 'caramel');
assert.equal(resolvePageSelection(secondPage, 'espresso'), 'espresso');

// Idempotent under a category change too, so the render-phase adjustment converges instead of
// looping and never leaves the list and the editor on different products for a committed frame.
for (const previous of ['caramel', 'hojicha', undefined, 'removed']) {
  const once = resolvePageSelection(firstPage, previous, true);
  assert.equal(resolvePageSelection(firstPage, once, true), once);
}

// Idempotent: resolving the result again returns the same product, so the render-phase
// adjustment converges instead of looping.
for (const selection of ['espresso', 'latte', undefined, 'removed']) {
  const once = resolvePageSelection(secondPage, selection);
  assert.equal(resolvePageSelection(secondPage, once), once);
}


// The editor half of the same synchronization: the values the form must show for the product
// that is selected, and the identity that decides when to re-seed. Exercised from the real
// component source as well.
const editorSource = readFileSync(
  new URL('../src/features/products/components/ProductEditorPanel/ProductEditorPanel.tsx', import.meta.url),
  'utf8',
);
const fromIdentity = editorSource.indexOf('export function productFormIdentity(');
const fromSeed = editorSource.indexOf('export function productFormSeed(');
const fromPanel = editorSource.indexOf('export function ProductEditorPanel(');
assert(
  fromIdentity > 0 && fromSeed > fromIdentity && fromPanel > fromSeed,
  'productFormIdentity and productFormSeed must be exported from ProductEditorPanel.tsx',
);
const productFormIdentity = new Function(
  `${stripTypeScriptTypes(editorSource.slice(fromIdentity, fromSeed).replace(/^export /, ''))}; return productFormIdentity;`,
)();
const productFormSeed = new Function(
  `${stripTypeScriptTypes(editorSource.slice(fromSeed, fromPanel).replace(/^export /, ''))}; return productFormSeed;`,
)();
const category = (id, status) => ({
  id, key: id, name: id, artworkKey: id, sortOrder: 10, status, revision: 1, productCount: 0,
});
const coffee = category('c1', 'active');
const retired = category('c2', 'archived');
const mocha = {
  id: 'p1', key: 'mocha', categoryId: 'c1', name: 'Mocha', receiptName: 'Mocha',
  basePriceCentimes: 2600, status: 'active', sortOrder: 10, revision: 1, updatedAt: 0,
  imageJpeg: 'data:image/jpeg;base64,AAA',
};

// A selected product seeds its own name, category, price, availability and photo.
const seeded = productFormSeed(mocha, undefined, [coffee]);
assert.equal(seeded.name, 'Mocha');
assert.equal(seeded.categoryId, 'c1');
assert.equal(seeded.priceMad, '26');
assert.equal(seeded.available, true);
assert.equal(seeded.imageJpeg, mocha.imageJpeg);

// Edge values keep the existing formatting and availability rules.
assert.equal(productFormSeed({ ...mocha, basePriceCentimes: 0 }, undefined, [coffee]).priceMad, '');
assert.equal(productFormSeed({ ...mocha, status: 'unavailable' }, undefined, [coffee]).available, false);

// With nothing selected the category falls back to the operator default, then the first active
// one, and the remaining fields are empty - the existing zero-row and new-product behaviour.
assert.equal(productFormSeed(undefined, 'c1', [coffee]).categoryId, 'c1');
assert.equal(productFormSeed(undefined, 'c2', [retired, coffee]).categoryId, 'c1');
assert.equal(productFormSeed(undefined, undefined, [retired]).categoryId, '');
const blank = productFormSeed(undefined, undefined, []);
assert.equal(blank.name, '');
assert.equal(blank.categoryId, '');
assert.equal(blank.priceMad, '');
assert.equal(blank.available, true);
assert.equal(blank.imageJpeg, undefined);

// Identity: an unrelated re-render must not re-seed (no draft loss), while a different product,
// revision, photo or default category must.
const identity = productFormIdentity(mocha, 'c1');
assert.equal(productFormIdentity(mocha, 'c1'), identity);
assert.notEqual(productFormIdentity({ ...mocha, id: 'p2' }, 'c1'), identity);
assert.notEqual(productFormIdentity({ ...mocha, revision: 2 }, 'c1'), identity);
assert.notEqual(productFormIdentity({ ...mocha, imageJpeg: 'data:image/jpeg;base64,BBB' }, 'c1'), identity);
assert.notEqual(productFormIdentity(mocha, 'c2'), identity);
assert.notEqual(productFormIdentity(undefined, 'c1'), identity);

console.log('Products page-selection and editor-seeding synchronization checks passed.');
