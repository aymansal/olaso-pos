import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type {
  ManagedModifierGroup,
  ManagedProduct,
} from '../features/products/productManagementTypes.ts';
import { withLocalTransaction } from './localDatabase.ts';
import {
  enqueueManagementOperation,
  latestPendingManagementOperationIdFromDatabase,
} from './localManagement.ts';
import {
  OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
  type LocalManagementActor,
} from './managementOperation.ts';
import { keyFromName } from './managementMutations.ts';

type Database = Pick<SQLiteDBConnection, 'query' | 'run'>;
type Transaction = <T>(operation: (database: Database) => Promise<T>) => Promise<T>;
type Context = { deviceId: string; actor: LocalManagementActor };
const localId = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

async function one(database: Database, table: string, id: string) {
  if (!/^[a-z_]+$/.test(table)) throw new Error('Catalog table is invalid.');
  return (await database.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id])).values?.[0];
}

export function saveLocalModifierGroup(context: Context, group: ManagedModifierGroup, transact: Transaction = withLocalTransaction) {
  return transact(async (database) => {
    const existing = group.id ? await one(database, 'modifier_groups', group.id) : undefined;
    if (group.id && !existing) throw new Error('Modifier group is unavailable.');
    if (existing && Number(existing.revision) !== group.revision) {
      throw new Error('Modifier group changed. Refresh it before saving.');
    }
    if (!group.name.trim() || group.options.length > 30
        || group.minSelections < 0 || group.maxSelections < 1
        || group.minSelections > group.maxSelections
        || (group.required && group.minSelections < 1)) {
      throw new Error('Modifier group is invalid.');
    }
    const id = group.id ?? localId('modifier');
    const groupKey = group.key ?? keyFromName(group.name, id);
    if (!existing && (await database.query(
      'SELECT 1 FROM modifier_groups WHERE key = ? LIMIT 1', [groupKey],
    )).values?.[0]) throw new Error('A modifier group with this name already exists.');
    const revision = existing ? Number(existing.revision) + 1 : 1;
    const now = Date.now();
    await database.run(
      `INSERT INTO modifier_groups
        (id, name, minimum_selections, maximum_selections, status, revision,
         updated_at, key, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name,
         minimum_selections = excluded.minimum_selections,
         maximum_selections = excluded.maximum_selections,
         status = excluded.status, revision = excluded.revision,
         updated_at = excluded.updated_at, key = excluded.key,
         sort_order = excluded.sort_order`,
      [id, group.name.trim(), group.minSelections, group.maxSelections,
        group.status, revision, now,
        groupKey, group.sortOrder],
      false,
    );
    const optionPayload = [];
    const submitted = new Set<string>();
    const submittedKeys = new Set<string>();
    for (const [index, option] of group.options.entries()) {
      const optionId = option.id ?? localId('option');
      const key = option.key || keyFromName(option.name, optionId);
      if (!option.name.trim() || !Number.isSafeInteger(option.priceDeltaCentimes)
          || !Number.isSafeInteger(option.sortOrder) || submittedKeys.has(key)) {
        throw new Error('Modifier option is invalid.');
      }
      submittedKeys.add(key);
      for (const effect of option.ingredientEffects) {
        const ingredient = await one(database, 'ingredients', effect.ingredientId);
        if (!ingredient || ingredient.status !== 'active'
            || !Number.isSafeInteger(effect.quantityDelta)) {
          throw new Error('Modifier ingredient effect is invalid.');
        }
      }
      submitted.add(optionId);
      await database.run(
        `INSERT INTO modifier_options
          (id, modifier_group_id, key, name, price_delta_centimes, status,
           ingredient_effects_json, sort_order, revision, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
         ON CONFLICT(id) DO UPDATE SET key = excluded.key, name = excluded.name,
           price_delta_centimes = excluded.price_delta_centimes,
           status = excluded.status,
           ingredient_effects_json = excluded.ingredient_effects_json,
           sort_order = excluded.sort_order, revision = revision + 1,
           updated_at = excluded.updated_at`,
        [optionId, id, key, option.name.trim(), option.priceDeltaCentimes,
          option.status, JSON.stringify(option.ingredientEffects), option.sortOrder, now],
        false,
      );
      optionPayload.push({ ...option, id: optionId, key, sortOrder: option.sortOrder ?? index * 10 + 10 });
    }
    const current = await database.query(
      `SELECT id FROM modifier_options WHERE modifier_group_id = ? AND status = 'active'`,
      [id],
    );
    for (const option of current.values ?? []) {
      if (!submitted.has(String(option.id))) {
        await database.run(
          `UPDATE modifier_options SET status = 'archived', revision = revision + 1,
           updated_at = ? WHERE id = ?`,
          [now, String(option.id)],
          false,
        );
      }
    }
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.modifier.save',
      localRecordId: id,
      dependsOnOperationId: await latestPendingManagementOperationIdFromDatabase(
        database,
        OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
      ),
      requiredPermission: 'products',
      actor: context.actor,
      expectedRevision: group.revision,
      payload: {
        key: groupKey, name: group.name.trim(),
        required: group.required, minSelections: group.minSelections,
        maxSelections: group.maxSelections, sortOrder: group.sortOrder,
        options: optionPayload,
      },
      createdAt: now,
    });
    return { id, revision, operationId: operation.operationId };
  });
}

export function setLocalModifierGroupArchived(
  context: Context,
  id: string,
  archived: boolean,
  expectedRevision: number,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const existing = await one(database, 'modifier_groups', id);
    if (!existing || Number(existing.revision) !== expectedRevision) {
      throw new Error('Modifier group changed. Refresh it before saving.');
    }
    const now = Date.now();
    await database.run(
      `UPDATE modifier_groups SET status = ?, revision = ?, updated_at = ? WHERE id = ?`,
      [archived ? 'archived' : 'active', expectedRevision + 1, now, id], false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.modifier.archive',
      localRecordId: id,
      dependsOnOperationId: await latestPendingManagementOperationIdFromDatabase(
        database,
        OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
      ),
      requiredPermission: 'products', actor: context.actor, expectedRevision,
      payload: { archived }, createdAt: now,
    });
    return { id, revision: expectedRevision + 1, operationId: operation.operationId };
  });
}

export function saveLocalRecipeVersion(
  context: Context,
  product: ManagedProduct,
  items: { ingredientId: string; quantity: number }[],
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const savedProduct = await one(database, 'products', product.id);
    if (!savedProduct || Number(savedProduct.revision) !== product.revision) {
      throw new Error('Product changed. Refresh it before saving the recipe.');
    }
    if (!items.length || items.length > 100
        || new Set(items.map((item) => item.ingredientId)).size !== items.length) {
      throw new Error('Recipe ingredients are invalid.');
    }
    for (const item of items) {
      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0
          || !(await one(database, 'ingredients', item.ingredientId))) {
        throw new Error('Recipe ingredient is invalid.');
      }
    }
    const latest = await database.query(
      `SELECT COALESCE(MAX(version), 0) AS version FROM recipe_versions WHERE product_id = ?`,
      [product.id],
    );
    const version = Number(latest.values?.[0]?.version ?? 0) + 1;
    const recipeId = localId('recipe');
    const now = Date.now();
    await database.run('UPDATE recipe_versions SET is_active = 0 WHERE product_id = ?', [product.id], false);
    await database.run(
      `INSERT INTO recipe_versions
        (id, product_id, product_name_snapshot, version, is_active, created_at)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [recipeId, product.id, String(savedProduct.name), version, now], false,
    );
    for (const item of items) {
      await database.run(
        `INSERT INTO recipe_items
          (recipe_version_id, ingredient_id, ingredient_name_snapshot,
           ingredient_base_unit_snapshot, quantity)
         SELECT ?, id, name, base_unit, ? FROM ingredients WHERE id = ?`,
        [recipeId, item.quantity, item.ingredientId], false,
      );
    }
    await database.run(
      `UPDATE products SET current_recipe_version_id = ?, revision = ?, updated_at = ? WHERE id = ?`,
      [recipeId, product.revision + 1, now, product.id], false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.recipe.save',
      localRecordId: recipeId,
      dependsOnOperationId: await latestPendingManagementOperationIdFromDatabase(
        database,
        OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
      ),
      requiredPermission: 'products', actor: context.actor,
      expectedRevision: product.revision,
      payload: { productId: product.id, items }, createdAt: now,
    });
    return { id: recipeId, versionNumber: version,
      productRevision: product.revision + 1, operationId: operation.operationId };
  });
}
