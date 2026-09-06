import {
  loadPendingStaffCredential,
  clearStaffSession,
  saveProvisionedStaffSession,
} from './identitySession.ts';
import type { PendingLocalManagementOperation } from './managementOperation.ts';
import { STAFF_MANAGEMENT_OPERATION_TYPES } from './managementOperation.ts';
import { isStaffRole } from './permissions.ts';
import { saveAuthenticatedStaffProfile } from './operationalCache.ts';
import { withLocalTransaction } from './localDatabase.ts';
import { syncPendingManagementOperations } from './catalogSync.ts';
import { loadStaffPreferredLanguage } from './localStaff.ts';
import { withStaffCredentialLock } from './staffCredentialQueue.ts';

type Result = {
  recordType: string;
  cloudRecordId: string;
  acknowledgedAt: number;
};

type Services = {
  sessionArgs: { sessionToken: string; deviceId: string };
  createStaff: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  deleteStaff: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  resolve: (recordType: string, localRecordId: string) => Promise<string>;
};

export async function dispatchStaffOperation(
  operation: PendingLocalManagementOperation,
  services: Services,
): Promise<Result> {
  if (operation.operationType === 'management.staff.delete') {
    const cloudId = await services.resolve('staff-profile', operation.localRecordId);
    const removed = await services.deleteStaff({
      ...services.sessionArgs,
      id: cloudId,
      expectedRevision: operation.expectedRevision,
      clientMutationId: operation.operationId,
      ...(typeof operation.payload.compensationEndMonth === 'string'
        ? { compensationEndMonth: operation.payload.compensationEndMonth }
        : {}),
      ...(typeof operation.payload.compensationEndDate === 'string'
        ? { compensationEndDate: operation.payload.compensationEndDate }
        : {}),
    });
    await withLocalTransaction(async (database) => {
      await database.run(
        'DELETE FROM staff_profiles WHERE id = ? OR id = ?',
        [operation.localRecordId, cloudId],
        false,
      );
    });
    await clearStaffSession(operation.localRecordId);
    if (cloudId !== operation.localRecordId) await clearStaffSession(cloudId);
    return {
      recordType: 'staff-profile',
      cloudRecordId: String(removed.id),
      acknowledgedAt: Date.now(),
    };
  }
  if (operation.operationType !== 'management.staff.create') {
    throw new Error('Staff synchronization operation is unsupported.');
  }
  const credential = await loadPendingStaffCredential(operation.localRecordId);
  const preferredLanguage = await loadStaffPreferredLanguage(
    operation.localRecordId,
  );
  const created = await services.createStaff({
    ...services.sessionArgs,
    name: String(operation.payload.name),
    role: operation.payload.role,
    preferredLanguage,
    ...credential,
    clientMutationId: operation.operationId,
  });
  const role = String(created.role);
  if (!created.id || !created.name || !isStaffRole(role)) {
    throw new Error('Staff synchronization acknowledgement is invalid.');
  }
  if (typeof created.token !== 'string' || created.token.length < 40) {
    throw new Error('New staff tablet access could not be provisioned.');
  }
  const profile = {
    id: String(created.id),
    name: String(created.name),
    role,
    revision: Number(created.revision),
    identityRevision: Number(created.identityRevision),
  };
  if (!Number.isSafeInteger(profile.revision) || profile.revision < 1
      || !Number.isSafeInteger(profile.identityRevision)
      || profile.identityRevision < 1) {
    throw new Error('Staff synchronization revision is invalid.');
  }
  await saveAuthenticatedStaffProfile({
    ...profile,
    preferredLanguage,
  });
  await saveProvisionedStaffSession(operation.localRecordId, {
    token: created.token,
    staffProfileId: profile.id,
    name: profile.name,
    role: profile.role,
    identityRevision: profile.identityRevision,
  });
  return {
    recordType: 'staff-profile',
    cloudRecordId: profile.id,
    acknowledgedAt: Date.now(),
  };
}

export function syncPendingStaffOperations(
  send: (operation: PendingLocalManagementOperation) => Promise<Result>,
) {
  return withStaffCredentialLock(() => syncPendingManagementOperations(
    STAFF_MANAGEMENT_OPERATION_TYPES,
    send,
  ));
}
