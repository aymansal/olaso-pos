import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import { localMigrations } from '../src/data/schema.ts';
import { OPERATIONAL_MANAGEMENT_OPERATION_TYPES } from '../src/data/managementOperation.ts';

const source = readFileSync('src/data/operationalCache.ts', 'utf8');
const replacement = stripTypeScriptTypes(source.slice(source.indexOf('export async function replaceOperationalCache('), source.indexOf('export async function saveAuthenticatedStaffProfile('))).replace('export ', '');
const local = readFileSync('src/data/localDatabase.ts', 'utf8');
const transaction = stripTypeScriptTypes(local.slice(local.indexOf('export function withLocalTransaction'), local.indexOf('export function serializeLocalTransaction'))).replace('export ', '');

for (const cancelAt of [0, 1, Infinity]) {
  const db = new DatabaseSync(':memory:');
  for (const m of localMigrations) for (const sql of m.statements) db.exec(sql);
  db.exec("INSERT INTO categories(id,key,name,sort_order,status,revision,updated_at) VALUES ('saved','saved','Saved',0,'active',1,1)");
  let writes = 0, committed = false, rolledBack = false;
  const adapter = {
    async beginTransaction() { db.exec('BEGIN'); },
    async commitTransaction() { db.exec('COMMIT'); committed = true; },
    async isTransactionActive() { return { result: db.isTransaction }; },
    async rollbackTransaction() { db.exec('ROLLBACK'); rolledBack = true; },
    async query(sql, args = []) { return { values: db.prepare(sql).all(...args) }; },
    async execute(sql) { db.exec(sql); },
    async run(sql, args = []) { db.prepare(sql).run(...args); writes++; },
  };
  const withLocalTransaction = new Function('serializeLocalTransaction', 'openLocalDatabase', 'persistLocalDatabase', `${transaction}; return withLocalTransaction;`)(op => op(), async () => adapter, async () => {});
  const replace = new Function('withLocalTransaction', 'assertBounded', 'OPERATIONAL_MANAGEMENT_OPERATION_TYPES', 'pruneStaleOperationalCatalog', `${replacement};return replaceOperationalCache;`)(withLocalTransaction, () => {}, OPERATIONAL_MANAGEMENT_OPERATION_TYPES, async () => {});
  const snapshot = Object.fromEntries([...replacement.matchAll(/snapshot\.(\w+)/g)].map(([, key]) => [key, []]));
  snapshot.updatedAt = 2;
  snapshot.categories = Array.from({ length: 100 }, (_, i) => ({ id: `new${i}`, key: `new${i}`, name: 'New', artworkKey: 'coffee', sortOrder: i, status: 'active', revision: 1 }));
  const check = () => { if (writes >= cancelAt) throw Error('Snapshot loading was cancelled.'); };
  if (Number.isFinite(cancelAt)) {
    await assert.rejects(replace(snapshot, check), /cancelled/);
    assert(rolledBack && !committed);
    assert.equal(writes, cancelAt, 'Stop between rows, not after the complete refresh');
    assert.deepEqual(db.prepare('SELECT id,status FROM categories').all().map(r => ({...r})), [{id:'saved',status:'active'}]);
  } else {
    await replace(snapshot, check);
    assert(committed && !rolledBack);
    assert.equal(db.prepare("SELECT COUNT(*) n FROM categories WHERE status='active'").get().n, 100);
  }
  db.close();
}
const worker = readFileSync('src/data/reconnectContext.tsx', 'utf8');
assert.match(worker, /const cloud = await convex\.query[\s\S]*?await withStaffCredentialLock\(async \(\) => \{\s*requireCurrentContext\(\);\s*await replaceOperationalCache/);
assert.match(worker, /\}, requireCurrentContext\);/);
const css = readFileSync('src/features/settings/LockScreen.module.css', 'utf8');
assert.match(css, /animation: lockReveal 180ms ease-out/);
assert.match(css, /prefers-reduced-motion: reduce[\s\S]*animation: none/);
console.log('Lock cancels queued and active refreshes with rollback; complete refresh still commits; fade respects reduced motion.');
