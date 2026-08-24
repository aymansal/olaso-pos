import type { PendingLocalManagementOperation } from './managementOperation.ts';
import { FINANCE_MANAGEMENT_OPERATION_TYPES } from './managementOperation.ts';
import { syncPendingManagementOperations } from './catalogSync.ts';

type Result = {
  recordType: string;
  cloudRecordId: string;
  relatedMappings?: Array<{
    recordType: string;
    localRecordId: string;
    cloudRecordId: string;
  }>;
  acknowledgedAt: number;
};

type Services = {
  sessionArgs: { sessionToken: string; deviceId: string };
  resolve: (recordType: string, localRecordId: string) => Promise<string>;
  addExpense: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  correctExpense: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  addCompensation: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

function expensePayload(payload: Record<string, unknown>) {
  return {
    category: String(payload.category),
    description: String(payload.description),
    amountCentimes: Number(payload.amountCentimes),
    recurrence: payload.recurrence,
    ...(payload.effectiveDate ? { effectiveDate: String(payload.effectiveDate) } : {}),
    ...(payload.effectiveStartMonth
      ? { effectiveStartMonth: String(payload.effectiveStartMonth) }
      : {}),
    ...(payload.effectiveEndMonth
      ? { effectiveEndMonth: String(payload.effectiveEndMonth) }
      : {}),
  };
}

export async function dispatchCostOperation(
  operation: PendingLocalManagementOperation,
  services: Services,
): Promise<Result> {
  const payload = operation.payload;
  const acknowledgedAt = Date.now();
  if (operation.operationType === 'management.expense.add') {
    const result = await services.addExpense({
      ...services.sessionArgs,
      ...expensePayload(payload),
      clientMutationId: operation.operationId,
    });
    return {
      recordType: 'expense',
      cloudRecordId: String(result.id),
      acknowledgedAt,
    };
  }
  if (operation.operationType === 'management.expense.correct') {
    const result = await services.correctExpense({
      ...services.sessionArgs,
      expenseId: await services.resolve('expense', String(payload.expenseId)),
      expectedRevision: operation.expectedRevision,
      ...expensePayload(payload),
      clientMutationId: operation.operationId,
    });
    return {
      recordType: 'expense',
      cloudRecordId: String(result.replacementId),
      relatedMappings: [{
        recordType: 'expense',
        localRecordId: String(payload.localReversalId),
        cloudRecordId: String(result.reversalId),
      }],
      acknowledgedAt,
    };
  }
  if (operation.operationType === 'management.compensation.add') {
    const result = await services.addCompensation({
      ...services.sessionArgs,
      staffProfileId: await services.resolve(
        'staff-profile',
        String(payload.staffProfileId),
      ),
      monthlyAmountCentimes: Number(payload.monthlyAmountCentimes),
      effectiveStartMonth: String(payload.effectiveStartMonth),
      ...(payload.effectiveEndMonth
        ? { effectiveEndMonth: String(payload.effectiveEndMonth) }
        : {}),
      clientMutationId: operation.operationId,
    });
    return {
      recordType: 'compensation-period',
      cloudRecordId: String(result.id),
      acknowledgedAt,
    };
  }
  throw new Error('Cost synchronization operation is unsupported.');
}

export function syncPendingCostOperations(
  send: (operation: PendingLocalManagementOperation) => Promise<Result>,
) {
  return syncPendingManagementOperations(
    FINANCE_MANAGEMENT_OPERATION_TYPES,
    send,
  );
}
