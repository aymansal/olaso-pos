import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import {
  receiveLocalPurchase,
  recordLocalStockAdjustment,
  saveLocalIngredient,
  deleteLocalIngredient,
} from '../src/data/localInventory.ts';
import {
  deleteLocalCategory,
  deleteLocalProduct,
  saveLocalCategory,
  saveLocalProduct,
} from '../src/data/localCatalog.ts';
import { saveLocalRecipeVersion } from '../src/data/localRecipes.ts';
import {
  addLocalCompensationPeriod,
  addLocalExpense,
  correctLocalExpense,
  deleteLocalCompensationPeriod,
} from '../src/data/localCosts.ts';
import {
  loadLocalCostManagementFromDatabase,
  pruneSavedCompensationFromDatabase,
  pruneSavedExpensesFromDatabase,
  replaceSavedCompensation,
} from '../src/data/localCostViews.ts';
import { listPendingOutboxFromDatabase } from '../src/data/outbox.ts';
import { loadDailySalesOverview } from '../src/data/dailyOwnerReport.ts';
import { localMigrations } from '../src/data/schema.ts';
import { operatingCostsForRange } from '../src/lib/costs.ts';
import { matchesLevelFilter } from '../src/features/stock/stockPresentation.ts';

const activeIngredient = {
  id: 'active', key: 'active', name: 'Active', baseUnit: 'gram',
  currentStockQuantity: 10, lowStockThreshold: 1, status: 'active',
  revision: 1, updatedAt: 1,
};
const archivedIngredient = { ...activeIngredient, id: 'archived', status: 'archived' };
assert.equal(matchesLevelFilter(activeIngredient, 'all'), true);
assert.equal(matchesLevelFilter(archivedIngredient, 'all'), false);
assert.equal(matchesLevelFilter(activeIngredient, 'healthy'), true);
assert.equal(matchesLevelFilter(activeIngredient, 'low'), false);

const database = new DatabaseSync(':memory:');
database.exec('PRAGMA foreign_keys = ON');
for (const migration of localMigrations) {
  for (const statement of migration.statements) database.exec(statement);
}
const adapter = {
  query(statement, values = []) {
    return { values: database.prepare(statement).all(...values) };
  },
  run(statement, values = []) {
    return database.prepare(statement).run(...values);
  },
};
const transaction = async (operation) => {
  database.exec('BEGIN');
  try {
    const result = await operation(adapter);
    database.exec('COMMIT');
    return result;
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
};
database.prepare(`INSERT INTO staff_profiles
  (id, name, role, status, revision, updated_at, identity_revision)
  VALUES (?, ?, ?, 'active', 1, 1, 1)`).run('manager-local', 'Manager', 'manager');
database.prepare(`INSERT INTO staff_profiles
  (id, name, role, status, revision, updated_at, identity_revision)
  VALUES (?, ?, ?, 'active', 1, 1, 1)`).run('owner-local', 'Owner', 'owner');
const manager = {
  deviceId: 'tablet-local',
  actor: { staffProfileId: 'manager-local', name: 'Manager', role: 'manager' },
};
const owner = {
  deviceId: 'tablet-local',
  actor: { staffProfileId: 'owner-local', name: 'Owner', role: 'owner' },
};

const expense = await addLocalExpense(manager, {
  category: 'Rent',
  description: 'August rent',
  amountCentimes: 120_000,
  recurrence: 'one-time',
  effectiveDate: '2026-08-20',
}, transaction);
const ingredient = await saveLocalIngredient(manager, {
  name: 'Offline milk',
  baseUnit: 'millilitre',
  lowStockThreshold: 100,
  openingQuantity: 0,
}, '2026-08-20', transaction);
const operations = database.prepare(
  `SELECT operation_id, operation_type, depends_on_operation_id
   FROM outbox ORDER BY rowid`,
).all();
assert.equal(operations[0].operation_type, 'management.expense.add');
assert.equal(operations[1].operation_type, 'management.ingredient.save');
assert.equal(operations[1].depends_on_operation_id, null,
  'Finance must not block operational stock or later sales.');

const purchase = await receiveLocalPurchase(manager, {
  id: ingredient.id,
  revision: ingredient.revision,
}, {
  packageLabel: 'Carton',
  packageCount: 2,
  quantityPerPackage: 500,
  packagePriceCentimes: 2_000,
  receivedAt: 1_777_000_000_000,
  businessDate: '2026-08-20',
}, transaction);
const adjustment = await recordLocalStockAdjustment(manager, {
  id: ingredient.id,
  revision: purchase.ingredientRevision,
}, 'set-count', 500, 'Physical count', '2026-08-20', transaction);
const savedIngredient = database.prepare(
  `SELECT current_stock_quantity + local_stock_delta AS quantity,
    inventory_value_centimes + local_inventory_value_delta AS value,
    cost_status, valuation_revision, revision
   FROM ingredients WHERE id = ?`,
).get(ingredient.id);
assert.deepEqual({ ...savedIngredient }, {
  quantity: 500,
  value: 2_000,
  cost_status: 'complete',
  valuation_revision: 2,
  revision: 3,
});
assert.equal(database.prepare(
  `SELECT COUNT(*) count FROM inventory_purchases WHERE client_mutation_id IS NOT NULL`,
).get().count, 1);
assert.equal(database.prepare(
  `SELECT COUNT(*) count FROM stock_movements WHERE client_mutation_id IS NOT NULL`,
).get().count, 2);
await assert.rejects(
  recordLocalStockAdjustment(manager, { id: ingredient.id, revision: 3 },
    'set-count', 500, 'No change', '2026-08-20', transaction),
  /already matches/,
);
assert.equal(database.prepare('SELECT COUNT(*) count FROM stock_movements').get().count, 2);

const compensation = await addLocalCompensationPeriod(owner, {
  staffProfileId: 'manager-local',
  monthlyAmountCentimes: 550_000,
  effectiveStartMonth: '2026-08',
}, transaction);
assert.ok(compensation.id);
await replaceSavedCompensation([
  {
    id: compensation.id,
    staffProfileId: 'manager-local',
    monthlyAmountCentimes: 550_000,
    effectiveStartMonth: '2026-08',
    revision: 1,
  },
  {
    id: 'exact-refresh-pay',
    staffProfileId: 'manager-local',
    monthlyAmountCentimes: 20_000,
    effectiveStartMonth: '2026-09',
    effectiveEndMonth: '2026-09',
    effectiveStartDate: '2026-09-15',
    effectiveEndDate: '2026-09-20',
    revision: 2,
  },
  {
    id: 'legacy-month-only-pay',
    staffProfileId: 'manager-local',
    monthlyAmountCentimes: 10_000,
    effectiveStartMonth: '2025-07',
    effectiveEndMonth: '2025-07',
    revision: 1,
  },
], transaction);
assert.deepEqual({ ...database.prepare(
  `SELECT effective_start_date, effective_end_date FROM compensation_periods WHERE id = ?`,
).get('exact-refresh-pay') }, {
  effective_start_date: '2026-09-15', effective_end_date: '2026-09-20',
});
assert.deepEqual({ ...database.prepare(
  `SELECT effective_start_date, effective_end_date FROM compensation_periods WHERE id = ?`,
).get('legacy-month-only-pay') }, {
  effective_start_date: null, effective_end_date: null,
});
await assert.rejects(
  addLocalCompensationPeriod(manager, {
    staffProfileId: 'owner-local',
    monthlyAmountCentimes: 1,
    effectiveStartMonth: '2026-08',
  }, transaction),
  /cannot make this change/,
);
assert.equal(database.prepare('SELECT COUNT(*) count FROM compensation_periods').get().count, 3);
const extraPay = await addLocalCompensationPeriod(owner, {
  staffProfileId: 'manager-local',
  monthlyAmountCentimes: 1_000,
  effectiveStartMonth: '2026-07',
  effectiveEndMonth: '2026-07',
}, transaction);
await deleteLocalCompensationPeriod(owner, extraPay, transaction);
assert.equal(database.prepare('SELECT COUNT(*) count FROM compensation_periods').get().count, 4);
assert.equal(
  database.prepare('SELECT effective_end_month FROM compensation_periods WHERE id = ?').get(extraPay.id).effective_end_month,
  '2026-07',
);

await correctLocalExpense(manager, { id: expense.id, revision: 1 }, {
  category: 'Rent',
  description: 'August rent corrected',
  amountCentimes: 130_000,
  recurrence: 'one-time',
  effectiveDate: '2026-08-20',
}, transaction);
const monthlyExpense = await addLocalExpense(manager, {
  category: 'Lease',
  description: 'September lease',
  amountCentimes: 90_000,
  recurrence: 'monthly',
  effectiveStartDate: '2026-09-10',
}, transaction);
await assert.rejects(
  correctLocalExpense(manager, monthlyExpense, {
    category: 'Lease',
    description: 'September lease correction',
    amountCentimes: 95_000,
    recurrence: 'monthly',
    effectiveStartDate: '2026-09-01',
  }, transaction),
  /The correction date cannot be before the original expense start date/,
);
assert.equal(database.prepare(
  `SELECT COUNT(*) count FROM operating_expenses WHERE correction_of_expense_id = ?`,
).get(monthlyExpense.id).count, 0);
await correctLocalExpense(manager, monthlyExpense, {
  category: 'Lease',
  description: 'September lease correction',
  amountCentimes: 95_000,
  recurrence: 'monthly',
  effectiveStartDate: '2026-09-10',
}, transaction);
assert.equal(database.prepare(
  `SELECT COUNT(*) count FROM operating_expenses WHERE correction_of_expense_id = ?`,
).get(monthlyExpense.id).count, 2);
database.prepare(`INSERT INTO sales
  (local_sale_id, device_id, receipt_number, status, service_type,
   subtotal_centimes, tax_centimes, total_centimes, currency, business_date,
   receipt_snapshot_json, ingredient_cost_centimes, cost_status, sync_state,
   created_at)
  VALUES ('sale-cost', 'tablet-local', '0826-0999', 'completed', 'take-away',
    500000, 0, 500000, 'MAD', '2026-08-20', '{}', 100000, 'complete',
    'synced', 1)`).run();
const ownerReport = await loadLocalCostManagementFromDatabase(
  adapter,
  '2026-08',
  'owner',
);
assert.equal(ownerReport.purchaseCashCentimes, 4_000);
assert.equal(ownerReport.otherExpenseCentimes, 130_000);
assert.equal(ownerReport.profitability?.revenueCentimes, 500_000);
assert.equal(ownerReport.profitability?.ingredientCostCentimes, 100_000);
assert.equal(ownerReport.profitability?.compensationCentimes, 550_000);
assert.equal(ownerReport.profitability?.operatingProfitCentimes, -280_000);
const managerReport = await loadLocalCostManagementFromDatabase(
  adapter,
  '2026-08',
  'manager',
);
assert.equal(managerReport.profitability, undefined);
assert.deepEqual(managerReport.compensation, []);

await assert.rejects(
  saveLocalIngredient(manager, {
    name: 'Priceless syrup',
    baseUnit: 'millilitre',
    lowStockThreshold: 0,
    openingQuantity: 1000,
  }, '2026-08-20', transaction),
  /price paid/,
);
const valuedOpening = await saveLocalIngredient(manager, {
  name: 'Vanilla syrup',
  baseUnit: 'millilitre',
  lowStockThreshold: 200,
  openingQuantity: 1000,
  openingCostCentimes: 10_000,
}, '2026-08-20', transaction);
const valuedRow = database.prepare(
  `SELECT current_stock_quantity + local_stock_delta AS quantity,
    inventory_value_centimes + local_inventory_value_delta AS value,
    cost_status, valuation_revision, revision
   FROM ingredients WHERE id = ?`,
).get(valuedOpening.id);
assert.deepEqual({ ...valuedRow }, {
  quantity: 1000,
  value: 10_000,
  cost_status: 'complete',
  valuation_revision: 1,
  revision: 2,
});
assert.equal(database.prepare(
  `SELECT package_label, total_quantity, total_cost_centimes, transaction_type
   FROM inventory_purchases WHERE ingredient_id = ?`,
).get(valuedOpening.id).package_label, 'Opening stock');
assert.equal(database.prepare(
  `SELECT depends_on_operation_id FROM outbox WHERE operation_id = ?`,
).get(valuedOpening.operationId).depends_on_operation_id,
  database.prepare(
    `SELECT operation_id FROM outbox
     WHERE local_record_id = ? AND operation_type = 'management.ingredient.save'`,
  ).get(valuedOpening.id).operation_id,
);
const valuedReport = await loadLocalCostManagementFromDatabase(
  adapter,
  '2026-08',
  'owner',
);
assert.equal(valuedReport.purchaseCashCentimes, 14_000);

database.prepare(
  `UPDATE outbox SET state = 'failed' WHERE operation_id = ?`,
).run(expense.operationId);
database.prepare(`INSERT INTO outbox
  (operation_id, device_id, operation_type, local_record_id, state,
   created_at, available_at)
  VALUES ('independent-sale', 'tablet-local', 'sale-completed', 'sale-cost',
    'pending', 2, 0)`).run();
const saleQueue = await listPendingOutboxFromDatabase(
  adapter,
  Date.now(),
  10,
  ['sale-completed'],
);
assert.deepEqual(saleQueue.map((row) => row.operationId), ['independent-sale']);

const stockQueue = database.prepare(
  `SELECT operation_id, depends_on_operation_id FROM outbox
   WHERE operation_type IN ('management.inventory.purchase',
     'management.inventory.adjust') ORDER BY rowid`,
).all();
assert.equal(stockQueue[0].depends_on_operation_id, ingredient.operationId);
assert.equal(stockQueue[1].depends_on_operation_id, purchase.operationId);
assert.ok(adjustment.operationId);
database.prepare(`INSERT INTO operating_expenses
  (id, category, description, amount_centimes, recurrence, effective_date,
   status, revision, created_at, transaction_type)
  VALUES ('stale-expense', 'Old', 'Old cloud copy', 1, 'one-time',
    '2026-08-01', 'active', 1, 1, 'recorded')`).run();
database.prepare(`INSERT INTO compensation_periods
  (id, staff_profile_id, monthly_amount_centimes, effective_start_month,
   revision, created_at)
  VALUES ('stale-compensation', 'manager-local', 1, '2025-01', 1, 1)`).run();
await pruneSavedExpensesFromDatabase(adapter, []);
await pruneSavedCompensationFromDatabase(adapter, []);
assert.equal(database.prepare(
  "SELECT COUNT(*) count FROM operating_expenses WHERE id = 'stale-expense'",
).get().count, 0);
assert.equal(database.prepare(
  "SELECT COUNT(*) count FROM compensation_periods WHERE id = 'stale-compensation'",
).get().count, 0);
assert.equal(database.prepare(
  'SELECT COUNT(*) count FROM operating_expenses',
).get().count, 6);
assert.equal(database.prepare(
  'SELECT COUNT(*) count FROM compensation_periods',
).get().count, 2);
const category = await saveLocalCategory(manager, {
  name: 'Delete test', artworkKey: 'coffee', sortOrder: 10,
}, transaction);
const remainingIngredient = await saveLocalIngredient(manager, {
  name: 'Remaining cocoa', baseUnit: 'gram', lowStockThreshold: 0,
  openingQuantity: 0,
}, '2026-08-20', transaction);
const product = await saveLocalProduct(manager, {
  name: 'Delete test drink', categoryId: category.id, basePriceCentimes: 2500,
  status: 'active', sortOrder: 10,
}, transaction);
const recipe = await saveLocalRecipeVersion(manager, {
  id: product.id, key: product.id, categoryId: category.id,
  name: 'Delete test drink', receiptName: 'Delete test drink',
  basePriceCentimes: 2500, status: 'active', sortOrder: 10,
  revision: product.revision, updatedAt: 1,
}, [{ ingredientId: ingredient.id, quantity: 20 },
  { ingredientId: remainingIngredient.id, quantity: 5 }], transaction);
database.prepare(`INSERT INTO stock_movements
  (id, ingredient_id, ingredient_name_snapshot,
   ingredient_base_unit_snapshot, local_sale_id, quantity_delta,
   movement_type, reason, business_date, created_at)
  VALUES ('sale-milk', ?, 'Offline milk', 'millilitre', 'sale-cost',
    -20, 'sale', 'Saved recipe', '2026-08-20', 3)`).run(ingredient.id);
database.prepare(`INSERT INTO sale_items
  (id, local_sale_id, product_id, quantity, product_name_snapshot,
   unit_price_centimes, modifier_snapshot_json, recipe_snapshot_json,
   line_total_centimes, category_id_snapshot, category_name_snapshot)
  VALUES ('delete-sale-item', 'sale-cost', ?, 1, 'Delete test drink', 2500,
    '[]', '[]', 2500, ?, 'Delete test')`).run(product.id, category.id);
const removedCategory = await deleteLocalCategory(
  manager, { id: category.id, revision: category.revision }, transaction,
);
assert.equal(database.prepare(
  'SELECT depends_on_operation_id FROM outbox WHERE operation_id = ?',
).get(removedCategory.operationId).depends_on_operation_id, 'independent-sale');
const removedIngredient = await deleteLocalIngredient(
  manager, { id: ingredient.id, revision: savedIngredient.revision }, transaction,
);
assert.equal(database.prepare('SELECT COUNT(*) count FROM ingredients WHERE id = ?')
  .get(ingredient.id).count, 0);
assert.equal(database.prepare('SELECT ingredient_name_snapshot FROM inventory_purchases')
  .get().ingredient_name_snapshot, 'Offline milk');
assert.equal(database.prepare('SELECT COUNT(*) count FROM stock_movements WHERE ingredient_id = ?')
  .get(ingredient.id).count, 3);
assert.equal(database.prepare('SELECT COUNT(*) count FROM recipe_items WHERE ingredient_id = ?')
  .get(ingredient.id).count, 1);
const repairedProduct = database.prepare(
  'SELECT current_recipe_version_id, status, revision FROM products WHERE id = ?',
).get(product.id);
assert.equal(repairedProduct.status, 'unavailable');
assert.notEqual(repairedProduct.current_recipe_version_id, recipe.id);
assert.deepEqual(database.prepare(
  'SELECT ingredient_id FROM recipe_items WHERE recipe_version_id = ?',
).all(repairedProduct.current_recipe_version_id).map((row) => row.ingredient_id),
[remainingIngredient.id]);
assert.equal(database.prepare(
  'SELECT depends_on_operation_id FROM outbox WHERE operation_id = ?',
).get(removedIngredient.operationId).depends_on_operation_id,
removedCategory.operationId,
'Ingredient deletion must wait for earlier category removal after the same sale.');
assert.equal(JSON.parse(database.prepare(
  'SELECT payload_json FROM management_operations WHERE operation_id = ?',
).get(removedIngredient.operationId).payload_json).pendingSaleRevisionCount, 1);
const removedProduct = await deleteLocalProduct(manager, {
  id: product.id,
  revision: repairedProduct.revision,
}, transaction);
assert.equal(database.prepare(
  'SELECT depends_on_operation_id FROM outbox WHERE operation_id = ?',
).get(removedProduct.operationId).depends_on_operation_id,
removedIngredient.operationId,
'Product deletion must wait for the earlier ingredient repair and its revision.');
assert.equal(database.prepare(
  'SELECT product_name_snapshot FROM sale_items WHERE id = ?',
).get('delete-sale-item').product_name_snapshot, 'Delete test drink');
assert.deepEqual(
  operatingCostsForRange(
    [{
      amountCentimes: 3100,
      recurrence: 'monthly',
      effectiveStartMonth: '2026-08',
      effectiveEndMonth: '2026-08',
    }],
    [{
      monthlyAmountCentimes: 31000,
      effectiveStartMonth: '2026-08',
      effectiveEndMonth: '2026-08',
    }],
    '2026-08-01',
    '2026-08-10',
  ),
  { otherExpenseCentimes: 1000, compensationCentimes: 10000 },
);
assert.equal((await loadLocalCostManagementFromDatabase(
  adapter, '2026-08', 'owner',
)).purchaseCashCentimes, 14_000);

const reportSale = (id, status, serviceType, subtotal, total, date) => {
  database.prepare(`INSERT INTO sales
    (local_sale_id, device_id, receipt_number, status, service_type,
     subtotal_centimes, tax_centimes, total_centimes, currency, business_date,
     receipt_snapshot_json, ingredient_cost_centimes, cost_status, sync_state,
     created_at)
    VALUES (?, 'tablet-local', ?, ?, ?, ?, 0, ?, 'MAD', ?, '{}', 0,
      'complete', 'synced', 1)`).run(
    id, `0902-${id}`, status, serviceType, subtotal, total, date,
  );
};
reportSale('done-1', 'completed', 'dine-in', 1300, 1000, '2026-09-02');
reportSale('done-2', 'completed', 'take-away', 2500, 2500, '2026-09-02');
reportSale('gone-1', 'cancelled', 'dine-in', 9000, 9000, '2026-09-02');
database.prepare(`INSERT INTO sale_corrections
  (local_correction_id, original_local_sale_id, device_id, reason, actor_name,
   business_date, corrected_at, sync_state)
  VALUES ('corr-1', 'gone-1', 'tablet-local', 'Wrong order', 'Owner',
   '2026-09-02', 1, 'synced')`).run();
const dailyOverview = await loadDailySalesOverview(adapter, '2026-09-02');
const dailyCompleted = dailyOverview.salesRows.filter(
  (row) => row.status === 'completed',
);
assert.equal(dailyCompleted.length, 2);
assert.equal(dailyCompleted.reduce(
  (sum, row) => sum + Number(row.subtotal_centimes), 0,
), 3800);
assert.deepEqual(dailyOverview.cancellations, [{
  receiptNumber: '0902-gone-1',
  reason: 'Wrong order',
  actorName: 'Owner',
}]);
database.close();

console.log('Local-first inventory, expense, compensation, and dependency checks passed.');
