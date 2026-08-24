import {
  acknowledgeManagementOperation,
  listPendingManagementOperations,
  recordManagementOperationFailure,
} from './localManagement.ts';
import { describeManagementSyncFailure } from './managementOperation.ts';

export const CATALOG_OPERATION_TYPES = [
  'management.category.save',
  'management.category.archive',
  'management.product.save',
  'management.product.status',
  'management.modifier.save',
  'management.modifier.archive',
  'management.recipe.save',
] as const;

export type CatalogOperationType = (typeof CATALOG_OPERATION_TYPES)[number];

export async function syncPendingCatalogOperations(
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
    CATALOG_OPERATION_TYPES,
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
