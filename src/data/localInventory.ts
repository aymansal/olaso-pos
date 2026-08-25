import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type {
  IngredientSaveInput,
  ManagedIngredient,
  StockAdjustmentMode,
} from '../features/stock/stockManagementTypes.ts';
import {
  allocateCentimes,
  consumeValuation,
  receiveValuation,
  type InventoryValuation,
} from '../lib/costs.ts';
import { withLocalTransaction } from './localDatabase.ts';
import {
  enqueueManagementOperation,
  latestPendingManagementOperationIdFromDatabase,
  latestPendingSaleForRecordFromDatabase,
} from './localManagement.ts';
import {
  OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
  type LocalManagementActor,
} from './managementOperation.ts';
import { keyFromName } from './managementMutations.ts';

type Database = Pick<SQLiteDBConnection, 'query' | 'run'>;
type Transaction = <T>(operation: (database: Database) => Promise<T>) => Promise<T>;
type Context = { deviceId: string; actor: LocalManagementActor };

const MAX_QUANTITY = 100_000_000;
const MAX_TIME = 8_640_000_000_000_000;
const units = new Set(['millilitre', 'gram', 'milligram', 'piece']);
const id = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

function integer(value: number, label: string, minimum = 0, maximum = MAX_QUANTITY) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
}

function multiplied(left: number, right: number, label: string) {
  const value = BigInt(left) * BigInt(right);
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`${label} is invalid.`);
  return Number(value);
}

function text(value: string, label: string, limit: number) {
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > limit) throw new Error(`${label} is invalid.`);
  return cleaned;
}

function optionalText(value: string | undefined, label: string, limit: number) {
  if (value === undefined || !value.trim()) return undefined;
  return text(value, label, limit);
}

function date(value: string) {
  const parsed = Date.parse(`${value}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)
      || !Number.isFinite(parsed)
      || new Date(parsed).toISOString().slice(0, 10) !== value) {
    throw new Error('Business date is invalid.');
  }
  return value;
}

async function ingredient(database: Database, ingredientId: string) {
  return (await database.query(
    `SELECT *,
      current_stock_quantity + local_stock_delta AS effective_quantity,
      CASE WHEN inventory_value_centimes IS NULL THEN NULL
        ELSE inventory_value_centimes + local_inventory_value_delta END
        AS effective_value
     FROM ingredients WHERE id = ? LIMIT 1`,
    [ingredientId],
  )).values?.[0];
}

function valuation(row: Record<string, unknown>): InventoryValuation {
  const quantity = integer(Number(row.effective_quantity), 'Stock quantity');
  const value = row.effective_value === null || row.effective_value === undefined
    ? undefined
    : integer(Number(row.effective_value), 'Inventory value', 0, MAX_TIME);
  return {
    quantity,
    ...(value === undefined ? {} : { inventoryValueCentimes: value }),
    complete: row.cost_status === 'complete' && value !== undefined,
  };
}

async function saveValuation(
  database: Database,
  row: Record<string, unknown>,
  next: InventoryValuation,
  valuationRevision: number,
  revision: number,
  updatedAt: number,
) {
  const baseQuantity = Number(row.current_stock_quantity);
  if (next.complete && next.inventoryValueCentimes !== undefined) {
    const baseValue = row.inventory_value_centimes === null
      ? 0
      : Number(row.inventory_value_centimes);
    await database.run(
      `UPDATE ingredients SET local_stock_delta = ?,
       inventory_value_centimes = ?, local_inventory_value_delta = ?,
       cost_status = 'complete', valuation_revision = ?, revision = ?,
       updated_at = ? WHERE id = ?`,
      [next.quantity - baseQuantity, baseValue,
        next.inventoryValueCentimes - baseValue, valuationRevision,
        revision, updatedAt, String(row.id)],
      false,
    );
    return;
  }
  await database.run(
    `UPDATE ingredients SET local_stock_delta = ?, inventory_value_centimes = NULL,
     local_inventory_value_delta = 0, cost_status = 'incomplete',
     valuation_revision = ?, revision = ?, updated_at = ? WHERE id = ?`,
    [next.quantity - baseQuantity, valuationRevision, revision, updatedAt,
      String(row.id)],
    false,
  );
}

async function dependency(database: Database) {
  return latestPendingManagementOperationIdFromDatabase(
    database,
    OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
  );
}

export function saveLocalIngredient(
  context: Context,
  input: IngredientSaveInput,
  businessDate: string,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const now = Date.now();
    const name = text(input.name, 'Ingredient name', 100);
    const lowStockThreshold = integer(input.lowStockThreshold, 'Low-stock threshold');
    if (!units.has(input.baseUnit)) throw new Error('Base unit is invalid.');
    const saved = input.id ? await ingredient(database, input.id) : undefined;
    if (input.id && !saved) throw new Error('Ingredient is unavailable.');
    if (saved && Number(saved.revision) !== input.expectedRevision) {
      throw new Error('Ingredient changed. Refresh it before saving.');
    }
    if (saved?.status === 'archived') {
      throw new Error('Restore this ingredient before editing it.');
    }
    if (saved && saved.base_unit !== input.baseUnit) {
      throw new Error('Base unit cannot change after ingredient creation.');
    }
    const localId = input.id ?? id('ingredient');
    const key = saved
      ? String(saved.key)
      : keyFromName(name, `ingredient-${crypto.randomUUID()}`);
    if (!saved && (await database.query(
      'SELECT 1 FROM ingredients WHERE key = ? LIMIT 1',
      [key],
    )).values?.[0]) {
      throw new Error('An ingredient with this name already exists.');
    }
    const openingQuantity = integer(input.openingQuantity ?? 0, 'Opening quantity');
    const revision = saved ? Number(saved.revision) + 1 : 1;
    const operationId = crypto.randomUUID();
    if (saved) {
      await database.run(
        `UPDATE ingredients SET name = ?, low_stock_threshold = ?,
         revision = ?, updated_at = ? WHERE id = ?`,
        [name, lowStockThreshold, revision, now, localId],
        false,
      );
    } else {
      await database.run(
        `INSERT INTO ingredients
          (id, key, name, base_unit, current_stock_quantity,
           low_stock_threshold, status, revision, updated_at,
           local_stock_delta, inventory_value_centimes, cost_status,
           valuation_revision, local_inventory_value_delta)
         VALUES (?, ?, ?, ?, ?, ?, 'active', 1, ?, 0, NULL, 'incomplete', 0, 0)`,
        [localId, key, name, input.baseUnit, openingQuantity,
          lowStockThreshold, now],
        false,
      );
      if (openingQuantity > 0) {
        await database.run(
          `INSERT INTO stock_movements
            (id, ingredient_id, quantity_delta, movement_type, reason,
             actor_label, business_date, created_at, client_mutation_id)
           VALUES (?, ?, ?, 'stock-addition', ?, ?, ?, ?, ?)`,
          [id('movement'), localId, openingQuantity, `Opening stock for ${name}`,
            context.actor.name, date(businessDate), now, operationId],
          false,
        );
      }
    }
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationId,
      operationType: 'management.ingredient.save',
      localRecordId: localId,
      dependsOnOperationId: await dependency(database),
      requiredPermission: 'stock',
      actor: context.actor,
      expectedRevision: input.expectedRevision,
      payload: {
        ...(saved ? {} : { key, openingQuantity }),
        name,
        baseUnit: input.baseUnit,
        lowStockThreshold,
        businessDate: date(businessDate),
      },
      createdAt: now,
    });
    return { id: localId, revision, operationId: operation.operationId };
  });
}

export function setLocalIngredientArchived(
  context: Context,
  input: Pick<ManagedIngredient, 'id' | 'revision'>,
  archived: boolean,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const saved = await ingredient(database, input.id);
    if (!saved || Number(saved.revision) !== input.revision) {
      throw new Error('Ingredient changed. Refresh it before saving.');
    }
    const now = Date.now();
    await database.run(
      `UPDATE ingredients SET status = ?, revision = ?, updated_at = ? WHERE id = ?`,
      [archived ? 'archived' : 'active', input.revision + 1, now, input.id],
      false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.ingredient.archive',
      localRecordId: input.id,
      dependsOnOperationId: await dependency(database),
      requiredPermission: 'stock',
      actor: context.actor,
      expectedRevision: input.revision,
      payload: { archived },
      createdAt: now,
    });
    return { id: input.id, revision: input.revision + 1, operationId: operation.operationId };
  });
}

export function deleteLocalIngredient(
  context: Context,
  input: Pick<ManagedIngredient, 'id' | 'revision'>,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const saved = await ingredient(database, input.id);
    if (!saved || Number(saved.revision) !== input.revision) {
      throw new Error('Ingredient changed. Refresh it before deleting.');
    }
    const saleDependency = await latestPendingSaleForRecordFromDatabase(
      database, 'ingredient', input.id, OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
    );
    const pendingSaleRevisions = await database.query(
      `SELECT COUNT(DISTINCT outbox.operation_id) AS count FROM outbox
       LEFT JOIN sale_corrections correction
         ON outbox.operation_type = 'sale-cancelled'
        AND correction.local_correction_id = outbox.local_record_id
       JOIN stock_movements movement
         ON movement.local_sale_id = CASE
           WHEN outbox.operation_type = 'sale-completed'
             THEN outbox.local_record_id
           ELSE correction.original_local_sale_id
         END
       WHERE outbox.operation_type IN ('sale-completed', 'sale-cancelled')
         AND movement.movement_type = 'sale'
         AND movement.ingredient_id = ?`,
      [input.id],
    );
    const now = Date.now();
    const recipes = await database.query(
      `SELECT product.id, product.name, product.current_recipe_version_id
       FROM products product
       JOIN recipe_items item
         ON item.recipe_version_id = product.current_recipe_version_id
       WHERE item.ingredient_id = ? LIMIT 201`,
      [input.id],
    );
    if ((recipes.values?.length ?? 0) > 200) {
      throw new Error('Too many products use this ingredient.');
    }
    const options = await database.query(
      `SELECT id, modifier_group_id, ingredient_effects_json
       FROM modifier_options LIMIT 1001`,
    );
    if ((options.values?.length ?? 0) > 1_000) {
      throw new Error('Too many product choices are saved.');
    }
    const affectedProducts = new Set<string>();
    const repairs: Array<{ productId: string; localRecipeId?: string }> = [];
    for (const product of recipes.values ?? []) {
      const productId = String(product.id);
      const previousRecipeId = String(product.current_recipe_version_id);
      const remaining = await database.query(
        `SELECT item.ingredient_id, item.quantity,
          COALESCE(ingredient.name, item.ingredient_name_snapshot) AS name,
          COALESCE(ingredient.base_unit,
            item.ingredient_base_unit_snapshot) AS base_unit
         FROM recipe_items item
         LEFT JOIN ingredients ingredient ON ingredient.id = item.ingredient_id
         WHERE item.recipe_version_id = ? AND item.ingredient_id <> ?
         LIMIT 101`,
        [previousRecipeId, input.id],
      );
      if ((remaining.values?.length ?? 0) > 100) {
        throw new Error('Product recipe exceeds its supported size.');
      }
      await database.run(
        'UPDATE recipe_versions SET is_active = 0 WHERE product_id = ?',
        [productId],
        false,
      );
      let recipeId: string | undefined;
      if (remaining.values?.length) {
        const latest = await database.query(
          `SELECT COALESCE(MAX(version), 0) AS version
           FROM recipe_versions WHERE product_id = ?`,
          [productId],
        );
        recipeId = id('recipe');
        await database.run(
          `INSERT INTO recipe_versions
            (id, product_id, product_name_snapshot, version, is_active, created_at)
           VALUES (?, ?, ?, ?, 1, ?)`,
          [recipeId, productId, String(product.name),
            Number(latest.values?.[0]?.version ?? 0) + 1, now],
          false,
        );
        for (const item of remaining.values) {
          await database.run(
            `INSERT INTO recipe_items
              (recipe_version_id, ingredient_id, ingredient_name_snapshot,
               ingredient_base_unit_snapshot, quantity)
             VALUES (?, ?, ?, ?, ?)`,
            [recipeId, String(item.ingredient_id), String(item.name),
              String(item.base_unit), Number(item.quantity)],
            false,
          );
        }
      }
      await database.run(
        `UPDATE products SET current_recipe_version_id = ?,
          status = CASE WHEN status = 'archived'
            THEN 'archived' ELSE 'unavailable' END,
          revision = revision + 1, updated_at = ? WHERE id = ?`,
        [recipeId ?? null, now, productId],
        false,
      );
      affectedProducts.add(productId);
      repairs.push({ productId, ...(recipeId ? { localRecipeId: recipeId } : {}) });
    }
    for (const option of options.values ?? []) {
      const effects = JSON.parse(String(option.ingredient_effects_json)) as
        Array<{ ingredientId: string; quantityDelta: number }>;
      const remaining = effects.filter((effect) => effect.ingredientId !== input.id);
      if (remaining.length === effects.length) continue;
      await database.run(
        `UPDATE modifier_options SET ingredient_effects_json = ?,
          revision = revision + 1, updated_at = ? WHERE id = ?`,
        [JSON.stringify(remaining), now, String(option.id)],
        false,
      );
      const products = await database.query(
        `SELECT product_id FROM product_modifier_groups
         WHERE modifier_group_id = ? LIMIT 201`,
        [String(option.modifier_group_id)],
      );
      if ((products.values?.length ?? 0) > 200) {
        throw new Error('Too many products use this choice.');
      }
      for (const product of products.values ?? []) {
        const productId = String(product.product_id);
        if (affectedProducts.has(productId)) continue;
        await database.run(
          `UPDATE products SET status = CASE WHEN status = 'archived'
             THEN 'archived' ELSE 'unavailable' END,
           revision = revision + 1, updated_at = ? WHERE id = ?`,
          [now, productId],
          false,
        );
        affectedProducts.add(productId);
      }
    }
    for (const table of ['recipe_items', 'stock_movements', 'inventory_purchases']) {
      await database.run(
        `UPDATE ${table} SET ingredient_name_snapshot = ?,
          ingredient_base_unit_snapshot = ? WHERE ingredient_id = ?`,
        [String(saved.name), String(saved.base_unit), input.id],
        false,
      );
    }
    await database.run('DELETE FROM ingredients WHERE id = ?', [input.id], false);
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.ingredient.delete',
      localRecordId: input.id,
      dependsOnOperationId: saleDependency ?? await dependency(database),
      requiredPermission: 'stock',
      actor: context.actor,
      expectedRevision: input.revision,
      payload: {
        name: String(saved.name),
        baseUnit: String(saved.base_unit),
        pendingSaleRevisionCount: Number(
          pendingSaleRevisions.values?.[0]?.count ?? 0,
        ),
        repairs,
      },
      createdAt: now,
    });
    return {
      id: input.id,
      affectedProductIds: [...affectedProducts],
      operationId: operation.operationId,
    };
  });
}

export function receiveLocalPurchase(
  context: Context,
  savedIngredient: Pick<ManagedIngredient, 'id' | 'revision'>,
  input: {
    packageLabel: string;
    packageCount: number;
    quantityPerPackage: number;
    packagePriceCentimes: number;
    supplierLabel?: string;
    note?: string;
    receivedAt?: number;
    businessDate: string;
  },
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const row = await ingredient(database, savedIngredient.id);
    if (!row || Number(row.revision) !== savedIngredient.revision) {
      throw new Error('Ingredient changed. Refresh it before receiving the purchase.');
    }
    if (row.status !== 'active') throw new Error('Restore this ingredient before receiving a purchase.');
    const packageLabel = text(input.packageLabel, 'Package label', 40);
    const packageCount = integer(input.packageCount, 'Package count', 1);
    const quantityPerPackage = integer(input.quantityPerPackage, 'Quantity per package', 1);
    const packagePriceCentimes = integer(input.packagePriceCentimes, 'Package price', 1, MAX_TIME);
    const totalQuantity = multiplied(packageCount, quantityPerPackage, 'Total quantity');
    const totalCostCentimes = multiplied(packageCount, packagePriceCentimes, 'Total purchase cost');
    const receivedAt = integer(input.receivedAt ?? Date.now(), 'Received time', 0, MAX_TIME);
    const current = valuation(row);
    integer(current.quantity + totalQuantity, 'Resulting stock quantity');
    const next = receiveValuation(current, totalQuantity, totalCostCentimes);
    const valuationRevision = Number(row.valuation_revision) + 1;
    const revision = Number(row.revision) + 1;
    const operationId = crypto.randomUUID();
    const movementId = id('movement');
    const purchaseId = id('purchase');
    await database.run(
      `INSERT INTO stock_movements
        (id, ingredient_id, quantity_delta, movement_type, reason, actor_label,
         business_date, created_at, cost_delta_centimes,
         inventory_value_after_centimes, valuation_revision, client_mutation_id)
       VALUES (?, ?, ?, 'purchase', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [movementId, savedIngredient.id, totalQuantity,
        `Purchase receipt: ${packageCount} ${packageLabel}`, context.actor.name,
        date(input.businessDate), receivedAt, totalCostCentimes,
        next.inventoryValueCentimes ?? null, valuationRevision, operationId],
      false,
    );
    await database.run(
      `INSERT INTO inventory_purchases
        (id, ingredient_id, stock_movement_id, package_label, package_count,
         quantity_per_package, total_quantity, package_price_centimes,
         total_cost_centimes, received_at, business_date, supplier_label, note,
         transaction_type, revision, client_mutation_id, actor_label)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', 1, ?, ?)`,
      [purchaseId, savedIngredient.id, movementId, packageLabel, packageCount,
        quantityPerPackage, totalQuantity, packagePriceCentimes,
        totalCostCentimes, receivedAt, date(input.businessDate),
        optionalText(input.supplierLabel, 'Supplier label', 100) ?? null,
        optionalText(input.note, 'Purchase note', 240) ?? null,
        operationId, context.actor.name],
      false,
    );
    await saveValuation(database, row, next, valuationRevision, revision, receivedAt);
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationId,
      operationType: 'management.inventory.purchase',
      localRecordId: purchaseId,
      dependsOnOperationId: await dependency(database),
      requiredPermission: 'stock',
      actor: context.actor,
      expectedRevision: savedIngredient.revision,
      payload: {
        ingredientId: savedIngredient.id,
        packageLabel,
        packageCount,
        quantityPerPackage,
        packagePriceCentimes,
        receivedAt,
        businessDate: date(input.businessDate),
        ...(optionalText(input.supplierLabel, 'Supplier label', 100)
          ? { supplierLabel: optionalText(input.supplierLabel, 'Supplier label', 100) }
          : {}),
        ...(optionalText(input.note, 'Purchase note', 240)
          ? { note: optionalText(input.note, 'Purchase note', 240) }
          : {}),
        localMovementId: movementId,
      },
      createdAt: receivedAt,
    });
    return { purchaseId, movementId, ingredientRevision: revision,
      operationId: operation.operationId };
  });
}

export function recordLocalStockAdjustment(
  context: Context,
  savedIngredient: Pick<ManagedIngredient, 'id' | 'revision'>,
  mode: StockAdjustmentMode,
  quantityInput: number,
  reasonInput: string,
  businessDate: string,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const row = await ingredient(database, savedIngredient.id);
    if (!row || Number(row.revision) !== savedIngredient.revision) {
      throw new Error('Ingredient changed. Refresh it before changing stock.');
    }
    if (row.status !== 'active') throw new Error('Restore this ingredient before changing stock.');
    const quantity = integer(quantityInput, 'Stock quantity', mode === 'receive' ? 1 : 0);
    const current = valuation(row);
    const quantityDelta = mode === 'receive' ? quantity : quantity - current.quantity;
    if (quantityDelta === 0) throw new Error('The counted quantity already matches the current stock.');
    const nextQuantity = integer(current.quantity + quantityDelta, 'Resulting stock quantity');
    let next: InventoryValuation;
    let costDeltaCentimes: number | undefined;
    if (mode === 'receive') {
      next = { quantity: nextQuantity, complete: false };
    } else if (quantityDelta < 0) {
      const consumed = consumeValuation(current, -quantityDelta);
      next = consumed.next;
      if (consumed.cost.complete) costDeltaCentimes = -consumed.cost.costCentimes;
    } else if (current.complete && current.quantity > 0) {
      const increaseCost = allocateCentimes(
        current.inventoryValueCentimes!,
        current.quantity,
        quantityDelta,
      );
      next = receiveValuation(current, quantityDelta, increaseCost);
      costDeltaCentimes = increaseCost;
    } else {
      next = { quantity: nextQuantity, complete: false };
    }
    const reason = text(reasonInput, 'Adjustment reason', 160);
    const now = Date.now();
    const operationId = crypto.randomUUID();
    const movementId = id('movement');
    const valuationRevision = Number(row.valuation_revision) + 1;
    const revision = Number(row.revision) + 1;
    await database.run(
      `INSERT INTO stock_movements
        (id, ingredient_id, quantity_delta, movement_type, reason, actor_label,
         business_date, created_at, cost_delta_centimes,
         inventory_value_after_centimes, valuation_revision, client_mutation_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [movementId, savedIngredient.id, quantityDelta,
        mode === 'receive' ? 'stock-addition' : 'manual-adjustment', reason,
        context.actor.name, date(businessDate), now, costDeltaCentimes ?? null,
        next.inventoryValueCentimes ?? null, valuationRevision, operationId],
      false,
    );
    await saveValuation(database, row, next, valuationRevision, revision, now);
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationId,
      operationType: 'management.inventory.adjust',
      localRecordId: movementId,
      dependsOnOperationId: await dependency(database),
      requiredPermission: 'stock',
      actor: context.actor,
      expectedRevision: savedIngredient.revision,
      payload: {
        ingredientId: savedIngredient.id,
        mode,
        quantity,
        reason,
        businessDate: date(businessDate),
      },
      createdAt: now,
    });
    return { movementId, ingredientRevision: revision,
      operationId: operation.operationId };
  });
}
