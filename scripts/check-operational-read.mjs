import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { serializeLocalTransaction } from '../src/data/localDatabase.ts';

// Exercise the production reader with a controllable bridge, not a second reader.
const source = readFileSync(new URL('../src/data/operationalCache.ts', import.meta.url), 'utf8');
const readerSource = stripTypeScriptTypes(source.slice(source.indexOf('export async function loadOperationalCache('))).replace('export ', '');
let status = 'active';
let reads = 0;
const database = {
  async query(sql) {
    reads += 1;
    return { values: /FROM products\s/.test(sql) ? [{
      id: 'coffee', key: 'coffee', name: 'Coffee', receipt_name: 'Coffee',
      price_centimes: 1000, status, sort_order: 0, revision: 1, updated_at: 1,
    }] : [] };
  },
};
const load = new Function('openLocalDatabase', 'serializeLocalTransaction', 'LIMITS', 'parseIngredientEffects',
  `${readerSource}; return loadOperationalCache;`)(
  async () => database, serializeLocalTransaction, new Proxy({}, { get: () => 1000 }), JSON.parse,
);

let releaseWrite;
const writeGate = new Promise((resolve) => { releaseWrite = resolve; });
const replacement = serializeLocalTransaction(async () => {
  // replaceOperationalCache archives rows before upserting the complete cloud snapshot.
  status = 'archived';
  await writeGate;
  status = 'active';
});
await Promise.resolve();
const reading = load();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(reads, 0, 'A screen must not read the replacement transaction halfway through.');
releaseWrite();
await replacement;
assert.equal((await reading).products[0].status, 'active');

// Checkout owns its transaction and supplies its connection: never queue recursively.
const nestedRead = serializeLocalTransaction(async () => load(database));
assert.equal((await nestedRead).products.length, 1);
await assert.rejects(serializeLocalTransaction(async () => { throw new Error('rolled back'); }), /rolled back/);
assert.equal((await load()).products.length, 1, 'A failed writer must not poison future reads.');
console.log('Operational reads wait for complete writes; explicit transaction reads do not deadlock.');
