import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { CartLine } from '../features/pos/posSession';
import {
  loadOperationalCache,
  type OperationalCacheSnapshot,
} from './operationalCache.ts';
import { listPendingOutbox } from './outbox.ts';
import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';

export type LocalServiceType = 'dine-in' | 'take-away' | 'order-online';

export type SavedReceipt = {
  receiptNumber: string;
  completedAt: number;
  serviceType: LocalServiceType;
  customerName?: string;
  tableLabel?: string;
  lines: Array<{
    productId: string;
    productRevision: number;
    recipeVersionId?: string;
    productName: string;
    receiptName: string;
    quantity: number;
    unitPriceCentimes: number;
    lineTotalCentimes: number;
    modifierOptionIds: string[];
    modifiers: Array<{
      groupName: string;
      optionName: string;
      priceDeltaCentimes: number;
      ingredientEffects: Array<{
        ingredientId: string;
        ingredientName: string;
        quantityDelta: number;
      }>;
    }>;
    recipe: Array<{
      ingredientId: string;
      ingredientName: string;
      quantity: number;
    }>;
  }>;
  subtotalCentimes: number;
  discountCentimes: number;
  taxCentimes: number;
  totalCentimes: number;
  taxPolicyLabel: string;
  paymentMethod: string;
};

export type SaleSyncPayload = {
  deviceId: string;
  localSaleId: string;
  receiptNumber: string;
  serviceMode: 'dine-in' | 'take-away' | 'online';
  customerName?: string;
  tableLabel?: string;
  businessDate: string;
  completedAt: number;
  lines: Array<{
    productId: string;
    productRevision: number;
    recipeVersionId?: string;
    quantity: number;
    modifierOptionIds: string[];
  }>;
};

type SaleDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;

export type CompleteSaleInput = {
  cart: CartLine[];
  serviceType: LocalServiceType;
  customerName: string;
  tableLabel: string;
  completedAt?: number;
};

const TAX_POLICY_LABEL = 'Temporary 0% — owner confirmation pending';
const PAYMENT_METHOD = 'Pending owner confirmation';
const CASHIER_LABEL = 'Development cashier';

function businessDate(timestamp: number) {
  const date = new Date(timestamp);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function cleanOptional(value: string, label: string, maximum: number) {
  const cleaned = value.trim();
  if (cleaned.length > maximum) {
    throw new Error(`${label} must contain at most ${maximum} characters.`);
  }
  return cleaned || undefined;
}

export function prepareSale(
  menu: OperationalCacheSnapshot,
  input: CompleteSaleInput,
  localSaleId: string,
) {
  if (input.cart.length < 1 || input.cart.length > 50) {
    throw new Error('An order must contain 1 to 50 lines.');
  }
  const completedAt = input.completedAt ?? Date.now();
  if (!Number.isSafeInteger(completedAt) || completedAt < 0) {
    throw new Error('The completion time is invalid.');
  }
  const customerName = cleanOptional(input.customerName, 'Customer name', 80);
  const tableLabel = cleanOptional(input.tableLabel, 'Table', 40);
  if (input.serviceType === 'dine-in' && !tableLabel) {
    throw new Error('Table is required for dine in.');
  }

  const products = new Map(menu.products.map((product) => [product.id, product]));
  const groups = new Map(menu.modifierGroups.map((group) => [group.id, group]));
  const options = new Map(menu.modifierOptions.map((option) => [option.id, option]));
  const ingredients = new Map(
    menu.ingredients.map((ingredient) => [ingredient.id, ingredient]),
  );
  const versions = new Map(
    menu.recipeVersions.map((version) => [version.id, version]),
  );
  const groupLinks = new Map<string, string[]>();
  for (const link of menu.productModifierGroups) {
    const linked = groupLinks.get(link.productId) ?? [];
    linked.push(link.modifierGroupId);
    groupLinks.set(link.productId, linked);
  }
  const recipeItems = new Map<string, OperationalCacheSnapshot['recipeItems']>();
  for (const item of menu.recipeItems) {
    const items = recipeItems.get(item.recipeVersionId) ?? [];
    items.push(item);
    recipeItems.set(item.recipeVersionId, items);
  }

  const stockUsage = new Map<string, number>();
  const lines = input.cart.map((cartLine) => {
    if (
      !Number.isSafeInteger(cartLine.quantity)
      || cartLine.quantity < 1
      || cartLine.quantity > 100
    ) {
      throw new Error('Every quantity must be an integer from 1 to 100.');
    }
    const product = products.get(cartLine.productId);
    if (!product || product.status !== 'active') {
      throw new Error('The order contains an unavailable product.');
    }
    const selectedIds = [...new Set(cartLine.modifierOptionIds)];
    if (
      selectedIds.length !== cartLine.modifierOptionIds.length
      || selectedIds.length > 20
    ) {
      throw new Error(`Invalid modifiers for ${product.name}.`);
    }
    const linkedGroupIds = groupLinks.get(product.id) ?? [];
    const selectedOptions = selectedIds.map((id) => {
      const option = options.get(id);
      if (!option || !linkedGroupIds.includes(option.modifierGroupId)) {
        throw new Error(`Invalid modifiers for ${product.name}.`);
      }
      return option;
    });
    for (const groupId of linkedGroupIds) {
      const group = groups.get(groupId);
      if (!group) throw new Error(`Modifier data is missing for ${product.name}.`);
      const count = selectedOptions.filter(
        (option) => option.modifierGroupId === groupId,
      ).length;
      if (
        count < group.minimumSelections
        || count > group.maximumSelections
      ) {
        throw new Error(
          `${group.name} requires ${group.minimumSelections} to ${group.maximumSelections} choices.`,
        );
      }
    }

    const unitPriceCentimes =
      product.priceCentimes
      + selectedOptions.reduce(
        (sum, option) => sum + option.priceDeltaCentimes,
        0,
      );
    if (!Number.isSafeInteger(unitPriceCentimes) || unitPriceCentimes < 0) {
      throw new Error(`The saved price for ${product.name} is invalid.`);
    }

    const versionId = product.currentRecipeVersionId;
    const version = versionId ? versions.get(versionId) : undefined;
    if (versionId && (!version || version.productId !== product.id)) {
      throw new Error(`The saved recipe for ${product.name} is unavailable.`);
    }
    const baseRecipe = versionId ? recipeItems.get(versionId) ?? [] : [];
    const lineUsage = new Map<string, number>();
    for (const item of baseRecipe) {
      if (!ingredients.has(item.ingredientId) || item.quantity < 1) {
        throw new Error(`The saved recipe for ${product.name} is invalid.`);
      }
      lineUsage.set(
        item.ingredientId,
        (lineUsage.get(item.ingredientId) ?? 0) + item.quantity,
      );
    }
    for (const option of selectedOptions) {
      for (const effect of option.ingredientEffects) {
        if (!ingredients.has(effect.ingredientId)) {
          throw new Error(`The saved modifiers for ${product.name} are invalid.`);
        }
        lineUsage.set(
          effect.ingredientId,
          (lineUsage.get(effect.ingredientId) ?? 0) + effect.quantityDelta,
        );
      }
    }
    for (const [ingredientId, quantity] of lineUsage) {
      if (!Number.isSafeInteger(quantity) || quantity < 0) {
        throw new Error(`The saved recipe for ${product.name} is invalid.`);
      }
      stockUsage.set(
        ingredientId,
        (stockUsage.get(ingredientId) ?? 0) + quantity * cartLine.quantity,
      );
    }

    return {
      productId: product.id,
      productRevision: product.revision,
      ...(versionId ? { recipeVersionId: versionId } : {}),
      productName: product.name,
      receiptName: product.receiptName,
      quantity: cartLine.quantity,
      unitPriceCentimes,
      lineTotalCentimes: unitPriceCentimes * cartLine.quantity,
      modifierOptionIds: selectedIds,
      modifiers: selectedOptions.map((option) => {
        const group = groups.get(option.modifierGroupId);
        if (!group) throw new Error('Modifier group is unavailable.');
        return {
          groupName: group.name,
          optionName: option.name,
          priceDeltaCentimes: option.priceDeltaCentimes,
          ingredientEffects: option.ingredientEffects.map((effect) => ({
            ingredientId: effect.ingredientId,
            ingredientName:
              ingredients.get(effect.ingredientId)?.name ?? 'Unknown ingredient',
            quantityDelta: effect.quantityDelta,
          })),
        };
      }),
      recipe: baseRecipe.map((item) => ({
        ingredientId: item.ingredientId,
        ingredientName:
          ingredients.get(item.ingredientId)?.name ?? 'Unknown ingredient',
        quantity: item.quantity,
      })),
    };
  });
  const subtotalCentimes = lines.reduce(
    (sum, line) => sum + line.lineTotalCentimes,
    0,
  );
  if (!Number.isSafeInteger(subtotalCentimes) || subtotalCentimes < 0) {
    throw new Error('The saved order total is invalid.');
  }
  const date = businessDate(completedAt);
  const receipt: SavedReceipt = {
    receiptNumber: `DEV-${date.replaceAll('-', '')}-${localSaleId.slice(0, 8).toUpperCase()}`,
    completedAt,
    serviceType: input.serviceType,
    ...(customerName ? { customerName } : {}),
    ...(tableLabel ? { tableLabel } : {}),
    lines,
    subtotalCentimes,
    discountCentimes: 0,
    taxCentimes: 0,
    totalCentimes: subtotalCentimes,
    taxPolicyLabel: TAX_POLICY_LABEL,
    paymentMethod: PAYMENT_METHOD,
  };
  return { receipt, businessDate: date, stockUsage };
}

export async function commitLocalSale(
  database: SaleDatabase,
  input: CompleteSaleInput,
  idFactory = () => crypto.randomUUID(),
) {
  const storedDevice = await database.query(
    `SELECT value FROM device_settings WHERE key = 'device_id' LIMIT 1`,
  );
  const deviceId = storedDevice.values?.[0]?.value
    ? String(storedDevice.values[0].value)
    : `device-${idFactory()}`;
  if (!storedDevice.values?.length) {
    await database.run(
      `INSERT INTO device_settings (key, value, updated_at)
       VALUES ('device_id', ?, ?)`,
      [deviceId, input.completedAt ?? Date.now()],
      false,
    );
  }

  const localSaleId = idFactory();
  const operationId = idFactory();
  const menu = await loadOperationalCache(database as SQLiteDBConnection);
  const prepared = prepareSale(menu, input, localSaleId);
  const { receipt } = prepared;

  await database.run(
    `INSERT INTO sales
      (local_sale_id, device_id, receipt_number, status, service_type,
       customer_name, table_label, subtotal_centimes, tax_centimes,
       total_centimes, currency, business_date, receipt_snapshot_json,
       sync_state, created_at)
     VALUES (?, ?, ?, 'completed', ?, ?, ?, ?, ?, ?, 'MAD', ?, ?, 'pending', ?)`,
    [
      localSaleId,
      deviceId,
      receipt.receiptNumber,
      input.serviceType,
      receipt.customerName ?? null,
      receipt.tableLabel ?? null,
      receipt.subtotalCentimes,
      receipt.taxCentimes,
      receipt.totalCentimes,
      prepared.businessDate,
      JSON.stringify(receipt),
      receipt.completedAt,
    ],
    false,
  );
  for (const line of receipt.lines) {
    await database.run(
      `INSERT INTO sale_items
        (id, local_sale_id, product_id, quantity, product_name_snapshot,
         unit_price_centimes, modifier_snapshot_json, recipe_snapshot_json,
         line_total_centimes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idFactory(),
        localSaleId,
        line.productId,
        line.quantity,
        line.productName,
        line.unitPriceCentimes,
        JSON.stringify(line.modifiers),
        JSON.stringify(line.recipe),
        line.lineTotalCentimes,
      ],
      false,
    );
  }
  for (const [ingredientId, quantity] of prepared.stockUsage) {
    if (quantity === 0) continue;
    await database.run(
      `UPDATE ingredients
       SET local_stock_delta = local_stock_delta - ?,
           updated_at = ?
       WHERE id = ?`,
      [quantity, receipt.completedAt, ingredientId],
      false,
    );
    await database.run(
      `INSERT INTO stock_movements
        (id, ingredient_id, local_sale_id, quantity_delta, movement_type,
         reason, actor_label, business_date, created_at)
       VALUES (?, ?, ?, ?, 'sale', ?, ?, ?, ?)`,
      [
        idFactory(),
        ingredientId,
        localSaleId,
        -quantity,
        `Recipe deduction for ${receipt.receiptNumber}`,
        CASHIER_LABEL,
        prepared.businessDate,
        receipt.completedAt,
      ],
      false,
    );
  }
  await database.run(
    `INSERT INTO outbox
      (operation_id, device_id, operation_type, local_record_id, state,
       created_at, available_at)
     VALUES (?, ?, 'sale-completed', ?, 'pending', ?, ?)`,
    [
      operationId,
      deviceId,
      localSaleId,
      receipt.completedAt,
      receipt.completedAt,
    ],
    false,
  );
  return { localSaleId, operationId, deviceId, receipt };
}

export function completeLocalSale(input: CompleteSaleInput) {
  return withLocalTransaction((database) => commitLocalSale(database, input));
}

async function loadSaleSyncPayload(
  localSaleId: string,
): Promise<SaleSyncPayload> {
  const database = await openLocalDatabase();
  const result = await database.query(
    `SELECT device_id, receipt_number, service_type, business_date,
      receipt_snapshot_json
     FROM sales
     WHERE local_sale_id = ?
     LIMIT 1`,
    [localSaleId],
  );
  const row = result.values?.[0];
  if (!row) throw new Error('The pending local sale is missing.');
  const receipt = JSON.parse(String(row.receipt_snapshot_json)) as SavedReceipt;
  if (!receipt || !Array.isArray(receipt.lines)) {
    throw new Error('The pending receipt snapshot is invalid.');
  }
  return {
    deviceId: String(row.device_id),
    localSaleId,
    receiptNumber: String(row.receipt_number),
    serviceMode:
      row.service_type === 'order-online' ? 'online' : row.service_type,
    ...(receipt.customerName ? { customerName: receipt.customerName } : {}),
    ...(receipt.tableLabel ? { tableLabel: receipt.tableLabel } : {}),
    businessDate: String(row.business_date),
    completedAt: receipt.completedAt,
    lines: receipt.lines.map((line) => ({
      productId: line.productId,
      productRevision: line.productRevision,
      ...(line.recipeVersionId
        ? { recipeVersionId: line.recipeVersionId }
        : {}),
      quantity: line.quantity,
      modifierOptionIds: line.modifierOptionIds,
    })),
  };
}

async function acknowledgeSale(
  operationId: string,
  localSaleId: string,
  cloudSaleId: string,
  acknowledgedAt: number,
) {
  return withLocalTransaction(async (database) => {
    await database.run(
      `UPDATE sales
       SET cloud_sale_id = ?, sync_state = 'synced'
       WHERE local_sale_id = ?`,
      [cloudSaleId, localSaleId],
      false,
    );
    await database.run(
      `DELETE FROM outbox
       WHERE operation_id = ? AND local_record_id = ?`,
      [operationId, localSaleId],
      false,
    );
    await database.run(
      `UPDATE sync_state
       SET last_success_at = ?, last_error = NULL
       WHERE id = 1`,
      [acknowledgedAt],
      false,
    );
  });
}

async function failSale(
  operationId: string,
  localSaleId: string,
  attemptCount: number,
  caught: unknown,
) {
  const error = (
    caught instanceof Error ? caught.message : 'Sale synchronization failed.'
  ).trim().slice(0, 500);
  const retryAt =
    Date.now() + Math.min(60_000, 1_000 * 2 ** Math.min(attemptCount, 6));
  return withLocalTransaction(async (database) => {
    await database.run(
      `UPDATE sales
       SET sync_state = 'failed'
       WHERE local_sale_id = ?
         AND EXISTS (
           SELECT 1 FROM outbox
           WHERE operation_id = ? AND local_record_id = ?
         )`,
      [localSaleId, operationId, localSaleId],
      false,
    );
    await database.run(
      `UPDATE outbox
       SET state = 'failed', attempt_count = attempt_count + 1,
           last_error = ?, available_at = ?
       WHERE operation_id = ?`,
      [error, retryAt, operationId],
      false,
    );
    await database.run(
      `UPDATE sync_state
       SET last_error = ?
       WHERE id = 1
         AND EXISTS (
           SELECT 1 FROM outbox WHERE operation_id = ?
         )`,
      [error, operationId],
      false,
    );
  });
}

export async function syncPendingSales(
  acceptSale: (
    input: SaleSyncPayload,
  ) => Promise<{ saleId: string; acknowledgedAt: number }>,
) {
  const entries = await listPendingOutbox(Date.now(), 10);
  let synced = 0;
  let failed = 0;
  for (const entry of entries) {
    if (entry.operationType !== 'sale-completed') continue;
    try {
      const result = await acceptSale(
        await loadSaleSyncPayload(entry.localRecordId),
      );
      await acknowledgeSale(
        entry.operationId,
        entry.localRecordId,
        result.saleId,
        result.acknowledgedAt,
      );
      synced += 1;
    } catch (error) {
      await failSale(
        entry.operationId,
        entry.localRecordId,
        entry.attemptCount,
        error,
      );
      failed += 1;
    }
  }
  return { synced, failed };
}
