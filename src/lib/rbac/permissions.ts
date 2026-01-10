import { UserRole } from '@prisma/client';

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: ['*'],
  [UserRole.COORDINATOR]: [
    'permits:read',
    'permits:write',
    'jobs:read',
    'jobs:write',
    'documents:read',
    'documents:write',
    'tasks:read',
    'tasks:write',
  ],
  [UserRole.BILLING]: [
    'permits:read',
    'jobs:read',
    'documents:read',
    'invoices:read',
    'invoices:write',
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes('*') || permissions.includes(permission);
}

export function requirePermission(role: UserRole, permission: string): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Access denied: ${permission} required`);
  }
}
