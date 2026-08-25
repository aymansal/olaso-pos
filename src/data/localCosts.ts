import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { StaffRole } from './permissions.ts';
import { withLocalTransaction } from './localDatabase.ts';
import {
  enqueueManagementOperation,
  latestPendingManagementOperationIdFromDatabase,
} from './localManagement.ts';
import {
  COMPENSATION_MANAGEMENT_OPERATION_TYPES,
  EXPENSE_MANAGEMENT_OPERATION_TYPES,
  type LocalManagementActor,
} from './managementOperation.ts';

type Database = Pick<SQLiteDBConnection, 'query' | 'run'>;
type Transaction = <T>(operation: (database: Database) => Promise<T>) => Promise<T>;
type Context = { deviceId: string; actor: LocalManagementActor };

export type ExpenseInput = {
  category: string;
  description: string;
  amountCentimes: number;
  recurrence: 'one-time' | 'monthly';
  effectiveDate?: string;
  effectiveStartMonth?: string;
  effectiveEndMonth?: string;
};

export type SavedExpense = ExpenseInput & {
  id: string;
  transactionType: 'recorded' | 'reversal';
  correctionOfExpenseId?: string;
  revision: number;
  createdAt: number;
};

export type SavedCompensationPeriod = {
  id: string;
  staffProfileId: string;
  staffNameSnapshot?: string;
  staffRoleSnapshot?: StaffRole;
  monthlyAmountCentimes: number;
  effectiveStartMonth: string;
  effectiveEndMonth?: string;
  revision: number;
  createdAt: number;
};

export type SavedCostManagement = {
  month: string;
  expenses: SavedExpense[];
  staff: Array<{ id: string; name: string; role: StaffRole }>;
  compensation: SavedCompensationPeriod[];
  purchaseCashCentimes: number;
  otherExpenseCentimes: number;
  profitability?: {
    revenueCentimes: number;
    ingredientCostCentimes: number;
    incompleteSaleCount: number;
    grossProfitCentimes: number;
    compensationCentimes: number;
    operatingProfitCentimes: number;
    complete: boolean;
  };
};

const MAX_MONEY = 100_000_000;
const id = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

function text(value: string, label: string, limit: number) {
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > limit) throw new Error(`${label} is invalid.`);
  return cleaned;
}

function integer(value: number, label: string, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum || value > MAX_MONEY) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
}

function month(value: string, label = 'Month') {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
}

function date(value: string) {
  const parsed = Date.parse(`${value}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)
      || !Number.isFinite(parsed)
      || new Date(parsed).toISOString().slice(0, 10) !== value) {
    throw new Error('Effective date is invalid.');
  }
  return value;
}

function cleanExpense(input: ExpenseInput) {
  const base = {
    category: text(input.category, 'Expense category', 60),
    description: text(input.description, 'Expense description', 160),
    amountCentimes: integer(input.amountCentimes, 'Expense amount', 1),
    recurrence: input.recurrence,
  };
  if (input.recurrence === 'one-time') {
    if (!input.effectiveDate || input.effectiveStartMonth || input.effectiveEndMonth) {
      throw new Error('One-time expenses require only an effective date.');
    }
    return { ...base, effectiveDate: date(input.effectiveDate) };
  }
  if (input.recurrence !== 'monthly'
      || !input.effectiveStartMonth || input.effectiveDate) {
    throw new Error('Monthly expenses require an effective start month.');
  }
  const effectiveStartMonth = month(input.effectiveStartMonth, 'Effective start month');
  const effectiveEndMonth = input.effectiveEndMonth
    ? month(input.effectiveEndMonth, 'Effective end month')
    : undefined;
  if (effectiveEndMonth && effectiveEndMonth < effectiveStartMonth) {
    throw new Error('Expense cannot end before it starts.');
  }
  return { ...base, effectiveStartMonth,
    ...(effectiveEndMonth ? { effectiveEndMonth } : {}) };
}

function insertExpense(
  database: Database,
  expense: ReturnType<typeof cleanExpense>,
  input: {
    id: string;
    transactionType: 'recorded' | 'reversal';
    correctionOfExpenseId?: string;
    actor: string;
    clientMutationId: string;
    createdAt: number;
  },
) {
  return database.run(
    `INSERT INTO operating_expenses
      (id, category, description, amount_centimes, recurrence, effective_date,
       effective_start_month, effective_end_month, status, revision, created_at,
       transaction_type, correction_of_expense_id, updated_by,
       client_mutation_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 1, ?, ?, ?, ?, ?)`,
    [input.id, expense.category, expense.description, expense.amountCentimes,
      expense.recurrence, 'effectiveDate' in expense ? expense.effectiveDate : null,
      'effectiveStartMonth' in expense ? expense.effectiveStartMonth : null,
      'effectiveEndMonth' in expense ? expense.effectiveEndMonth ?? null : null,
      input.createdAt, input.transactionType, input.correctionOfExpenseId ?? null,
      input.actor, input.clientMutationId],
    false,
  );
}

export function addLocalExpense(
  context: Context,
  input: ExpenseInput,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const saved = cleanExpense(input);
    const now = Date.now();
    const expenseId = id('expense');
    const operationId = crypto.randomUUID();
    await insertExpense(database, saved, {
      id: expenseId,
      transactionType: 'recorded',
      actor: context.actor.name,
      clientMutationId: operationId,
      createdAt: now,
    });
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationId,
      operationType: 'management.expense.add',
      localRecordId: expenseId,
      dependsOnOperationId: await latestPendingManagementOperationIdFromDatabase(
        database,
        EXPENSE_MANAGEMENT_OPERATION_TYPES,
      ),
      requiredPermission: 'expenses',
      actor: context.actor,
      payload: saved,
      createdAt: now,
    });
    return { id: expenseId, revision: 1, operationId: operation.operationId };
  });
}

export function correctLocalExpense(
  context: Context,
  original: Pick<SavedExpense, 'id' | 'revision'>,
  input: ExpenseInput,
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const row = (await database.query(
      `SELECT * FROM operating_expenses WHERE id = ? LIMIT 1`,
      [original.id],
    )).values?.[0];
    if (!row || row.transaction_type !== 'recorded') {
      throw new Error('Only a recorded expense can be corrected.');
    }
    if (Number(row.revision) !== original.revision) {
      throw new Error('Expense changed. Refresh it before correcting it.');
    }
    if ((await database.query(
      `SELECT 1 FROM operating_expenses
       WHERE correction_of_expense_id = ? LIMIT 1`,
      [original.id],
    )).values?.[0]) {
      throw new Error('This expense already has correction history.');
    }
    const replacement = cleanExpense(input);
    const prior = cleanExpense({
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
    });
    const now = Date.now();
    const operationId = crypto.randomUUID();
    const reversalId = id('expense-reversal');
    const replacementId = id('expense');
    await insertExpense(database, {
      ...prior,
      description: `Correction reversal: ${prior.description}`,
    }, {
      id: reversalId,
      transactionType: 'reversal',
      correctionOfExpenseId: original.id,
      actor: context.actor.name,
      clientMutationId: `${operationId}:reversal`,
      createdAt: now,
    });
    await insertExpense(database, replacement, {
      id: replacementId,
      transactionType: 'recorded',
      correctionOfExpenseId: original.id,
      actor: context.actor.name,
      clientMutationId: `${operationId}:replacement`,
      createdAt: now + 1,
    });
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationId,
      operationType: 'management.expense.correct',
      localRecordId: replacementId,
      dependsOnOperationId: await latestPendingManagementOperationIdFromDatabase(
        database,
        EXPENSE_MANAGEMENT_OPERATION_TYPES,
      ),
      requiredPermission: 'expenses',
      actor: context.actor,
      expectedRevision: original.revision,
      payload: { expenseId: original.id, ...replacement, localReversalId: reversalId },
      createdAt: now,
    });
    return { reversalId, replacementId, operationId: operation.operationId };
  });
}

export function addLocalCompensationPeriod(
  context: Context,
  input: {
    staffProfileId: string;
    monthlyAmountCentimes: number;
    effectiveStartMonth: string;
    effectiveEndMonth?: string;
  },
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const profile = (await database.query(
      `SELECT id, name, role FROM staff_profiles
       WHERE id = ? AND status = 'active' LIMIT 1`,
      [input.staffProfileId],
    )).values?.[0];
    if (!profile) {
      throw new Error('Staff profile is unavailable.');
    }
    const effectiveStartMonth = month(input.effectiveStartMonth, 'Effective start month');
    const effectiveEndMonth = input.effectiveEndMonth
      ? month(input.effectiveEndMonth, 'Effective end month')
      : undefined;
    if (effectiveEndMonth && effectiveEndMonth < effectiveStartMonth) {
      throw new Error('Compensation cannot end before it starts.');
    }
    const periods = await database.query(
      `SELECT effective_start_month, effective_end_month
       FROM compensation_periods WHERE staff_profile_id = ? LIMIT 101`,
      [input.staffProfileId],
    );
    if ((periods.values?.length ?? 0) > 100) {
      throw new Error('Compensation history exceeds the saved limit.');
    }
    if ((periods.values ?? []).some((period) =>
      String(period.effective_start_month) <= (effectiveEndMonth ?? '9999-12')
      && String(period.effective_end_month ?? '9999-12') >= effectiveStartMonth)) {
      throw new Error('Compensation periods cannot overlap.');
    }
    const monthlyAmountCentimes = integer(
      input.monthlyAmountCentimes,
      'Monthly compensation',
    );
    const now = Date.now();
    const periodId = id('compensation');
    const operationId = crypto.randomUUID();
    await database.run(
      `INSERT INTO compensation_periods
        (id, staff_profile_id, staff_name_snapshot, staff_role_snapshot,
         monthly_amount_centimes, effective_start_month,
         effective_end_month, revision, created_at, updated_by,
         client_mutation_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
      [periodId, input.staffProfileId, String(profile.name), String(profile.role),
        monthlyAmountCentimes,
        effectiveStartMonth, effectiveEndMonth ?? null, now,
        context.actor.name, operationId],
      false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationId,
      operationType: 'management.compensation.add',
      localRecordId: periodId,
      dependsOnOperationId: await latestPendingManagementOperationIdFromDatabase(
        database,
        COMPENSATION_MANAGEMENT_OPERATION_TYPES,
      ),
      requiredPermission: 'compensation',
      actor: context.actor,
      payload: { staffProfileId: input.staffProfileId, monthlyAmountCentimes,
        effectiveStartMonth, ...(effectiveEndMonth ? { effectiveEndMonth } : {}) },
      createdAt: now,
    });
    return { id: periodId, revision: 1, operationId: operation.operationId };
  });
}
