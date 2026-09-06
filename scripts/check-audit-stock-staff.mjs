import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { stripTypeScriptTypes } from 'node:module';
import { localMigrations } from '../src/data/schema.ts';
import { receiveLocalPurchase, recordLocalStockAdjustment, saveLocalIngredient } from '../src/data/localInventory.ts';
import { receiveValuation, valueStockIncrease } from '../src/lib/costs.ts';
import { withStaffCredentialLock } from '../src/data/staffCredentialQueue.ts';

// Isolated SQLite only. No tablet, protected store, network or cloud mutations.
const sql = new DatabaseSync(':memory:');
for (const migration of localMigrations) for (const statement of migration.statements) sql.exec(statement);
const db = {
  query: async (statement, values = []) => ({ values: sql.prepare(statement).all(...values) }),
  run: async (statement, values = []) => sql.prepare(statement).run(...values),
};
const transaction = async (operation) => {
  sql.exec('BEGIN');
  try { const result = await operation(db); sql.exec('COMMIT'); return result; }
  catch (error) { sql.exec('ROLLBACK'); throw error; }
};
sql.exec("INSERT INTO staff_profiles (id,name,role,status,revision,updated_at,identity_revision) VALUES ('audit-owner','Audit','owner','active',1,1,1)");
const actor = { deviceId: 'audit-tablet', actor: { staffProfileId: 'audit-owner', name: 'Audit', role: 'owner' } };
let sequence = 0;
async function fixture(quantity, value) {
  const item = await saveLocalIngredient(actor, { name: `Audit ${++sequence}`, baseUnit: 'gram', lowStockThreshold: 0, openingQuantity: 0 }, '2026-09-06', transaction);
  sql.prepare('UPDATE ingredients SET local_stock_delta=?,inventory_value_centimes=?,cost_status=? WHERE id=?')
    .run(quantity, value ?? null, value === undefined ? 'incomplete' : 'complete', item.id);
  return item;
}
const read = (id) => sql.prepare('SELECT current_stock_quantity+local_stock_delta quantity, inventory_value_centimes+local_inventory_value_delta value, cost_status status FROM ingredients WHERE id=?').get(id);
for (const added of [5, 10, 20]) {
  const item = await fixture(-10);
  await receiveLocalPurchase(actor, item, { packageLabel: 'Bag', packageCount: 1, quantityPerPackage: added, packagePriceCentimes: 100, businessDate: '2026-09-06' }, transaction);
  assert.equal(read(item.id).quantity, added - 10);
  assert.equal(read(item.id).status, added === 10 ? 'complete' : 'incomplete');
}
for (const target of [0, 10, 100]) {
  const item = await fixture(-10);
  await recordLocalStockAdjustment(actor, item, 'set-count', target, 'Physical count', '2026-09-06', transaction);
  assert.equal(read(item.id).quantity, target);
  assert.equal(read(item.id).status, 'incomplete');
}
for (const target of [15, 20, 30]) {
  const item = await fixture(10, 100);
  await recordLocalStockAdjustment(actor, item, 'set-count', target, 'Physical count', '2026-09-06', transaction);
  assert.deepEqual({ ...read(item.id) }, { quantity: target, value: target * 10, status: 'complete' });
}
assert.deepEqual(receiveValuation({ quantity: -10, complete: true, inventoryValueCentimes: 999 }, 20, 100), { quantity: 10, complete: false });
assert.equal(valueStockIncrease({ quantity: 3, inventoryValueCentimes: 100, complete: true }, 7), 233);
const cloudInventory = readFileSync('convex/inventory.ts', 'utf8');
assert.match(cloudInventory, /valueStockIncrease\(currentValuation, quantityDelta\)/);
assert.match(cloudInventory, /'Resulting stock quantity',\s*-MAX_PACKAGE_QUANTITY/);

// Execute the actual hook action with isolated credential/network dependencies.
const staffSource = readFileSync('src/data/useStaffManagement.ts', 'utf8');
const actionSource = staffSource.slice(staffSource.indexOf('const changePin ='), staffSource.indexOf('\n  return {', staffSource.indexOf('const changePin =')));
const compile = (source) => stripTypeScriptTypes(source);
let profile = { id: 'staff:pending', pending: true, identityRevision: 0 };
const staleProfile = { ...profile };
let mapped = profile.id;
let cloudPin = 'old-derived';
let protectedPin = cloudPin;
let message = '';
let cloudCalls = 0;
const dependencies = {
  setError: () => {}, setMessage: (value) => { message = value; },
  createStaffPinCredential: async () => ({ pinSalt: 'fixture', pinHash: 'new-derived' }),
  validateStaffPin: () => 'fixture', withStaffCredentialLock,
  resolveCloudRecordId: async () => mapped,
  loadLocalStaffProfiles: async () => [profile],
  session: { token: 'fixture', deviceId: 'fixture' },
  updateStaffPin: async (input) => { assert.equal(input.staffProfileId, 'cloud-profile'); cloudCalls++; cloudPin = input.pinHash; return { identityRevision: 2 }; },
  saveUpdatedStaffPin: async (id, credential) => { assert.equal(id, mapped); protectedPin = credential.pinHash; },
  saveStaffIdentityRevision: async () => {}, clearStaffSession: async () => {}, reload: async () => {},
};
const changePin = new Function(...Object.keys(dependencies), `${compile(actionSource)}\nreturn changePin;`)(...Object.values(dependencies));
let release;
const gate = new Promise((resolve) => { release = resolve; });
const provisioning = withStaffCredentialLock(async () => {
  await gate;
  mapped = 'cloud-profile';
  profile = { id: mapped, pending: false, identityRevision: 1 };
});
const changing = changePin(staleProfile, {});
await new Promise((resolve) => setImmediate(resolve));
assert.equal(cloudCalls, 0);
release();
await Promise.all([provisioning, changing]);
assert.equal(cloudCalls, 1);
assert.equal(cloudPin, 'new-derived');
assert.equal(protectedPin, cloudPin);
assert.equal(message, 'PIN changed.');
assert.notEqual(cloudPin, 'old-derived');
// A rejected operation must release the queue, and stale dialogs stay resolvable.
await assert.rejects(withStaffCredentialLock(async () => { throw Error('fixture failure'); }));
await changePin(staleProfile, {});
assert.equal(cloudCalls, 2);
// Reverse ordering: a pending PIN change finishes before provisioning reads it.
mapped = 'staff:pending';
profile = { ...staleProfile };
cloudPin = 'old-derived';
protectedPin = cloudPin;
await changePin(staleProfile, {});
await withStaffCredentialLock(async () => {
  cloudPin = protectedPin;
  mapped = 'cloud-profile';
  profile = { id: mapped, pending: false, identityRevision: 1 };
});
assert.equal(cloudCalls, 2, 'Pending edit must not call a cloud ID prematurely.');
assert.equal(cloudPin, 'new-derived');
assert.equal(protectedPin, cloudPin);
assert.match(readFileSync('src/data/staffSync.ts', 'utf8'), /withStaffCredentialLock\(\(\) => syncPendingManagementOperations/);

// Execute the actual Settings sync callback with synthetic worker outcomes.
const settings = readFileSync('src/data/useSettingsData.ts', 'utf8');
const start = settings.indexOf('const syncNow = useCallback(async () => {');
const callback = settings.slice(start, settings.indexOf('}, [reconnect, refresh]);', start)) + '});';
for (const result of [
  { failed: 1, pendingChanges: true, refreshed: false },
  { failed: 0, pendingChanges: true, refreshed: true },
  { failed: 0, pendingChanges: false, refreshed: false },
  { failed: 0, pendingChanges: false, refreshed: true },
]) {
  let error = ''; let success = '';
  const run = new Function('useCallback','reconnect','refresh','setError','setMessage', `${callback}\nreturn syncNow;`)(
    (fn) => fn, { run: async () => result }, async () => ({ pendingSyncCount: 0 }),
    (value) => { error = value; }, (value) => { success = value; },
  );
  await run();
  const clean = !result.failed && !result.pendingChanges && result.refreshed;
  assert.equal(Boolean(success), clean);
  assert.equal(Boolean(error), !clean);
}
// A delayed staff snapshot must not erase a newer PIN revision. Execute the
// actual directory writer and snapshot upserts against the isolated database.
const cacheSource = readFileSync('src/data/operationalCache.ts', 'utf8');
const reconcileSource = cacheSource.slice(
  cacheSource.indexOf('export async function reconcileAuthenticatedStaffProfiles'),
  cacheSource.indexOf('\nfunction parseIngredientEffects'),
).replace('export ', '');
const reconcile = new Function('withLocalTransaction', 'LIMITS',
  `${compile(reconcileSource)}; return reconcileAuthenticatedStaffProfiles;`,
)(transaction, { staffProfiles: 100 });
const ownerProfile = { id: 'audit-owner', name: 'Audit', role: 'owner', revision: 1, identityRevision: 1 };
const targetProfile = { id: 'audit-staff', name: 'Staff', role: 'cashier', revision: 1, identityRevision: 2 };
sql.prepare("INSERT INTO staff_profiles(id,name,role,status,revision,updated_at,identity_revision) VALUES (?,?,?,'active',1,1,2)")
  .run(targetProfile.id, targetProfile.name, targetProfile.role);
const identityRevision = () => sql.prepare('SELECT identity_revision FROM staff_profiles WHERE id=?').get(targetProfile.id).identity_revision;
assert.deepEqual(await reconcile([ownerProfile, { ...targetProfile, identityRevision: 1 }], ownerProfile.id), []);
assert.equal(identityRevision(), 2);
assert.deepEqual(await reconcile([ownerProfile, targetProfile], ownerProfile.id), []);
assert.deepEqual(await reconcile([ownerProfile, { ...targetProfile, identityRevision: 3 }], ownerProfile.id), [targetProfile.id]);
assert.equal(identityRevision(), 3);
const saveProfileSource = cacheSource.slice(
  cacheSource.indexOf('export async function saveAuthenticatedStaffProfile'),
  cacheSource.indexOf('export async function reconcileAuthenticatedStaffProfiles'),
).replace('export ', '');
const saveProfile = new Function('withLocalTransaction',
  `${compile(saveProfileSource)}; return saveAuthenticatedStaffProfile;`,
)(transaction);
await saveProfile(targetProfile);
assert.equal(identityRevision(), 3);
const snapshotStaffSource = cacheSource.slice(
  cacheSource.indexOf('for (const staff of snapshot.staffProfiles)'),
  cacheSource.indexOf('for (const version of snapshot.recipeVersions)'),
);
await new Function('database', 'snapshot', `return (async () => { ${compile(snapshotStaffSource)} })();`)(
  db, { staffProfiles: [targetProfile], updatedAt: Date.now() },
);
assert.equal(identityRevision(), 3);
assert.deepEqual(await reconcile([ownerProfile], ownerProfile.id), [targetProfile.id], 'Missing staff must still invalidate protected access.');

// Authentication uses the same credential queue and refuses an obsolete
// response before replacing protected values. No real PIN/store/network used.
const lockSource = readFileSync('src/features/settings/LockScreen.tsx', 'utf8');
const unlockSource = lockSource.slice(lockSource.indexOf('async function unlock()'), lockSource.indexOf('\n  const locale ='));
let savedSessionRevision;
let unlocked = false;
let unlockError = '';
const unlockDependencies = {
  staffProfileId: targetProfile.id, pin: '123456', setUnlocking: () => {},
  setError: (value) => { unlockError = value; }, withStaffCredentialLock,
  loadStaffSession: async () => undefined, staff: [targetProfile],
  readSecureSessionNetworkStatus: async () => true,
  isPendingStaffSession: () => false, clearStaffSession: async () => {},
  verifyOfflinePin: async () => { throw Error('Unexpected offline path'); },
  signIn: async () => ({ ...targetProfile, staffProfileId: targetProfile.id, kind: 'authenticated' }),
  settings: { deviceId: 'audit-tablet' }, authoritativeStaff: undefined,
  reconcileAuthenticatedStaffProfiles: reconcile, saveAuthenticatedStaffProfile: saveProfile,
  loadLocalStaffProfiles: async () => [{ ...targetProfile, identityRevision: identityRevision() }],
  saveStaffSession: async (session) => { savedSessionRevision = session.identityRevision; },
  clearLegacyStaffSession: async () => {}, isServiceUnavailable: () => false,
  onUnlock: async () => { unlocked = true; }, unlockErrorMessage: (error) => error.message,
};
const unlock = new Function(...Object.keys(unlockDependencies), `${compile(unlockSource)}; return unlock;`)(...Object.values(unlockDependencies));
await unlock();
assert.equal(savedSessionRevision, undefined);
assert.equal(unlocked, false);
assert.match(unlockError, /identity changed/);
sql.prepare('UPDATE staff_profiles SET identity_revision=2 WHERE id=?').run(targetProfile.id);
await unlock();
assert.equal(savedSessionRevision, 2);
assert.equal(unlocked, true);

const reconnectSource = readFileSync('src/data/reconnectContext.tsx', 'utf8');
const directoryStart = reconnectSource.indexOf('await withStaffCredentialLock(async () => {');
const directoryBlock = reconnectSource.slice(directoryStart, reconnectSource.indexOf('\n\n      const settings', directoryStart));
let releaseDirectory;
const directoryGate = new Promise((resolve) => { releaseDirectory = resolve; });
const directoryEvents = [];
const directorySync = new Function('withStaffCredentialLock', 'convex', 'api', 'session', 'isStaffRole', 'reconcileAuthenticatedStaffProfiles', 'clearStaffSession',
  `return (async () => { ${compile(directoryBlock)} })();`,
)(withStaffCredentialLock, { query: async () => { directoryEvents.push('fetch'); await directoryGate; return [ownerProfile]; } },
  { identity: { listActiveProfiles: {} } }, { staffProfileId: ownerProfile.id }, () => true,
  async () => [targetProfile.id], async () => { directoryEvents.push('clear'); });
const queuedPin = withStaffCredentialLock(async () => { directoryEvents.push('new-pin'); });
await new Promise((resolve) => setImmediate(resolve));
assert.deepEqual(directoryEvents, ['fetch']);
releaseDirectory();
await Promise.all([directorySync, queuedPin]);
assert.deepEqual(directoryEvents, ['fetch', 'clear', 'new-pin']);
sql.close();
console.log('AUD-02/03/06/10: isolated stock recovery, PIN promotion ordering, and sync feedback passed.');
