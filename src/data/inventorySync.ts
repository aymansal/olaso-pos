import type { PendingLocalManagementOperation } from './managementOperation.ts';
import { INVENTORY_MANAGEMENT_OPERATION_TYPES } from './managementOperation.ts';
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
  saveIngredient: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  archiveIngredient: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  receivePurchase: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  recordAdjustment: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

export async function dispatchInventoryOperation(
  operation: PendingLocalManagementOperation,
  services: Services,
): Promise<Result> {
  const payload = operation.payload;
  const acknowledgedAt = Date.now();
  if (operation.operationType === 'management.ingredient.save') {
    const result = await services.saveIngredient({
      ...services.sessionArgs,
      ...(operation.expectedRevision === undefined
        ? {
            key: String(payload.key),
            openingQuantity: Number(payload.openingQuantity ?? 0),
          }
        : {
            id: await services.resolve('ingredient', operation.localRecordId),
            expectedRevision: operation.expectedRevision,
          }),
      name: String(payload.name),
      baseUnit: payload.baseUnit,
      lowStockThreshold: Number(payload.lowStockThreshold),
      businessDate: String(payload.businessDate),
      clientMutationId: operation.operationId,
    });
    return {
      recordType: 'ingredient',
      cloudRecordId: String(result.id),
      acknowledgedAt,
    };
  }
  if (operation.operationType === 'management.ingredient.archive') {
    const result = await services.archiveIngredient({
      ...services.sessionArgs,
      id: await services.resolve('ingredient', operation.localRecordId),
      archived: Boolean(payload.archived),
      expectedRevision: operation.expectedRevision,
      clientMutationId: operation.operationId,
    });
    return {
      recordType: 'ingredient',
      cloudRecordId: String(result.id),
      acknowledgedAt,
    };
  }
  if (operation.operationType === 'management.inventory.purchase') {
    const result = await services.receivePurchase({
      ...services.sessionArgs,
      ingredientId: await services.resolve('ingredient', String(payload.ingredientId)),
      packageLabel: String(payload.packageLabel),
      packageCount: Number(payload.packageCount),
      quantityPerPackage: Number(payload.quantityPerPackage),
      packagePriceCentimes: Number(payload.packagePriceCentimes),
      receivedAt: Number(payload.receivedAt),
      businessDate: String(payload.businessDate),
      ...(payload.supplierLabel ? { supplierLabel: String(payload.supplierLabel) } : {}),
      ...(payload.note ? { note: String(payload.note) } : {}),
      expectedRevision: operation.expectedRevision,
      clientMutationId: operation.operationId,
    });
    return {
      recordType: 'inventory-purchase',
      cloudRecordId: String(result.purchaseId),
      relatedMappings: [{
        recordType: 'stock-movement',
        localRecordId: String(payload.localMovementId),
        cloudRecordId: String(result.stockMovementId),
      }],
      acknowledgedAt,
    };
  }
  if (operation.operationType === 'management.inventory.adjust') {
    const result = await services.recordAdjustment({
      ...services.sessionArgs,
      ingredientId: await services.resolve('ingredient', String(payload.ingredientId)),
      mode: payload.mode,
      quantity: Number(payload.quantity),
      reason: String(payload.reason),
      expectedRevision: operation.expectedRevision,
      businessDate: String(payload.businessDate),
      clientMutationId: operation.operationId,
    });
    return {
      recordType: 'stock-movement',
      cloudRecordId: String(result.movementId),
      acknowledgedAt,
    };
  }
  throw new Error('Inventory synchronization operation is unsupported.');
}

export function syncPendingInventoryOperations(
  send: (operation: PendingLocalManagementOperation) => Promise<Result>,
) {
  return syncPendingManagementOperations(
    INVENTORY_MANAGEMENT_OPERATION_TYPES,
    send,
  );
}
