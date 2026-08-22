export const roles = ['owner', 'manager', 'cashier'] as const;

export type StaffRole = (typeof roles)[number];
export type Permission =
  | 'pos'
  | 'orders'
  | 'dashboard'
  | 'products'
  | 'stock'
  | 'expenses'
  | 'reports'
  | 'settings'
  | 'staff'
  | 'identityRecovery'
  | 'profitability'
  | 'compensation';

const matrix: Record<StaffRole, readonly Permission[]> = {
  cashier: ['pos', 'orders'],
  manager: ['pos', 'orders', 'dashboard', 'products', 'stock', 'expenses', 'reports'],
  owner: [
    'pos', 'orders', 'dashboard', 'products', 'stock', 'expenses', 'reports',
    'settings', 'staff', 'identityRecovery', 'profitability', 'compensation',
  ],
};

export function isStaffRole(value: string): value is StaffRole {
  return roles.includes(value as StaffRole);
}

export function hasPermission(role: StaffRole, permission: Permission) {
  return matrix[role].includes(permission);
}
