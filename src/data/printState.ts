import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { withLocalTransaction } from './localDatabase.ts';

type PrintDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;

export type SalePrintState = 'pending' | 'printed' | 'failed';

function saleId(value: string) {
  if (!value || value.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(value)) {
    throw new Error('The local sale ID is invalid.');
  }
  return value;
}

function timestamp(value: number) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error('The print attempt time is invalid.');
  }
  return value;
}

function count(value: number, label: string) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`The print ${label} is invalid.`);
  }
  return value;
}

function diagnostic(value: string, fallback: string, maximum: number) {
  const cleaned = value.trim().replace(/\s+/g, ' ') || fallback;
  return cleaned.slice(0, maximum);
}

async function assertSale(database: PrintDatabase, localSaleId: string) {
  const result = await database.query(
    'SELECT 1 AS found FROM sales WHERE local_sale_id = ? LIMIT 1',
    [localSaleId],
  );
  if (!result.values?.[0]) throw new Error('The saved sale is missing.');
}

function update(
  connection: PrintDatabase | undefined,
  operation: (database: PrintDatabase) => Promise<void>,
) {
  return connection ? operation(connection) : withLocalTransaction(operation);
}

export function recordSalePrintAttempt(
  localSaleId: string,
  attemptedAt = Date.now(),
  connection?: PrintDatabase,
) {
  const id = saleId(localSaleId);
  const at = timestamp(attemptedAt);
  return update(connection, async (database) => {
    await assertSale(database, id);
    await database.run(
      `UPDATE sales
       SET print_state = 'pending',
           print_attempt_count = print_attempt_count + 1,
           last_print_attempt_at = ?,
           last_print_error_code = NULL,
           last_print_error_message = NULL,
           last_print_bytes_written = NULL,
           last_print_total_ms = NULL
       WHERE local_sale_id = ?`,
      [at, id],
      false,
    );
  });
}

export function recordSalePrintSuccess(
  localSaleId: string,
  result: { bytesWritten: number; totalMs: number },
  connection?: PrintDatabase,
) {
  const id = saleId(localSaleId);
  const bytesWritten = count(result.bytesWritten, 'byte count');
  const totalMs = count(result.totalMs, 'duration');
  return update(connection, async (database) => {
    await assertSale(database, id);
    await database.run(
      `UPDATE sales
       SET print_state = 'printed',
           last_print_error_code = NULL,
           last_print_error_message = NULL,
           last_print_bytes_written = ?,
           last_print_total_ms = ?
       WHERE local_sale_id = ?`,
      [bytesWritten, totalMs, id],
      false,
    );
  });
}

export function recordSalePrintFailure(
  localSaleId: string,
  failure: { code: string; message: string },
  connection?: PrintDatabase,
) {
  const id = saleId(localSaleId);
  const code = diagnostic(failure.code, 'UNKNOWN', 40);
  const message = diagnostic(failure.message, 'Printer action failed.', 160);
  return update(connection, async (database) => {
    await assertSale(database, id);
    await database.run(
      `UPDATE sales
       SET print_state = 'failed',
           last_print_error_code = ?,
           last_print_error_message = ?,
           last_print_bytes_written = NULL,
           last_print_total_ms = NULL
       WHERE local_sale_id = ?`,
      [code, message, id],
      false,
    );
  });
}
