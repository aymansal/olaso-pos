import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type {
  ManagedModifierGroup,
  ManagedProduct,
  ProductSaveInput,
} from '../features/products/productManagementTypes.ts';
import { withLocalTransaction } from './localDatabase.ts';
import {
  enqueueManagementOperation,
  latestPendingManagementOperationIdFromDatabase,
} from './localManagement.ts';
import type { LocalManagementActor } from './managementOperation.ts';
import { keyFromName } from './managementMutations.ts';

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

async function dependency(database: CatalogDatabase) {
  return latestPendingManagementOperationIdFromDatabase(database);
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
    sortOrder: number;
    expectedRevision?: number;
  },
  transact: CatalogTransaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const now = Date.now();
    const name = text(input.name, 'Category name', 80);
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
        (id, key, name, sort_order, status, revision, updated_at)
       VALUES (?, ?, ?, ?, 'active', ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name,
         sort_order = excluded.sort_order, revision = excluded.revision,
         updated_at = excluded.updated_at`,
      [localId, key, name, sortOrder, revision, now],
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
      payload: { key, name, sortOrder },
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

export function saveLocalProduct(context: CatalogContext, input: ProductSaveInput, transact: CatalogTransaction = withLocalTransaction) {
  return transact(async (database) => {
    const now = Date.now();
    const name = text(input.name, 'Product name', 100);
    if (!['active', 'unavailable'].includes(input.status)
        || new Set(input.modifierGroupIds).size !== input.modifierGroupIds.length) {
      throw new Error('Product settings are invalid.');
    }
    const category = await row(database, 'categories', input.categoryId);
    if (!category || category.status !== 'active') throw new Error('Category is unavailable.');
    const existing = input.id ? await row(database, 'products', input.id) : undefined;
    if (input.id && !existing) throw new Error('Product is unavailable.');
    if (existing && Number(existing.revision) !== input.expectedRevision) {
      throw new Error('Product changed. Refresh it before saving.');
    }
    for (const groupId of input.modifierGroupIds) {
      const group = await row(database, 'modifier_groups', groupId);
      if (!group || group.status !== 'active') throw new Error('Modifier group is unavailable.');
    }
    const localId = input.id ?? id('product');
    const key = existing ? String(existing.key) : keyFromName(name, localId);
    if (!existing && (await database.query(
      'SELECT 1 FROM products WHERE key = ? LIMIT 1', [key],
    )).values?.[0]) throw new Error('A product with this name already exists.');
    const revision = existing ? Number(existing.revision) + 1 : 1;
    await database.run(
      `INSERT INTO products
        (id, category_id, name, receipt_name, price_centimes, status,
         sort_order, revision, updated_at, key)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET category_id = excluded.category_id,
         name = excluded.name, receipt_name = excluded.receipt_name,
         price_centimes = excluded.price_centimes, status = excluded.status,
         sort_order = excluded.sort_order, revision = excluded.revision,
         updated_at = excluded.updated_at, key = excluded.key`,
      [
        localId, input.categoryId, name, name,
        integer(input.basePriceCentimes, 'Product price', 0, 10_000_000),
        input.status, integer(input.sortOrder, 'Sort order', 0, 100_000),
        revision, now, key,
      ],
      false,
    );
    await database.run('DELETE FROM product_modifier_groups WHERE product_id = ?', [localId], false);
    for (const [index, groupId] of input.modifierGroupIds.entries()) {
      await database.run(
        `INSERT INTO product_modifier_groups
          (product_id, modifier_group_id, sort_order) VALUES (?, ?, ?)`,
        [localId, groupId, index * 10 + 10],
        false,
      );
    }
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
        sortOrder: input.sortOrder, modifierGroupIds: input.modifierGroupIds,
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

export type LocalModifierInput = ManagedModifierGroup;
