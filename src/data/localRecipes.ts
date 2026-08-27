import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { ManagedProduct } from '../features/products/productManagementTypes.ts';
import { withLocalTransaction } from './localDatabase.ts';
import {
  enqueueManagementOperation,
  latestPendingManagementOperationIdFromDatabase,
} from './localManagement.ts';
import {
  OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
  type LocalManagementActor,
} from './managementOperation.ts';

type Database = Pick<SQLiteDBConnection, 'query' | 'run'>;
type Transaction = <T>(operation: (database: Database) => Promise<T>) => Promise<T>;
type Context = { deviceId: string; actor: LocalManagementActor };
const localId = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

async function one(database: Database, table: string, id: string) {
  if (!/^[a-z_]+$/.test(table)) throw new Error('Catalog table is invalid.');
  return (await database.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id])).values?.[0];
}

export function saveLocalRecipeVersion(
  context: Context,
  product: ManagedProduct,
  items: { ingredientId: string; quantity: number }[],
  sizeQuantitiesOrTransaction: Array<{
    ingredientId: string;
    productSizeId: string;
    quantity: number;
  }> | Transaction = [],
  transact: Transaction = withLocalTransaction,
) {
  const sizeQuantities = typeof sizeQuantitiesOrTransaction === 'function'
    ? []
    : sizeQuantitiesOrTransaction;
  const transaction = typeof sizeQuantitiesOrTransaction === 'function'
    ? sizeQuantitiesOrTransaction
    : transact;
  return transaction(async (database) => {
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
    if (new Set(sizeQuantities.map(
      (item) => `${item.ingredientId}:${item.productSizeId}`,
    )).size !== sizeQuantities.length) {
      throw new Error('Recipe size quantities are invalid.');
    }
    for (const item of sizeQuantities) {
      const size = await one(database, 'product_sizes', item.productSizeId);
      if (!items.some((recipeItem) => recipeItem.ingredientId === item.ingredientId)
          || !size || String(size.product_id) !== product.id
          || size.status === 'archived'
          || !Number.isSafeInteger(item.quantity) || item.quantity < 0) {
        throw new Error('Recipe size quantity is invalid.');
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
    for (const item of sizeQuantities) {
      await database.run(
        `INSERT INTO recipe_size_quantities
          (recipe_version_id, ingredient_id, product_size_id, size_name_snapshot, quantity)
         SELECT ?, ?, id, name, ? FROM product_sizes WHERE id = ?`,
        [recipeId, item.ingredientId, item.quantity, item.productSizeId],
        false,
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
      payload: { productId: product.id, items, sizeQuantities }, createdAt: now,
    });
    return { id: recipeId, versionNumber: version,
      productRevision: product.revision + 1, operationId: operation.operationId };
  });
}
