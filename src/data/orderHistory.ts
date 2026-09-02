import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';
import type { SalePrintState } from './printState.ts';

type OrderDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;

export type OrderStatus = 'completed' | 'cancelled' | 'refunded';
export type OrderStatusFilter = 'All' | 'Completed' | 'Cancelled';
export type OrderSyncState = 'pending' | 'synced' | 'failed';

export type OrderReceipt = {
  receiptNumber: string;
  completedAt: number;
  cashierName?: string;
  serviceType: 'dine-in' | 'take-away' | 'order-online';
  customerName?: string;
  tableLabel?: string;
  lines: Array<{
    productId?: string;
    productName: string;
    quantity: number;
    unitPriceCentimes: number;
    lineTotalCentimes: number;
    sizeName?: string;
    modifiers: Array<{
      groupName: string;
      optionName: string;
      priceDeltaCentimes: number;
    }>;
    complimentary?: boolean;
  }>;
  subtotalCentimes: number;
  discountCentimes: number;
  taxCentimes: number;
  totalCentimes: number;
  taxPolicyLabel: string;
  paymentMethod: string;
  tenders?: Array<{
    paymentMethod: 'Cash' | 'Card';
    dueCentimes: number;
    amountCentimes: number;
    changeCentimes: number;
  }>;
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
  printState?: SalePrintState;
  printAttemptCount: number;
  printError?: string;
  receipt: OrderReceipt;
};

export type LocalOrderCursor = {
  createdAt: number;
  localSaleId: string;
};

export const ORDER_PAGE_SIZE = 8;

export type OrderListFilter = {
  status?: OrderStatus;
  fromDate?: string;
  toDate?: string;
  query?: string;
};

function likeNeedle(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return null;
  return `%${trimmed.replaceAll('%', '').replaceAll('_', '')}%`;
}

function filterBinds(filter?: OrderListFilter) {
  const status = filter?.status ?? null;
  const fromDate = filter?.fromDate?.trim() || null;
  const toDate = filter?.toDate?.trim() || null;
  const like = likeNeedle(filter?.query ?? '');
  return {
    clause: `AND (? IS NULL OR s.status = ?)
     AND (? IS NULL OR s.business_date >= ?)
     AND (? IS NULL OR s.business_date <= ?)
     AND (? IS NULL OR s.receipt_number LIKE ? OR IFNULL(s.customer_name, '') LIKE ?)`,
    values: [
      status, status, fromDate, fromDate, toDate, toDate, like, like, like,
    ],
  };
}

function recordFromSaleRow(row: Record<string, unknown>): OrderHistoryRecord {
  const status = String(row.status);
  const syncState = String(row.effective_sync_state);
  const printState = String(row.print_state);
  if (
    !['completed', 'cancelled', 'refunded'].includes(status)
    || !['pending', 'synced', 'failed'].includes(syncState)
    || !['pending', 'printed', 'failed'].includes(printState)
  ) {
    throw new Error('A saved order state is invalid.');
  }
  const localSaleId = String(row.local_sale_id);
  const deviceId = String(row.device_id);
  const receipt = parseReceipt(row.receipt_snapshot_json);
  return {
    key: `${deviceId}:${localSaleId}`,
    deviceId,
    localSaleId,
    ...(row.cloud_sale_id ? { cloudSaleId: String(row.cloud_sale_id) } : {}),
    businessDate: String(row.business_date),
    ...(receipt.cashierName ? { cashierName: receipt.cashierName } : {}),
    status: status as OrderStatus,
    syncState: syncState as OrderSyncState,
    syncAttemptCount: Number(row.attempt_count ?? 0),
    ...(row.last_error ? { syncError: String(row.last_error) } : {}),
    printState: printState as SalePrintState,
    printAttemptCount: Number(row.print_attempt_count ?? 0),
    ...(row.last_print_error_message
      ? { printError: String(row.last_print_error_message) }
      : {}),
    receipt,
  };
}

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
    ...(typeof value.cashierName === 'string' && value.cashierName
      ? { cashierName: value.cashierName }
      : {}),
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
        ...(typeof line.productId === 'string' && line.productId
          ? { productId: line.productId }
          : {}),
        productName: text(
          line.receiptName ?? line.productName,
          'product name',
        ),
        quantity: positiveInteger(line.quantity, 'quantity'),
        unitPriceCentimes: money(line.unitPriceCentimes, 'unit price'),
        lineTotalCentimes: money(line.lineTotalCentimes, 'line total'),
        ...(typeof line.sizeName === 'string' && line.sizeName.trim()
          ? { sizeName: line.sizeName.trim() }
          : {}),
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
        ...(line.complimentary === true ? { complimentary: true as const } : {}),
      };
    }),
    subtotalCentimes: money(value.subtotalCentimes, 'subtotal'),
    discountCentimes: money(value.discountCentimes ?? 0, 'discount'),
    taxCentimes: money(value.taxCentimes, 'tax'),
    totalCentimes: money(value.totalCentimes, 'total'),
    taxPolicyLabel: text(value.taxPolicyLabel, 'tax policy'),
    paymentMethod: text(value.paymentMethod, 'payment method'),
    ...(Array.isArray(value.tenders) && value.tenders.length
      ? { tenders: parseTenders(value.tenders, value.paymentMethod) }
      : {}),
  };
}

export async function loadCurrentProductImages(
  connection?: OrderDatabase,
) {
  const database = connection ?? await openLocalDatabase();
  const result = await database.query(
    `SELECT p.id, p.image_asset_key, p.image_jpeg, c.artwork_key
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.status != 'archived' LIMIT 501`,
  );
  if ((result.values?.length ?? 0) > 500) {
    throw new Error('Saved product images exceed the local limit.');
  }
  return Object.fromEntries((result.values ?? []).map((row) => [String(row.id), {
    ...(row.image_asset_key ? { imageAssetKey: String(row.image_asset_key) } : {}),
    ...(row.artwork_key ? { artworkKey: String(row.artwork_key) } : {}),
    ...(row.image_jpeg ? { imageJpeg: String(row.image_jpeg) } : {}),
  }]));
}

function parseTenders(
  raw: unknown[],
  fallbackPaymentMethod: unknown,
): OrderReceipt['tenders'] {
  if (raw.length > 20) {
    throw new Error('The saved receipt has too many payments.');
  }
  return raw.map((rawTender) => {
    const tender = rawTender as Record<string, unknown>;
    const dueCentimes = money(tender.dueCentimes, 'payment due');
    const amountCentimes = money(tender.amountCentimes, 'payment amount');
    const changeCentimes = money(tender.changeCentimes, 'change');
    if (amountCentimes < dueCentimes) {
      throw new Error('The saved receipt payment amount is invalid.');
    }
    if (changeCentimes !== amountCentimes - dueCentimes) {
      throw new Error('The saved receipt change is invalid.');
    }
    const paymentMethod = tender.paymentMethod === 'Card'
      || (tender.paymentMethod === undefined && fallbackPaymentMethod === 'Card')
      ? 'Card'
      : 'Cash';
    return { paymentMethod, dueCentimes, amountCentimes, changeCentimes };
  });
}

export async function countLocalOrders(
  filter?: OrderListFilter,
  connection?: OrderDatabase,
) {
  const database = connection ?? await openLocalDatabase();
  const binds = filterBinds(filter);
  const result = await database.query(
    `SELECT COUNT(*) AS count
     FROM sales AS s
     WHERE 1 = 1
     ${binds.clause}`,
    binds.values,
  );
  const count = Number(result.values?.[0]?.count ?? 0);
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error('The saved order count is invalid.');
  }
  return count;
}

export async function loadLocalOrderPage(
  {
    limit = ORDER_PAGE_SIZE,
    cursor,
    offset,
    filter,
  }: {
    limit?: number;
    cursor?: LocalOrderCursor;
    offset?: number;
    filter?: OrderListFilter;
  } = {},
  connection?: OrderDatabase,
) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 20) {
    throw new Error('Order page size must be an integer from 1 to 20.');
  }
  if (cursor && offset !== undefined) {
    throw new Error('Order pages cannot use both a cursor and an offset.');
  }
  if (
    offset !== undefined
    && (!Number.isSafeInteger(offset) || offset < 0)
  ) {
    throw new Error('The order page offset is invalid.');
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
  const binds = filterBinds(filter);
  const usingOffset = offset !== undefined;
  const cursorTime = usingOffset ? null : cursor?.createdAt ?? null;
  const cursorId = usingOffset ? null : cursor?.localSaleId ?? null;
  const result = await database.query(
    `SELECT s.local_sale_id, s.device_id, s.cloud_sale_id, s.status,
      s.business_date, s.receipt_snapshot_json,
      COALESCE(c.sync_state, s.sync_state) AS effective_sync_state, s.created_at,
      s.print_state, s.print_attempt_count, s.last_print_error_message,
      COALESCE(co.attempt_count, o.attempt_count) AS attempt_count,
      COALESCE(co.last_error, o.last_error) AS last_error
     FROM sales AS s
     LEFT JOIN outbox AS o
       ON o.operation_type = 'sale-completed'
      AND o.local_record_id = s.local_sale_id
     LEFT JOIN sale_corrections AS c
       ON c.original_local_sale_id = s.local_sale_id
     LEFT JOIN outbox AS co
       ON co.operation_type = 'sale-cancelled'
      AND co.local_record_id = c.local_correction_id
     WHERE (
       ? IS NULL
       OR s.created_at < ?
       OR (s.created_at = ? AND s.local_sale_id < ?)
     )
     ${binds.clause}
     ORDER BY s.created_at DESC, s.local_sale_id DESC
     LIMIT ? OFFSET ?`,
    [
      cursorTime,
      cursorTime,
      cursorTime,
      cursorId,
      ...binds.values,
      limit + 1,
      usingOffset ? offset : 0,
    ],
  );
  const rows = result.values ?? [];
  const pageRows = rows.slice(0, limit);
  const page = pageRows.map((row) =>
    recordFromSaleRow(row as Record<string, unknown>),
  );
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
       WHERE (operation_type = 'sale-completed' AND local_record_id = ?)
          OR (operation_type = 'sale-cancelled' AND local_record_id IN (
            SELECT local_correction_id FROM sale_corrections
            WHERE original_local_sale_id = ?
          ))
       LIMIT 1`,
      [localSaleId, localSaleId],
    );
    if (!existing.values?.[0]) {
      throw new Error('This order has no pending synchronization work.');
    }
    await database.run(
      `UPDATE outbox
       SET state = 'pending', available_at = 0, last_error = NULL
       WHERE (operation_type = 'sale-completed' AND local_record_id = ?)
          OR (operation_type = 'sale-cancelled' AND local_record_id IN (
            SELECT local_correction_id FROM sale_corrections
            WHERE original_local_sale_id = ?
          ))`,
      [localSaleId, localSaleId],
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
