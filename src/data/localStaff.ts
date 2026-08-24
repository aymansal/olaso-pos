import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { StaffRole } from './permissions.ts';
import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';
import {
  enqueueManagementOperation,
  latestPendingManagementOperationIdFromDatabase,
} from './localManagement.ts';
import {
  STAFF_MANAGEMENT_OPERATION_TYPES,
  type LocalManagementActor,
} from './managementOperation.ts';
import {
  clearStaffSession,
  savePendingStaffSession,
} from './identitySession.ts';

type Database = Pick<SQLiteDBConnection, 'query' | 'run'>;
type Context = { deviceId: string; actor: LocalManagementActor };

export type StaffCreationInput = {
  name: string;
  role: StaffRole;
  pin: string;
  confirmPin: string;
};

export type SavedStaffProfile = {
  id: string;
  name: string;
  role: StaffRole;
  revision: number;
  identityRevision: number;
  pending: boolean;
};

export function validateStaffCreation(input: StaffCreationInput) {
  const name = input.name.trim();
  if (!name || name.length > 100) throw new Error('Staff name is invalid.');
  if (!['owner', 'manager', 'cashier'].includes(input.role)) {
    throw new Error('Staff role is invalid.');
  }
  if (!/^\d{6}$/.test(input.pin)) throw new Error('PIN must contain six digits.');
  if (input.pin !== input.confirmPin) throw new Error('PIN confirmation does not match.');
  return { name, role: input.role, pin: input.pin };
}

export async function insertLocalStaffOperation(
  database: Database,
  context: Context,
  input: {
    localId: string;
    operationId: string;
    name: string;
    role: StaffRole;
    createdAt: number;
  },
) {
  const [existing, count] = await Promise.all([
    database.query(
      `SELECT 1 FROM staff_profiles
       WHERE status = 'active' AND lower(name) = lower(?) LIMIT 1`,
      [input.name],
    ),
    database.query(
      `SELECT COUNT(*) AS count FROM staff_profiles WHERE status = 'active'`,
    ),
  ]);
  if (existing.values?.[0]) throw new Error('A staff member with this name already exists.');
  if (Number(count.values?.[0]?.count ?? 0) >= 50) {
    throw new Error('Staff list has reached the 50-profile limit.');
  }
  await database.run(
    `INSERT INTO staff_profiles
      (id, name, role, status, revision, updated_at, identity_revision)
     VALUES (?, ?, ?, 'active', 1, ?, 0)`,
    [input.localId, input.name, input.role, input.createdAt],
    false,
  );
  const operation = await enqueueManagementOperation(database, {
    deviceId: context.deviceId,
    operationId: input.operationId,
    operationType: 'management.staff.create',
    localRecordId: input.localId,
    dependsOnOperationId: await latestPendingManagementOperationIdFromDatabase(
      database,
      STAFF_MANAGEMENT_OPERATION_TYPES,
    ),
    requiredPermission: 'staff',
    actor: context.actor,
    payload: { name: input.name, role: input.role },
    createdAt: input.createdAt,
  });
  return {
    id: input.localId,
    name: input.name,
    role: input.role,
    revision: 1,
    identityRevision: 0,
    pending: true,
    operationId: operation.operationId,
  };
}

export async function createLocalStaff(
  context: Context,
  input: StaffCreationInput,
) {
  const prepared = validateStaffCreation(input);
  const localId = `staff:${crypto.randomUUID()}`;
  const operationId = crypto.randomUUID();
  try {
    return await withLocalTransaction(async (database) => {
      const result = await insertLocalStaffOperation(database, context, {
        localId,
        operationId,
        name: prepared.name,
        role: prepared.role,
        createdAt: Date.now(),
      });
      await savePendingStaffSession(result, prepared.pin);
      return result;
    });
  } catch (error) {
    await clearStaffSession(localId).catch(() => undefined);
    throw error;
  }
}

export async function loadLocalStaffProfiles(): Promise<SavedStaffProfile[]> {
  const result = await (await openLocalDatabase()).query(
    `SELECT id, name, role, revision, identity_revision
     FROM staff_profiles WHERE status = 'active'
     ORDER BY name LIMIT 101`,
  );
  if ((result.values?.length ?? 0) > 100) {
    throw new Error('Saved staff exceeds the 100-profile limit.');
  }
  return (result.values ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    role: row.role as StaffRole,
    revision: Number(row.revision),
    identityRevision: Number(row.identity_revision),
    pending: String(row.id).startsWith('staff:'),
  }));
}

export async function cleanupAcknowledgedStaffProvisioning() {
  const result = await (await openLocalDatabase()).query(
    `SELECT local_record_id FROM local_cloud_mappings
     WHERE record_type = 'staff-profile'
       AND local_record_id <> cloud_record_id LIMIT 101`,
  );
  if ((result.values?.length ?? 0) > 100) {
    throw new Error('Saved staff mappings exceed the cleanup limit.');
  }
  await Promise.all((result.values ?? []).map((row) =>
    clearStaffSession(String(row.local_record_id))));
}
