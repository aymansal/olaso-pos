import { openLocalDatabase } from './localDatabase.ts';
import { LOCAL_SCHEMA_VERSION } from './schema.ts';

export const OPERATIONAL_BACKUP_FORMAT = 'olaso-operational-backup';
export const OPERATIONAL_BACKUP_VERSION = 1;

const SALE_LIMIT = 5_000;
const MOVEMENT_LIMIT = 10_000;
const PURCHASE_LIMIT = 5_000;
const EXPENSE_LIMIT = 5_000;
const COMPENSATION_LIMIT = 5_000;
const RECIPE_VERSION_LIMIT = 5_000;

type QueryDatabase = {
  query: (
    statement: string,
    values?: unknown[],
  ) => Promise<{ values?: Array<Record<string, unknown>> }>;
};

export type OperationalBackup = {
  format: typeof OPERATIONAL_BACKUP_FORMAT;
  version: typeof OPERATIONAL_BACKUP_VERSION;
  exportedAt: string;
  deviceId: string;
  schemaVersion: number;
  includes: string[];
  excludes: string[];
  counts: Record<string, number>;
  data: Record<string, Array<Record<string, unknown>>>;
};

const INCLUDES = [
  'sales',
  'sale_items',
  'sale_corrections',
  'products',
  'categories',
  'recipe_versions',
  'recipe_items',
  'ingredients',
  'stock_movements',
  'inventory_purchases',
  'operating_expenses',
  'compensation_periods',
  'staff_profiles',
] as const;

const EXCLUDES = [
  'sessionTokens',
  'pinVerifiers',
  'rawPins',
  'secureSessionStorage',
  'outbox',
  'managementOperationSecrets',
] as const;

async function rows(
  database: QueryDatabase,
  statement: string,
  values: unknown[] = [],
) {
  const result = await database.query(statement, values);
  return result.values ?? [];
}

function mapStaff(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    status: row.status,
    revision: row.revision,
    updated_at: row.updated_at,
    ...(row.cloud_profile_id === undefined
      ? {}
      : { cloud_profile_id: row.cloud_profile_id }),
    ...(row.sort_order === undefined ? {} : { sort_order: row.sort_order }),
    ...(row.created_at === undefined ? {} : { created_at: row.created_at }),
  };
}

export async function buildOperationalBackupFromDatabase(
  database: QueryDatabase,
): Promise<OperationalBackup> {
  const settings = await rows(
    database,
    `SELECT value FROM device_settings WHERE key = 'device_id' LIMIT 1`,
  );
  const deviceId = String(settings[0]?.value ?? 'unknown-device');

  const [
    sales,
    saleItems,
    saleCorrections,
    products,
    categories,
    recipeVersions,
    recipeItems,
    ingredients,
    stockMovements,
    purchases,
    expenses,
    compensation,
    staff,
  ] = await Promise.all([
    rows(
      database,
      `SELECT local_sale_id, device_id, cloud_sale_id, receipt_number, status,
              service_type, customer_name, table_label, subtotal_centimes,
              tax_centimes, total_centimes, currency, business_date,
              receipt_snapshot_json, sync_state, created_at, actor_profile_id
       FROM sales
       ORDER BY created_at DESC
       LIMIT ?`,
      [SALE_LIMIT],
    ),
    rows(
      database,
      `SELECT id, local_sale_id, product_id, quantity, product_name_snapshot,
              unit_price_centimes, modifier_snapshot_json, recipe_snapshot_json,
              line_total_centimes
       FROM sale_items
       WHERE local_sale_id IN (
         SELECT local_sale_id FROM sales ORDER BY created_at DESC LIMIT ?
       )`,
      [SALE_LIMIT],
    ),
    rows(
      database,
      `SELECT * FROM sale_corrections
       WHERE local_sale_id IN (
         SELECT local_sale_id FROM sales ORDER BY created_at DESC LIMIT ?
       )`,
      [SALE_LIMIT],
    ).catch(() => [] as Array<Record<string, unknown>>),
    rows(database, `SELECT * FROM products ORDER BY name LIMIT 2000`),
    rows(database, `SELECT * FROM categories ORDER BY sort_order, name LIMIT 500`),
    rows(
      database,
      `SELECT * FROM recipe_versions ORDER BY created_at DESC LIMIT ?`,
      [RECIPE_VERSION_LIMIT],
    ),
    rows(
      database,
      `SELECT * FROM recipe_items
       WHERE recipe_version_id IN (
         SELECT id FROM recipe_versions ORDER BY created_at DESC LIMIT ?
       )`,
      [RECIPE_VERSION_LIMIT],
    ),
    rows(database, `SELECT * FROM ingredients ORDER BY name LIMIT 2000`),
    rows(
      database,
      `SELECT * FROM stock_movements ORDER BY created_at DESC LIMIT ?`,
      [MOVEMENT_LIMIT],
    ),
    rows(
      database,
      `SELECT * FROM inventory_purchases ORDER BY received_at DESC LIMIT ?`,
      [PURCHASE_LIMIT],
    ),
    rows(
      database,
      `SELECT * FROM operating_expenses ORDER BY created_at DESC LIMIT ?`,
      [EXPENSE_LIMIT],
    ),
    rows(
      database,
      `SELECT * FROM compensation_periods ORDER BY created_at DESC LIMIT ?`,
      [COMPENSATION_LIMIT],
    ),
    rows(database, `SELECT * FROM staff_profiles ORDER BY name LIMIT 200`),
  ]);

  const data = {
    sales,
    sale_items: saleItems,
    sale_corrections: saleCorrections,
    products,
    categories,
    recipe_versions: recipeVersions,
    recipe_items: recipeItems,
    ingredients,
    stock_movements: stockMovements,
    inventory_purchases: purchases,
    operating_expenses: expenses,
    compensation_periods: compensation,
    staff_profiles: staff.map(mapStaff),
  };

  const counts = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value.length]),
  );

  return {
    format: OPERATIONAL_BACKUP_FORMAT,
    version: OPERATIONAL_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    deviceId,
    schemaVersion: LOCAL_SCHEMA_VERSION,
    includes: [...INCLUDES],
    excludes: [...EXCLUDES],
    counts,
    data,
  };
}

export async function buildOperationalBackup() {
  const database = await openLocalDatabase();
  return buildOperationalBackupFromDatabase(database);
}

export function parseOperationalBackup(text: string): OperationalBackup {
  const parsed = JSON.parse(text) as OperationalBackup;
  if (parsed.format !== OPERATIONAL_BACKUP_FORMAT) {
    throw new Error('This file is not an Olaso operational backup.');
  }
  if (parsed.version !== OPERATIONAL_BACKUP_VERSION) {
    throw new Error('This backup format version is not supported.');
  }
  if (!parsed.data || typeof parsed.data !== 'object') {
    throw new Error('This backup is missing operational data.');
  }
  return parsed;
}

export function summarizeOperationalBackup(backup: OperationalBackup) {
  return {
    exportedAt: backup.exportedAt,
    deviceId: backup.deviceId,
    schemaVersion: backup.schemaVersion,
    pendingSales: (backup.data.sales ?? []).filter(
      (sale) => sale.sync_state === 'pending' || sale.sync_state === 'failed',
    ).length,
    counts: backup.counts,
  };
}

export function assertBackupHasNoSecrets(text: string) {
  const payload = JSON.parse(text) as OperationalBackup;
  const haystack = JSON.stringify({
    format: payload.format,
    data: payload.data,
    deviceId: payload.deviceId,
  });
  if (
    /sessionToken|pinVerifier|rawPin|"pin"\s*:|password|keystore|secureSession/i
      .test(haystack)
  ) {
    throw new Error('Backup content must not include credentials or session secrets.');
  }
}
