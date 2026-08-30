import { localBusinessDate, shiftBusinessDate } from '../lib/date.ts';
import { openLocalDatabase } from './localDatabase.ts';
import { loadOperationalCache } from './operationalCache.ts';

type SavedLine = {
  productId: string;
  productName: string;
  quantity: number;
  lineTotalCentimes: number;
  complimentary?: boolean;
  categoryIdSnapshot?: string;
  categoryNameSnapshot?: string;
};

type SavedReceipt = {
  completedAt: number;
  paymentMethod: string;
  lines: SavedLine[];
};

function receipt(value: unknown): SavedReceipt {
  const parsed = JSON.parse(String(value)) as SavedReceipt;
  if (!parsed || !Array.isArray(parsed.lines)) {
    throw new Error('A saved receipt is unavailable.');
  }
  return parsed;
}

async function localSales(fromDate: string, toDate: string) {
  const database = await openLocalDatabase();
  const [result, savedCategories] = await Promise.all([database.query(
    `SELECT local_sale_id, receipt_number, status, service_type,
      total_centimes, business_date, receipt_snapshot_json, created_at
     FROM sales
     WHERE business_date BETWEEN ? AND ?
     ORDER BY created_at DESC
     LIMIT 1001`,
    [fromDate, toDate],
  ), database.query(
    `SELECT item.local_sale_id, item.product_id, item.category_id_snapshot,
      item.category_name_snapshot
     FROM sale_items item
     JOIN sales sale ON sale.local_sale_id = item.local_sale_id
     WHERE sale.business_date BETWEEN ? AND ?
     LIMIT 5001`,
    [fromDate, toDate],
  )]);
  if ((result.values?.length ?? 0) > 1_000) {
    throw new Error('Saved tablet sales exceed the offline report limit.');
  }
  if ((savedCategories.values?.length ?? 0) > 5_000) {
    throw new Error('Saved tablet sale items exceed the offline report limit.');
  }
  const categoryBySaleProduct = new Map((savedCategories.values ?? []).map((row) => [
    `${String(row.local_sale_id)}:${String(row.product_id)}`,
    { id: String(row.category_id_snapshot), name: String(row.category_name_snapshot) },
  ]));
  return (result.values ?? []).map((row) => {
    const savedReceipt = receipt(row.receipt_snapshot_json);
    return {
    id: String(row.local_sale_id),
    receiptNumber: String(row.receipt_number),
    status: String(row.status) as 'completed' | 'cancelled' | 'refunded',
    serviceMode: row.service_type === 'dine-in'
      ? 'dine-in' as const
      : row.service_type === 'take-away'
        ? 'take-away' as const
        : 'online' as const,
    totalCentimes: Number(row.total_centimes),
    businessDate: String(row.business_date),
    createdAt: Number(row.created_at),
    receipt: {
      ...savedReceipt,
      lines: savedReceipt.lines.map((line) => {
        const category = categoryBySaleProduct.get(
          `${String(row.local_sale_id)}:${line.productId}`,
        );
        return {
          ...line,
          ...(category?.id && category.name ? {
            categoryIdSnapshot: category.id,
            categoryNameSnapshot: category.name,
          } : {}),
        };
      }),
    },
    };
  });
}

const QUICK_ADD_DAYS = 7;
const QUICK_ADD_LIMIT = 3;

export async function topSellingProductIds() {
  const toDate = localBusinessDate();
  const fromDate = shiftBusinessDate(toDate, -(QUICK_ADD_DAYS - 1));
  const database = await openLocalDatabase();
  const result = await database.query(
    `SELECT item.product_id AS product_id, SUM(item.quantity) AS quantity
     FROM sale_items item
     JOIN sales sale ON sale.local_sale_id = item.local_sale_id
     WHERE sale.business_date BETWEEN ? AND ?
       AND sale.status = 'completed'
       AND item.product_id IS NOT NULL
     GROUP BY item.product_id
     ORDER BY quantity DESC, item.product_id
     LIMIT ${QUICK_ADD_LIMIT}`,
    [fromDate, toDate],
  );
  return (result.values ?? []).map((row) => String(row.product_id));
}

export function aggregateOfflineSales(
  rows: Awaited<ReturnType<typeof localSales>>,
  categoryByProduct: Map<string, { id: string; name: string }>,
) {
  const products = new Map<string, {
    productId: string;
    productName: string;
    categoryName?: string;
    quantity: number;
    totalCentimes: number;
  }>();
  const categories = new Map<string, {
    categoryId: string;
    categoryName: string;
    quantity: number;
    totalCentimes: number;
  }>();
  const payments = new Map<string, {
    paymentMethod: string;
    totalCentimes: number;
    orderCount: number;
  }>();
  let netCentimes = 0;
  let itemCount = 0;
  const completed = rows.filter((row) => row.status === 'completed');
  for (const row of completed) {
    netCentimes += row.totalCentimes;
    const paymentMethod = row.receipt.paymentMethod || 'Unknown';
    const payment = payments.get(paymentMethod) ?? {
      paymentMethod,
      totalCentimes: 0,
      orderCount: 0,
    };
    payment.totalCentimes += row.totalCentimes;
    payment.orderCount += 1;
    payments.set(paymentMethod, payment);
    for (const line of row.receipt.lines) {
      itemCount += line.quantity;
      const category = line.categoryIdSnapshot && line.categoryNameSnapshot
        ? { id: line.categoryIdSnapshot, name: line.categoryNameSnapshot }
        : categoryByProduct.get(line.productId);
      const product = products.get(line.productId) ?? {
        productId: line.productId,
        productName: line.productName,
        ...(category ? { categoryName: category.name } : {}),
        quantity: 0,
        totalCentimes: 0,
      };
      const chargedCentimes = line.complimentary === true
        ? 0
        : line.lineTotalCentimes;
      product.quantity += line.quantity;
      product.totalCentimes += chargedCentimes;
      products.set(line.productId, product);
      if (category) {
        const total = categories.get(category.id) ?? {
          categoryId: category.id,
          categoryName: category.name,
          quantity: 0,
          totalCentimes: 0,
        };
        total.quantity += line.quantity;
        total.totalCentimes += chargedCentimes;
        categories.set(category.id, total);
      }
    }
  }
  const productList = [...products.values()];
  return {
    netCentimes,
    orderCount: completed.length,
    itemCount,
    ingredientUsageEventCount: 0,
    productTotals: productList
      .slice()
      .sort((left, right) => right.totalCentimes - left.totalCentimes)
      .slice(0, 20),
    bestSeller: productList.slice().sort(
      (left, right) =>
        right.quantity - left.quantity
        || right.totalCentimes - left.totalCentimes
        || left.productName.localeCompare(right.productName),
    )[0],
    categoryTotals: [...categories.values()]
      .sort((left, right) => right.totalCentimes - left.totalCentimes)
      .slice(0, 20),
    paymentTotals: [...payments.values()]
      .sort((left, right) => right.totalCentimes - left.totalCentimes)
      .slice(0, 20),
  };
}

async function ingredientUsage(fromDate: string, toDate: string) {
  const database = await openLocalDatabase();
  const result = await database.query(
    `SELECT m.ingredient_id,
      COALESCE(i.name, NULLIF(m.ingredient_name_snapshot, '')) AS name,
      COALESCE(i.base_unit,
        NULLIF(m.ingredient_base_unit_snapshot, '')) AS base_unit,
      SUM(-m.quantity_delta) AS quantity
     FROM stock_movements m
     LEFT JOIN ingredients i ON i.id = m.ingredient_id
     JOIN sales s ON s.local_sale_id = m.local_sale_id
     WHERE m.business_date BETWEEN ? AND ?
       AND m.movement_type = 'sale'
       AND s.status = 'completed'
     GROUP BY m.ingredient_id,
       COALESCE(i.name, NULLIF(m.ingredient_name_snapshot, '')),
       COALESCE(i.base_unit, NULLIF(m.ingredient_base_unit_snapshot, ''))
     ORDER BY name
     LIMIT 21`,
    [fromDate, toDate],
  );
  if ((result.values?.length ?? 0) > 20) {
    throw new Error('Saved ingredient usage exceeds the offline report limit.');
  }
  return (result.values ?? []).map((row) => ({
    ingredientId: String(row.ingredient_id),
    ingredientName: String(row.name),
    baseUnit: String(row.base_unit) as 'millilitre' | 'gram' | 'milligram' | 'piece',
    quantity: Number(row.quantity),
  }));
}

export async function loadOfflineDashboard(businessDate: string) {
  const fromDate = shiftBusinessDate(businessDate, -11);
  const [rows, cache] = await Promise.all([
    localSales(fromDate, businessDate),
    loadOperationalCache(),
  ]);
  const categories = new Map(cache.categories.map((category) => [category.id, category]));
  const categoryByProduct = new Map(
    cache.products.flatMap((product) => {
      const category = categories.get(product.categoryId);
      return category ? [[product.id, { id: category.id, name: category.name }] as const] : [];
    }),
  );
  const todayRows = rows.filter((row) => row.businessDate === businessDate);
  const yesterdayDate = shiftBusinessDate(businessDate, -1);
  const today = aggregateOfflineSales(todayRows, categoryByProduct);
  const yesterday = aggregateOfflineSales(
    rows.filter((row) => row.businessDate === yesterdayDate),
    categoryByProduct,
  );
  const bestSeller = today.bestSeller;
  return {
    businessDate,
    updatedAt: Math.max(0, ...todayRows.map((row) => row.createdAt)),
    today: today.orderCount
      ? {
          grossCentimes: today.netCentimes,
          netCentimes: today.netCentimes,
          orderCount: today.orderCount,
          itemCount: today.itemCount,
          ...(bestSeller
            ? {
                bestSeller: {
                  name: bestSeller.productName,
                  quantity: bestSeller.quantity,
                  totalCentimes: bestSeller.totalCentimes,
                },
              }
            : {}),
        }
      : undefined,
    yesterday: yesterday.orderCount
      ? { netCentimes: yesterday.netCentimes, orderCount: yesterday.orderCount }
      : undefined,
    dailySales: Array.from({ length: 12 }, (_, index) => {
      const date = shiftBusinessDate(businessDate, index - 11);
      const daily = aggregateOfflineSales(
        rows.filter((row) => row.businessDate === date),
        categoryByProduct,
      );
      return {
        businessDate: date,
        netCentimes: daily.netCentimes,
        orderCount: daily.orderCount,
      };
    }),
    warnings: cache.ingredients
      .filter((item) => item.currentStockQuantity <= item.lowStockThreshold)
      .sort(
        (left, right) =>
          left.currentStockQuantity / Math.max(1, left.lowStockThreshold)
          - right.currentStockQuantity / Math.max(1, right.lowStockThreshold),
      )
      .slice(0, 4)
      .map((item) => ({
        id: item.id,
        key: item.id,
        name: item.name,
        baseUnit: item.baseUnit,
        currentStockQuantity: item.currentStockQuantity,
        lowStockThreshold: item.lowStockThreshold,
      })),
    recentOrders: rows.slice(0, 4).map((row) => ({
      id: row.id,
      receiptNumber: row.receiptNumber,
      status: row.status,
      serviceMode: row.serviceMode,
      totalCentimes: row.totalCentimes,
      completedAt: row.receipt.completedAt,
      itemCount: row.receipt.lines.reduce((sum, line) => sum + line.quantity, 0),
    })),
  };
}

export async function loadOfflineReport(fromDate: string, toDate: string) {
  const days = Math.floor(
    (Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`))
      / 86_400_000,
  ) + 1;
  if (days < 1 || days > 31) throw new Error('Report periods must contain 1 to 31 days.');
  const previousTo = shiftBusinessDate(fromDate, -1);
  const previousFrom = shiftBusinessDate(previousTo, 1 - days);
  const [currentRows, previousRows, cache, usage] = await Promise.all([
    localSales(fromDate, toDate),
    localSales(previousFrom, previousTo),
    loadOperationalCache(),
    ingredientUsage(fromDate, toDate),
  ]);
  const categories = new Map(cache.categories.map((category) => [category.id, category]));
  const categoryByProduct = new Map(
    cache.products.flatMap((product) => {
      const category = categories.get(product.categoryId);
      return category ? [[product.id, { id: category.id, name: category.name }] as const] : [];
    }),
  );
  const current = {
    ...aggregateOfflineSales(currentRows, categoryByProduct),
    ingredientUsageEventCount: usage.length,
    ingredientTotals: usage,
  };
  const previous = {
    ...aggregateOfflineSales(previousRows, categoryByProduct),
    ingredientTotals: [],
  };
  return {
    range: { from: fromDate, to: toDate, days },
    comparisonRange: { from: previousFrom, to: previousTo },
    current,
    previous,
    daily: Array.from({ length: days }, (_, index) => {
      const date = shiftBusinessDate(fromDate, index);
      const daily = aggregateOfflineSales(
        currentRows.filter((row) => row.businessDate === date),
        categoryByProduct,
      );
      return {
        businessDate: date,
        netCentimes: daily.netCentimes,
        itemCount: daily.itemCount,
        ingredientUsageEventCount: 0,
      };
    }),
  };
}

export async function loadOfflineInventory() {
  const database = await openLocalDatabase();
  const today = localBusinessDate();
  const [ingredientResult, movementResult] = await Promise.all([
    database.query(
      `SELECT i.id, i.key, i.name, i.base_unit,
        i.current_stock_quantity + i.local_stock_delta AS current_stock_quantity,
        CASE WHEN i.inventory_value_centimes IS NULL THEN NULL
          ELSE i.inventory_value_centimes + i.local_inventory_value_delta END
          AS inventory_value_centimes,
        i.cost_status, i.valuation_revision, i.low_stock_threshold,
        i.status, i.revision, i.updated_at
       FROM ingredients i
       WHERE NOT EXISTS (
         SELECT 1 FROM local_cloud_mappings m
         JOIN ingredients cloud ON cloud.id = m.cloud_record_id
         WHERE m.record_type = 'ingredient'
           AND m.local_record_id = i.id
           AND m.local_record_id <> m.cloud_record_id
       )
       ORDER BY CASE WHEN i.status = 'archived' THEN 1 ELSE 0 END,
         i.name
       LIMIT 1001`,
    ),
    database.query(
      `SELECT ingredient_id, COUNT(*) AS movement_count,
        SUM(CASE WHEN movement_type IN ('manual-adjustment', 'stock-addition') THEN 1 ELSE 0 END) AS adjustment_count,
        SUM(CASE WHEN movement_type = 'sale' AND quantity_delta < 0 THEN -quantity_delta ELSE 0 END) AS used_today
       FROM stock_movements
       WHERE business_date = ?
       GROUP BY ingredient_id
       LIMIT 1001`,
      [today],
    ),
  ]);
  if ((ingredientResult.values?.length ?? 0) > 1_000
      || (movementResult.values?.length ?? 0) > 1_000) {
    throw new Error('Saved stock exceeds the offline inventory limit.');
  }
  const mappedMovementId = new Map<string, string>();
  const mappings = await database.query(
    `SELECT local_record_id, cloud_record_id FROM local_cloud_mappings
     WHERE record_type = 'ingredient' LIMIT 1001`,
  );
  for (const mapping of mappings.values ?? []) {
    mappedMovementId.set(String(mapping.local_record_id), String(mapping.cloud_record_id));
  }
  const movements = new Map<string, { movement_count: number; adjustment_count: number; used_today: number }>();
  for (const row of movementResult.values ?? []) {
    const ingredientId = mappedMovementId.get(String(row.ingredient_id))
      ?? String(row.ingredient_id);
    const current = movements.get(ingredientId) ?? {
      movement_count: 0,
      adjustment_count: 0,
      used_today: 0,
    };
    current.movement_count += Number(row.movement_count ?? 0);
    current.adjustment_count += Number(row.adjustment_count ?? 0);
    current.used_today += Number(row.used_today ?? 0);
    movements.set(ingredientId, current);
  }
  const ingredients = (ingredientResult.values ?? []).map((item) => ({
    id: String(item.id),
    key: String(item.key),
    name: String(item.name),
    baseUnit: item.base_unit as 'millilitre' | 'gram' | 'milligram' | 'piece',
    currentStockQuantity: Number(item.current_stock_quantity),
    ...(item.inventory_value_centimes === null
      ? {}
      : { inventoryValueCentimes: Number(item.inventory_value_centimes) }),
    costStatus: item.cost_status === 'complete' ? 'complete' as const : 'incomplete' as const,
    valuationRevision: Number(item.valuation_revision),
    lowStockThreshold: Number(item.low_stock_threshold),
    usedToday: movements.get(String(item.id))?.used_today ?? 0,
    status: item.status === 'archived' ? 'archived' as const : 'active' as const,
    revision: Number(item.revision),
    updatedAt: Number(item.updated_at),
  }));
  const active = ingredients.filter((item) => item.status === 'active');
  return {
    ingredients,
    metrics: {
      ingredientCount: active.length,
      lowStockCount: active.filter(
        (item) => item.currentStockQuantity <= item.lowStockThreshold,
      ).length,
      movementCount: [...movements.values()].reduce(
        (sum, row) => sum + Number(row.movement_count ?? 0),
        0,
      ),
      adjustmentCount: [...movements.values()].reduce(
        (sum, row) => sum + Number(row.adjustment_count ?? 0),
        0,
      ),
    },
  };
}

export async function loadOfflineIngredientDetail(ingredientId: string) {
  const [database, cache] = await Promise.all([
    openLocalDatabase(),
    loadOperationalCache(),
  ]);
  const [movements, purchases] = await Promise.all([
    database.query(
      `SELECT id, quantity_delta, movement_type, reason, actor_label,
        business_date, created_at
       FROM stock_movements
       WHERE ingredient_id = ? OR ingredient_id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'ingredient' AND cloud_record_id = ?
       )
       ORDER BY created_at DESC
       LIMIT 50`,
      [ingredientId, ingredientId],
    ),
    database.query(
      `SELECT id, package_label, package_count, quantity_per_package,
        total_quantity, package_price_centimes, total_cost_centimes,
        transaction_type, received_at
       FROM inventory_purchases
       WHERE ingredient_id = ? OR ingredient_id IN (
         SELECT local_record_id FROM local_cloud_mappings
         WHERE record_type = 'ingredient' AND cloud_record_id = ?
       )
       ORDER BY received_at DESC
       LIMIT 20`,
      [ingredientId, ingredientId],
    ),
  ]);
  const productById = new Map(cache.products.map((product) => [product.id, product]));
  const activeVersions = new Map(
    cache.recipeVersions.map((version) => [version.id, version]),
  );
  return {
    movements: (movements.values ?? []).map((row) => ({
      id: String(row.id),
      quantityDelta: Number(row.quantity_delta),
      movementType: String(row.movement_type),
      reason: String(row.reason),
      ...(row.actor_label ? { actorLabel: String(row.actor_label) } : {}),
      businessDate: String(row.business_date),
      createdAt: Number(row.created_at),
    })),
    purchases: (purchases.values ?? []).map((row) => ({
      id: String(row.id),
      packageLabel: String(row.package_label),
      packageCount: Number(row.package_count),
      quantityPerPackage: Number(row.quantity_per_package),
      totalQuantity: Number(row.total_quantity),
      packagePriceCentimes: Number(row.package_price_centimes),
      totalCostCentimes: Number(row.total_cost_centimes),
      transactionType: String(row.transaction_type),
      receivedAt: Number(row.received_at),
    })),
    linkedRecipes: cache.recipeItems.flatMap((item) => {
      if (item.ingredientId !== ingredientId) return [];
      const version = activeVersions.get(item.recipeVersionId);
      const product = version ? productById.get(version.productId) : undefined;
      return product
        ? [{ productId: product.id, productName: product.name, quantity: item.quantity }]
        : [];
    }),
  };
}
