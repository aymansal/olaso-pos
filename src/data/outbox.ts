import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';

export type PendingOutboxEntry = {
  operationId: string;
  deviceId: string;
  operationType: string;
  localRecordId: string;
  attemptCount: number;
  lastError?: string;
  createdAt: number;
  availableAt: number;
};

export async function listPendingOutbox(
  now = Date.now(),
  limit = 25,
): Promise<PendingOutboxEntry[]> {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new Error('Outbox limit must be an integer from 1 to 100.');
  }
  const database = await openLocalDatabase();
  const result = await database.query(
    `SELECT operation_id, device_id, operation_type, local_record_id,
      attempt_count, last_error, created_at, available_at
     FROM outbox
     WHERE available_at <= ?
     ORDER BY created_at
     LIMIT ?`,
    [now, limit],
  );
  return (result.values ?? []).map((row) => ({
    operationId: String(row.operation_id),
    deviceId: String(row.device_id),
    operationType: String(row.operation_type),
    localRecordId: String(row.local_record_id),
    attemptCount: Number(row.attempt_count),
    lastError: row.last_error ? String(row.last_error) : undefined,
    createdAt: Number(row.created_at),
    availableAt: Number(row.available_at),
  }));
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
