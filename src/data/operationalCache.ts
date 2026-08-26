import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';
import { OPERATIONAL_MANAGEMENT_OPERATION_TYPES } from './managementOperation.ts';

export type IngredientEffect = {
  ingredientId: string;
  quantityDelta: number;
};

export type OperationalCacheSnapshot = {
  updatedAt: number;
  categories: Array<{
    id: string;
    key: string;
    name: string;
    artworkKey: string;
    sortOrder: number;
    status?: 'active' | 'archived';
    revision: number;
  }>;
  products: Array<{
    id: string;
    key: string;
    categoryId: string;
    name: string;
    receiptName: string;
    priceCentimes: number;
    status: 'active' | 'unavailable' | 'archived';
    imageAssetKey?: string;
    sortOrder: number;
    currentRecipeVersionId?: string;
    revision: number;
    updatedAt: number;
  }>;
  modifierGroups: Array<{
    id: string;
    key: string;
    name: string;
    minimumSelections: number;
    maximumSelections: number;
    sortOrder: number;
    status?: 'active' | 'archived';
    revision: number;
  }>;
  modifierOptions: Array<{
    id: string;
    modifierGroupId: string;
    key: string;
    name: string;
    status?: 'active' | 'archived';
    priceDeltaCentimes: number;
    ingredientEffects: IngredientEffect[];
    sortOrder: number;
    revision: number;
  }>;
  productModifierGroups: Array<{
    productId: string;
    modifierGroupId: string;
    sortOrder: number;
  }>;
  recipeVersions: Array<{
    id: string;
    productId: string;
    version: number;
    createdAt: number;
  }>;
  recipeItems: Array<{
    recipeVersionId: string;
    ingredientId: string;
    quantity: number;
  }>;
  productSizes: Array<{
    id: string;
    productId: string;
    key: string;
    name: string;
    priceCentimes: number;
    sortOrder: number;
    isDefault: boolean;
    status: 'active' | 'unavailable' | 'archived';
    revision: number;
    updatedAt: number;
  }>;
  recipeSizeQuantities: Array<{
    recipeVersionId: string;
    ingredientId: string;
    productSizeId: string;
    sizeNameSnapshot: string;
    quantity: number;
  }>;
  productChoiceSections: Array<{
    id: string;
    productId: string;
    key: string;
    name: string;
    selectionMode: 'single' | 'multiple';
    required: boolean;
    minimumSelections: number;
    maximumSelections: number;
    sortOrder: number;
    status: 'active' | 'archived';
    revision: number;
    updatedAt: number;
  }>;
  productChoiceSectionSizes: Array<{
    sectionId: string;
    productSizeId: string;
  }>;
  productChoiceValues: Array<{
    id: string;
    sectionId: string;
    key: string;
    name: string;
    priceDeltaCentimes: number;
    isDefaultSelected: boolean;
    sortOrder: number;
    status: 'active' | 'archived';
    revision: number;
    updatedAt: number;
  }>;
  productChoiceValueSizes: Array<{
    valueId: string;
    productSizeId: string;
    available: boolean;
    priceDeltaCentimes: number | null;
  }>;
  productChoiceValueEffects: Array<{
    id: string;
    valueId: string;
    effectType: 'add' | 'replace' | 'set-exact' | 'remove';
    ingredientId: string;
    replacementIngredientId?: string;
    quantity: number;
    sortOrder: number;
  }>;
  productChoiceValueEffectSizes: Array<{
    effectId: string;
    productSizeId: string;
    quantity: number;
  }>;
  ingredients: Array<{
    id: string;
    name: string;
    baseUnit: 'millilitre' | 'gram' | 'milligram' | 'piece';
    currentStockQuantity: number;
    inventoryValueCentimes?: number;
    costStatus: 'complete' | 'incomplete';
    valuationRevision: number;
    lowStockThreshold: number;
    revision: number;
  }>;
  staffProfiles: Array<{
    id: string;
    name: string;
    role: 'owner' | 'manager' | 'cashier';
    revision: number;
    identityRevision: number;
  }>;
};

const LIMITS = {
  categories: 100,
  products: 500,
  modifierGroups: 100,
  modifierOptions: 1_000,
  productModifierGroups: 1_000,
  recipeVersions: 500,
  recipeItems: 5_000,
  productSizes: 4_000,
  recipeSizeQuantities: 8_000,
  productChoiceSections: 2_000,
  productChoiceSectionSizes: 4_000,
  productChoiceValues: 4_000,
  productChoiceValueSizes: 8_000,
  productChoiceValueEffects: 4_000,
  productChoiceValueEffectSizes: 8_000,
  ingredients: 1_000,
  staffProfiles: 100,
} as const;

export type ActiveStaffProfile = OperationalCacheSnapshot['staffProfiles'][number];

function assertBounded(snapshot: OperationalCacheSnapshot) {
  for (const key of Object.keys(LIMITS) as Array<keyof typeof LIMITS>) {
    if (snapshot[key].length > LIMITS[key]) {
      throw new Error(`${key} exceeded the local operational cache limit.`);
    }
  }
}

export async function pruneStaleOperationalCatalog(
  database: Pick<SQLiteDBConnection, 'run'>,
  _snapshotUpdatedAt: number,
) {
  await database.run(
    `UPDATE recipe_versions SET is_active = 0,
       product_name_snapshot = COALESCE(
         NULLIF(product_name_snapshot, ''),
         (SELECT name FROM products WHERE id = recipe_versions.product_id),
         ''
       )
     WHERE product_id IN (
       SELECT id FROM products
       WHERE status = 'archived'
     )`,
    [],
    false,
  );
  for (const table of [
    'modifier_options',
    'products',
    'modifier_groups',
    'categories',
    'product_sizes',
    'product_choice_sections',
    'product_choice_values',
  ]) {
    await database.run(
      `DELETE FROM ${table} WHERE status = 'archived'`,
      [],
      false,
    );
  }
  await database.run(
    `DELETE FROM ingredients
     WHERE status = 'archived'
       AND NOT EXISTS (
         SELECT 1 FROM outbox pending
         JOIN stock_movements movement
           ON movement.local_sale_id = pending.local_record_id
         WHERE movement.ingredient_id = ingredients.id
           AND pending.operation_type IN ('sale-completed', 'sale-cancelled')
       )`,
    [],
    false,
  );
  await database.run(
    `DELETE FROM staff_profiles
     WHERE status = 'archived'
       AND NOT EXISTS (
         SELECT 1 FROM outbox pending
         LEFT JOIN management_operations management
           ON management.operation_id = pending.operation_id
         LEFT JOIN sales sale
           ON sale.local_sale_id = pending.local_record_id
         LEFT JOIN sale_corrections correction
           ON correction.local_correction_id = pending.local_record_id
         WHERE pending.local_record_id = staff_profiles.id
           OR management.actor_profile_id = staff_profiles.id
           OR sale.actor_profile_id = staff_profiles.id
           OR correction.actor_profile_id = staff_profiles.id
       )`,
    [],
    false,
  );
}

export async function replaceOperationalCache(
  snapshot: OperationalCacheSnapshot,
) {
  assertBounded(snapshot);
  return withLocalTransaction(async (database) => {
    const pendingStaff = await database.query(
      `SELECT local_record_id FROM outbox
       WHERE operation_type = 'management.staff.create' LIMIT 101`,
    );
    if ((pendingStaff.values?.length ?? 0) > 100) {
      throw new Error('Pending staff exceeds the local cache limit.');
    }
    const unsynced = await database.query(
      `SELECT 1 FROM outbox
       WHERE operation_type IN (${OPERATIONAL_MANAGEMENT_OPERATION_TYPES.map(() => '?').join(', ')})
       LIMIT 1`,
      [...OPERATIONAL_MANAGEMENT_OPERATION_TYPES],
    );
    if (unsynced.values?.length) {
      throw new Error(
        'Operational cache refresh is unavailable while local management changes are pending.',
      );
    }
    await database.execute(
      `UPDATE categories SET status = 'archived';
       UPDATE products SET status = 'archived';
       UPDATE modifier_groups SET status = 'archived';
       UPDATE modifier_options SET status = 'archived';
       UPDATE ingredients SET status = 'archived';
       UPDATE staff_profiles SET status = 'archived';
       UPDATE product_sizes SET status = 'archived';
       UPDATE product_choice_sections SET status = 'archived';
       UPDATE product_choice_values SET status = 'archived';
       UPDATE recipe_versions SET is_active = 0;
       DELETE FROM product_modifier_groups;
       DELETE FROM product_choice_section_sizes;
       DELETE FROM product_choice_value_sizes;
       DELETE FROM product_choice_value_effects;
       DELETE FROM product_choice_value_effect_sizes;`,
      false,
    );
    await database.execute(
      `DELETE FROM recipe_items WHERE recipe_version_id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'recipe-version' AND local_record_id <> cloud_record_id
       );
       DELETE FROM recipe_size_quantities WHERE recipe_version_id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'recipe-version' AND local_record_id <> cloud_record_id
       );
       DELETE FROM product_modifier_groups WHERE product_id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'product' AND local_record_id <> cloud_record_id
       ) OR modifier_group_id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'modifier-group' AND local_record_id <> cloud_record_id
       );
       DELETE FROM modifier_options WHERE id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'modifier-option' AND local_record_id <> cloud_record_id
       );
       DELETE FROM product_choice_value_effects WHERE id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'choice-value-effect'
           AND local_record_id <> cloud_record_id
       );
       DELETE FROM product_choice_values WHERE id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'choice-value' AND local_record_id <> cloud_record_id
       );
       DELETE FROM product_choice_sections WHERE id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'choice-section' AND local_record_id <> cloud_record_id
       );
       DELETE FROM product_sizes WHERE id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'product-size' AND local_record_id <> cloud_record_id
       );
       DELETE FROM recipe_versions WHERE id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'recipe-version' AND local_record_id <> cloud_record_id
       );
       DELETE FROM products WHERE id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'product' AND local_record_id <> cloud_record_id
       );
       DELETE FROM modifier_groups WHERE id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'modifier-group' AND local_record_id <> cloud_record_id
       );
       DELETE FROM categories WHERE id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'category' AND local_record_id <> cloud_record_id
       );`,
      false,
    );

    for (const category of snapshot.categories) {
      await database.run(
        `INSERT INTO categories
          (id, key, name, artwork_key, sort_order, status, revision, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           key = excluded.key,
           name = excluded.name,
           artwork_key = excluded.artwork_key,
           sort_order = excluded.sort_order,
           status = 'active',
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          category.id,
          category.key,
          category.name,
          category.artworkKey ?? 'neutral',
          category.sortOrder,
          category.status ?? 'active',
          category.revision,
          snapshot.updatedAt,
        ],
        false,
      );
    }
    for (const product of snapshot.products) {
      await database.run(
        `INSERT INTO products
          (id, category_id, name, receipt_name, price_centimes, status, key,
           image_asset_key, sort_order, current_recipe_version_id, revision,
           updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           category_id = excluded.category_id,
           name = excluded.name,
           receipt_name = excluded.receipt_name,
           price_centimes = excluded.price_centimes,
           status = excluded.status,
           key = excluded.key,
           image_asset_key = excluded.image_asset_key,
           sort_order = excluded.sort_order,
           current_recipe_version_id = excluded.current_recipe_version_id,
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          product.id,
          product.categoryId || null,
          product.name,
          product.receiptName,
          product.priceCentimes,
          product.status,
          product.key,
          product.imageAssetKey ?? null,
          product.sortOrder,
          product.currentRecipeVersionId ?? null,
          product.revision,
          snapshot.updatedAt,
        ],
        false,
      );
    }
    for (const group of snapshot.modifierGroups) {
      await database.run(
        `INSERT INTO modifier_groups
          (id, key, name, minimum_selections, maximum_selections, status,
           sort_order, revision, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           key = excluded.key,
           minimum_selections = excluded.minimum_selections,
           maximum_selections = excluded.maximum_selections,
           status = excluded.status,
           sort_order = excluded.sort_order,
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          group.id,
          group.key,
          group.name,
          group.minimumSelections,
          group.maximumSelections,
          group.status ?? 'active',
          group.sortOrder,
          group.revision,
          snapshot.updatedAt,
        ],
        false,
      );
    }
    for (const option of snapshot.modifierOptions) {
      await database.run(
        `INSERT INTO modifier_options
          (id, modifier_group_id, key, name, price_delta_centimes, status,
           ingredient_effects_json, sort_order, revision, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           modifier_group_id = excluded.modifier_group_id,
           key = excluded.key,
           name = excluded.name,
           price_delta_centimes = excluded.price_delta_centimes,
           status = 'active',
           ingredient_effects_json = excluded.ingredient_effects_json,
           sort_order = excluded.sort_order,
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          option.id,
          option.modifierGroupId,
          option.key,
          option.name,
          option.priceDeltaCentimes,
          option.status ?? 'active',
          JSON.stringify(option.ingredientEffects),
          option.sortOrder,
          option.revision,
          snapshot.updatedAt,
        ],
        false,
      );
    }
    for (const link of snapshot.productModifierGroups) {
      await database.run(
        `INSERT INTO product_modifier_groups
          (product_id, modifier_group_id, sort_order)
         VALUES (?, ?, ?)`,
        [link.productId, link.modifierGroupId, link.sortOrder],
        false,
      );
    }
    for (const ingredient of snapshot.ingredients) {
      const cachedStock = Math.max(0, ingredient.currentStockQuantity);
      const localStockDelta = Math.min(0, ingredient.currentStockQuantity);
      await database.run(
        `INSERT INTO ingredients
          (id, name, base_unit, current_stock_quantity, low_stock_threshold,
           status, revision, updated_at, local_stock_delta,
           inventory_value_centimes, cost_status, valuation_revision,
           local_inventory_value_delta)
         VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, 0)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           base_unit = excluded.base_unit,
           current_stock_quantity = excluded.current_stock_quantity,
           low_stock_threshold = excluded.low_stock_threshold,
           status = 'active',
           revision = excluded.revision,
           updated_at = excluded.updated_at,
           local_stock_delta = excluded.local_stock_delta,
           inventory_value_centimes = excluded.inventory_value_centimes,
           cost_status = excluded.cost_status,
           valuation_revision = excluded.valuation_revision,
           local_inventory_value_delta = excluded.local_inventory_value_delta`,
        [
          ingredient.id,
          ingredient.name,
          ingredient.baseUnit,
          cachedStock,
          ingredient.lowStockThreshold,
          ingredient.revision,
          snapshot.updatedAt,
          localStockDelta,
          ingredient.inventoryValueCentimes ?? null,
          ingredient.costStatus,
          ingredient.valuationRevision,
        ],
        false,
      );
    }
    for (const staff of snapshot.staffProfiles) {
      await database.run(
        `INSERT INTO staff_profiles
          (id, name, role, status, revision, updated_at, identity_revision)
         VALUES (?, ?, ?, 'active', ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           role = excluded.role,
           status = 'active',
           revision = excluded.revision,
           updated_at = excluded.updated_at,
           identity_revision = excluded.identity_revision`,
        [
          staff.id,
          staff.name,
          staff.role,
          staff.revision,
          snapshot.updatedAt,
          staff.identityRevision,
        ],
        false,
      );
    }
    for (const version of snapshot.recipeVersions) {
      await database.run(
        `INSERT INTO recipe_versions
          (id, product_id, product_name_snapshot, version, is_active, created_at)
         VALUES (?, ?, COALESCE((SELECT name FROM products WHERE id = ?), ''),
           ?, 1, ?)
         ON CONFLICT(id) DO UPDATE SET
           is_active = 1,
           product_name_snapshot = excluded.product_name_snapshot`,
        [version.id, version.productId, version.productId, version.version,
          version.createdAt],
        false,
      );
    }
    await database.execute(
      `DELETE FROM recipe_items
       WHERE recipe_version_id IN (
         SELECT id FROM recipe_versions WHERE is_active = 1
       );
       DELETE FROM recipe_size_quantities
       WHERE recipe_version_id IN (
         SELECT id FROM recipe_versions WHERE is_active = 1
       )`,
      false,
    );
    for (const item of snapshot.recipeItems) {
      await database.run(
        `INSERT INTO recipe_items
          (recipe_version_id, ingredient_id, ingredient_name_snapshot,
           ingredient_base_unit_snapshot, quantity)
         VALUES (?, ?, COALESCE((SELECT name FROM ingredients WHERE id = ?), ''),
           COALESCE((SELECT base_unit FROM ingredients WHERE id = ?), ''), ?)
         ON CONFLICT(recipe_version_id, ingredient_id) DO UPDATE SET
           ingredient_name_snapshot = excluded.ingredient_name_snapshot,
           ingredient_base_unit_snapshot = excluded.ingredient_base_unit_snapshot,
           quantity = excluded.quantity`,
        [item.recipeVersionId, item.ingredientId, item.ingredientId,
          item.ingredientId, item.quantity],
        false,
      );
    }
    for (const size of snapshot.productSizes) {
      await database.run(
        `INSERT INTO product_sizes
          (id, product_id, key, name, price_centimes, sort_order, is_default,
           status, revision, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           product_id = excluded.product_id,
           key = excluded.key,
           name = excluded.name,
           price_centimes = excluded.price_centimes,
           sort_order = excluded.sort_order,
           is_default = excluded.is_default,
           status = excluded.status,
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          size.id,
          size.productId,
          size.key,
          size.name,
          size.priceCentimes,
          size.sortOrder,
          size.isDefault ? 1 : 0,
          size.status,
          size.revision,
          size.updatedAt,
        ],
        false,
      );
    }
    for (const row of snapshot.recipeSizeQuantities) {
      await database.run(
        `INSERT INTO recipe_size_quantities
          (recipe_version_id, ingredient_id, product_size_id, size_name_snapshot,
           quantity)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(recipe_version_id, ingredient_id, product_size_id)
         DO UPDATE SET
           size_name_snapshot = excluded.size_name_snapshot,
           quantity = excluded.quantity`,
        [
          row.recipeVersionId,
          row.ingredientId,
          row.productSizeId,
          row.sizeNameSnapshot,
          row.quantity,
        ],
        false,
      );
    }
    for (const section of snapshot.productChoiceSections) {
      await database.run(
        `INSERT INTO product_choice_sections
          (id, product_id, key, name, selection_mode, is_required,
           minimum_selections, maximum_selections, sort_order, status, revision,
           updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           product_id = excluded.product_id,
           key = excluded.key,
           name = excluded.name,
           selection_mode = excluded.selection_mode,
           is_required = excluded.is_required,
           minimum_selections = excluded.minimum_selections,
           maximum_selections = excluded.maximum_selections,
           sort_order = excluded.sort_order,
           status = excluded.status,
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          section.id,
          section.productId,
          section.key,
          section.name,
          section.selectionMode,
          section.required ? 1 : 0,
          section.minimumSelections,
          section.maximumSelections,
          section.sortOrder,
          section.status,
          section.revision,
          section.updatedAt,
        ],
        false,
      );
    }
    for (const link of snapshot.productChoiceSectionSizes) {
      await database.run(
        `INSERT INTO product_choice_section_sizes (section_id, product_size_id)
         VALUES (?, ?)`,
        [link.sectionId, link.productSizeId],
        false,
      );
    }
    for (const value of snapshot.productChoiceValues) {
      await database.run(
        `INSERT INTO product_choice_values
          (id, section_id, key, name, price_delta_centimes, is_default_selected,
           sort_order, status, revision, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           section_id = excluded.section_id,
           key = excluded.key,
           name = excluded.name,
           price_delta_centimes = excluded.price_delta_centimes,
           is_default_selected = excluded.is_default_selected,
           sort_order = excluded.sort_order,
           status = excluded.status,
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          value.id,
          value.sectionId,
          value.key,
          value.name,
          value.priceDeltaCentimes,
          value.isDefaultSelected ? 1 : 0,
          value.sortOrder,
          value.status,
          value.revision,
          value.updatedAt,
        ],
        false,
      );
    }
    for (const link of snapshot.productChoiceValueSizes) {
      await database.run(
        `INSERT INTO product_choice_value_sizes
          (value_id, product_size_id, available, price_delta_centimes)
         VALUES (?, ?, ?, ?)`,
        [
          link.valueId,
          link.productSizeId,
          link.available ? 1 : 0,
          link.priceDeltaCentimes,
        ],
        false,
      );
    }
    for (const effect of snapshot.productChoiceValueEffects) {
      await database.run(
        `INSERT INTO product_choice_value_effects
          (id, value_id, effect_type, ingredient_id, replacement_ingredient_id,
           quantity, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           value_id = excluded.value_id,
           effect_type = excluded.effect_type,
           ingredient_id = excluded.ingredient_id,
           replacement_ingredient_id = excluded.replacement_ingredient_id,
           quantity = excluded.quantity,
           sort_order = excluded.sort_order`,
        [
          effect.id,
          effect.valueId,
          effect.effectType,
          effect.ingredientId,
          effect.replacementIngredientId ?? null,
          effect.quantity,
          effect.sortOrder,
        ],
        false,
      );
    }
    for (const link of snapshot.productChoiceValueEffectSizes) {
      await database.run(
        `INSERT INTO product_choice_value_effect_sizes
          (effect_id, product_size_id, quantity)
         VALUES (?, ?, ?)`,
        [link.effectId, link.productSizeId, link.quantity],
        false,
      );
    }
    await pruneStaleOperationalCatalog(database, snapshot.updatedAt);
    for (const pending of pendingStaff.values ?? []) {
      await database.run(
        `UPDATE staff_profiles SET status = 'active'
         WHERE id = ?`,
        [String(pending.local_record_id)],
        false,
      );
    }
    await database.run(
      `INSERT INTO device_settings (key, value, updated_at)
       VALUES ('operational_cache_updated_at', ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         value = excluded.value,
         updated_at = excluded.updated_at`,
      [String(snapshot.updatedAt), snapshot.updatedAt],
      false,
    );
    await database.run(
      `UPDATE sync_state
       SET last_success_at = ?, last_error = NULL
       WHERE id = 1`,
      [Date.now()],
      false,
    );
  });
}

export async function saveAuthenticatedStaffProfile(profile: ActiveStaffProfile) {
  const updatedAt = Date.now();
  return withLocalTransaction(async (database) => {
    await database.run(
      `INSERT INTO staff_profiles
        (id, name, role, status, revision, updated_at, identity_revision)
       VALUES (?, ?, ?, 'active', ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         role = excluded.role,
         status = 'active',
         revision = excluded.revision,
         updated_at = excluded.updated_at,
         identity_revision = excluded.identity_revision`,
      [
        profile.id,
        profile.name,
        profile.role,
        profile.revision,
        updatedAt,
        profile.identityRevision,
      ],
      false,
    );
  });
}

export async function reconcileAuthenticatedStaffProfiles(
  profiles: ActiveStaffProfile[],
  authenticatedProfileId: string,
) {
  if (!profiles.length || profiles.length > LIMITS.staffProfiles
      || !profiles.some((profile) => profile.id === authenticatedProfileId)) {
    throw new Error('The authenticated staff directory is unavailable.');
  }
  const updatedAt = Date.now();
  return withLocalTransaction(async (database) => {
    const [previous, pending, pendingActors] = await Promise.all([
      database.query(
        'SELECT id, identity_revision FROM staff_profiles LIMIT 1001',
      ),
      database.query(
        `SELECT outbox.local_record_id, outbox.operation_type,
           mapping.cloud_record_id
         FROM outbox
         LEFT JOIN local_cloud_mappings mapping
           ON mapping.record_type = 'staff-profile'
          AND mapping.local_record_id = outbox.local_record_id
         WHERE outbox.operation_type IN
           ('management.staff.create', 'management.staff.delete')
         LIMIT 101`,
      ),
      database.query(
        `SELECT management.actor_profile_id AS profile_id
         FROM outbox pending
         JOIN management_operations management
           ON management.operation_id = pending.operation_id
         UNION
         SELECT sale.actor_profile_id AS profile_id
         FROM outbox pending
         JOIN sales sale ON sale.local_sale_id = pending.local_record_id
         UNION
         SELECT correction.actor_profile_id AS profile_id
         FROM outbox pending
         JOIN sale_corrections correction
           ON correction.local_correction_id = pending.local_record_id
         LIMIT 101`,
      ),
    ]);
    if ((pending.values?.length ?? 0) > 100
        || (pendingActors.values?.length ?? 0) > 100
        || (previous.values?.length ?? 0) > 1000) {
      throw new Error('Pending staff exceeds the local directory limit.');
    }
    const pendingIds = new Set((pending.values ?? [])
      .filter((row) => row.operation_type === 'management.staff.create')
      .map((row) => String(row.local_record_id)));
    const deletedIds = new Set((pending.values ?? [])
      .filter((row) => row.operation_type === 'management.staff.delete')
      .flatMap((row) => [String(row.local_record_id),
        ...(row.cloud_record_id ? [String(row.cloud_record_id)] : [])]));
    const acceptedProfiles = profiles.filter((profile) => !deletedIds.has(profile.id));
    const activeById = new Map(acceptedProfiles.map((profile) => [profile.id, profile]));
    const retainedActorIds = new Set((pendingActors.values ?? [])
      .filter((row) => row.profile_id)
      .map((row) => String(row.profile_id)));
    const invalidatedProfileIds = (previous.values ?? []).flatMap((row) => {
      const current = activeById.get(String(row.id));
      return !pendingIds.has(String(row.id))
        && !retainedActorIds.has(String(row.id))
        && (!current || current.identityRevision !== Number(row.identity_revision))
        ? [String(row.id)]
        : [];
    });
    await database.run("UPDATE staff_profiles SET status = 'archived'", [], false);
    for (const profile of acceptedProfiles) {
      await database.run(
        `INSERT INTO staff_profiles
          (id, name, role, status, revision, updated_at, identity_revision)
         VALUES (?, ?, ?, 'active', ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           role = excluded.role,
           status = 'active',
           revision = excluded.revision,
           updated_at = excluded.updated_at,
           identity_revision = excluded.identity_revision`,
        [
          profile.id,
          profile.name,
          profile.role,
          profile.revision,
          updatedAt,
          profile.identityRevision,
        ],
        false,
      );
    }
    for (const pendingId of pendingIds) {
      await database.run(
        `UPDATE staff_profiles SET status = 'active' WHERE id = ?`,
        [pendingId],
        false,
      );
    }
    return invalidatedProfileIds;
  });
}

function parseIngredientEffects(value: unknown): IngredientEffect[] {
  try {
    const parsed = JSON.parse(String(value));
    if (
      !Array.isArray(parsed)
      || parsed.some(
        (effect) =>
          !effect
          || typeof effect.ingredientId !== 'string'
          || !Number.isSafeInteger(effect.quantityDelta),
      )
    ) {
      throw new Error();
    }
    return parsed;
  } catch {
    throw new Error('The local modifier cache is corrupted.');
  }
}

export async function loadOperationalCache(
  connection?: SQLiteDBConnection,
): Promise<OperationalCacheSnapshot> {
  const database = connection ?? await openLocalDatabase();
  const [
    categories,
    products,
    modifierGroups,
    modifierOptions,
    productModifierGroups,
    recipeVersions,
    recipeItems,
    productSizes,
    recipeSizeQuantities,
    productChoiceSections,
    productChoiceSectionSizes,
    productChoiceValues,
    productChoiceValueSizes,
    productChoiceValueEffects,
    productChoiceValueEffectSizes,
    ingredients,
    staffProfiles,
    cacheState,
  ] = await Promise.all([
      database.query(
        `SELECT id, key, name, artwork_key, sort_order, status, revision
         FROM categories
         ORDER BY CASE WHEN status = 'archived' THEN 1 ELSE 0 END,
           sort_order, updated_at DESC
         LIMIT ${LIMITS.categories}`,
      ),
      database.query(
        `SELECT id, key, category_id, name, receipt_name, price_centimes, status,
          image_asset_key, sort_order, current_recipe_version_id, revision, updated_at
         FROM products
         ORDER BY CASE WHEN status = 'archived' THEN 1 ELSE 0 END,
           sort_order, updated_at DESC
         LIMIT ${LIMITS.products}`,
      ),
      database.query(
         `SELECT id, key, name, minimum_selections, maximum_selections, status,
          sort_order, revision
         FROM modifier_groups
         ORDER BY CASE WHEN status = 'archived' THEN 1 ELSE 0 END,
           sort_order, name
         LIMIT ${LIMITS.modifierGroups}`,
      ),
      database.query(
         `SELECT id, modifier_group_id, key, name, price_delta_centimes, status, sort_order,
          ingredient_effects_json, revision
         FROM modifier_options
         ORDER BY CASE WHEN status = 'archived' THEN 1 ELSE 0 END,
           modifier_group_id, sort_order, name
         LIMIT ${LIMITS.modifierOptions}`,
      ),
      database.query(
        `SELECT pmg.product_id, pmg.modifier_group_id, pmg.sort_order
         FROM product_modifier_groups pmg
         JOIN products p ON p.id = pmg.product_id
         ORDER BY CASE WHEN p.status = 'archived' THEN 1 ELSE 0 END,
           p.updated_at DESC, pmg.sort_order
         LIMIT ${LIMITS.productModifierGroups}`,
      ),
      database.query(
         `SELECT id, product_id, version, created_at
         FROM recipe_versions
         ORDER BY is_active DESC, created_at DESC
         LIMIT ${LIMITS.recipeVersions}`,
      ),
      database.query(
        `SELECT ri.recipe_version_id, ri.ingredient_id, ri.quantity
         FROM recipe_items ri
         JOIN recipe_versions rv ON rv.id = ri.recipe_version_id
         ORDER BY rv.is_active DESC, rv.created_at DESC
         LIMIT ${LIMITS.recipeItems}`,
      ),
      database.query(
        `SELECT id, product_id, key, name, price_centimes, sort_order, is_default,
          status, revision, updated_at
         FROM product_sizes
         ORDER BY CASE WHEN status = 'archived' THEN 1 ELSE 0 END,
           product_id, sort_order
         LIMIT ${LIMITS.productSizes}`,
      ),
      database.query(
        `SELECT recipe_version_id, ingredient_id, product_size_id,
          size_name_snapshot, quantity
         FROM recipe_size_quantities
         LIMIT ${LIMITS.recipeSizeQuantities}`,
      ),
      database.query(
        `SELECT id, product_id, key, name, selection_mode, is_required,
          minimum_selections, maximum_selections, sort_order, status, revision,
          updated_at
         FROM product_choice_sections
         ORDER BY CASE WHEN status = 'archived' THEN 1 ELSE 0 END,
           product_id, sort_order
         LIMIT ${LIMITS.productChoiceSections}`,
      ),
      database.query(
        `SELECT section_id, product_size_id
         FROM product_choice_section_sizes
         LIMIT ${LIMITS.productChoiceSectionSizes}`,
      ),
      database.query(
        `SELECT id, section_id, key, name, price_delta_centimes,
          is_default_selected, sort_order, status, revision, updated_at
         FROM product_choice_values
         ORDER BY CASE WHEN status = 'archived' THEN 1 ELSE 0 END,
           section_id, sort_order
         LIMIT ${LIMITS.productChoiceValues}`,
      ),
      database.query(
        `SELECT value_id, product_size_id, available, price_delta_centimes
         FROM product_choice_value_sizes
         LIMIT ${LIMITS.productChoiceValueSizes}`,
      ),
      database.query(
        `SELECT id, value_id, effect_type, ingredient_id,
          replacement_ingredient_id, quantity, sort_order
         FROM product_choice_value_effects
         ORDER BY value_id, sort_order
         LIMIT ${LIMITS.productChoiceValueEffects}`,
      ),
      database.query(
        `SELECT effect_id, product_size_id, quantity
         FROM product_choice_value_effect_sizes
         LIMIT ${LIMITS.productChoiceValueEffectSizes}`,
      ),
      database.query(
        `SELECT id, name, base_unit,
          current_stock_quantity + local_stock_delta AS current_stock_quantity,
          inventory_value_centimes + local_inventory_value_delta AS inventory_value_centimes,
          cost_status, valuation_revision, low_stock_threshold, revision
         FROM ingredients
         WHERE status = 'active'
         LIMIT ${LIMITS.ingredients}`,
      ),
      database.query(
        `SELECT id, name, role, revision, identity_revision
         FROM staff_profiles
         WHERE status = 'active'
         ORDER BY updated_at DESC
         LIMIT ${LIMITS.staffProfiles}`,
      ),
      database.query(
        `SELECT value
         FROM device_settings
         WHERE key = 'operational_cache_updated_at'
         LIMIT 1`,
      ),
    ]);
  return {
    updatedAt: Number(cacheState.values?.[0]?.value ?? 0),
    categories: (categories.values ?? []).map((row) => ({
      id: String(row.id),
      key: String(row.key),
      name: String(row.name),
      artworkKey: String(row.artwork_key || 'neutral'),
      sortOrder: Number(row.sort_order),
      status: row.status === 'archived' ? 'archived' : 'active',
      revision: Number(row.revision),
    })),
    products: (products.values ?? []).map((row) => ({
      id: String(row.id),
      key: String(row.key),
      categoryId: row.category_id ? String(row.category_id) : '',
      name: String(row.name),
      receiptName: String(row.receipt_name),
      priceCentimes: Number(row.price_centimes),
      status: ['active', 'unavailable', 'archived'].includes(String(row.status))
        ? row.status as 'active' | 'unavailable' | 'archived'
        : 'unavailable',
      ...(row.image_asset_key
        ? { imageAssetKey: String(row.image_asset_key) }
        : {}),
      sortOrder: Number(row.sort_order),
      ...(row.current_recipe_version_id
        ? { currentRecipeVersionId: String(row.current_recipe_version_id) }
        : {}),
      revision: Number(row.revision),
      updatedAt: Number(row.updated_at),
    })),
    modifierGroups: (modifierGroups.values ?? []).map((row) => ({
      id: String(row.id),
      key: String(row.key),
      name: String(row.name),
      minimumSelections: Number(row.minimum_selections),
      maximumSelections: Number(row.maximum_selections),
      sortOrder: Number(row.sort_order),
      status: row.status === 'archived' ? 'archived' : 'active',
      revision: Number(row.revision),
    })),
    modifierOptions: (modifierOptions.values ?? []).map((row) => ({
      id: String(row.id),
      modifierGroupId: String(row.modifier_group_id),
      key: String(row.key),
      name: String(row.name),
      status: row.status === 'archived' ? 'archived' : 'active',
      priceDeltaCentimes: Number(row.price_delta_centimes),
      ingredientEffects: parseIngredientEffects(row.ingredient_effects_json),
      sortOrder: Number(row.sort_order),
      revision: Number(row.revision),
    })),
    productModifierGroups: (productModifierGroups.values ?? []).map((row) => ({
      productId: String(row.product_id),
      modifierGroupId: String(row.modifier_group_id),
      sortOrder: Number(row.sort_order),
    })),
    recipeVersions: (recipeVersions.values ?? []).map((row) => ({
      id: String(row.id),
      productId: String(row.product_id),
      version: Number(row.version),
      createdAt: Number(row.created_at),
    })),
    recipeItems: (recipeItems.values ?? []).map((row) => ({
      recipeVersionId: String(row.recipe_version_id),
      ingredientId: String(row.ingredient_id),
      quantity: Number(row.quantity),
    })),
    productSizes: (productSizes.values ?? []).map((row) => ({
      id: String(row.id),
      productId: String(row.product_id),
      key: String(row.key),
      name: String(row.name),
      priceCentimes: Number(row.price_centimes),
      sortOrder: Number(row.sort_order),
      isDefault: Number(row.is_default) === 1,
      status: ['active', 'unavailable', 'archived'].includes(String(row.status))
        ? row.status as 'active' | 'unavailable' | 'archived'
        : 'unavailable',
      revision: Number(row.revision),
      updatedAt: Number(row.updated_at),
    })),
    recipeSizeQuantities: (recipeSizeQuantities.values ?? []).map((row) => ({
      recipeVersionId: String(row.recipe_version_id),
      ingredientId: String(row.ingredient_id),
      productSizeId: String(row.product_size_id),
      sizeNameSnapshot: String(row.size_name_snapshot ?? ''),
      quantity: Number(row.quantity),
    })),
    productChoiceSections: (productChoiceSections.values ?? []).map((row) => ({
      id: String(row.id),
      productId: String(row.product_id),
      key: String(row.key),
      name: String(row.name),
      selectionMode: row.selection_mode === 'multiple' ? 'multiple' : 'single',
      required: Number(row.is_required) === 1,
      minimumSelections: Number(row.minimum_selections),
      maximumSelections: Number(row.maximum_selections),
      sortOrder: Number(row.sort_order),
      status: row.status === 'archived' ? 'archived' : 'active',
      revision: Number(row.revision),
      updatedAt: Number(row.updated_at),
    })),
    productChoiceSectionSizes: (productChoiceSectionSizes.values ?? []).map(
      (row) => ({
        sectionId: String(row.section_id),
        productSizeId: String(row.product_size_id),
      }),
    ),
    productChoiceValues: (productChoiceValues.values ?? []).map((row) => ({
      id: String(row.id),
      sectionId: String(row.section_id),
      key: String(row.key),
      name: String(row.name),
      priceDeltaCentimes: Number(row.price_delta_centimes),
      isDefaultSelected: Number(row.is_default_selected) === 1,
      sortOrder: Number(row.sort_order),
      status: row.status === 'archived' ? 'archived' : 'active',
      revision: Number(row.revision),
      updatedAt: Number(row.updated_at),
    })),
    productChoiceValueSizes: (productChoiceValueSizes.values ?? []).map((row) => ({
      valueId: String(row.value_id),
      productSizeId: String(row.product_size_id),
      available: Number(row.available) === 1,
      priceDeltaCentimes: row.price_delta_centimes === null
        || row.price_delta_centimes === undefined
        ? null
        : Number(row.price_delta_centimes),
    })),
    productChoiceValueEffects: (productChoiceValueEffects.values ?? []).map(
      (row) => ({
        id: String(row.id),
        valueId: String(row.value_id),
        effectType: row.effect_type as
          'add' | 'replace' | 'set-exact' | 'remove',
        ingredientId: String(row.ingredient_id),
        ...(row.replacement_ingredient_id
          ? {
              replacementIngredientId: String(row.replacement_ingredient_id),
            }
          : {}),
        quantity: Number(row.quantity),
        sortOrder: Number(row.sort_order),
      }),
    ),
    productChoiceValueEffectSizes: (
      productChoiceValueEffectSizes.values ?? []
    ).map((row) => ({
      effectId: String(row.effect_id),
      productSizeId: String(row.product_size_id),
      quantity: Number(row.quantity),
    })),
    ingredients: (ingredients.values ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      baseUnit: row.base_unit,
      currentStockQuantity: Number(row.current_stock_quantity),
      ...(row.inventory_value_centimes === null
        ? {}
        : { inventoryValueCentimes: Number(row.inventory_value_centimes) }),
      costStatus: row.cost_status === 'complete' ? 'complete' : 'incomplete',
      valuationRevision: Number(row.valuation_revision),
      lowStockThreshold: Number(row.low_stock_threshold),
      revision: Number(row.revision),
    })),
    staffProfiles: (staffProfiles.values ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      role: row.role,
      revision: Number(row.revision),
      identityRevision: Number(row.identity_revision),
    })),
  };
}
