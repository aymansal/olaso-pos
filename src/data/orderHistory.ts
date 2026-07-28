import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';

type OrderDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;

export type OrderStatus = 'completed' | 'cancelled' | 'refunded';
export type OrderSyncState = 'pending' | 'synced' | 'failed';

export type OrderReceipt = {
  receiptNumber: string;
  completedAt: number;
  serviceType: 'dine-in' | 'take-away' | 'order-online';
  customerName?: string;
  tableLabel?: string;
  lines: Array<{
    productName: string;
    quantity: number;
    unitPriceCentimes: number;
    lineTotalCentimes: number;
    modifiers: Array<{
      groupName: string;
      optionName: string;
      priceDeltaCentimes: number;
    }>;
  }>;
  subtotalCentimes: number;
  discountCentimes: number;
  taxCentimes: number;
  totalCentimes: number;
  taxPolicyLabel: string;
  paymentMethod: string;
};

export type OrderHistoryRecord = {
  key: string;
  deviceId: string;
  localSaleId: string;
  cloudSaleId?: string;
  businessDate: string;
  cashierName?: string;
  status: OrderStatus;
  syncState: OrderSyncState;
  syncAttemptCount: number;
  syncError?: string;
  receipt: OrderReceipt;
};

export type LocalOrderCursor = {
  createdAt: number;
  localSaleId: string;
};

function money(value: unknown, label: string) {
  const amount = Number(value);
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new Error(`The saved receipt ${label} is invalid.`);
  }
  return amount;
}

function positiveInteger(value: unknown, label: string) {
  const amount = money(value, label);
  if (amount < 1) throw new Error(`The saved receipt ${label} is invalid.`);
  return amount;
}

function text(value: unknown, label: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`The saved receipt ${label} is invalid.`);
  }
  return value;
}

function parseReceipt(raw: unknown): OrderReceipt {
  const value = JSON.parse(String(raw)) as Record<string, unknown>;
  if (!value || !Array.isArray(value.lines) || value.lines.length > 50) {
    throw new Error('The saved receipt snapshot is invalid.');
  }
  const serviceType = value.serviceType;
  if (
    serviceType !== 'dine-in'
    && serviceType !== 'take-away'
    && serviceType !== 'order-online'
  ) {
    throw new Error('The saved receipt service type is invalid.');
  }
  const completedAt = Number(value.completedAt);
  if (!Number.isSafeInteger(completedAt) || completedAt < 0) {
    throw new Error('The saved receipt completion time is invalid.');
  }
  return {
    receiptNumber: text(value.receiptNumber, 'number'),
    completedAt,
    serviceType,
    ...(typeof value.customerName === 'string' && value.customerName
      ? { customerName: value.customerName }
      : {}),
    ...(typeof value.tableLabel === 'string' && value.tableLabel
      ? { tableLabel: value.tableLabel }
      : {}),
    lines: value.lines.map((rawLine) => {
      const line = rawLine as Record<string, unknown>;
      const modifiers = Array.isArray(line.modifiers) ? line.modifiers : [];
      if (modifiers.length > 20) {
        throw new Error('A saved receipt has too many modifiers.');
      }
      return {
        productName: text(
          line.receiptName ?? line.productName,
          'product name',
        ),
        quantity: positiveInteger(line.quantity, 'quantity'),
        unitPriceCentimes: money(line.unitPriceCentimes, 'unit price'),
        lineTotalCentimes: money(line.lineTotalCentimes, 'line total'),
        modifiers: modifiers.map((rawModifier) => {
          const modifier = rawModifier as Record<string, unknown>;
          return {
            groupName: text(modifier.groupName, 'modifier group'),
            optionName: text(modifier.optionName, 'modifier option'),
            priceDeltaCentimes: money(
              modifier.priceDeltaCentimes,
              'modifier price',
            ),
          };
        }),
      };
    }),
    subtotalCentimes: money(value.subtotalCentimes, 'subtotal'),
    discountCentimes: money(value.discountCentimes ?? 0, 'discount'),
    taxCentimes: money(value.taxCentimes, 'tax'),
    totalCentimes: money(value.totalCentimes, 'total'),
    taxPolicyLabel: text(value.taxPolicyLabel, 'tax policy'),
    paymentMethod: text(value.paymentMethod, 'payment method'),
  };
}

export async function loadLocalOrderPage(
  {
    limit = 6,
    cursor,
  }: {
    limit?: number;
    cursor?: LocalOrderCursor;
  } = {},
  connection?: OrderDatabase,
) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 20) {
    throw new Error('Order page size must be an integer from 1 to 20.');
  }
  if (
    cursor
    && (
      !Number.isSafeInteger(cursor.createdAt)
      || cursor.createdAt < 0
      || !cursor.localSaleId
    )
  ) {
    throw new Error('The local order cursor is invalid.');
  }
  const database = connection ?? await openLocalDatabase();
  const cursorTime = cursor?.createdAt ?? null;
  const cursorId = cursor?.localSaleId ?? null;
  const result = await database.query(
    `SELECT s.local_sale_id, s.device_id, s.cloud_sale_id, s.status,
      s.business_date, s.receipt_snapshot_json, s.sync_state, s.created_at,
      o.attempt_count, o.last_error
     FROM sales AS s
     LEFT JOIN outbox AS o
       ON o.operation_type = 'sale-completed'
      AND o.local_record_id = s.local_sale_id
     WHERE (
       ? IS NULL
       OR s.created_at < ?
       OR (s.created_at = ? AND s.local_sale_id < ?)
     )
     ORDER BY s.created_at DESC, s.local_sale_id DESC
     LIMIT ?`,
    [cursorTime, cursorTime, cursorTime, cursorId, limit + 1],
  );
  const rows = result.values ?? [];
  const pageRows = rows.slice(0, limit);
  const page: OrderHistoryRecord[] = pageRows.map((row) => {
    const status = String(row.status);
    const syncState = String(row.sync_state);
    if (
      !['completed', 'cancelled', 'refunded'].includes(status)
      || !['pending', 'synced', 'failed'].includes(syncState)
    ) {
      throw new Error('A saved order state is invalid.');
    }
    const localSaleId = String(row.local_sale_id);
    const deviceId = String(row.device_id);
    return {
      key: `${deviceId}:${localSaleId}`,
      deviceId,
      localSaleId,
      ...(row.cloud_sale_id ? { cloudSaleId: String(row.cloud_sale_id) } : {}),
      businessDate: String(row.business_date),
      cashierName: 'Development cashier',
      status: status as OrderStatus,
      syncState: syncState as OrderSyncState,
      syncAttemptCount: Number(row.attempt_count ?? 0),
      ...(row.last_error ? { syncError: String(row.last_error) } : {}),
      receipt: parseReceipt(row.receipt_snapshot_json),
    };
  });
  const last = pageRows.at(-1);
  return {
    page,
    isDone: rows.length <= limit,
    ...(last
      ? {
          continueCursor: {
            createdAt: Number(last.created_at),
            localSaleId: String(last.local_sale_id),
          },
        }
      : {}),
  };
}

export async function loadLocalSyncSummary(connection?: OrderDatabase) {
  const database = connection ?? await openLocalDatabase();
  const result = await database.query(
    `SELECT last_success_at, last_error
     FROM sync_state
     WHERE id = 1
     LIMIT 1`,
  );
  const row = result.values?.[0];
  return {
    lastSuccessAt: row?.last_success_at
      ? Number(row.last_success_at)
      : undefined,
    lastError: row?.last_error ? String(row.last_error) : undefined,
  };
}

export async function makeLocalSaleRetryAvailable(
  localSaleId: string,
  connection?: OrderDatabase,
) {
  if (
    !localSaleId
    || localSaleId.length > 128
    || !/^[A-Za-z0-9._:-]+$/.test(localSaleId)
  ) {
    throw new Error('The local sale ID is invalid.');
  }
  const update = async (database: OrderDatabase) => {
    const existing = await database.query(
      `SELECT operation_id
       FROM outbox
       WHERE operation_type = 'sale-completed' AND local_record_id = ?
       LIMIT 1`,
      [localSaleId],
    );
    if (!existing.values?.[0]) {
      throw new Error('This order has no pending synchronization work.');
    }
    await database.run(
      `UPDATE outbox
       SET state = 'pending', available_at = 0, last_error = NULL
       WHERE operation_type = 'sale-completed' AND local_record_id = ?`,
      [localSaleId],
      false,
    );
    await database.run(
      `UPDATE sales SET sync_state = 'pending' WHERE local_sale_id = ?`,
      [localSaleId],
      false,
    );
  };
  if (connection) return update(connection);
  return withLocalTransaction(update);
}
