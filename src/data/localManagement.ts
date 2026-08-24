import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import {
  openLocalDatabase,
  withLocalTransaction,
} from './localDatabase.ts';
import {
  managementActor,
  managementExpectedRevision,
  managementIdentifier,
  managementOperationFromRow,
  managementOperationType,
  managementPayloadJson,
  managementPermission,
  managementTime,
  type LocalManagementActor,
  type ManagementPermission,
  type PendingLocalManagementOperation,
} from './managementOperation.ts';
import { listPendingOutboxFromDatabase } from './outbox.ts';

type ManagementDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;

export async function loadManagementOperationFromDatabase(
  database: ManagementDatabase,
  operationId: string,
) {
  const id = managementIdentifier(operationId, 'Operation ID');
  const result = await database.query(
    `SELECT operation_id, device_id, operation_type, local_record_id,
      depends_on_operation_id, required_permission, actor_profile_id,
      actor_name, actor_role, expected_revision, payload_json,
      cloud_record_id, created_at, acknowledged_at
     FROM management_operations
     WHERE operation_id = ? LIMIT 1`,
    [id],
  );
  const row = result.values?.[0];
  return row ? managementOperationFromRow(row) : undefined;
}

export async function enqueueManagementOperation(
  database: ManagementDatabase,
  input: {
    deviceId: string;
    operationType: string;
    localRecordId: string;
    dependsOnOperationId?: string;
    requiredPermission: ManagementPermission;
    actor: LocalManagementActor;
    expectedRevision?: number;
    payload: Record<string, unknown>;
    operationId?: string;
    createdAt?: number;
  },
  idFactory = () => crypto.randomUUID(),
) {
  const required = managementPermission(input.requiredPermission);
  const savedActor = managementActor(input.actor, required);
  const deviceId = managementIdentifier(input.deviceId, 'Device ID');
  const operationId = managementIdentifier(
    input.operationId ?? idFactory(),
    'Operation ID',
  );
  const type = managementOperationType(input.operationType);
  const localRecordId = managementIdentifier(
    input.localRecordId,
    'Local record ID',
  );
  const dependsOnOperationId = input.dependsOnOperationId
    ? managementIdentifier(input.dependsOnOperationId, 'Dependency operation ID')
    : undefined;
  if (dependsOnOperationId === operationId) {
    throw new Error('A management operation cannot depend on itself.');
  }
  const revision = managementExpectedRevision(input.expectedRevision);
  const serializedPayload = managementPayloadJson(input.payload);
  const createdAt = managementTime(
    input.createdAt ?? Date.now(),
    'Creation time',
  );
  const existing = await loadManagementOperationFromDatabase(
    database,
    operationId,
  );
  if (existing) {
    const same = existing.operationType === type
      && existing.deviceId === deviceId
      && existing.localRecordId === localRecordId
      && existing.dependsOnOperationId === dependsOnOperationId
      && existing.requiredPermission === required
      && existing.actor.staffProfileId === savedActor.staffProfileId
      && existing.actor.name === savedActor.name
      && existing.actor.role === savedActor.role
      && existing.expectedRevision === revision
      && JSON.stringify(existing.payload) === serializedPayload
      && (input.createdAt === undefined || existing.createdAt === createdAt);
    if (!same) {
      throw new Error('Operation ID is already used by another change.');
    }
    if (!existing.acknowledgedAt) {
      const pending = await database.query(
        'SELECT operation_id FROM outbox WHERE operation_id = ? LIMIT 1',
        [operationId],
      );
      if (!pending.values?.[0]) {
        throw new Error('Pending management operation is missing its outbox record.');
      }
    }
    return existing;
  }
  if (dependsOnOperationId) {
    const dependency = await database.query(
      `SELECT operation_id FROM outbox WHERE operation_id = ?
       UNION ALL
       SELECT operation_id FROM management_operations
       WHERE operation_id = ? AND acknowledged_at IS NOT NULL
       LIMIT 1`,
      [dependsOnOperationId, dependsOnOperationId],
    );
    if (!dependency.values?.[0]) {
      throw new Error('Management operation dependency is unavailable.');
    }
  }
  await database.run(
    `INSERT INTO management_operations
      (operation_id, device_id, operation_type, local_record_id,
       depends_on_operation_id, required_permission, actor_profile_id,
       actor_name, actor_role, expected_revision, payload_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      operationId,
      deviceId,
      type,
      localRecordId,
      dependsOnOperationId ?? null,
      required,
      savedActor.staffProfileId,
      savedActor.name,
      savedActor.role,
      revision ?? null,
      serializedPayload,
      createdAt,
    ],
    false,
  );
  await database.run(
    `INSERT INTO outbox
      (operation_id, device_id, operation_type, local_record_id,
       depends_on_operation_id, state, created_at, available_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [
      operationId,
      deviceId,
      type,
      localRecordId,
      dependsOnOperationId ?? null,
      createdAt,
      createdAt,
    ],
    false,
  );
  return (await loadManagementOperationFromDatabase(database, operationId))!;
}

export function createLocalManagementOperation(
  input: Parameters<typeof enqueueManagementOperation>[1],
) {
  return withLocalTransaction((database) =>
    enqueueManagementOperation(database, input),
  );
}

export async function listPendingManagementOperationsFromDatabase(
  database: ManagementDatabase,
  operationTypes: readonly string[],
  now = Date.now(),
  limit = 10,
) {
  const entries = await listPendingOutboxFromDatabase(
    database,
    now,
    limit,
    operationTypes.map(managementOperationType),
  );
  return Promise.all(entries.map(async (entry) => {
    const operation = await loadManagementOperationFromDatabase(
      database,
      entry.operationId,
    );
    if (!operation || operation.acknowledgedAt
        || operation.operationType !== entry.operationType
        || operation.localRecordId !== entry.localRecordId) {
      throw new Error('Pending management operation is invalid.');
    }
    return {
      ...operation,
      attemptCount: entry.attemptCount,
      ...(entry.lastError ? { lastError: entry.lastError } : {}),
      availableAt: entry.availableAt,
    } satisfies PendingLocalManagementOperation;
  }));
}

export async function acknowledgeManagementOperationInDatabase(
  database: ManagementDatabase,
  input: {
    operationId: string;
    cloudRecordId: string;
    acknowledgedAt: number;
  },
) {
  const operationId = managementIdentifier(input.operationId, 'Operation ID');
  const cloudRecordId = managementIdentifier(
    input.cloudRecordId,
    'Cloud record ID',
  );
  const acknowledgedAt = managementTime(
    input.acknowledgedAt,
    'Acknowledgement time',
  );
  const operation = await loadManagementOperationFromDatabase(
    database,
    operationId,
  );
  if (!operation) throw new Error('Management operation is unavailable.');
  if (operation.acknowledgedAt && operation.cloudRecordId !== cloudRecordId) {
    throw new Error('Management acknowledgement does not match the saved record.');
  }
  await database.run(
    `UPDATE management_operations
     SET cloud_record_id = ?, acknowledged_at = ?
     WHERE operation_id = ? AND acknowledged_at IS NULL`,
    [cloudRecordId, acknowledgedAt, operationId],
    false,
  );
  await database.run(
    'DELETE FROM outbox WHERE operation_id = ?',
    [operationId],
    false,
  );
  await database.run(
    `UPDATE sync_state SET last_success_at = ?, last_error = NULL WHERE id = 1`,
    [acknowledgedAt],
    false,
  );
  return operation.localRecordId;
}

export function acknowledgeManagementOperation(
  input: Parameters<typeof acknowledgeManagementOperationInDatabase>[1],
) {
  return withLocalTransaction((database) =>
    acknowledgeManagementOperationInDatabase(database, input),
  );
}

export async function recordManagementOperationFailureInDatabase(
  database: ManagementDatabase,
  input: {
    operationId: string;
    attemptCount: number;
    error: string;
    failedAt?: number;
  },
) {
  const operationId = managementIdentifier(input.operationId, 'Operation ID');
  if (!Number.isSafeInteger(input.attemptCount) || input.attemptCount < 0) {
    throw new Error('Management attempt count is invalid.');
  }
  const error = input.error.trim().slice(0, 500);
  if (!error) throw new Error('Management synchronization error is required.');
  const failedAt = managementTime(input.failedAt ?? Date.now(), 'Failure time');
  const operation = await loadManagementOperationFromDatabase(
    database,
    operationId,
  );
  if (!operation || operation.acknowledgedAt) {
    throw new Error('Pending management operation is unavailable.');
  }
  const availableAt = failedAt
    + Math.min(60_000, 1_000 * 2 ** Math.min(input.attemptCount, 6));
  await database.run(
    `UPDATE outbox
     SET state = 'failed', attempt_count = attempt_count + 1,
         last_error = ?, available_at = ?
     WHERE operation_id = ?`,
    [error, availableAt, operationId],
    false,
  );
  await database.run(
    `UPDATE sync_state SET last_error = ? WHERE id = 1`,
    [error],
    false,
  );
  return availableAt;
}

export function recordManagementOperationFailure(
  input: Parameters<typeof recordManagementOperationFailureInDatabase>[1],
) {
  return withLocalTransaction((database) =>
    recordManagementOperationFailureInDatabase(database, input),
  );
}

export async function listPendingManagementOperations(
  operationTypes: readonly string[],
  now = Date.now(),
  limit = 10,
) {
  return listPendingManagementOperationsFromDatabase(
    await openLocalDatabase(),
    operationTypes,
    now,
    limit,
  );
}
