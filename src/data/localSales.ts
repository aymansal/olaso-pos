import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { CartLine, PaymentTender } from '../features/pos/posSession';
import {
  loadOperationalCache,
  type OperationalCacheSnapshot,
} from './operationalCache.ts';
import {
  CONNECTION_SYNC_FAILURE,
  listPendingOutbox,
} from './outbox.ts';
import { latestPendingManagementOperationIdFromDatabase } from './localManagement.ts';
import {
  managementIdentifier,
  OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
} from './managementOperation.ts';
import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';
import { allocateCentimes } from '../lib/costs.ts';
import { resolveProductConfiguration } from '../lib/productConfiguration.ts';

export type LocalServiceType = 'dine-in' | 'take-away' | 'order-online';
export type PaymentMethod = 'Cash' | 'Card';
export type ReceiptLanguage = 'en' | 'fr';

export type SavedReceipt = {
  receiptNumber: string;
  completedAt: number;
  cashierName?: string;
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
    ingredientCostCentimes?: number;
    costStatus: 'complete' | 'incomplete';
    valuationRevisions: Array<{ ingredientId: string; revision: number }>;
    sizeId?: string;
    sizeName?: string;
    choiceValueIds?: string[];
    modifierOptionIds?: string[];
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
    complimentary?: true;
  }>;
  subtotalCentimes: number;
  discountCentimes: number;
  taxCentimes: number;
  totalCentimes: number;
  taxPolicyLabel: string;
  paymentMethod: string;
  receiptLanguage?: ReceiptLanguage;
  tenders?: PaymentTender[];
  ingredientCostCentimes?: number;
  costStatus: 'complete' | 'incomplete';
};

export type SaleSyncPayload = {
  actorProfileId?: string;
  actorName: string;
  deviceId: string;
  localSaleId: string;
  receiptNumber: string;
  serviceMode: 'dine-in' | 'take-away';
  paymentMethod: PaymentMethod;
  receiptLanguage: ReceiptLanguage;
  tenders?: PaymentTender[];
  businessDate: string;
  completedAt: number;
  ingredientCostCentimes?: number;
  costStatus: 'complete' | 'incomplete';
  lines: Array<{
    productId: string;
    productRevision: number;
    recipeVersionId?: string;
    quantity: number;
    sizeId?: string;
    choiceValueIds?: string[];
    ingredientCostCentimes?: number;
    costStatus: 'complete' | 'incomplete';
    valuationRevisions: Array<{ ingredientId: string; revision: number }>;
    complimentary?: true;
  }>;
};

type SaleDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;

export type CompleteSaleInput = {
  cart: CartLine[];
  cashierProfileId: string;
  cashierName: string;
  serviceType: Exclude<LocalServiceType, 'order-online'>;
  paymentMethod: PaymentMethod;
  receiptLanguage?: ReceiptLanguage;
  tenders?: PaymentTender[];
  completedAt?: number;
};

export type SaleCancellationPayload = {
  actorProfileId?: string;
  actorName: string;
  deviceId: string;
  localCorrectionId: string;
  originalLocalSaleId: string;
  reason: string;
  businessDate: string;
  correctedAt: number;
};

const TAX_POLICY_LABEL = 'No tax';

function validateTenders(tenders: PaymentTender[], saleTotalCentimes: number) {
  if (tenders.length < 1 || tenders.length > 20) {
    throw new Error('A sale can include 1 to 20 payments.');
  }
  let dueSum = 0;
  for (const tender of tenders) {
    if (
      !Number.isSafeInteger(tender.dueCentimes)
      || tender.dueCentimes < 0
      || !Number.isSafeInteger(tender.amountCentimes)
      || tender.amountCentimes < 0
      || !Number.isSafeInteger(tender.changeCentimes)
      || tender.changeCentimes < 0
    ) {
      throw new Error('A saved payment amount is invalid.');
    }
    if (tender.amountCentimes < tender.dueCentimes) {
      throw new Error('A payment amount is less than its due.');
    }
    if (tender.changeCentimes !== tender.amountCentimes - tender.dueCentimes) {
      throw new Error('Payment change does not match amount and due.');
    }
    dueSum += tender.dueCentimes;
  }
  if (dueSum !== saleTotalCentimes) {
    throw new Error('Split payments do not add up to the sale total.');
  }
  return tenders;
}

function businessDate(timestamp: number) {
  const date = new Date(timestamp);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function receiptPeriod(timestamp: number) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Casablanca', month: '2-digit', year: '2-digit',
  }).formatToParts(timestamp);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${value('month')}${value('year')}`;
}

function fallbackReceiptNumber(timestamp: number) {
  return `${receiptPeriod(timestamp)}-0001`;
}

async function allocateReceiptNumber(
  database: SaleDatabase,
  completedAt: number,
) {
  const period = receiptPeriod(completedAt);
  const current = await database.query(
    'SELECT next_number FROM receipt_counters WHERE period = ? LIMIT 1',
    [period],
  );
  const next = Number(current.values?.[0]?.next_number ?? 1);
  if (!Number.isInteger(next) || next < 1 || next > 9_999) {
    throw new Error('Receipt sequence is invalid.');
  }
  await database.run(
    `INSERT INTO receipt_counters (period, next_number)
     VALUES (?, ?)
     ON CONFLICT(period) DO UPDATE SET next_number = excluded.next_number`,
    [period, next + 1],
    false,
  );
  return `${period}-${String(next).padStart(4, '0')}`;
}

type SaleValuation = {
  quantity: number;
  inventoryValueCentimes?: number;
  complete: boolean;
};

function consumeSnapshotCost(valuation: SaleValuation, quantity: number) {
  if (quantity === 0) return 0;
  if (
    !valuation.complete
    || valuation.inventoryValueCentimes === undefined
    || quantity > valuation.quantity
  ) {
    valuation.quantity -= quantity;
    valuation.complete = false;
    valuation.inventoryValueCentimes = undefined;
    return undefined;
  }
  const costCentimes = allocateCentimes(
    valuation.inventoryValueCentimes,
    valuation.quantity,
    quantity,
  );
  valuation.quantity -= quantity;
  valuation.inventoryValueCentimes -= costCentimes;
  return costCentimes;
}

export function prepareSale(
  menu: OperationalCacheSnapshot,
  input: CompleteSaleInput,
  localSaleId: string,
  receiptNumber?: string,
) {
  if (input.cart.length < 1 || input.cart.length > 50) {
    throw new Error('An order must contain 1 to 50 lines.');
  }
  const completedAt = input.completedAt ?? Date.now();
  if (!Number.isSafeInteger(completedAt) || completedAt < 0) {
    throw new Error('The completion time is invalid.');
  }
  const language = input.receiptLanguage ?? 'en';
  if (language !== 'en' && language !== 'fr') throw new Error('Receipt language is invalid.');
  const cashierName = input.cashierName.trim();
  if (!cashierName || cashierName.length > 80) {
    throw new Error('The cashier name is invalid.');
  }

  const products = new Map(menu.products.map((product) => [product.id, product]));
  const ingredients = new Map(
    menu.ingredients.map((ingredient) => [ingredient.id, ingredient]),
  );
  const versions = new Map(
    menu.recipeVersions.map((version) => [version.id, version]),
  );
  const recipeItems = new Map<string, OperationalCacheSnapshot['recipeItems']>();
  for (const item of menu.recipeItems) {
    const items = recipeItems.get(item.recipeVersionId) ?? [];
    items.push(item);
    recipeItems.set(item.recipeVersionId, items);
  }

  const stockUsage = new Map<string, number>();
  const valuations = new Map<string, SaleValuation>(
    menu.ingredients.map((ingredient) => [
      ingredient.id,
      {
        quantity: ingredient.currentStockQuantity,
        ...(ingredient.inventoryValueCentimes === undefined
          ? {}
          : { inventoryValueCentimes: ingredient.inventoryValueCentimes }),
        complete: ingredient.costStatus === 'complete',
      },
    ]),
  );
  const ingredientCosts = new Map<string, number | undefined>();
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

    const versionId = product.currentRecipeVersionId;
    const version = versionId ? versions.get(versionId) : undefined;
    if (versionId && (!version || version.productId !== product.id)) {
      throw new Error(`The saved recipe for ${product.name} is unavailable.`);
    }
    const baseRecipe = versionId ? recipeItems.get(versionId) ?? [] : [];

    if (!cartLine.sizeId) {
      throw new Error(`Select a size for ${product.name}.`);
    }

    let unitPriceCentimes: number;
    let lineUsage: Map<string, number>;
    let modifiers: SavedReceipt['lines'][number]['modifiers'];
    let recipe: SavedReceipt['lines'][number]['recipe'];
    let sizeId: string;
    let sizeName: string;
    let choiceValueIds: string[];

    const selectedChoiceIds = [...new Set(cartLine.choiceValueIds ?? [])];
    if (
      selectedChoiceIds.length !== (cartLine.choiceValueIds ?? []).length
      || selectedChoiceIds.length > 40
    ) {
      throw new Error(`Invalid choices for ${product.name}.`);
    }
    const productSizes = menu.productSizes.filter(
      (size) => size.productId === product.id,
    );
    const sections = menu.productChoiceSections.filter(
      (section) => section.productId === product.id,
    );
    const sectionIds = new Set(sections.map((section) => section.id));
    const values = menu.productChoiceValues.filter((value) =>
      sectionIds.has(value.sectionId),
    );
    const valueIds = new Set(values.map((value) => value.id));
    const effects = menu.productChoiceValueEffects.filter((effect) =>
      valueIds.has(effect.valueId),
    );
    const effectIds = new Set(effects.map((effect) => effect.id));
    let resolved;
    try {
      resolved = resolveProductConfiguration({
        sizeId: cartLine.sizeId,
        choiceValueIds: selectedChoiceIds,
        sizes: productSizes,
        recipeItems: baseRecipe.map((item) => ({
          ingredientId: item.ingredientId,
          quantity: item.quantity,
        })),
        sizeQuantities: menu.recipeSizeQuantities.filter(
          (row) => row.recipeVersionId === versionId,
        ),
        sections,
        sectionSizeIds: menu.productChoiceSectionSizes.filter((link) =>
          sectionIds.has(link.sectionId),
        ),
        values,
        valueSizes: menu.productChoiceValueSizes.filter((row) =>
          valueIds.has(row.valueId),
        ),
        effects,
        effectSizes: menu.productChoiceValueEffectSizes.filter((row) =>
          effectIds.has(row.effectId),
        ),
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : `Invalid configuration for ${product.name}.`,
      );
    }
    const size = productSizes.find((row) => row.id === cartLine.sizeId);
    if (!size) throw new Error(`Invalid size for ${product.name}.`);
    unitPriceCentimes = resolved.unitPriceCentimes;
    lineUsage = resolved.ingredients;
    for (const ingredientId of lineUsage.keys()) {
      if (!ingredients.has(ingredientId)) {
        throw new Error(`The saved recipe for ${product.name} is invalid.`);
      }
    }
    sizeId = size.id;
    sizeName = size.name;
    choiceValueIds = selectedChoiceIds;
    modifiers = selectedChoiceIds.map((id) => {
      const value = values.find((row) => row.id === id);
      const section = value
        ? sections.find((row) => row.id === value.sectionId)
        : undefined;
      if (!value || !section) {
        throw new Error(`Invalid choices for ${product.name}.`);
      }
      const sizeRule = menu.productChoiceValueSizes.find(
        (row) => row.valueId === value.id && row.productSizeId === size.id,
      );
      const priceDeltaCentimes =
        sizeRule?.priceDeltaCentimes ?? value.priceDeltaCentimes;
      return {
        groupName: section.name,
        optionName: value.name,
        priceDeltaCentimes,
        ingredientEffects: [],
      };
    });
    recipe = [...lineUsage.entries()].map(([ingredientId, quantity]) => ({
      ingredientId,
      ingredientName:
        ingredients.get(ingredientId)?.name ?? 'Unknown ingredient',
      quantity,
    }));

    if (!Number.isSafeInteger(unitPriceCentimes) || unitPriceCentimes < 0) {
      throw new Error(`The saved price for ${product.name} is invalid.`);
    }

    const valuationRevisions = [...lineUsage.keys()].sort().map((ingredientId) => ({
      ingredientId,
      revision: ingredients.get(ingredientId)?.valuationRevision ?? 0,
    }));
    let ingredientCostCentimes = 0;
    let completeCost = true;
    for (const [ingredientId, quantity] of lineUsage) {
      if (!Number.isSafeInteger(quantity) || quantity < 0) {
        throw new Error(`The saved recipe for ${product.name} is invalid.`);
      }
      const usage = quantity * cartLine.quantity;
      const cost = consumeSnapshotCost(
        valuations.get(ingredientId) ?? { quantity: 0, complete: false },
        usage,
      );
      if (cost === undefined) {
        completeCost = false;
        ingredientCosts.set(ingredientId, undefined);
      } else if (ingredientCosts.has(ingredientId)) {
        ingredientCosts.set(ingredientId, (ingredientCosts.get(ingredientId) ?? 0) + cost);
        ingredientCostCentimes += cost;
      } else {
        ingredientCosts.set(ingredientId, cost);
        ingredientCostCentimes += cost;
      }
      stockUsage.set(
        ingredientId,
        (stockUsage.get(ingredientId) ?? 0) + usage,
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
      ...(completeCost ? { ingredientCostCentimes } : {}),
      costStatus: completeCost ? 'complete' as const : 'incomplete' as const,
      valuationRevisions,
      sizeId,
      sizeName,
      choiceValueIds,
      modifiers,
      recipe,
      ...(cartLine.complimentary === true ? { complimentary: true as const } : {}),
    };
  });
  const subtotalCentimes = lines.reduce(
    (sum, line) => sum + line.lineTotalCentimes,
    0,
  );
  if (!Number.isSafeInteger(subtotalCentimes) || subtotalCentimes < 0) {
    throw new Error('The saved order total is invalid.');
  }
  const discountCentimes = lines.reduce(
    (sum, line) =>
      line.complimentary === true ? sum + line.lineTotalCentimes : sum,
    0,
  );
  if (!Number.isSafeInteger(discountCentimes) || discountCentimes < 0) {
    throw new Error('The saved Offert total is invalid.');
  }
  const totalCentimes = subtotalCentimes - discountCentimes;
  if (!Number.isSafeInteger(totalCentimes) || totalCentimes < 0) {
    throw new Error('The saved order total is invalid.');
  }
  const date = businessDate(completedAt);
  const completeCost = lines.every((line) => line.costStatus === 'complete');
  const ingredientCostCentimes = completeCost
    ? lines.reduce((sum, line) => sum + (line.ingredientCostCentimes ?? 0), 0)
    : undefined;
  const receipt: SavedReceipt = {
    receiptNumber: receiptNumber ?? fallbackReceiptNumber(completedAt),
    completedAt,
    cashierName,
    serviceType: input.serviceType,
    lines,
    subtotalCentimes,
    discountCentimes,
    taxCentimes: 0,
    totalCentimes,
    taxPolicyLabel: TAX_POLICY_LABEL,
    paymentMethod: input.paymentMethod,
    receiptLanguage: language,
    ...(input.tenders
      ? { tenders: validateTenders(input.tenders, totalCentimes) }
      : {}),
    ...(ingredientCostCentimes === undefined ? {} : { ingredientCostCentimes }),
    costStatus: completeCost ? 'complete' : 'incomplete',
  };
  return { receipt, businessDate: date, stockUsage, ingredientCosts };
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
  const actorProfileId = managementIdentifier(
    input.cashierProfileId,
    'Cashier profile ID',
  );
  const menu = await loadOperationalCache(database as SQLiteDBConnection);
  const completedAt = input.completedAt ?? Date.now();
  const receiptNumber = await allocateReceiptNumber(database, completedAt);
  const prepared = prepareSale(menu, { ...input, completedAt }, localSaleId, receiptNumber);
  const { receipt } = prepared;

  await database.run(
    `INSERT INTO sales
      (local_sale_id, device_id, actor_profile_id, receipt_number, status,
       service_type,
       customer_name, table_label, subtotal_centimes, tax_centimes,
       total_centimes, currency, business_date, receipt_snapshot_json,
       ingredient_cost_centimes, cost_status, sync_state, created_at)
     VALUES (?, ?, ?, ?, 'completed', ?, ?, ?, ?, ?, ?, 'MAD', ?, ?, ?, ?, 'pending', ?)`,
    [
      localSaleId,
      deviceId,
      actorProfileId,
      receipt.receiptNumber,
      input.serviceType,
      null,
      null,
      receipt.subtotalCentimes,
      receipt.taxCentimes,
      receipt.totalCentimes,
      prepared.businessDate,
      JSON.stringify(receipt),
      receipt.ingredientCostCentimes ?? null,
      receipt.costStatus,
      receipt.completedAt,
    ],
    false,
  );
  for (const line of receipt.lines) {
    const product = menu.products.find((item) => item.id === line.productId);
    const category = menu.categories.find((item) => item.id === product?.categoryId);
    await database.run(
      `INSERT INTO sale_items
         (id, local_sale_id, product_id, quantity, product_name_snapshot,
         unit_price_centimes, modifier_snapshot_json, recipe_snapshot_json,
         line_total_centimes, ingredient_cost_centimes, cost_status,
         category_id_snapshot, category_name_snapshot,
         size_id_snapshot, size_name_snapshot)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idFactory(),
        localSaleId,
        line.productId,
        line.quantity,
        line.productName,
        line.complimentary === true ? 0 : line.unitPriceCentimes,
        JSON.stringify(line.modifiers),
        JSON.stringify(line.recipe),
        line.complimentary === true ? 0 : line.lineTotalCentimes,
        line.ingredientCostCentimes ?? null,
        line.costStatus,
        category?.id ?? '',
        category?.name ?? '',
        line.sizeId ?? null,
        line.sizeName ?? null,
      ],
      false,
    );
  }
  for (const [ingredientId, quantity] of prepared.stockUsage) {
    if (quantity === 0) continue;
    const ingredientCostCentimes = prepared.ingredientCosts.get(ingredientId);
    const ingredient = menu.ingredients.find((item) => item.id === ingredientId);
    await database.run(
      `UPDATE ingredients
       SET local_stock_delta = local_stock_delta - ?,
           local_inventory_value_delta = local_inventory_value_delta - COALESCE(?, 0),
           updated_at = ?
       WHERE id = ?`,
      [quantity, ingredientCostCentimes ?? null, receipt.completedAt, ingredientId],
      false,
    );
    await database.run(
        `INSERT INTO stock_movements
        (id, ingredient_id, ingredient_name_snapshot,
         ingredient_base_unit_snapshot, local_sale_id, quantity_delta,
         movement_type, reason, actor_label, business_date, created_at,
         cost_delta_centimes)
       VALUES (?, ?, ?, ?, ?, ?, 'sale', ?, ?, ?, ?, ?)`,
      [
        idFactory(),
        ingredientId,
        ingredient?.name ?? '',
        ingredient?.baseUnit ?? '',
        localSaleId,
        -quantity,
        `Recipe deduction for ${receipt.receiptNumber}`,
        receipt.cashierName,
        prepared.businessDate,
        receipt.completedAt,
        ingredientCostCentimes === undefined ? null : -ingredientCostCentimes,
      ],
      false,
    );
  }
  await database.run(
    `INSERT INTO outbox
      (operation_id, device_id, operation_type, local_record_id, state,
       created_at, available_at, depends_on_operation_id)
     VALUES (?, ?, 'sale-completed', ?, 'pending', ?, ?, ?)`,
    [
      operationId,
      deviceId,
      localSaleId,
      receipt.completedAt,
      receipt.completedAt,
      (await latestPendingManagementOperationIdFromDatabase(
        database,
        OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
      )) ?? null,
    ],
    false,
  );
  return { localSaleId, operationId, deviceId, receipt };
}

export function completeLocalSale(input: CompleteSaleInput) {
  return withLocalTransaction((database) => commitLocalSale(database, input));
}

export async function cancelLocalSale(
  database: SaleDatabase,
  {
    originalLocalSaleId,
    reason,
    actorProfileId,
    actorName,
    correctedAt = Date.now(),
  }: {
    originalLocalSaleId: string;
    reason: string;
    actorProfileId: string;
    actorName: string;
    correctedAt?: number;
  },
  idFactory = () => crypto.randomUUID(),
) {
  if (!/^[A-Za-z0-9._:-]+$/.test(originalLocalSaleId) || originalLocalSaleId.length > 128) {
    throw new Error('The original sale ID is invalid.');
  }
  const cleanedReason = reason.trim();
  if (cleanedReason.length < 3 || cleanedReason.length > 240) {
    throw new Error('Correction reason must contain 3 to 240 characters.');
  }
  const savedActorProfileId = managementIdentifier(
    actorProfileId,
    'Correction actor profile ID',
  );
  if (!actorName.trim() || actorName.length > 120) throw new Error('Correction actor is invalid.');
  if (!Number.isSafeInteger(correctedAt) || correctedAt < 0) throw new Error('Correction time is invalid.');
  const originalResult = await database.query(
    `SELECT local_sale_id, device_id, status, business_date
     FROM sales WHERE local_sale_id = ? LIMIT 1`,
    [originalLocalSaleId],
  );
  const original = originalResult.values?.[0];
  if (!original) throw new Error('The saved order is unavailable on this tablet.');
  if (original.status !== 'completed') throw new Error('Only a completed order can be corrected.');
  const date = String(original.business_date);
  if (date !== businessDate(correctedAt)) {
    throw new Error('Only a same-calendar-day order can be corrected.');
  }
  const previous = await database.query(
    `SELECT local_correction_id FROM sale_corrections
     WHERE original_local_sale_id = ? LIMIT 1`,
    [originalLocalSaleId],
  );
  if (previous.values?.[0]) throw new Error('This order already has a correction.');
  const movements = await database.query(
    `SELECT ingredient_id, ingredient_name_snapshot,
      ingredient_base_unit_snapshot, quantity_delta, cost_delta_centimes
     FROM stock_movements
     WHERE local_sale_id = ? AND movement_type = 'sale'
     ORDER BY id LIMIT 101`,
    [originalLocalSaleId],
  );
  if ((movements.values?.length ?? 0) > 100) throw new Error('Saved stock history is invalid.');
  const localCorrectionId = idFactory();
  const operationId = idFactory();
  await database.run(
    `UPDATE sales SET status = 'cancelled' WHERE local_sale_id = ?`,
    [originalLocalSaleId],
    false,
  );
  for (const movement of movements.values ?? []) {
    const quantityDelta = Number(movement.quantity_delta);
    const costDelta = movement.cost_delta_centimes === null || movement.cost_delta_centimes === undefined
      ? undefined
      : Number(movement.cost_delta_centimes);
    if (!Number.isSafeInteger(quantityDelta) || quantityDelta >= 0 || (costDelta !== undefined && !Number.isSafeInteger(costDelta))) {
      throw new Error('Saved stock history is invalid.');
    }
    await database.run(
      `UPDATE ingredients
       SET local_stock_delta = local_stock_delta - ?,
           local_inventory_value_delta = local_inventory_value_delta - COALESCE(?, 0),
           updated_at = ?
       WHERE id = ?`,
      [quantityDelta, costDelta ?? null, correctedAt, String(movement.ingredient_id)],
      false,
    );
    await database.run(
      `INSERT INTO stock_movements
       (id, ingredient_id, ingredient_name_snapshot,
        ingredient_base_unit_snapshot, local_sale_id, quantity_delta,
        movement_type, reason, actor_label, business_date, created_at,
        cost_delta_centimes)
       VALUES (?, ?, ?, ?, ?, ?, 'cancellation', ?, ?, ?, ?, ?)`,
      [
        idFactory(),
        String(movement.ingredient_id),
        String(movement.ingredient_name_snapshot),
        String(movement.ingredient_base_unit_snapshot),
        originalLocalSaleId,
        -quantityDelta,
        `Cancellation: ${cleanedReason}`,
        actorName.trim(),
        date,
        correctedAt,
        costDelta === undefined ? null : -costDelta,
      ],
      false,
    );
  }
  await database.run(
    `INSERT INTO sale_corrections
     (local_correction_id, original_local_sale_id, device_id, actor_profile_id,
      reason, actor_name, business_date, corrected_at, sync_state)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      localCorrectionId,
      originalLocalSaleId,
      String(original.device_id),
      savedActorProfileId,
      cleanedReason,
      actorName.trim(),
      date,
      correctedAt,
    ],
    false,
  );
  await database.run(
    `INSERT INTO outbox
     (operation_id, device_id, operation_type, local_record_id, state, created_at,
      available_at, depends_on_operation_id)
     VALUES (?, ?, 'sale-cancelled', ?, 'pending', ?, ?, ?)`,
    [
      operationId,
      String(original.device_id),
      localCorrectionId,
      correctedAt,
      correctedAt,
      (await database.query(
        `SELECT operation_id FROM outbox
         WHERE operation_type = 'sale-completed' AND local_record_id = ?
         LIMIT 1`,
        [originalLocalSaleId],
      )).values?.[0]?.operation_id ?? null,
    ],
    false,
  );
  return { localCorrectionId, operationId, originalLocalSaleId, correctedAt };
}

export function completeLocalSaleCancellation(
  input: Parameters<typeof cancelLocalSale>[1],
) {
  return withLocalTransaction((database) => cancelLocalSale(database, input));
}

async function loadSaleSyncPayload(
  localSaleId: string,
): Promise<SaleSyncPayload> {
  const database = await openLocalDatabase();
  const result = await database.query(
    `SELECT device_id, actor_profile_id, receipt_number, service_type, business_date,
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
    ...(row.actor_profile_id
      ? { actorProfileId: String(row.actor_profile_id) }
      : {}),
    actorName: String(receipt.cashierName ?? ''),
    deviceId: String(row.device_id),
    localSaleId,
    receiptNumber: String(row.receipt_number),
    serviceMode: row.service_type === 'dine-in' ? 'dine-in' : 'take-away',
    paymentMethod: receipt.paymentMethod === 'Card' ? 'Card' : 'Cash',
    receiptLanguage: receipt.receiptLanguage === 'fr' ? 'fr' : 'en',
    ...(receipt.tenders ? { tenders: receipt.tenders } : {}),
    businessDate: String(row.business_date),
    completedAt: receipt.completedAt,
    ...(receipt.ingredientCostCentimes === undefined
      ? {}
      : { ingredientCostCentimes: receipt.ingredientCostCentimes }),
    costStatus: receipt.costStatus,
    lines: receipt.lines.map((line) => ({
      productId: line.productId,
      productRevision: line.productRevision,
      ...(line.recipeVersionId
        ? { recipeVersionId: line.recipeVersionId }
        : {}),
      quantity: line.quantity,
      sizeId: line.sizeId,
      choiceValueIds: line.choiceValueIds ?? [],
      modifierOptionIds: [],
      ...(line.ingredientCostCentimes === undefined
        ? {}
        : { ingredientCostCentimes: line.ingredientCostCentimes }),
      costStatus: line.costStatus,
      valuationRevisions: line.valuationRevisions,
      ...(line.complimentary === true ? { complimentary: true as const } : {}),
    })),
  };
}

async function loadSaleCancellationPayload(
  localCorrectionId: string,
): Promise<SaleCancellationPayload> {
  const database = await openLocalDatabase();
  const result = await database.query(
    `SELECT device_id, actor_profile_id, local_correction_id,
      original_local_sale_id, reason, actor_name, business_date, corrected_at
     FROM sale_corrections WHERE local_correction_id = ? LIMIT 1`,
    [localCorrectionId],
  );
  const row = result.values?.[0];
  if (!row) throw new Error('The pending correction is missing.');
  return {
    ...(row.actor_profile_id
      ? { actorProfileId: String(row.actor_profile_id) }
      : {}),
    actorName: String(row.actor_name),
    deviceId: String(row.device_id),
    localCorrectionId: String(row.local_correction_id),
    originalLocalSaleId: String(row.original_local_sale_id),
    reason: String(row.reason),
    businessDate: String(row.business_date),
    correctedAt: Number(row.corrected_at),
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

async function acknowledgeSaleCancellation(
  operationId: string,
  localCorrectionId: string,
  cloudCorrectionId: string,
  acknowledgedAt: number,
) {
  return withLocalTransaction(async (database) => {
    await database.run(
      `UPDATE sale_corrections
       SET cloud_correction_id = ?, sync_state = 'synced'
       WHERE local_correction_id = ?`,
      [cloudCorrectionId, localCorrectionId],
      false,
    );
    await database.run(
      'DELETE FROM outbox WHERE operation_id = ? AND local_record_id = ?',
      [operationId, localCorrectionId],
      false,
    );
    await database.run(
      `UPDATE sync_state SET last_success_at = ?, last_error = NULL WHERE id = 1`,
      [acknowledgedAt],
      false,
    );
  });
}

function convexFailureMessage(caught: unknown): string {
  if (caught && typeof caught === 'object' && 'data' in caught) {
    const data = (caught as { data?: unknown }).data;
    if (
      data
      && typeof data === 'object'
      && data !== null
      && 'message' in data
      && typeof (data as { message: unknown }).message === 'string'
    ) {
      return (data as { message: string }).message.trim();
    }
  }
  const message = caught instanceof Error ? caught.message : String(caught ?? '');
  const embedded = message.match(/ConvexError:\s*(\{[\s\S]*\})\s*$/);
  if (embedded) {
    try {
      const parsed = JSON.parse(embedded[1]) as { message?: unknown };
      if (typeof parsed.message === 'string' && parsed.message.trim()) {
        return parsed.message.trim();
      }
    } catch {
      /* keep raw message */
    }
  }
  return message.trim();
}

const PERMANENT_SALE_SYNC_FAILURE =
  /no longer available|changed after it was added|has a newer recipe|cost no longer matches|modifier setup is unavailable|selected modifier .* is unavailable|category is unavailable|receipt-number support|Receipt number must use/i;

export function describeSaleSyncFailure(caught: unknown, fallback: string) {
  const message = convexFailureMessage(caught);
  if (/original sale has not synchronized|original order must synchronize/i.test(message)) {
    return 'The original order must synchronize before its correction.';
  }
  if (/receipt number|Receipt number must use/i.test(message)) {
    return 'This saved order needs receipt-number support before it can synchronize.';
  }
  if (/unauthenticated|sign-in is required|staff session is unavailable/i.test(message)) {
    return 'Synchronization access is unavailable. Restore terminal access and try again.';
  }
  if (/network|failed to fetch|offline/i.test(message)) {
    return CONNECTION_SYNC_FAILURE;
  }
  if (PERMANENT_SALE_SYNC_FAILURE.test(message)) {
    return message.length <= 180 ? message : fallback;
  }
  const raw = caught instanceof Error ? caught.message : String(caught ?? '');
  if (
    /extra field|not in the validator|ArgumentValidation/i.test(message)
    || /INVALID_ARGUMENT/i.test(raw)
  ) {
    return 'Cloud rejected this saved order. Use Sync now to retry.';
  }
  return fallback;
}

export function isPermanentSaleSyncFailure(message: string) {
  return PERMANENT_SALE_SYNC_FAILURE.test(message)
    || /receipt-number support/i.test(message);
}

async function abandonSale(
  operationId: string,
  localSaleId: string,
  error: string,
) {
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
      `DELETE FROM outbox WHERE operation_id = ? AND local_record_id = ?`,
      [operationId, localSaleId],
      false,
    );
    await database.run(
      `UPDATE sync_state SET last_error = ? WHERE id = 1`,
      [error],
      false,
    );
  });
}

async function abandonSaleCancellation(
  operationId: string,
  localCorrectionId: string,
  error: string,
) {
  return withLocalTransaction(async (database) => {
    await database.run(
      `UPDATE sale_corrections SET sync_state = 'failed' WHERE local_correction_id = ?`,
      [localCorrectionId],
      false,
    );
    await database.run(
      `DELETE FROM outbox WHERE operation_id = ? AND local_record_id = ?`,
      [operationId, localCorrectionId],
      false,
    );
    await database.run(
      `UPDATE sync_state SET last_error = ? WHERE id = 1`,
      [error],
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
  const error = describeSaleSyncFailure(caught, 'Sale synchronization failed.');
  if (isPermanentSaleSyncFailure(error)) {
    return abandonSale(operationId, localSaleId, error);
  }
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

async function failSaleCancellation(
  operationId: string,
  localCorrectionId: string,
  attemptCount: number,
  caught: unknown,
) {
  const error = describeSaleSyncFailure(caught, 'Correction synchronization failed.');
  if (
    isPermanentSaleSyncFailure(error)
    || /original order must synchronize/i.test(error)
  ) {
    // If the original can never sync (or is already gone from the outbox),
    // keep retrying the correction only while the parent sale-completed row
    // still exists.
    if (!/original order must synchronize/i.test(error)) {
      return abandonSaleCancellation(operationId, localCorrectionId, error);
    }
    const parentPending = await listPendingOutbox(Date.now(), 100, ['sale-completed']);
    const correction = await loadSaleCancellationPayload(localCorrectionId);
    const parentStillQueued = parentPending.some(
      (entry) => entry.localRecordId === correction.originalLocalSaleId,
    );
    if (!parentStillQueued) {
      return abandonSaleCancellation(
        operationId,
        localCorrectionId,
        'The original order can no longer synchronize, so this correction was dropped from the sync queue.',
      );
    }
  }
  const retryAt = Date.now() + Math.min(60_000, 1_000 * 2 ** Math.min(attemptCount, 6));
  return withLocalTransaction(async (database) => {
    await database.run(
      `UPDATE sale_corrections SET sync_state = 'failed' WHERE local_correction_id = ?`,
      [localCorrectionId],
      false,
    );
    await database.run(
      `UPDATE outbox SET state = 'failed', attempt_count = attempt_count + 1,
       last_error = ?, available_at = ? WHERE operation_id = ?`,
      [error, retryAt, operationId],
      false,
    );
    await database.run(
      `UPDATE sync_state SET last_error = ? WHERE id = 1`,
      [error],
      false,
    );
  });
}

export async function syncPendingSales(
  acceptSale: (
    input: SaleSyncPayload,
  ) => Promise<{ saleId: string; acknowledgedAt: number }>,
  cancelSale?: (
    input: SaleCancellationPayload,
  ) => Promise<
    | { kind: 'cancelled'; correctionId: string; acknowledgedAt: number }
    | { kind: 'original-pending' }
  >,
) {
  const entries = await listPendingOutbox(
    Date.now(),
    10,
    ['sale-completed', 'sale-cancelled'],
  );
  let synced = 0;
  let failed = 0;
  for (const entry of entries) {
    if (entry.operationType === 'sale-completed') {
      try {
        const database = await openLocalDatabase();
        const existing = await database.query(
          `SELECT cloud_sale_id FROM sales WHERE local_sale_id = ? LIMIT 1`,
          [entry.localRecordId],
        );
        const cloudSaleId = existing.values?.[0]?.cloud_sale_id
          ? String(existing.values[0].cloud_sale_id)
          : '';
        if (cloudSaleId) {
          await acknowledgeSale(
            entry.operationId,
            entry.localRecordId,
            cloudSaleId,
            Date.now(),
          );
          synced += 1;
          continue;
        }
        const result = await acceptSale(await loadSaleSyncPayload(entry.localRecordId));
        await acknowledgeSale(entry.operationId, entry.localRecordId, result.saleId, result.acknowledgedAt);
        synced += 1;
      } catch (error) {
        await failSale(entry.operationId, entry.localRecordId, entry.attemptCount, error);
        failed += 1;
      }
      continue;
    }
    if (entry.operationType === 'sale-cancelled') {
      try {
        if (!cancelSale) throw new Error('Correction synchronization is unavailable.');
        const result = await cancelSale(await loadSaleCancellationPayload(entry.localRecordId));
        if (result.kind === 'original-pending') {
          throw new Error('The original order must synchronize before its correction.');
        }
        await acknowledgeSaleCancellation(entry.operationId, entry.localRecordId, result.correctionId, result.acknowledgedAt);
        synced += 1;
      } catch (error) {
        await failSaleCancellation(entry.operationId, entry.localRecordId, entry.attemptCount, error);
        failed += 1;
      }
    }
  }
  return { synced, failed, processed: entries.length };
}
