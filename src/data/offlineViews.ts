import { localBusinessDate, shiftBusinessDate } from '../lib/date.ts';
import { openLocalDatabase } from './localDatabase.ts';
import { loadOperationalCache } from './operationalCache.ts';

const ALIAS_LOCAL_STOCK_DELTA = `COALESCE((
  SELECT SUM(alias.local_stock_delta)
  FROM local_cloud_mappings map
  JOIN ingredients alias ON alias.id = map.local_record_id
  WHERE map.record_type = 'ingredient'
    AND map.cloud_record_id = i.id
    AND map.local_record_id <> map.cloud_record_id
), 0)`;

const ALIAS_LOCAL_VALUE_DELTA = `COALESCE((
  SELECT SUM(alias.local_inventory_value_delta)
  FROM local_cloud_mappings map
  JOIN ingredients alias ON alias.id = map.local_record_id
  WHERE map.record_type = 'ingredient'
    AND map.cloud_record_id = i.id
    AND map.local_record_id <> map.cloud_record_id
), 0)`;

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
  tenders?: Array<{
    paymentMethod?: 'Cash' | 'Card';
    dueCentimes: number;
  }>;
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
      total_centimes, business_date, receipt_snapshot_json, created_at,
      ingredient_cost_centimes
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
    ingredientCostCentimes: Number(row.ingredient_cost_centimes ?? 0),
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
  let ingredientCostCentimes = 0;
  const completed = rows.filter((row) => row.status === 'completed');
  for (const row of completed) {
    netCentimes += row.totalCentimes;
    ingredientCostCentimes += row.ingredientCostCentimes ?? 0;
    const salePayments = new Map<string, number>();
    for (const tender of row.receipt.tenders?.length
      ? row.receipt.tenders
      : [{ paymentMethod: row.receipt.paymentMethod, dueCentimes: row.totalCentimes }]) {
      const method = tender.paymentMethod ?? (row.receipt.paymentMethod || 'Unknown');
      salePayments.set(method, (salePayments.get(method) ?? 0) + tender.dueCentimes);
    }
    for (const [paymentMethod, amount] of salePayments) {
      const payment = payments.get(paymentMethod) ?? {
        paymentMethod,
        totalCentimes: 0,
        orderCount: 0,
      };
      payment.totalCentimes += amount;
      payment.orderCount += 1;
      payments.set(paymentMethod, payment);
    }
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
    ingredientCostCentimes,
    incompleteSaleCount: 0,
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
  const [result, countResult, stockResult] = await Promise.all([
    database.query(
      `SELECT MIN(m.ingredient_id) AS ingredient_id,
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
       GROUP BY COALESCE(i.name, NULLIF(m.ingredient_name_snapshot, '')),
         COALESCE(i.base_unit, NULLIF(m.ingredient_base_unit_snapshot, ''))
       ORDER BY name
        LIMIT 20`,
       [fromDate, toDate],
     ),
    database.query(
      `SELECT COUNT(*) AS count FROM (
        SELECT 1
        FROM stock_movements m
        LEFT JOIN ingredients i ON i.id = m.ingredient_id
        JOIN sales s ON s.local_sale_id = m.local_sale_id
        WHERE m.business_date BETWEEN ? AND ?
          AND m.movement_type = 'sale'
          AND s.status = 'completed'
        GROUP BY COALESCE(i.name, NULLIF(m.ingredient_name_snapshot, '')),
          COALESCE(i.base_unit, NULLIF(m.ingredient_base_unit_snapshot, ''))
      )`,
      [fromDate, toDate],
    ),
    database.query(
      `SELECT name, base_unit,
        current_stock_quantity + local_stock_delta
          + ${ALIAS_LOCAL_STOCK_DELTA} AS current_stock_quantity
       FROM ingredients i
       WHERE i.status = 'active'
         AND NOT EXISTS (
           SELECT 1 FROM local_cloud_mappings m
           JOIN ingredients cloud ON cloud.id = m.cloud_record_id
           WHERE m.record_type = 'ingredient'
             AND m.local_record_id = i.id
             AND m.local_record_id <> m.cloud_record_id
         )
       LIMIT 101`,
    ),
  ]);
  if ((stockResult.values?.length ?? 0) > 100) {
    throw new Error('Saved stock exceeds the offline inventory limit.');
  }
  const stockByName = new Map(
    (stockResult.values ?? []).map((row) => [
      `${row.name}\0${row.base_unit}`,
      Number(row.current_stock_quantity),
    ]),
  );
  return {
    ingredientTypeCount: Number(countResult.values?.[0]?.count ?? 0),
    ingredientTotals: (result.values ?? []).map((row) => {
    const ingredientName = String(row.name);
    const baseUnit = String(row.base_unit) as
      'millilitre' | 'gram' | 'milligram' | 'piece';
    return {
      ingredientId: String(row.ingredient_id),
      ingredientName,
      baseUnit,
      quantity: Number(row.quantity),
      currentStockQuantity: stockByName.get(`${ingredientName}\0${baseUnit}`) ?? 0,
    };
    }),
  };
}

async function dailyIngredientUsageEvents(fromDate: string, toDate: string) {
  const database = await openLocalDatabase();
  const result = await database.query(
    `SELECT m.business_date AS business_date, COUNT(*) AS event_count
     FROM stock_movements m
     JOIN sales s ON s.local_sale_id = m.local_sale_id
     WHERE m.business_date BETWEEN ? AND ?
       AND m.movement_type = 'sale'
       AND s.status = 'completed'
     GROUP BY m.business_date`,
    [fromDate, toDate],
  );
  return new Map(
    (result.values ?? []).map((row) => [
      String(row.business_date),
      Number(row.event_count),
    ]),
  );
}

async function loadOfflineAllReport() {
  const database = await openLocalDatabase();
  const today = localBusinessDate();
  const dates = await database.query(
    `SELECT MIN(date) AS earliest FROM (
       SELECT business_date AS date FROM sales WHERE status = 'completed'
       UNION ALL SELECT COALESCE(effective_date, effective_start_date,
         effective_start_month || '-01') FROM operating_expenses WHERE status = 'active'
       UNION ALL SELECT COALESCE(effective_start_date,
         effective_start_month || '-01') FROM compensation_periods
     )`,
  );
  const fromDate = String(dates.values?.[0]?.earliest ?? today);
  const [summary, products, categories, payments, usage] = await Promise.all([
    database.query(
      `SELECT COALESCE(SUM(total_centimes), 0) AS net_centimes,
        COUNT(*) AS order_count,
        COALESCE(SUM(ingredient_cost_centimes), 0) AS ingredient_cost_centimes,
        COALESCE(SUM(CASE WHEN cost_status <> 'complete' THEN 1 ELSE 0 END), 0) AS incomplete_sale_count
       FROM sales WHERE status = 'completed'`,
    ),
    database.query(
      `SELECT item.product_id, item.product_name_snapshot AS product_name,
        SUM(item.quantity) AS quantity, SUM(item.line_total_centimes) AS total_centimes
       FROM sale_items item JOIN sales sale ON sale.local_sale_id = item.local_sale_id
       WHERE sale.status = 'completed' GROUP BY item.product_id, item.product_name_snapshot
       ORDER BY total_centimes DESC, quantity DESC, product_name LIMIT 20`,
    ),
    database.query(
      `SELECT item.category_id_snapshot AS category_id, item.category_name_snapshot AS category_name,
        SUM(item.quantity) AS quantity, SUM(item.line_total_centimes) AS total_centimes
       FROM sale_items item JOIN sales sale ON sale.local_sale_id = item.local_sale_id
       WHERE sale.status = 'completed' AND item.category_id_snapshot <> ''
       GROUP BY item.category_id_snapshot, item.category_name_snapshot
       ORDER BY total_centimes DESC, category_name LIMIT 20`,
    ),
    database.query(
      `SELECT COALESCE(json_extract(sale.receipt_snapshot_json, '$.paymentMethod'), 'Unknown') AS payment_method,
        SUM(sale.total_centimes) AS total_centimes, COUNT(*) AS order_count
       FROM sales sale WHERE sale.status = 'completed'
       GROUP BY payment_method ORDER BY total_centimes DESC, payment_method LIMIT 20`,
    ),
    ingredientUsage(fromDate, today),
  ]);
  const row = summary.values?.[0] ?? {};
  const productTotals = (products.values ?? []).map((item) => ({
    productId: String(item.product_id), productName: String(item.product_name),
    quantity: Number(item.quantity), totalCentimes: Number(item.total_centimes),
  }));
  return {
    range: { from: fromDate, to: today, days: 0 },
    comparisonRange: undefined,
    current: {
      netCentimes: Number(row.net_centimes ?? 0), orderCount: Number(row.order_count ?? 0),
      itemCount: productTotals.reduce((total, item) => total + item.quantity, 0),
      ingredientCostCentimes: Number(row.ingredient_cost_centimes ?? 0),
      incompleteSaleCount: Number(row.incomplete_sale_count ?? 0),
      ingredientUsageEventCount: 0, ingredientTypeCount: usage.ingredientTypeCount,
      productTotals,
      categoryTotals: (categories.values ?? []).map((item) => ({
        categoryId: String(item.category_id), categoryName: String(item.category_name),
        quantity: Number(item.quantity), totalCentimes: Number(item.total_centimes),
      })),
      paymentTotals: (payments.values ?? []).map((item) => ({
        paymentMethod: String(item.payment_method), totalCentimes: Number(item.total_centimes),
        orderCount: Number(item.order_count),
      })),
      ingredientTotals: usage.ingredientTotals,
    },
    previous: { netCentimes: 0, orderCount: 0, itemCount: 0, ingredientCostCentimes: 0,
      incompleteSaleCount: 0, ingredientUsageEventCount: 0, ingredientTypeCount: 0,
      productTotals: [], categoryTotals: [], paymentTotals: [], ingredientTotals: [] },
    daily: [],
  };
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
  if (!fromDate && !toDate) return loadOfflineAllReport();
  const days = Math.floor(
    (Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`))
      / 86_400_000,
  ) + 1;
  if (days < 1 || days > 31) throw new Error('Report periods must contain 1 to 31 days.');
  const previousTo = shiftBusinessDate(fromDate, -1);
  const previousFrom = shiftBusinessDate(previousTo, 1 - days);
  const [currentRows, previousRows, cache, usage, dailyUsage] = await Promise.all([
    localSales(fromDate, toDate),
    localSales(previousFrom, previousTo),
    loadOperationalCache(),
    ingredientUsage(fromDate, toDate),
    dailyIngredientUsageEvents(fromDate, toDate),
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
    ingredientTypeCount: usage.ingredientTypeCount,
    ingredientUsageEventCount: [...dailyUsage.values()].reduce(
      (total, count) => total + count,
      0,
    ),
    ingredientTotals: usage.ingredientTotals,
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
        ingredientCostCentimes: daily.ingredientCostCentimes,
        ingredientUsageEventCount: dailyUsage.get(date) ?? 0,
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
        i.current_stock_quantity + i.local_stock_delta
          + ${ALIAS_LOCAL_STOCK_DELTA} AS current_stock_quantity,
        CASE WHEN i.inventory_value_centimes IS NULL THEN NULL
          ELSE i.inventory_value_centimes + i.local_inventory_value_delta
            + ${ALIAS_LOCAL_VALUE_DELTA} END
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
      `SELECT COALESCE(i.name, NULLIF(m.ingredient_name_snapshot, '')) AS name,
        COALESCE(i.base_unit, NULLIF(m.ingredient_base_unit_snapshot, '')) AS base_unit,
        COUNT(*) AS movement_count,
        SUM(CASE WHEN m.movement_type IN ('manual-adjustment', 'stock-addition') THEN 1 ELSE 0 END)
          AS adjustment_count,
        SUM(CASE WHEN m.movement_type = 'sale' AND m.quantity_delta < 0
          AND s.status = 'completed'
          THEN -m.quantity_delta ELSE 0 END) AS used_today,
        SUM(CASE WHEN m.movement_type = 'sale' AND m.quantity_delta < 0
          AND s.status = 'completed' AND s.sync_state != 'synced'
          THEN -m.quantity_delta ELSE 0 END) AS unsynced_used
       FROM stock_movements m
       LEFT JOIN ingredients i ON i.id = COALESCE(
         (SELECT cloud_record_id FROM local_cloud_mappings
          WHERE record_type = 'ingredient' AND local_record_id = m.ingredient_id
          LIMIT 1),
         (SELECT local_record_id FROM local_cloud_mappings
          WHERE record_type = 'ingredient' AND cloud_record_id = m.ingredient_id
          LIMIT 1),
         m.ingredient_id
       )
       LEFT JOIN sales s ON s.local_sale_id = m.local_sale_id
       WHERE m.business_date = ?
       GROUP BY 1, 2
       LIMIT 1001`,
      [today],
    ),
  ]);
  if ((ingredientResult.values?.length ?? 0) > 1_000
      || (movementResult.values?.length ?? 0) > 1_000) {
    throw new Error('Saved stock exceeds the offline inventory limit.');
  }
  const usedByName = new Map<string, number>();
  const unsyncedUsedByName = new Map<string, number>();
  let movementCount = 0;
  let adjustmentCount = 0;
  for (const row of movementResult.values ?? []) {
    movementCount += Number(row.movement_count ?? 0);
    adjustmentCount += Number(row.adjustment_count ?? 0);
    const key = `${row.name}\0${row.base_unit}`;
    if (!row.name) continue;
    usedByName.set(key, (usedByName.get(key) ?? 0) + Number(row.used_today ?? 0));
    unsyncedUsedByName.set(
      key,
      (unsyncedUsedByName.get(key) ?? 0) + Number(row.unsynced_used ?? 0),
    );
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
    usedToday: usedByName.get(`${item.name}\0${item.base_unit}`) ?? 0,
    status: item.status === 'archived' ? 'archived' as const : 'active' as const,
    revision: Number(item.revision),
    updatedAt: Number(item.updated_at),
  }));
  const active = ingredients.filter((item) => item.status === 'active');
  return {
    ingredients,
    unsyncedUsedByName,
    metrics: {
      ingredientCount: active.length,
      lowStockCount: active.filter(
        (item) => item.currentStockQuantity <= item.lowStockThreshold,
      ).length,
      movementCount,
      adjustmentCount,
    },
  };
}

export function overlayCloudUsedToday(
  inventory: Awaited<ReturnType<typeof loadOfflineInventory>>,
  cloudTotals: Array<{
    ingredientName: string;
    baseUnit: string;
    quantity: number;
  }>,
) {
  const cloudByName = new Map(
    cloudTotals.map((item) => [
      `${item.ingredientName}\0${item.baseUnit}`,
      item.quantity,
    ]),
  );
  return {
    ...inventory,
    ingredients: inventory.ingredients.map((item) => {
      const key = `${item.name}\0${item.baseUnit}`;
      const cloud = cloudByName.get(key);
      const unsynced = inventory.unsyncedUsedByName.get(key) ?? 0;
      return {
        ...item,
        usedToday: Math.max(item.usedToday, (cloud ?? 0) + unsynced),
      };
    }),
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
