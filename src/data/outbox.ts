import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';
import type { SQLiteDBConnection } from '@capacitor-community/sqlite';

export const CONNECTION_SYNC_FAILURE =
  'Cloud connection failed. Check the connection and try again.';

export type PendingOutboxEntry = {
  operationId: string;
  deviceId: string;
  operationType: string;
  localRecordId: string;
  dependsOnOperationId?: string;
  attemptCount: number;
  lastError?: string;
  createdAt: number;
  availableAt: number;
};

type OutboxDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;

export async function listPendingOutboxFromDatabase(
  database: OutboxDatabase,
  now = Date.now(),
  limit = 25,
  operationTypes?: readonly string[],
): Promise<PendingOutboxEntry[]> {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new Error('Outbox limit must be an integer from 1 to 100.');
  }
  if (operationTypes && (
    operationTypes.length < 1
    || operationTypes.length > 20
    || operationTypes.some((value) => !/^[a-z][a-z0-9.-]{1,63}$/.test(value))
  )) {
    throw new Error('Outbox operation types are invalid.');
  }
  const typeFilter = operationTypes
    ? `AND candidate.operation_type IN (${operationTypes.map(() => '?').join(', ')})`
    : '';
  const result = await database.query(
    `SELECT operation_id, device_id, operation_type, local_record_id,
      depends_on_operation_id, attempt_count, last_error, created_at, available_at
     FROM outbox AS candidate
     WHERE candidate.state = 'pending' AND candidate.available_at <= ?
       ${typeFilter}
       AND (
         candidate.depends_on_operation_id IS NULL
         OR NOT EXISTS (
           SELECT 1 FROM outbox AS dependency
           WHERE dependency.operation_id = candidate.depends_on_operation_id
         )
       )
     ORDER BY candidate.created_at, candidate.rowid
     LIMIT ?`,
    [now, ...(operationTypes ?? []), limit],
  );
  return (result.values ?? []).map((row) => ({
    operationId: String(row.operation_id),
    deviceId: String(row.device_id),
    operationType: String(row.operation_type),
    localRecordId: String(row.local_record_id),
    dependsOnOperationId: row.depends_on_operation_id
      ? String(row.depends_on_operation_id)
      : undefined,
    attemptCount: Number(row.attempt_count),
    lastError: row.last_error ? String(row.last_error) : undefined,
    createdAt: Number(row.created_at),
    availableAt: Number(row.available_at),
  }));
}

export async function listPendingOutbox(
  now = Date.now(),
  limit = 25,
  operationTypes?: readonly string[],
) {
  return listPendingOutboxFromDatabase(
    await openLocalDatabase(),
    now,
    limit,
    operationTypes,
  );
}

export function recordOutboxFailure(
  operationId: string,
  error: string,
  availableAt: number,
) {
  if (!operationId.trim()) throw new Error('Operation ID is required.');
  if (!Number.isSafeInteger(availableAt) || availableAt < 0) {
    throw new Error('Outbox retry time must be a non-negative integer.');
  }
  return withLocalTransaction((database) =>
    database.run(
      `UPDATE outbox
       SET state = 'failed',
           attempt_count = attempt_count + 1,
           last_error = ?,
           available_at = ?
       WHERE operation_id = ?`,
      [error.trim().slice(0, 500), availableAt, operationId],
      false,
    ),
  );
}

export function acknowledgeOutbox(operationId: string) {
  if (!operationId.trim()) throw new Error('Operation ID is required.');
  return withLocalTransaction((database) =>
    database.run(
      'DELETE FROM outbox WHERE operation_id = ?',
      [operationId],
      false,
    ),
  );
}

export function makePendingOutboxAvailableInDatabase(database: OutboxDatabase) {
  return database.run(
    `UPDATE outbox
     SET state = 'pending', available_at = 0
     WHERE state IN ('pending', 'failed')`,
    [],
    false,
  );
}

export function makePendingOutboxAvailable() {
  return withLocalTransaction(makePendingOutboxAvailableInDatabase);
}

export function makeConnectivityFailuresAvailableInDatabase(
  database: OutboxDatabase,
) {
  return database.run(
    `UPDATE outbox
     SET state = 'pending', available_at = 0
     WHERE state = 'failed' AND last_error = ?`,
    [CONNECTION_SYNC_FAILURE],
    false,
  );
}

export function makeConnectivityFailuresAvailable() {
  return withLocalTransaction(makeConnectivityFailuresAvailableInDatabase);
}
