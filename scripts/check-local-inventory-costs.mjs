import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import {
  receiveLocalPurchase,
  recordLocalStockAdjustment,
  saveLocalIngredient,
} from '../src/data/localInventory.ts';
import {
  addLocalCompensationPeriod,
  addLocalExpense,
  correctLocalExpense,
} from '../src/data/localCosts.ts';
import {
  loadLocalCostManagementFromDatabase,
  pruneSavedCompensationFromDatabase,
  pruneSavedExpensesFromDatabase,
} from '../src/data/localCostViews.ts';
import { listPendingOutboxFromDatabase } from '../src/data/outbox.ts';
import { localMigrations } from '../src/data/schema.ts';
import { matchesLevelFilter } from '../src/features/stock/stockPresentation.ts';

const activeIngredient = {
  id: 'active', key: 'active', name: 'Active', baseUnit: 'gram',
  currentStockQuantity: 10, lowStockThreshold: 1, status: 'active',
  revision: 1, updatedAt: 1,
};
const archivedIngredient = { ...activeIngredient, id: 'archived', status: 'archived' };
assert.equal(matchesLevelFilter(activeIngredient, 'all'), true);
assert.equal(matchesLevelFilter(archivedIngredient, 'all'), false);
assert.equal(matchesLevelFilter(archivedIngredient, 'archived'), true);

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
await assert.rejects(
  addLocalCompensationPeriod(manager, {
    staffProfileId: 'owner-local',
    monthlyAmountCentimes: 1,
    effectiveStartMonth: '2026-08',
  }, transaction),
  /cannot make this change/,
);
assert.equal(database.prepare('SELECT COUNT(*) count FROM compensation_periods').get().count, 1);

await correctLocalExpense(manager, { id: expense.id, revision: 1 }, {
  category: 'Rent',
  description: 'August rent corrected',
  amountCentimes: 130_000,
  recurrence: 'one-time',
  effectiveDate: '2026-08-20',
}, transaction);
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
).get().count, 3);
assert.equal(database.prepare(
  'SELECT COUNT(*) count FROM compensation_periods',
).get().count, 1);
database.close();

console.log('Local-first inventory, expense, compensation, and dependency checks passed.');
