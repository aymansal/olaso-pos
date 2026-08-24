import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import {
  insertLocalStaffOperation,
  validateStaffCreation,
} from '../src/data/localStaff.ts';
import { offlineCredentialKeys } from '../src/data/offlineCredentials.ts';
import { localMigrations } from '../src/data/schema.ts';

const database = new DatabaseSync(':memory:');
database.exec('PRAGMA foreign_keys = ON');
for (const migration of localMigrations) {
  for (const statement of migration.statements) database.exec(statement);
}
const adapter = {
  query(statement, values = []) {
    return { values: database.prepare(statement).all(...values) };
  },
  run(statement, values = []) {
    return database.prepare(statement).run(...values);
  },
};
const transaction = async (operation) => {
  database.exec('BEGIN');
  try {
    const result = await operation(adapter);
    database.exec('COMMIT');
    return result;
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
};
database.prepare(`INSERT INTO staff_profiles
  (id, name, role, status, revision, updated_at, identity_revision)
  VALUES ('owner-local', 'Owner', 'owner', 'active', 1, 1, 1)`).run();
database.prepare(`INSERT INTO staff_profiles
  (id, name, role, status, revision, updated_at, identity_revision)
  VALUES ('manager-local', 'Manager', 'manager', 'active', 1, 1, 1)`).run();
const owner = {
  deviceId: 'tablet-local',
  actor: { staffProfileId: 'owner-local', name: 'Owner', role: 'owner' },
};
const manager = {
  deviceId: 'tablet-local',
  actor: { staffProfileId: 'manager-local', name: 'Manager', role: 'manager' },
};

assert.deepEqual(validateStaffCreation({
  name: '  Local Cashier  ', role: 'cashier', pin: '123456', confirmPin: '123456',
}), { name: 'Local Cashier', role: 'cashier', pin: '123456' });
assert.throws(() => validateStaffCreation({
  name: 'Mismatch', role: 'cashier', pin: '123456', confirmPin: '654321',
}), /does not match/);

const created = await transaction((db) => insertLocalStaffOperation(db, owner, {
  localId: 'staff:local-cashier',
  operationId: 'staff-operation-create',
  name: 'Local Cashier',
  role: 'cashier',
  createdAt: 10,
}));
assert.equal(created.pending, true);
const profile = database.prepare(
  `SELECT name, role, status, identity_revision FROM staff_profiles WHERE id = ?`,
).get(created.id);
assert.deepEqual({ ...profile }, {
  name: 'Local Cashier', role: 'cashier', status: 'active', identity_revision: 0,
});
const operation = database.prepare(
  `SELECT operation_type, required_permission, actor_role, payload_json
   FROM management_operations WHERE operation_id = ?`,
).get(created.operationId);
assert.equal(operation.operation_type, 'management.staff.create');
assert.equal(operation.required_permission, 'staff');
assert.equal(operation.actor_role, 'owner');
assert.deepEqual(JSON.parse(operation.payload_json), {
  name: 'Local Cashier', role: 'cashier',
});
assert.doesNotMatch(operation.payload_json, /pin|password|secret|token/i);
assert.equal(database.prepare(
  `SELECT COUNT(*) count FROM outbox WHERE operation_type = 'management.staff.create'`,
).get().count, 1);

await assert.rejects(
  transaction((db) => insertLocalStaffOperation(db, manager, {
    localId: 'staff:denied', operationId: 'staff-operation-denied',
    name: 'Denied', role: 'cashier', createdAt: 11,
  })),
  /cannot make this change/,
);
assert.equal(database.prepare(
  `SELECT COUNT(*) count FROM staff_profiles WHERE id = 'staff:denied'`,
).get().count, 0);
database.close();

const keys = offlineCredentialKeys('staff:local-cashier');
assert.equal(new Set(Object.values(keys)).size, 4);
assert.ok(keys.provisioning.endsWith('.provisioning_credential'));
const identitySession = readFileSync('src/data/identitySession.ts', 'utf8');
const lock = readFileSync('src/features/settings/LockScreen.tsx', 'utf8');
const worker = readFileSync('src/data/reconnectContext.tsx', 'utf8');
const cache = readFileSync('src/data/operationalCache.ts', 'utf8');
const staffSync = readFileSync('src/data/staffSync.ts', 'utf8');
const identity = readFileSync('convex/identity.ts', 'utf8');
const identityInternal = readFileSync('convex/identityInternal.ts', 'utf8');
const settingsNav = readFileSync(
  'src/features/settings/components/SettingsNavigationPanel/SettingsNavigationPanel.tsx',
  'utf8',
);
const staffPanelStyles = readFileSync(
  'src/features/settings/components/StaffAccessPanel/StaffAccessPanel.module.css',
  'utf8',
);
assert.match(identitySession, /savePendingStaffSession/);
assert.match(identitySession, /loadPendingStaffCredential/);
assert.match(identitySession, /saveProvisionedStaffSession/);
assert.doesNotMatch(identitySession, /writeSecureSessionValue\(keys\.provisioning, pin\)/);
assert.match(lock, /isPendingStaffSession/);
assert.match(lock, /pendingLocal/);
assert.ok(
  worker.indexOf('const staffResult = await syncPendingStaffOperations')
    < worker.indexOf('const remoteProfiles = await convex.query'),
);
assert.match(cache, /management\.staff\.create/);
assert.match(staffSync, /loadPendingStaffCredential/);
assert.match(staffSync, /saveProvisionedStaffSession/);
assert.doesNotMatch(staffSync, /\bsignIn\b/);
assert.match(identity, /export const createStaff = action/);
assert.doesNotMatch(identity.match(/export const createStaff[\s\S]*?export const checkSession/)?.[0] ?? '', /\bpin:\s*v\.string/);
assert.match(identity, /pinHash: args\.pinHash/);
assert.match(identityInternal, /createStaffWithCredential/);
assert.doesNotMatch(identityInternal, /\bpin:\s*v\.string/);
assert.match(settingsNav, /id: 'staff', label: 'Staff & access'/);
assert.match(staffPanelStyles, /\.panel>header\{/);
assert.doesNotMatch(staffPanelStyles, /\.panel header\{/);

console.log('Local offline staff creation, PIN isolation, permission, and sync-boundary checks passed.');
