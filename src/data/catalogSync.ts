import {
  acknowledgeManagementOperation,
  listPendingManagementOperations,
  recordManagementOperationFailure,
} from './localManagement.ts';
import { describeManagementSyncFailure } from './managementOperation.ts';
import { CATALOG_MANAGEMENT_OPERATION_TYPES } from './managementOperation.ts';

export async function syncPendingManagementOperations(
  operationTypes: readonly string[],
  send: (operation: Awaited<ReturnType<typeof listPendingManagementOperations>>[number]) => Promise<{
    recordType: string;
    cloudRecordId: string;
    relatedMappings?: Array<{
      recordType: string;
      localRecordId: string;
      cloudRecordId: string;
    }>;
    acknowledgedAt: number;
  }>,
) {
  const operations = await listPendingManagementOperations(
    operationTypes,
    Date.now(),
    10,
  );
  let synced = 0;
  let failed = 0;
  for (const operation of operations) {
    try {
      const result = await send(operation);
      await acknowledgeManagementOperation({
        operationId: operation.operationId,
        recordType: result.recordType,
        cloudRecordId: result.cloudRecordId,
        relatedMappings: result.relatedMappings,
        acknowledgedAt: result.acknowledgedAt,
      });
      synced += 1;
    } catch (error) {
      await recordManagementOperationFailure({
        operationId: operation.operationId,
        attemptCount: operation.attemptCount,
        error: describeManagementSyncFailure(error),
      });
      failed += 1;
    }
  }
  return { synced, failed, processed: operations.length };
}

export function syncPendingCatalogOperations(
  send: Parameters<typeof syncPendingManagementOperations>[1],
) {
  return syncPendingManagementOperations(
    CATALOG_MANAGEMENT_OPERATION_TYPES,
    send,
  );
}
