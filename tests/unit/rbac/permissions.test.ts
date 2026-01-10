import { hasPermission, requirePermission, ROLE_PERMISSIONS } from '@/lib/rbac/permissions';
import { UserRole } from '@prisma/client';

describe('RBAC Permissions', () => {
  describe('hasPermission', () => {
    it('should grant all permissions to ADMIN', () => {
      expect(hasPermission(UserRole.ADMIN, 'any:permission')).toBe(true);
      expect(hasPermission(UserRole.ADMIN, 'permits:read')).toBe(true);
    });

    it('should check specific permissions for COORDINATOR', () => {
      expect(hasPermission(UserRole.COORDINATOR, 'permits:read')).toBe(true);
      expect(hasPermission(UserRole.COORDINATOR, 'permits:write')).toBe(true);
      expect(hasPermission(UserRole.COORDINATOR, 'invoices:write')).toBe(false);
    });

    it('should check specific permissions for BILLING', () => {
      expect(hasPermission(UserRole.BILLING, 'permits:read')).toBe(true);
      expect(hasPermission(UserRole.BILLING, 'invoices:write')).toBe(true);
      expect(hasPermission(UserRole.BILLING, 'permits:write')).toBe(false);
    });
  });

  describe('requirePermission', () => {
    it('should not throw for authorized permissions', () => {
      expect(() => requirePermission(UserRole.ADMIN, 'any:permission')).not.toThrow();
      expect(() => requirePermission(UserRole.COORDINATOR, 'permits:read')).not.toThrow();
    });

    it('should throw for unauthorized permissions', () => {
      expect(() => requirePermission(UserRole.BILLING, 'permits:write')).toThrow('Access denied');
      expect(() => requirePermission(UserRole.COORDINATOR, 'invoices:write')).toThrow('Access denied');
    });
  });
});
