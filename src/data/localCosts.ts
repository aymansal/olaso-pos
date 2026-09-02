import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { localBusinessDate, shiftBusinessDate } from '../lib/date.ts';
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
  effectiveStartDate?: string;
  effectiveEndDate?: string;
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
  effectiveStartDate?: string;
  effectiveEndDate?: string;
  revision: number;
  createdAt: number;
};

export type SavedCostManagement = {
  month: string;
  expenses: SavedExpense[];
  staff: Array<{ id: string; name: string; role: StaffRole }>;
  compensation: SavedCompensationPeriod[];
  purchaseCashCentimes: number;
  inventoryValueCentimes: number;
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
    return { ...base, recurrence: 'one-time' as const,
      effectiveDate: date(input.effectiveDate) };
  }
  if (input.recurrence !== 'monthly' || input.effectiveDate) {
    throw new Error('Monthly expenses require an effective start date.');
  }
  const effectiveStartDate = input.effectiveStartDate
    ? date(input.effectiveStartDate)
    : input.effectiveStartMonth
      ? `${month(input.effectiveStartMonth, 'Effective start month')}-01`
      : undefined;
  if (!effectiveStartDate) {
    throw new Error('Monthly expenses require an effective start date.');
  }
  const effectiveEndDate = input.effectiveEndDate
    ? date(input.effectiveEndDate)
    : input.effectiveEndMonth
      ? `${month(input.effectiveEndMonth, 'Effective end month')}-31`
      : undefined;
  if (effectiveEndDate && effectiveEndDate < effectiveStartDate) {
    throw new Error('Expense cannot end before it starts.');
  }
  return {
    ...base,
    recurrence: 'monthly' as const,
    effectiveStartMonth: effectiveStartDate.slice(0, 7),
    ...(effectiveEndDate ? { effectiveEndMonth: effectiveEndDate.slice(0, 7) } : {}),
    effectiveStartDate,
    ...(effectiveEndDate ? { effectiveEndDate } : {}),
  };
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
       effective_start_month, effective_end_month, effective_start_date,
       effective_end_date, status, revision, created_at,
       transaction_type, correction_of_expense_id, updated_by,
       client_mutation_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 1, ?, ?, ?, ?, ?)`,
    [input.id, expense.category, expense.description, expense.amountCentimes,
      expense.recurrence, 'effectiveDate' in expense ? expense.effectiveDate : null,
      'effectiveStartMonth' in expense ? expense.effectiveStartMonth : null,
      'effectiveEndMonth' in expense ? expense.effectiveEndMonth ?? null : null,
      'effectiveStartDate' in expense ? expense.effectiveStartDate : null,
      'effectiveEndDate' in expense ? expense.effectiveEndDate ?? null : null,
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
      ...(row.effective_start_date
        ? { effectiveStartDate: String(row.effective_start_date) }
        : {}),
      ...(row.effective_end_date
        ? { effectiveEndDate: String(row.effective_end_date) }
        : {}),
    });
    const now = Date.now();
    const operationId = crypto.randomUUID();
    const reversalId = id('expense-reversal');
    const replacementId = id('expense');
    const correctionDate = replacement.recurrence === 'monthly'
      ? replacement.effectiveStartDate
      : replacement.effectiveDate;
    const originalStartDate = prior.recurrence === 'monthly'
      ? prior.effectiveStartDate
      : prior.effectiveDate;
    if (originalStartDate && correctionDate < originalStartDate) {
      throw new Error('The correction date cannot be before the original expense start date.');
    }
    const reversal = prior.recurrence === 'monthly'
      ? {
          ...prior,
          effectiveStartMonth: correctionDate.slice(0, 7),
          effectiveStartDate: correctionDate,
        }
      : prior;
    await insertExpense(database, {
      ...reversal,
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
    effectiveStartDate?: string;
    effectiveEndDate?: string;
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
    const effectiveStartDate = input.effectiveStartDate
      ? date(input.effectiveStartDate)
      : `${month(input.effectiveStartMonth, 'Effective start month')}-01`;
    const effectiveEndDate = input.effectiveEndDate
      ? date(input.effectiveEndDate)
      : input.effectiveEndMonth
        ? `${month(input.effectiveEndMonth, 'Effective end month')}-31`
        : undefined;
    if (effectiveEndDate && effectiveEndDate < effectiveStartDate) {
      throw new Error('Compensation cannot end before it starts.');
    }
    const effectiveStartMonth = effectiveStartDate.slice(0, 7);
    const effectiveEndMonth = effectiveEndDate?.slice(0, 7);
    const periods = await database.query(
      `SELECT id, effective_start_month, effective_end_month,
        effective_start_date, effective_end_date
       FROM compensation_periods WHERE staff_profile_id = ? LIMIT 101`,
      [input.staffProfileId],
    );
    if ((periods.values?.length ?? 0) > 100) {
      throw new Error('Compensation history exceeds the saved limit.');
    }
    const priorDay = shiftBusinessDate(effectiveStartDate, -1);
    for (const period of periods.values ?? []) {
      const periodStart = String(
        period.effective_start_date ?? `${period.effective_start_month}-01`,
      );
      const periodEnd = String(
        period.effective_end_date ?? (period.effective_end_month
          ? `${period.effective_end_month}-31`
          : '9999-12-31'),
      );
      if (periodStart >= effectiveStartDate && periodStart <= (effectiveEndDate ?? '9999-12-31')) {
        throw new Error('Compensation periods cannot overlap.');
      }
      if (periodStart < effectiveStartDate && periodEnd >= effectiveStartDate) {
        await database.run(
          `UPDATE compensation_periods
           SET effective_end_month = ?, effective_end_date = ?, revision = revision + 1
           WHERE id = ?`,
          [priorDay.slice(0, 7), priorDay, String(period.id)],
          false,
        );
      }
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
         effective_end_month, effective_start_date, effective_end_date,
         revision, created_at, updated_by,
         client_mutation_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
      [periodId, input.staffProfileId, String(profile.name), String(profile.role),
        monthlyAmountCentimes,
        effectiveStartMonth, effectiveEndMonth ?? null,
        effectiveStartDate, effectiveEndDate ?? null, now,
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
        effectiveStartMonth, ...(effectiveEndMonth ? { effectiveEndMonth } : {}),
        effectiveStartDate, ...(effectiveEndDate ? { effectiveEndDate } : {}) },
      createdAt: now,
    });
    return { id: periodId, revision: 1, operationId: operation.operationId };
  });
}

export function deleteLocalCompensationPeriod(
  context: Context,
  period: { id: string; revision: number },
  transact: Transaction = withLocalTransaction,
) {
  return transact(async (database) => {
    const existing = (await database.query(
      `SELECT id, revision, effective_end_month, effective_end_date
       FROM compensation_periods WHERE id = ? LIMIT 1`,
      [period.id],
    )).values?.[0];
    if (!existing || Number(existing.revision) !== period.revision) {
      throw new Error('Monthly pay changed. Refresh it before deleting.');
    }
    const now = Date.now();
    const effectiveEndDate = shiftBusinessDate(localBusinessDate(), -1);
    const savedEndDate = existing.effective_end_date
      ? String(existing.effective_end_date)
      : existing.effective_end_month
        ? `${String(existing.effective_end_month)}-31`
        : undefined;
    if (savedEndDate && savedEndDate <= effectiveEndDate) {
      return { id: period.id };
    }
    await database.run(
      `UPDATE compensation_periods
       SET effective_end_month = ?, effective_end_date = ?, revision = revision + 1
       WHERE id = ?`,
      [effectiveEndDate.slice(0, 7), effectiveEndDate, period.id],
      false,
    );
    const operation = await enqueueManagementOperation(database, {
      deviceId: context.deviceId,
      operationType: 'management.compensation.delete',
      localRecordId: period.id,
      dependsOnOperationId: await latestPendingManagementOperationIdFromDatabase(
        database,
        COMPENSATION_MANAGEMENT_OPERATION_TYPES,
      ),
      requiredPermission: 'compensation',
      actor: context.actor,
      expectedRevision: period.revision,
      payload: { periodId: period.id, effectiveEndDate },
      createdAt: now,
    });
    return { id: period.id, operationId: operation.operationId };
  });
}
