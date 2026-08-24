import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { occursInMonth } from '../lib/costs.ts';
import type { StaffRole } from './permissions.ts';
import { openLocalDatabase, withLocalTransaction } from './localDatabase.ts';
import type {
  SavedCostManagement,
  SavedExpense,
} from './localCosts.ts';

type Database = Pick<SQLiteDBConnection, 'query' | 'run'>;

function month(value: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    throw new Error('Month is invalid.');
  }
  return value;
}

function expenseFromRow(row: Record<string, unknown>): SavedExpense {
  return {
    id: String(row.id),
    category: String(row.category),
    description: String(row.description),
    amountCentimes: Number(row.amount_centimes),
    recurrence: row.recurrence as 'one-time' | 'monthly',
    ...(row.effective_date ? { effectiveDate: String(row.effective_date) } : {}),
    ...(row.effective_start_month
      ? { effectiveStartMonth: String(row.effective_start_month) }
      : {}),
    ...(row.effective_end_month
      ? { effectiveEndMonth: String(row.effective_end_month) }
      : {}),
    transactionType: row.transaction_type === 'reversal' ? 'reversal' : 'recorded',
    ...(row.correction_of_expense_id
      ? { correctionOfExpenseId: String(row.correction_of_expense_id) }
      : {}),
    revision: Number(row.revision),
    createdAt: Number(row.created_at),
  };
}

export async function loadLocalCostManagementFromDatabase(
  database: Database,
  targetMonth: string,
  role: StaffRole,
): Promise<SavedCostManagement> {
  const selectedMonth = month(targetMonth);
  const expenseRows = await database.query(
    `SELECT e.* FROM operating_expenses e
     WHERE e.status = 'active' AND NOT EXISTS (
       SELECT 1 FROM local_cloud_mappings m
       JOIN operating_expenses cloud ON cloud.id = m.cloud_record_id
       WHERE m.record_type = 'expense' AND m.local_record_id = e.id
         AND m.local_record_id <> m.cloud_record_id
     )
     ORDER BY e.created_at DESC LIMIT 101`,
  );
  if ((expenseRows.values?.length ?? 0) > 100) {
    throw new Error('Saved expenses exceed the local report limit.');
  }
  const expenses = (expenseRows.values ?? []).map(expenseFromRow);
  const otherExpenseCentimes = expenses.reduce((sum, expense) => {
    const applies = expense.recurrence === 'one-time'
      ? expense.effectiveDate?.slice(0, 7) === selectedMonth
      : occursInMonth(
          selectedMonth,
          expense.effectiveStartMonth!,
          expense.effectiveEndMonth,
        );
    return applies
      ? sum + (expense.transactionType === 'reversal'
          ? -expense.amountCentimes
          : expense.amountCentimes)
      : sum;
  }, 0);
  const purchaseRows = await database.query(
    `SELECT transaction_type, total_cost_centimes FROM inventory_purchases
     WHERE business_date BETWEEN ? AND ? LIMIT 1001`,
    [`${selectedMonth}-01`, `${selectedMonth}-31`],
  );
  if ((purchaseRows.values?.length ?? 0) > 1_000) {
    throw new Error('Saved purchases exceed the local report limit.');
  }
  const purchaseCashCentimes = (purchaseRows.values ?? []).reduce(
    (sum, purchase) => sum + (purchase.transaction_type === 'reversal' ? -1 : 1)
      * Number(purchase.total_cost_centimes),
    0,
  );
  if (role !== 'owner') {
    return { month: selectedMonth, expenses, staff: [], compensation: [],
      purchaseCashCentimes, otherExpenseCentimes };
  }
  const [staffRows, periodRows, saleRows] = await Promise.all([
    database.query(
      `SELECT id, name, role FROM staff_profiles
       WHERE status = 'active' ORDER BY name LIMIT 101`,
    ),
    database.query(
      `SELECT c.* FROM compensation_periods c
       WHERE NOT EXISTS (
         SELECT 1 FROM local_cloud_mappings m
         JOIN compensation_periods cloud ON cloud.id = m.cloud_record_id
         WHERE m.record_type = 'compensation-period'
           AND m.local_record_id = c.id
           AND m.local_record_id <> m.cloud_record_id
       )
       ORDER BY c.effective_start_month DESC LIMIT 101`,
    ),
    database.query(
      `SELECT total_centimes, ingredient_cost_centimes, cost_status
       FROM sales WHERE status = 'completed'
         AND business_date BETWEEN ? AND ? LIMIT 1001`,
      [`${selectedMonth}-01`, `${selectedMonth}-31`],
    ),
  ]);
  if ((staffRows.values?.length ?? 0) > 100
      || (periodRows.values?.length ?? 0) > 100
      || (saleRows.values?.length ?? 0) > 1_000) {
    throw new Error('Saved profitability data exceeds the local report limit.');
  }
  const staff = (staffRows.values ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    role: row.role as StaffRole,
  }));
  const compensation = (periodRows.values ?? []).map((row) => ({
    id: String(row.id),
    staffProfileId: String(row.staff_profile_id),
    monthlyAmountCentimes: Number(row.monthly_amount_centimes),
    effectiveStartMonth: String(row.effective_start_month),
    ...(row.effective_end_month
      ? { effectiveEndMonth: String(row.effective_end_month) }
      : {}),
    revision: Number(row.revision),
    createdAt: Number(row.created_at),
  }));
  const revenueCentimes = (saleRows.values ?? []).reduce(
    (sum, row) => sum + Number(row.total_centimes),
    0,
  );
  const ingredientCostCentimes = (saleRows.values ?? []).reduce(
    (sum, row) => sum + Number(row.ingredient_cost_centimes ?? 0),
    0,
  );
  const incompleteSaleCount = (saleRows.values ?? []).filter(
    (row) => row.cost_status !== 'complete',
  ).length;
  const compensationCentimes = compensation.reduce((sum, period) =>
    occursInMonth(selectedMonth, period.effectiveStartMonth,
      period.effectiveEndMonth)
      ? sum + period.monthlyAmountCentimes
      : sum, 0);
  return {
    month: selectedMonth,
    expenses,
    staff,
    compensation,
    purchaseCashCentimes,
    otherExpenseCentimes,
    profitability: {
      revenueCentimes,
      ingredientCostCentimes,
      incompleteSaleCount,
      grossProfitCentimes: revenueCentimes - ingredientCostCentimes,
      compensationCentimes,
      operatingProfitCentimes: revenueCentimes - ingredientCostCentimes
        - compensationCentimes - otherExpenseCentimes,
      complete: incompleteSaleCount === 0,
    },
  };
}

export async function loadLocalCostManagement(
  targetMonth: string,
  role: StaffRole,
) {
  return loadLocalCostManagementFromDatabase(
    await openLocalDatabase(), targetMonth, role,
  );
}

export async function pruneSavedExpensesFromDatabase(
  database: Database,
  incomingIds: string[],
) {
  const incoming = incomingIds.length
    ? `id NOT IN (${incomingIds.map(() => '?').join(', ')})`
    : '1 = 1';
  await database.run(
    `DELETE FROM operating_expenses
     WHERE ${incoming}
       AND id NOT IN (
         SELECT m.local_record_id
         FROM management_operations m
         JOIN outbox o ON o.operation_id = m.operation_id
         WHERE m.operation_type IN (
           'management.expense.add', 'management.expense.correct'
         )
         UNION
         SELECT json_extract(m.payload_json, '$.localReversalId')
         FROM management_operations m
         JOIN outbox o ON o.operation_id = m.operation_id
         WHERE m.operation_type = 'management.expense.correct'
       )`,
    incomingIds,
    false,
  );
}

export async function pruneSavedCompensationFromDatabase(
  database: Database,
  incomingIds: string[],
) {
  const incoming = incomingIds.length
    ? `id NOT IN (${incomingIds.map(() => '?').join(', ')})`
    : '1 = 1';
  await database.run(
    `DELETE FROM compensation_periods
     WHERE ${incoming}
       AND id NOT IN (
         SELECT m.local_record_id
         FROM management_operations m
         JOIN outbox o ON o.operation_id = m.operation_id
         WHERE m.operation_type = 'management.compensation.add'
       )`,
    incomingIds,
    false,
  );
}

export function replaceSavedExpenses(
  rows: Array<{
    id: string;
    category: string;
    description: string;
    amountCentimes: number;
    recurrence: 'one-time' | 'monthly';
    effectiveDate?: string;
    effectiveStartMonth?: string;
    effectiveEndMonth?: string;
    transactionType: 'recorded' | 'reversal';
    correctionOfExpenseId?: string;
    revision: number;
  }>,
) {
  if (rows.length > 100) throw new Error('Expense snapshot exceeds its limit.');
  return withLocalTransaction(async (database) => {
    const now = Date.now();
    const ordered = [...rows].sort(
      (left, right) => Number(Boolean(left.correctionOfExpenseId))
        - Number(Boolean(right.correctionOfExpenseId)),
    );
    for (const row of ordered) {
      await database.run(
        `INSERT INTO operating_expenses
          (id, category, description, amount_centimes, recurrence,
           effective_date, effective_start_month, effective_end_month, status,
           revision, created_at, transaction_type, correction_of_expense_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET category = excluded.category,
           description = excluded.description,
           amount_centimes = excluded.amount_centimes,
           recurrence = excluded.recurrence,
           effective_date = excluded.effective_date,
           effective_start_month = excluded.effective_start_month,
           effective_end_month = excluded.effective_end_month,
           transaction_type = excluded.transaction_type,
           correction_of_expense_id = excluded.correction_of_expense_id,
           revision = excluded.revision`,
        [row.id, row.category, row.description, row.amountCentimes,
          row.recurrence, row.effectiveDate ?? null,
          row.effectiveStartMonth ?? null, row.effectiveEndMonth ?? null,
          row.revision, now, row.transactionType,
          row.correctionOfExpenseId ?? null],
        false,
      );
    }
    await pruneSavedExpensesFromDatabase(database, rows.map((row) => row.id));
  });
}

export function replaceSavedCompensation(
  rows: Array<{
    id: string;
    staffProfileId: string;
    monthlyAmountCentimes: number;
    effectiveStartMonth: string;
    effectiveEndMonth?: string;
    revision: number;
  }>,
) {
  if (rows.length > 100) throw new Error('Compensation snapshot exceeds its limit.');
  return withLocalTransaction(async (database) => {
    const now = Date.now();
    for (const row of rows) {
      await database.run(
        `INSERT INTO compensation_periods
          (id, staff_profile_id, monthly_amount_centimes,
           effective_start_month, effective_end_month, revision, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           monthly_amount_centimes = excluded.monthly_amount_centimes,
           effective_start_month = excluded.effective_start_month,
           effective_end_month = excluded.effective_end_month,
           revision = excluded.revision`,
        [row.id, row.staffProfileId, row.monthlyAmountCentimes,
          row.effectiveStartMonth, row.effectiveEndMonth ?? null,
          row.revision, now],
        false,
      );
    }
    await pruneSavedCompensationFromDatabase(
      database,
      rows.map((row) => row.id),
    );
  });
}
