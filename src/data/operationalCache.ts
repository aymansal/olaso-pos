import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';

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
    sortOrder: number;
    revision: number;
  }>;
  products: Array<{
    id: string;
    categoryId: string;
    name: string;
    receiptName: string;
    priceCentimes: number;
    status: 'active' | 'unavailable';
    imageAssetKey?: string;
    sortOrder: number;
    currentRecipeVersionId?: string;
    revision: number;
  }>;
  modifierGroups: Array<{
    id: string;
    name: string;
    minimumSelections: number;
    maximumSelections: number;
    revision: number;
  }>;
  modifierOptions: Array<{
    id: string;
    modifierGroupId: string;
    name: string;
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
};

const LIMITS = {
  categories: 100,
  products: 500,
  modifierGroups: 100,
  modifierOptions: 1_000,
  productModifierGroups: 1_000,
  recipeVersions: 500,
  recipeItems: 5_000,
  ingredients: 1_000,
} as const;

function assertBounded(snapshot: OperationalCacheSnapshot) {
  for (const key of Object.keys(LIMITS) as Array<keyof typeof LIMITS>) {
    if (snapshot[key].length > LIMITS[key]) {
      throw new Error(`${key} exceeded the local operational cache limit.`);
    }
  }
}

export async function replaceOperationalCache(
  snapshot: OperationalCacheSnapshot,
) {
  assertBounded(snapshot);
  return withLocalTransaction(async (database) => {
    const unsynced = await database.query('SELECT 1 FROM outbox LIMIT 1');
    if (unsynced.values?.length) {
      throw new Error(
        'Operational cache refresh is unavailable while local changes are pending.',
      );
    }
    await database.execute(
      `UPDATE categories SET status = 'archived';
       UPDATE products SET status = 'archived';
       UPDATE modifier_groups SET status = 'archived';
       UPDATE modifier_options SET status = 'archived';
       UPDATE ingredients SET status = 'archived';
       UPDATE recipe_versions SET is_active = 0;
       DELETE FROM product_modifier_groups;`,
      false,
    );

    for (const category of snapshot.categories) {
      await database.run(
        `INSERT INTO categories
          (id, key, name, sort_order, status, revision, updated_at)
         VALUES (?, ?, ?, ?, 'active', ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           key = excluded.key,
           name = excluded.name,
           sort_order = excluded.sort_order,
           status = 'active',
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          category.id,
          category.key,
          category.name,
          category.sortOrder,
          category.revision,
          snapshot.updatedAt,
        ],
        false,
      );
    }
    for (const product of snapshot.products) {
      await database.run(
        `INSERT INTO products
          (id, category_id, name, receipt_name, price_centimes, status,
           image_asset_key, sort_order, current_recipe_version_id, revision,
           updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           category_id = excluded.category_id,
           name = excluded.name,
           receipt_name = excluded.receipt_name,
           price_centimes = excluded.price_centimes,
           status = excluded.status,
           image_asset_key = excluded.image_asset_key,
           sort_order = excluded.sort_order,
           current_recipe_version_id = excluded.current_recipe_version_id,
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          product.id,
          product.categoryId,
          product.name,
          product.receiptName,
          product.priceCentimes,
          product.status,
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
          (id, name, minimum_selections, maximum_selections, status, revision,
           updated_at)
         VALUES (?, ?, ?, ?, 'active', ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           minimum_selections = excluded.minimum_selections,
           maximum_selections = excluded.maximum_selections,
           status = 'active',
           revision = excluded.revision,
           updated_at = excluded.updated_at`,
        [
          group.id,
          group.name,
          group.minimumSelections,
          group.maximumSelections,
          group.revision,
          snapshot.updatedAt,
        ],
        false,
      );
    }
    for (const option of snapshot.modifierOptions) {
      await database.run(
        `INSERT INTO modifier_options
          (id, modifier_group_id, name, price_delta_centimes, status,
           ingredient_effects_json, sort_order, revision, updated_at)
         VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           modifier_group_id = excluded.modifier_group_id,
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
          option.name,
          option.priceDeltaCentimes,
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
    for (const version of snapshot.recipeVersions) {
      await database.run(
        `INSERT INTO recipe_versions
          (id, product_id, version, is_active, created_at)
         VALUES (?, ?, ?, 1, ?)
         ON CONFLICT(id) DO UPDATE SET is_active = 1`,
        [version.id, version.productId, version.version, version.createdAt],
        false,
      );
    }
    await database.execute(
      `DELETE FROM recipe_items
       WHERE recipe_version_id IN (
         SELECT id FROM recipe_versions WHERE is_active = 1
       )`,
      false,
    );
    for (const item of snapshot.recipeItems) {
      await database.run(
        `INSERT INTO recipe_items
          (recipe_version_id, ingredient_id, quantity)
         VALUES (?, ?, ?)
         ON CONFLICT(recipe_version_id, ingredient_id) DO UPDATE SET
           quantity = excluded.quantity`,
        [item.recipeVersionId, item.ingredientId, item.quantity],
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
    ingredients,
    cacheState,
  ] = await Promise.all([
      database.query(
        `SELECT id, key, name, sort_order, revision
         FROM categories
         WHERE status = 'active'
         ORDER BY sort_order
         LIMIT ${LIMITS.categories}`,
      ),
      database.query(
        `SELECT id, category_id, name, receipt_name, price_centimes, status,
          image_asset_key, sort_order, current_recipe_version_id, revision
         FROM products
         WHERE status <> 'archived'
         ORDER BY sort_order
         LIMIT ${LIMITS.products}`,
      ),
      database.query(
        `SELECT id, name, minimum_selections, maximum_selections, revision
         FROM modifier_groups
         WHERE status = 'active'
         LIMIT ${LIMITS.modifierGroups}`,
      ),
      database.query(
        `SELECT id, modifier_group_id, name, price_delta_centimes, sort_order,
          ingredient_effects_json, revision
         FROM modifier_options
         WHERE status = 'active'
         LIMIT ${LIMITS.modifierOptions}`,
      ),
      database.query(
        `SELECT product_id, modifier_group_id, sort_order
         FROM product_modifier_groups
         LIMIT ${LIMITS.productModifierGroups}`,
      ),
      database.query(
        `SELECT id, product_id, version, created_at
         FROM recipe_versions
         WHERE is_active = 1
         LIMIT ${LIMITS.recipeVersions}`,
      ),
      database.query(
        `SELECT ri.recipe_version_id, ri.ingredient_id, ri.quantity
         FROM recipe_items ri
         JOIN recipe_versions rv ON rv.id = ri.recipe_version_id
         WHERE rv.is_active = 1
         LIMIT ${LIMITS.recipeItems}`,
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
      sortOrder: Number(row.sort_order),
      revision: Number(row.revision),
    })),
    products: (products.values ?? []).map((row) => ({
      id: String(row.id),
      categoryId: String(row.category_id),
      name: String(row.name),
      receiptName: String(row.receipt_name),
      priceCentimes: Number(row.price_centimes),
      status: row.status === 'active' ? 'active' : 'unavailable',
      ...(row.image_asset_key
        ? { imageAssetKey: String(row.image_asset_key) }
        : {}),
      sortOrder: Number(row.sort_order),
      ...(row.current_recipe_version_id
        ? { currentRecipeVersionId: String(row.current_recipe_version_id) }
        : {}),
      revision: Number(row.revision),
    })),
    modifierGroups: (modifierGroups.values ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      minimumSelections: Number(row.minimum_selections),
      maximumSelections: Number(row.maximum_selections),
      revision: Number(row.revision),
    })),
    modifierOptions: (modifierOptions.values ?? []).map((row) => ({
      id: String(row.id),
      modifierGroupId: String(row.modifier_group_id),
      name: String(row.name),
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
  };
}
