import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type {
  ManagedProduct,
  ProductSaveInput,
} from '../features/products/productManagementTypes.ts';
import { withLocalTransaction } from './localDatabase.ts';
import {
  enqueueManagementOperation,
  latestPendingManagementOperationIdFromDatabase,
  latestPendingSaleForRecordFromDatabase,
} from './localManagement.ts';
import type { LocalManagementActor } from './managementOperation.ts';
import { OPERATIONAL_MANAGEMENT_OPERATION_TYPES } from './managementOperation.ts';
import { keyFromName } from './managementMutations.ts';
import { productImageJpeg } from '../lib/compressProductImage.ts';

type CatalogDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;
type CatalogTransaction = <T>(operation: (database: CatalogDatabase) => Promise<T>) => Promise<T>;
type CatalogContext = {
  deviceId: string;
  actor: LocalManagementActor;
};

function id(prefix: string) {
  return `${prefix}:${crypto.randomUUID()}`;
}

function text(value: string, label: string, limit: number) {
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > limit) throw new Error(`${label} is invalid.`);
  return cleaned;
}

function integer(value: number, label: string, minimum: number, maximum: number) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
}

function artworkKey(value: string) {
  if (value.length > 80 || value !== value.trim().toLowerCase()
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error('Category artwork is invalid.');
  }
  return value;
}

async function dependency(database: CatalogDatabase) {
  return latestPendingManagementOperationIdFromDatabase(
    database,
    OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
  );
}

async function row(database: CatalogDatabase, table: string, recordId: string) {
  if (!/^[a-z_]+$/.test(table)) throw new Error('Catalog table is invalid.');
  return (await database.query(
    `SELECT * FROM ${table} WHERE id = ? LIMIT 1`,
    [recordId],
  )).values?.[0];
}

export function saveLocalCategory(
  context: CatalogContext,
  input: {
    id?: string;
    name: string;
    artworkKey: string;
    sortOrder: number;
    expectedRevision?: number;
  },
  transact: CatalogTransaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const now = Date.now();
    const name = text(input.name, 'Category name', 80);
    const savedArtworkKey = artworkKey(input.artworkKey);
    const sortOrder = integer(input.sortOrder, 'Sort order', 0, 10_000);
    const existing = input.id ? await row(database, 'categories', input.id) : undefined;
    if (input.id && !existing) throw new Error('Category is unavailable.');
    if (existing && Number(existing.revision) !== input.expectedRevision) {
      throw new Error('Category changed. Refresh it before saving.');
    }
    const localId = input.id ?? id('category');
    const key = existing ? String(existing.key) : keyFromName(name, localId);
    if (!existing && (await database.query(
      'SELECT 1 FROM categories WHERE key = ? LIMIT 1', [key],
    )).values?.[0]) throw new Error('A category with this name already exists.');
    const revision = existing ? Number(existing.revision) + 1 : 1;
    await database.run(
      `INSERT INTO categories
        (id, key, name, artwork_key, sort_order, status, revision, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name,
         artwork_key = excluded.artwork_key,
         sort_order = excluded.sort_order, revision = excluded.revision,
         updated_at = excluded.updated_at`,
      [localId, key, name, savedArtworkKey, sortOrder, revision, now],
      false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.category.save',
      localRecordId: localId,
      dependsOnOperationId: await dependency(database),
      requiredPermission: 'products',
      actor: context.actor,
      expectedRevision: input.expectedRevision,
      payload: { key, name, artworkKey: savedArtworkKey, sortOrder },
      createdAt: now,
    });
    return { id: localId, revision, operationId: operation.operationId };
  });
}

export function setLocalCategoryArchived(
  context: CatalogContext,
  recordId: string,
  archived: boolean,
  expectedRevision: number,
  transact: CatalogTransaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const existing = await row(database, 'categories', recordId);
    if (!existing) throw new Error('Category is unavailable.');
    if (Number(existing.revision) !== expectedRevision) {
      throw new Error('Category changed. Refresh it before saving.');
    }
    const now = Date.now();
    const revision = expectedRevision + 1;
    await database.run(
      `UPDATE categories SET status = ?, revision = ?, updated_at = ? WHERE id = ?`,
      [archived ? 'archived' : 'active', revision, now, recordId],
      false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.category.archive',
      localRecordId: recordId,
      dependsOnOperationId: await dependency(database),
      requiredPermission: 'products',
      actor: context.actor,
      expectedRevision,
      payload: { archived },
      createdAt: now,
    });
    return { id: recordId, revision, operationId: operation.operationId };
  });
}

export function deleteLocalCategory(
  context: CatalogContext,
  category: { id: string; revision: number },
  transact: CatalogTransaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const existing = await row(database, 'categories', category.id);
    if (!existing || Number(existing.revision) !== category.revision) {
      throw new Error('Category changed. Refresh it before deleting.');
    }
    const saleDependency = await latestPendingSaleForRecordFromDatabase(
      database, 'category', category.id, OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
    );
    const now = Date.now();
    await database.run(
      `UPDATE products SET category_id = NULL, revision = revision + 1,
       updated_at = ? WHERE category_id = ?`,
      [now, category.id],
      false,
    );
    await database.run('DELETE FROM categories WHERE id = ?', [category.id], false);
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.category.delete',
      localRecordId: category.id,
      dependsOnOperationId: saleDependency ?? await dependency(database),
      requiredPermission: 'products',
      actor: context.actor,
      expectedRevision: category.revision,
      payload: { name: String(existing.name) },
      createdAt: now,
    });
    return { id: category.id, operationId: operation.operationId };
  });
}

export function saveLocalProduct(context: CatalogContext, input: ProductSaveInput, transact: CatalogTransaction = withLocalTransaction) {
  return transact(async (database) => {
    const now = Date.now();
    const name = text(input.name, 'Product name', 100);
    if (!['active', 'unavailable'].includes(input.status)) {
      throw new Error('Product settings are invalid.');
    }
    if (input.categoryId) {
      const category = await row(database, 'categories', input.categoryId);
      if (!category || category.status !== 'active') {
        throw new Error('Category is unavailable.');
      }
    }
    const existing = input.id ? await row(database, 'products', input.id) : undefined;
    if (input.id && !existing) throw new Error('Product is unavailable.');
    if (existing && Number(existing.revision) !== input.expectedRevision) {
      throw new Error('Product changed. Refresh it before saving.');
    }
    const localId = input.id ?? id('product');
    const key = existing ? String(existing.key) : keyFromName(name, localId);
    if (!existing && (await database.query(
      'SELECT 1 FROM products WHERE key = ? LIMIT 1', [key],
    )).values?.[0]) throw new Error('A product with this name already exists.');
    const revision = existing ? Number(existing.revision) + 1 : 1;
    const imageJpeg = input.imageJpeg !== undefined
      ? productImageJpeg(input.imageJpeg) ?? null
      : existing?.image_jpeg != null && String(existing.image_jpeg)
        ? String(existing.image_jpeg)
        : null;
    await database.run(
      `INSERT INTO products
        (id, category_id, name, receipt_name, price_centimes, status,
         sort_order, revision, updated_at, key, image_jpeg)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET category_id = excluded.category_id,
         name = excluded.name, receipt_name = excluded.receipt_name,
         price_centimes = excluded.price_centimes, status = excluded.status,
         sort_order = excluded.sort_order, revision = excluded.revision,
         updated_at = excluded.updated_at, key = excluded.key,
         image_jpeg = excluded.image_jpeg`,
      [
        localId, input.categoryId || null, name, name,
        integer(input.basePriceCentimes, 'Product price', 0, 10_000_000),
        input.status, integer(input.sortOrder, 'Sort order', 0, 100_000),
        revision, now, key, imageJpeg,
      ],
      false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.product.save',
      localRecordId: localId,
      dependsOnOperationId: await dependency(database),
      requiredPermission: 'products',
      actor: context.actor,
      expectedRevision: input.expectedRevision,
      payload: {
        key, categoryId: input.categoryId, name, receiptName: name,
        basePriceCentimes: input.basePriceCentimes, status: input.status,
        sortOrder: input.sortOrder,
        ...(input.imageJpeg !== undefined && imageJpeg
          ? { imageJpeg }
          : {}),
      },
      createdAt: now,
    });
    return { id: localId, revision, operationId: operation.operationId };
  });
}

export function setLocalProductStatus(
  context: CatalogContext,
  product: Pick<ManagedProduct, 'id' | 'revision'>,
  status: ManagedProduct['status'],
  transact: CatalogTransaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const existing = await row(database, 'products', product.id);
    if (!existing || Number(existing.revision) !== product.revision) {
      throw new Error('Product changed. Refresh it before saving.');
    }
    const now = Date.now();
    const revision = product.revision + 1;
    await database.run(
      `UPDATE products SET status = ?, revision = ?, updated_at = ? WHERE id = ?`,
      [status, revision, now, product.id],
      false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.product.status',
      localRecordId: product.id,
      dependsOnOperationId: await dependency(database),
      requiredPermission: 'products',
      actor: context.actor,
      expectedRevision: product.revision,
      payload: { status },
      createdAt: now,
    });
    return { id: product.id, revision, operationId: operation.operationId };
  });
}

export function deleteLocalProduct(
  context: CatalogContext,
  product: Pick<ManagedProduct, 'id' | 'revision'>,
  transact: CatalogTransaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const existing = await row(database, 'products', product.id);
    if (!existing || Number(existing.revision) !== product.revision) {
      throw new Error('Product changed. Refresh it before deleting.');
    }
    const saleDependency = await latestPendingSaleForRecordFromDatabase(
      database, 'product', product.id, OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
    );
    const now = Date.now();
    await database.run(
      'UPDATE recipe_versions SET is_active = 0 WHERE product_id = ?',
      [product.id],
      false,
    );
    await database.run('DELETE FROM products WHERE id = ?', [product.id], false);
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.product.delete',
      localRecordId: product.id,
      dependsOnOperationId: saleDependency ?? await dependency(database),
      requiredPermission: 'products',
      actor: context.actor,
      expectedRevision: product.revision,
      payload: { name: String(existing.name) },
      createdAt: now,
    });
    return { id: product.id, operationId: operation.operationId };
  });
}
