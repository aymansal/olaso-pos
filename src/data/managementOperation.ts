import { CONNECTION_SYNC_FAILURE } from './outbox.ts';
import {
  hasPermission,
  isStaffRole,
  type Permission,
  type StaffRole,
} from './permissions.ts';

export type ManagementPermission = Extract<
  Permission,
  'products' | 'stock' | 'expenses' | 'compensation' | 'staff'
>;

export type LocalManagementActor = {
  staffProfileId: string;
  name: string;
  role: StaffRole;
};

export type LocalManagementOperation = {
  operationId: string;
  deviceId: string;
  operationType: string;
  localRecordId: string;
  dependsOnOperationId?: string;
  requiredPermission: ManagementPermission;
  actor: LocalManagementActor;
  expectedRevision?: number;
  payload: Record<string, unknown>;
  cloudRecordId?: string;
  createdAt: number;
  acknowledgedAt?: number;
};

export type PendingLocalManagementOperation = LocalManagementOperation & {
  attemptCount: number;
  lastError?: string;
  availableAt: number;
};

export const CATALOG_MANAGEMENT_OPERATION_TYPES = [
  'management.category.save',
  'management.category.archive',
  'management.category.delete',
  'management.product.save',
  'management.product.status',
  'management.product.delete',
  'management.modifier.save',
  'management.modifier.archive',
  'management.recipe.save',
] as const;

export const INVENTORY_MANAGEMENT_OPERATION_TYPES = [
  'management.ingredient.save',
  'management.ingredient.archive',
  'management.ingredient.delete',
  'management.inventory.purchase',
  'management.inventory.adjust',
] as const;

export const OPERATIONAL_MANAGEMENT_OPERATION_TYPES = [
  ...CATALOG_MANAGEMENT_OPERATION_TYPES,
  ...INVENTORY_MANAGEMENT_OPERATION_TYPES,
] as const;

export const EXPENSE_MANAGEMENT_OPERATION_TYPES = [
  'management.expense.add',
  'management.expense.correct',
] as const;

export const COMPENSATION_MANAGEMENT_OPERATION_TYPES = [
  'management.compensation.add',
] as const;

export const FINANCE_MANAGEMENT_OPERATION_TYPES = [
  ...EXPENSE_MANAGEMENT_OPERATION_TYPES,
  ...COMPENSATION_MANAGEMENT_OPERATION_TYPES,
] as const;

export const STAFF_MANAGEMENT_OPERATION_TYPES = [
  'management.staff.create',
  'management.staff.delete',
] as const;

const permissions = new Set<ManagementPermission>([
  'products',
  'stock',
  'expenses',
  'compensation',
  'staff',
]);

export function managementIdentifier(value: string, label: string) {
  const cleaned = value.trim();
  if (!/^[A-Za-z0-9._:-]{1,128}$/.test(cleaned)) {
    throw new Error(`${label} is invalid.`);
  }
  return cleaned;
}

export function managementOperationType(value: string) {
  const cleaned = value.trim();
  if (!/^management\.[a-z][a-z0-9.-]{1,52}$/.test(cleaned)) {
    throw new Error('Management operation type is invalid.');
  }
  return cleaned;
}

export function managementPermission(value: ManagementPermission) {
  if (!permissions.has(value)) {
    throw new Error('Management permission is invalid.');
  }
  return value;
}

export function managementPayloadJson(value: Record<string, unknown>) {
  if (!value || Array.isArray(value)) {
    throw new Error('Management payload must be an object.');
  }
  const inspect = (candidate: unknown, depth: number) => {
    if (depth > 12) throw new Error('Management payload is too deeply nested.');
    if (!candidate || typeof candidate !== 'object') return;
    for (const [key, child] of Object.entries(candidate)) {
      const normalizedKey = key.replace(/[^a-z0-9]/gi, '').toLowerCase();
      if (/(?:pin(?:code|hash|salt|value)?|password|token|secret|recoverycode|verifier)$/.test(normalizedKey)) {
        throw new Error('Protected credentials cannot enter management payloads.');
      }
      inspect(child, depth + 1);
    }
  };
  inspect(value, 0);
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new Error('Management payload is invalid.');
  }
  if (serialized.length < 2 || serialized.length > 65_536) {
    throw new Error('Management payload is too large.');
  }
  return serialized;
}

export function managementTime(value: number, label: string) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
}

export function managementExpectedRevision(value: number | undefined) {
  if (value !== undefined && (!Number.isSafeInteger(value) || value < 1)) {
    throw new Error('Expected revision is invalid.');
  }
  return value;
}

export function managementActor(
  value: LocalManagementActor,
  required: ManagementPermission,
) {
  const name = value.name.trim();
  if (!isStaffRole(value.role) || !name || name.length > 120) {
    throw new Error('Management actor is invalid.');
  }
  if (!hasPermission(value.role, required)) {
    throw new Error('This staff profile cannot make this change.');
  }
  return {
    staffProfileId: managementIdentifier(value.staffProfileId, 'Staff profile ID'),
    name,
    role: value.role,
  };
}

function parsePayload(value: unknown) {
  try {
    const parsed: unknown = JSON.parse(String(value));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error();
    }
    return parsed as Record<string, unknown>;
  } catch {
    throw new Error('Saved management payload is invalid.');
  }
}

export function managementOperationFromRow(
  row: Record<string, unknown>,
): LocalManagementOperation {
  const required = managementPermission(
    String(row.required_permission) as ManagementPermission,
  );
  const role = String(row.actor_role);
  if (!isStaffRole(role)) throw new Error('Saved management actor is invalid.');
  const savedActor = managementActor({
    staffProfileId: String(row.actor_profile_id),
    name: String(row.actor_name),
    role,
  }, required);
  return {
    operationId: managementIdentifier(String(row.operation_id), 'Operation ID'),
    deviceId: managementIdentifier(String(row.device_id), 'Device ID'),
    operationType: managementOperationType(String(row.operation_type)),
    localRecordId: managementIdentifier(String(row.local_record_id), 'Local record ID'),
    ...(row.depends_on_operation_id
      ? {
          dependsOnOperationId: managementIdentifier(
            String(row.depends_on_operation_id),
            'Dependency operation ID',
          ),
        }
      : {}),
    requiredPermission: required,
    actor: savedActor,
    ...(row.expected_revision === null || row.expected_revision === undefined
      ? {}
      : {
          expectedRevision: managementExpectedRevision(
            Number(row.expected_revision),
          ),
        }),
    payload: parsePayload(row.payload_json),
    ...(row.cloud_record_id
      ? {
          cloudRecordId: managementIdentifier(
            String(row.cloud_record_id),
            'Cloud record ID',
          ),
        }
      : {}),
    createdAt: managementTime(Number(row.created_at), 'Creation time'),
    ...(row.acknowledged_at === null || row.acknowledged_at === undefined
      ? {}
      : {
          acknowledgedAt: managementTime(
            Number(row.acknowledged_at),
            'Acknowledgement time',
          ),
        }),
  };
}

export function describeManagementSyncFailure(caught: unknown) {
  const message = caught instanceof Error ? caught.message : '';
  if (/revision|changed by another|stale/i.test(message)) {
    return 'This saved change conflicts with a newer record. Review it before retrying.';
  }
  if (/unauthenticated|sign-in is required|session/i.test(message)) {
    return 'Synchronization access is unavailable. Restore terminal access and try again.';
  }
  if (/network|failed to fetch|offline/i.test(message)) {
    return CONNECTION_SYNC_FAILURE;
  }
  return 'Management synchronization failed.';
}
