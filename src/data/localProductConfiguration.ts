import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type {
  ManagedChoiceSection,
  ManagedProductSize,
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
type SizeMap = Record<string, string>;
const localId = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;
const integer = (value: number, label: string, minimum = 0, maximum = 1_000_000) => {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
};
const text = (value: string, label: string, limit = 80) => {
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > limit) throw new Error(`${label} is invalid.`);
  return cleaned;
};
const one = async (database: Database, table: string, id: string) => (
  await database.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id])
).values?.[0];
const dependency = (database: Database) => latestPendingManagementOperationIdFromDatabase(
  database,
  OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
);

async function activeSizes(database: Database, productId: string) {
  return (await database.query(
    `SELECT id, name FROM product_sizes
     WHERE product_id = ? AND status <> 'archived' ORDER BY sort_order LIMIT 9`,
    [productId],
  )).values ?? [];
}

export function saveLocalProductSize(
  context: Context,
  input: ManagedProductSize,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const product = await one(database, 'products', input.productId);
    if (!product || product.status === 'archived') throw new Error('Product is unavailable.');
    const existing = input.id ? await one(database, 'product_sizes', input.id) : undefined;
    if (input.id && !existing) throw new Error('Product size is unavailable.');
    if (existing && Number(existing.revision) !== input.revision) {
      throw new Error('Product size changed. Refresh it before saving.');
    }
    if (!['active', 'unavailable', 'archived'].includes(input.status)) {
      throw new Error('Product size status is invalid.');
    }
    const name = text(input.name, 'Product size name');
    const id = input.id ?? localId('size');
    const key = input.key ?? keyFromName(name, id);
    const count = await activeSizes(database, input.productId);
    if (!existing && count.length >= 8) throw new Error('A product can have at most 8 sizes.');
    if ((await database.query(
      'SELECT 1 FROM product_sizes WHERE product_id = ? AND key = ? AND id <> ? LIMIT 1',
      [input.productId, key, id],
    )).values?.[0]) throw new Error('A product size with this name already exists.');
    const now = Date.now();
    const revision = existing ? Number(existing.revision) + 1 : 1;
    if (input.isDefault && input.status !== 'archived') {
      await database.run(
        `UPDATE product_sizes SET is_default = 0, revision = revision + 1, updated_at = ?
         WHERE product_id = ? AND id <> ? AND is_default = 1 AND status <> 'archived'`,
        [now, input.productId, id], false,
      );
    }
    await database.run(
      `INSERT INTO product_sizes
        (id, product_id, key, name, price_centimes, sort_order, is_default,
         status, revision, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET key = excluded.key, name = excluded.name,
         price_centimes = excluded.price_centimes, sort_order = excluded.sort_order,
         is_default = excluded.is_default, status = excluded.status,
         revision = excluded.revision, updated_at = excluded.updated_at`,
      [id, input.productId, key, name, integer(input.priceCentimes, 'Size price', 0, 10_000_000),
        integer(input.sortOrder, 'Size order', 0, 100_000), input.isDefault ? 1 : 0,
        input.status, revision, now],
      false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId, operationType: 'management.product-size.save',
      localRecordId: id, dependsOnOperationId: await dependency(database),
      requiredPermission: 'products', actor: context.actor, expectedRevision: input.revision,
      payload: { productId: input.productId, key, name, priceCentimes: input.priceCentimes,
        sortOrder: input.sortOrder, isDefault: input.isDefault, status: input.status },
      createdAt: now,
    });
    return { id, revision, operationId: operation.operationId };
  });
}

export function deleteLocalProductSize(
  context: Context,
  size: Required<Pick<ManagedProductSize, 'id' | 'revision'>>,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const existing = await one(database, 'product_sizes', size.id);
    if (!existing || Number(existing.revision) !== size.revision) {
      throw new Error('Product size changed. Refresh it before deleting.');
    }
    const references = await Promise.all([
      database.query(
        `SELECT 1 FROM management_operations operation
         JOIN outbox ON outbox.operation_id = operation.operation_id
         WHERE outbox.state IN ('pending', 'failed')
           AND operation.payload_json LIKE ? LIMIT 1`,
        [`%${size.id}%`],
      ),
      database.query('SELECT 1 FROM product_choice_section_sizes WHERE product_size_id = ? LIMIT 1', [size.id]),
      database.query('SELECT 1 FROM product_choice_value_sizes WHERE product_size_id = ? LIMIT 1', [size.id]),
      database.query('SELECT 1 FROM product_choice_value_effect_sizes WHERE product_size_id = ? LIMIT 1', [size.id]),
      database.query('SELECT 1 FROM recipe_size_quantities WHERE product_size_id = ? LIMIT 1', [size.id]),
    ]);
    if (references.some((result) => result.values?.[0])) {
      throw new Error('Remove saved choice and recipe references before deleting this size.');
    }
    const now = Date.now();
    await database.run(
      `UPDATE product_sizes SET status = 'archived', is_default = 0,
       revision = ?, updated_at = ? WHERE id = ?`,
      [size.revision + 1, now, size.id], false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId, operationType: 'management.product-size.delete',
      localRecordId: size.id, dependsOnOperationId: await dependency(database),
      requiredPermission: 'products', actor: context.actor, expectedRevision: size.revision,
      payload: { productId: String(existing.product_id) }, createdAt: now,
    });
    return { id: size.id, operationId: operation.operationId };
  });
}

async function validateSection(database: Database, section: ManagedChoiceSection) {
  if (!['single', 'multiple'].includes(section.selectionMode)
      || !['active', 'archived'].includes(section.status)
      || section.values.length > 30
      || section.minimumSelections < 0
      || section.maximumSelections < 1
      || section.minimumSelections > section.maximumSelections
      || (section.selectionMode === 'single' && section.maximumSelections > 1)
      || (section.required && section.minimumSelections < 1)) {
    throw new Error('Choice section is invalid.');
  }
  if (new Set(section.productSizeIds).size !== section.productSizeIds.length) {
    throw new Error('Choice section sizes are invalid.');
  }
  for (const sizeId of section.productSizeIds) {
    const size = await one(database, 'product_sizes', sizeId);
    if (!size || String(size.product_id) !== section.productId || size.status === 'archived') {
      throw new Error('Choice section size is unavailable.');
    }
  }
  for (const value of section.values) {
    if (!text(value.name, 'Choice value') || !['active', 'archived'].includes(value.status)
        || new Set(value.sizeRules.map((rule) => rule.productSizeId)).size !== value.sizeRules.length
        || value.effects.length > 10) throw new Error('Choice value is invalid.');
    for (const rule of value.sizeRules) {
      integer(rule.priceDeltaCentimes ?? 0, 'Choice size price', -10_000_000, 10_000_000);
      if (!(await one(database, 'product_sizes', rule.productSizeId))) {
        throw new Error('Choice value size is unavailable.');
      }
    }
    for (const effect of value.effects) {
      if (!['add', 'replace', 'set-exact', 'remove'].includes(effect.effectType)
          || !(await one(database, 'ingredients', effect.ingredientId))
          || (effect.effectType === 'replace' && !effect.replacementIngredientId)
          || (effect.replacementIngredientId && !(await one(database, 'ingredients', effect.replacementIngredientId)))) {
        throw new Error('Choice ingredient effect is invalid.');
      }
      integer(effect.quantity, 'Choice effect quantity');
      for (const row of effect.sizeQuantities) integer(row.quantity, 'Choice effect size quantity');
    }
  }
}

async function replaceSection(database: Database, section: ManagedChoiceSection, id: string, revision: number, now: number) {
  const key = section.key ?? keyFromName(section.name, id);
  await database.run(
    `INSERT INTO product_choice_sections
      (id, product_id, key, name, selection_mode, is_required, minimum_selections,
       maximum_selections, sort_order, status, revision, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET key = excluded.key, name = excluded.name,
       selection_mode = excluded.selection_mode, is_required = excluded.is_required,
       minimum_selections = excluded.minimum_selections, maximum_selections = excluded.maximum_selections,
       sort_order = excluded.sort_order, status = excluded.status, revision = excluded.revision,
       updated_at = excluded.updated_at`,
    [id, section.productId, key, text(section.name, 'Choice section'), section.selectionMode,
      section.required ? 1 : 0, section.minimumSelections, section.maximumSelections,
      integer(section.sortOrder, 'Choice section order', 0, 100_000), section.status, revision, now],
    false,
  );
  await database.run('DELETE FROM product_choice_section_sizes WHERE section_id = ?', [id], false);
  await database.run('DELETE FROM product_choice_values WHERE section_id = ?', [id], false);
  for (const sizeId of section.productSizeIds) {
    await database.run('INSERT INTO product_choice_section_sizes (section_id, product_size_id) VALUES (?, ?)', [id, sizeId], false);
  }
  const values: Array<Record<string, unknown>> = [];
  for (const value of section.values) {
    const valueId = value.id ?? localId('choice-value');
    const valueKey = value.key ?? keyFromName(value.name, valueId);
    await database.run(
      `INSERT INTO product_choice_values
        (id, section_id, key, name, price_delta_centimes, is_default_selected,
         sort_order, status, revision, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [valueId, id, valueKey, text(value.name, 'Choice value'),
        integer(value.priceDeltaCentimes, 'Choice price', -10_000_000, 10_000_000),
        value.isDefaultSelected ? 1 : 0, integer(value.sortOrder, 'Choice value order', 0, 100_000),
        value.status, now],
      false,
    );
    for (const rule of value.sizeRules) {
      await database.run(
        `INSERT INTO product_choice_value_sizes
          (value_id, product_size_id, available, price_delta_centimes) VALUES (?, ?, ?, ?)`,
        [valueId, rule.productSizeId, rule.available ? 1 : 0, rule.priceDeltaCentimes ?? null],
        false,
      );
    }
    const effects: Array<Record<string, unknown>> = [];
    for (const effect of value.effects) {
      const effectId = effect.id ?? localId('choice-effect');
      await database.run(
        `INSERT INTO product_choice_value_effects
          (id, value_id, effect_type, ingredient_id, replacement_ingredient_id,
           quantity, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [effectId, valueId, effect.effectType, effect.ingredientId,
          effect.replacementIngredientId ?? null, effect.quantity, effect.sortOrder],
        false,
      );
      for (const sizeQuantity of effect.sizeQuantities) {
        await database.run(
          `INSERT INTO product_choice_value_effect_sizes
            (effect_id, product_size_id, quantity) VALUES (?, ?, ?)`,
          [effectId, sizeQuantity.productSizeId, sizeQuantity.quantity], false,
        );
      }
      effects.push({ ...effect, id: effectId });
    }
    values.push({ ...value, id: valueId, key: valueKey, effects });
  }
  return { key, values };
}

export function saveLocalChoiceSection(
  context: Context,
  section: ManagedChoiceSection,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const product = await one(database, 'products', section.productId);
    if (!product || product.status === 'archived') throw new Error('Product is unavailable.');
    const existing = section.id ? await one(database, 'product_choice_sections', section.id) : undefined;
    if (section.id && !existing) throw new Error('Choice section is unavailable.');
    if (existing && Number(existing.revision) !== section.revision) {
      throw new Error('Choice section changed. Refresh it before saving.');
    }
    if (!existing && (await database.query(
      `SELECT id FROM product_choice_sections WHERE product_id = ? AND status = 'active' LIMIT 13`,
      [section.productId],
    )).values?.length! >= 12) throw new Error('A product can have at most 12 choice sections.');
    await validateSection(database, section);
    const id = section.id ?? localId('choice-section');
    const key = section.key ?? keyFromName(section.name, id);
    if ((await database.query(
      'SELECT 1 FROM product_choice_sections WHERE product_id = ? AND key = ? AND id <> ? LIMIT 1',
      [section.productId, key, id],
    )).values?.[0]) throw new Error('A choice section with this name already exists.');
    const now = Date.now();
    const revision = existing ? Number(existing.revision) + 1 : 1;
    const saved = await replaceSection(database, { ...section, key }, id, revision, now);
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId, operationType: 'management.choice-section.save',
      localRecordId: id, dependsOnOperationId: await dependency(database),
      requiredPermission: 'products', actor: context.actor, expectedRevision: section.revision,
      payload: { ...section, id, key: saved.key, values: saved.values }, createdAt: now,
    });
    return { id, revision, operationId: operation.operationId };
  });
}

export function deleteLocalChoiceSection(
  context: Context,
  section: Required<Pick<ManagedChoiceSection, 'id' | 'revision'>>,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const existing = await one(database, 'product_choice_sections', section.id);
    if (!existing || Number(existing.revision) !== section.revision) {
      throw new Error('Choice section changed. Refresh it before deleting.');
    }
    const now = Date.now();
    await database.run(
      `UPDATE product_choice_sections SET status = 'archived', revision = ?,
       updated_at = ? WHERE id = ?`,
      [section.revision + 1, now, section.id], false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId, operationType: 'management.choice-section.delete',
      localRecordId: section.id, dependsOnOperationId: await dependency(database),
      requiredPermission: 'products', actor: context.actor, expectedRevision: section.revision,
      payload: { productId: String(existing.product_id) }, createdAt: now,
    });
    return { id: section.id, operationId: operation.operationId };
  });
}

export function copyLocalChoiceSections(
  context: Context,
  sourceProductId: string,
  destinationProductId: string,
  sizeNameMap: SizeMap | undefined,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    if (sourceProductId === destinationProductId) throw new Error('Choose a different product to copy choices.');
    if (!(await one(database, 'products', sourceProductId))
        || !(await one(database, 'products', destinationProductId))) throw new Error('Product is unavailable.');
    const [sourceSizes, destinationSizes, sections] = await Promise.all([
      activeSizes(database, sourceProductId), activeSizes(database, destinationProductId),
      database.query(`SELECT * FROM product_choice_sections WHERE product_id = ? AND status = 'active'
        ORDER BY sort_order LIMIT 13`, [sourceProductId]),
    ]);
    if ((sections.values?.length ?? 0) > 12) throw new Error('Source choice sections are invalid.');
    if ((await database.query(
      `SELECT id FROM product_choice_sections WHERE product_id = ? AND status = 'active' LIMIT 13`,
      [destinationProductId],
    )).values?.length! + (sections.values?.length ?? 0) > 12) {
      throw new Error('The destination product has no room for these choice sections.');
    }
    const automatic = new Map<string, string>();
    for (const source of sourceSizes) {
      const matches = destinationSizes.filter((destination) => destination.name === source.name);
      if (matches.length === 1) automatic.set(String(source.id), String(matches[0].id));
    }
    const mapping = sizeNameMap ?? Object.fromEntries(automatic);
    if (sourceSizes.some((size) => mapping[String(size.id)] === undefined)
        || Object.values(mapping).some((sizeId) => !destinationSizes.some((size) => size.id === sizeId))) {
      throw new Error('Map every source size to a destination size before copying choices.');
    }
    const copied: string[] = [];
    for (const source of sections.values ?? []) {
      const values = (await database.query(`SELECT * FROM product_choice_values WHERE section_id = ?
        ORDER BY sort_order LIMIT 31`, [source.id])).values ?? [];
      const section: ManagedChoiceSection = {
        productId: destinationProductId,
        key: `copy-${crypto.randomUUID()}`,
        name: String(source.name),
        selectionMode: source.selection_mode === 'multiple' ? 'multiple' : 'single',
        required: Number(source.is_required) === 1,
        minimumSelections: Number(source.minimum_selections),
        maximumSelections: Number(source.maximum_selections), sortOrder: Number(source.sort_order),
        status: 'active',
        productSizeIds: ((await database.query(
          'SELECT product_size_id FROM product_choice_section_sizes WHERE section_id = ?',
          [source.id],
        )).values ?? []).map((row) => mapping[String(row.product_size_id)]),
        values: await Promise.all(values.map(async (value) => ({
          name: String(value.name), priceDeltaCentimes: Number(value.price_delta_centimes),
          isDefaultSelected: Number(value.is_default_selected) === 1, sortOrder: Number(value.sort_order),
          status: value.status === 'archived' ? 'archived' as const : 'active' as const,
          sizeRules: ((await database.query(
            'SELECT product_size_id, available, price_delta_centimes FROM product_choice_value_sizes WHERE value_id = ?',
            [value.id],
          )).values ?? []).map((rule) => ({
            productSizeId: mapping[String(rule.product_size_id)], available: Number(rule.available) === 1,
            ...(rule.price_delta_centimes === null ? {} : { priceDeltaCentimes: Number(rule.price_delta_centimes) }),
          })),
          effects: await Promise.all(((await database.query(
            `SELECT id, effect_type, ingredient_id, replacement_ingredient_id, quantity, sort_order
             FROM product_choice_value_effects WHERE value_id = ? ORDER BY sort_order LIMIT 11`,
            [value.id],
          )).values ?? []).map(async (effect) => ({
            effectType: effect.effect_type as 'add' | 'replace' | 'set-exact' | 'remove',
            ingredientId: String(effect.ingredient_id),
            ...(effect.replacement_ingredient_id
              ? { replacementIngredientId: String(effect.replacement_ingredient_id) }
              : {}),
            quantity: Number(effect.quantity), sortOrder: Number(effect.sort_order),
            sizeQuantities: ((await database.query(
              `SELECT product_size_id, quantity FROM product_choice_value_effect_sizes
               WHERE effect_id = ?`,
              [effect.id],
            )).values ?? []).map((row) => ({
              productSizeId: mapping[String(row.product_size_id)],
              quantity: Number(row.quantity),
            })),
          }))),
        }))),
      };
      const id = localId('choice-section');
      const now = Date.now();
      await replaceSection(database, section, id, 1, now);
      copied.push(id);
    }
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId, operationType: 'management.choice-copy',
      localRecordId: destinationProductId, dependsOnOperationId: await dependency(database),
      requiredPermission: 'products', actor: context.actor,
      payload: { sourceProductId, destinationProductId, sizeNameMap: mapping, copiedSectionIds: copied },
      createdAt: Date.now(),
    });
    return { sectionIds: copied, operationId: operation.operationId };
  });
}
