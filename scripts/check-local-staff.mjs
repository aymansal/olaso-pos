import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import {
  insertLocalStaffOperation,
  deleteLocalStaff,
  validateStaffCreation,
  validateStaffPin,
} from '../src/data/localStaff.ts';
import { offlineCredentialKeys } from '../src/data/offlineCredentials.ts';
import { loadLocalCostManagementFromDatabase } from '../src/data/localCostViews.ts';
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
assert.equal(validateStaffPin({ pin: '654321', confirmPin: '654321' }), '654321');
assert.throws(() => validateStaffPin({ pin: '654321', confirmPin: '123456' }), /does not match/);

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
database.prepare(`INSERT INTO compensation_periods
  (id, staff_profile_id, monthly_amount_centimes, effective_start_month,
   revision, created_at)
  VALUES ('manager-wages', 'manager-local', 450000, '2026-08', 1, 1)`).run();
database.prepare(`INSERT INTO sales
  (local_sale_id, device_id, actor_profile_id, receipt_number, status,
   service_type, subtotal_centimes, tax_centimes, total_centimes, currency,
   business_date, receipt_snapshot_json, sync_state, created_at)
  VALUES ('manager-sale', 'tablet-local', 'manager-local', '0826-0101',
    'completed', 'take-away', 1000, 0, 1000, 'MAD', '2026-08-25',
    '{"lines":[]}', 'pending', 1)`).run();
database.prepare(`INSERT INTO outbox
  (operation_id, device_id, operation_type, local_record_id, state,
   created_at, available_at)
  VALUES ('manager-sale-operation', 'tablet-local', 'sale-completed',
    'manager-sale', 'pending', 2, 0)`).run();
await assert.rejects(
  deleteLocalStaff(owner, { id: 'owner-local', revision: 1 }, transaction),
  /profile you are using/,
);
await assert.rejects(
  deleteLocalStaff(manager, { id: created.id, revision: 1 }, transaction),
  /cannot make this change/,
);
const removed = await deleteLocalStaff(
  owner, { id: 'manager-local', revision: 1 }, transaction,
);
assert.equal(database.prepare(
  'SELECT COUNT(*) count FROM staff_profiles WHERE id = ?',
).get('manager-local').count, 0);
assert.deepEqual({ ...database.prepare(
  `SELECT staff_name_snapshot, staff_role_snapshot,
    monthly_amount_centimes FROM compensation_periods WHERE id = ?`,
).get('manager-wages') }, {
  staff_name_snapshot: 'Manager', staff_role_snapshot: 'manager',
  monthly_amount_centimes: 450000,
});
assert.equal(database.prepare(
  'SELECT depends_on_operation_id FROM outbox WHERE operation_id = ?',
).get(removed.operationId).depends_on_operation_id, 'manager-sale-operation');
const preservedCosts = await loadLocalCostManagementFromDatabase(
  adapter, '2026-08', 'owner',
);
assert.equal(preservedCosts.compensation[0]?.staffNameSnapshot, 'Manager');
assert.equal(preservedCosts.compensation[0]?.staffRoleSnapshot, 'manager');
assert.equal(preservedCosts.profitability?.compensationCentimes, 450000);
database.close();

const keys = offlineCredentialKeys('staff:local-cashier');
assert.equal(new Set(Object.values(keys)).size, 4);
assert.ok(keys.provisioning.endsWith('.provisioning_credential'));
const identitySession = readFileSync('src/data/identitySession.ts', 'utf8');
const secureSession = readFileSync('src/data/secureSession.ts', 'utf8');
const staffManagement = readFileSync('src/data/useStaffManagement.ts', 'utf8');
const lock = readFileSync('src/features/settings/LockScreen.tsx', 'utf8');
const worker = readFileSync('src/data/reconnectContext.tsx', 'utf8');
const cache = readFileSync('src/data/operationalCache.ts', 'utf8');
const staffSync = readFileSync('src/data/staffSync.ts', 'utf8');
const identity = readFileSync('convex/identity.ts', 'utf8');
const identityInternal = readFileSync('convex/identityInternal.ts', 'utf8');
const seed = readFileSync('convex/seed.ts', 'utf8');
const settingsScreen = readFileSync(
  'src/features/settings/SettingsScreen.tsx',
  'utf8',
);
const staffPanelStyles = readFileSync(
  'src/features/settings/components/StaffAccessPanel/StaffAccessPanel.module.css',
  'utf8',
);
const staffDialog = readFileSync(
  'src/features/settings/components/StaffDialog/StaffDialog.tsx',
  'utf8',
);
const staffPinDialog = readFileSync(
  'src/features/settings/components/StaffPinDialog/StaffPinDialog.tsx',
  'utf8',
);
assert.match(identitySession, /savePendingStaffSession/);
assert.match(identitySession, /loadPendingStaffCredential/);
assert.match(identitySession, /saveProvisionedStaffSession/);
assert.match(identitySession, /replaceSecureSessionValues/);
assert.match(secureSession, /nativeSecureSession\.replace/);
assert.ok(
  staffManagement.indexOf('await saveUpdatedStaffPin(')
    < staffManagement.indexOf('await saveStaffIdentityRevision('),
);
assert.match(staffManagement, /await clearStaffSession\(profile\.id\)/);
assert.doesNotMatch(identitySession, /writeSecureSessionValue\(keys\.provisioning, pin\)/);
assert.match(lock, /isPendingStaffSession/);
assert.match(lock, /pendingLocal/);
assert.ok(
  worker.indexOf('const staffResult = await syncPendingStaffOperations')
    < worker.indexOf('const remoteProfiles = await convex.query'),
);
assert.match(cache, /management\.staff\.create/);
assert.match(staffSync, /loadPendingStaffCredential/);
assert.match(staffSync, /loadStaffPreferredLanguage/);
assert.match(staffSync, /preferredLanguage/);
assert.match(staffSync, /saveProvisionedStaffSession/);
assert.doesNotMatch(staffSync, /\bsignIn\b/);
assert.match(identity, /export const createStaff = action/);
assert.match(identity, /export const updateStaffPin = action/);
assert.doesNotMatch(identity.match(/export const updateStaffPin[\s\S]*?export const listActiveProfiles/)?.[0] ?? '', /\bpin:\s*v\.string/);
assert.doesNotMatch(identity.match(/export const createStaff[\s\S]*?export const checkSession/)?.[0] ?? '', /\bpin:\s*v\.string/);
assert.match(identity, /pinHash: args\.pinHash/);
assert.match(identity, /preferredLanguage: args\.preferredLanguage/);
assert.match(identityInternal, /createStaffWithCredential/);
assert.match(identityInternal, /replaceCredentialAsOwner/);
assert.match(identityInternal, /keepCurrentOwner/);
assert.match(identityInternal, /attempts\.map\(\(attempt\) => ctx\.db\.delete/);
assert.match(identityInternal, /identity\.pinSalt !== args\.pinSalt/);
assert.match(identityInternal, /preferredLanguage: args\.preferredLanguage/);
assert.doesNotMatch(identityInternal, /\bpin:\s*v\.string/);
assert.match(seed, /if \(table === 'staffProfiles'\) continue/);
assert.match(seed, /const saved = existingStaff\.find/);
assert.match(seed, /OLASO_ALLOW_DESTRUCTIVE_DEV_RESET/);
assert.match(seed, /ERASE_DISPOSABLE_DEPLOYMENT/);
assert.match(settingsScreen, /StaffAccessPanel/);
assert.match(staffPanelStyles, /\.header \{/);
assert.doesNotMatch(staffPanelStyles, /\.panel header\{/);
for (const dialog of [staffDialog, staffPinDialog]) {
  assert.match(dialog, /savingRef\.current/);
  assert.match(dialog, /disabled=\{saving\}/);
}

console.log('Local offline staff creation, PIN isolation, permission, and sync-boundary checks passed.');
