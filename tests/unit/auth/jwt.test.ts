import { signToken, verifyToken } from '@/lib/auth/jwt';

describe('JWT Utilities', () => {
  const testPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    role: 'ADMIN',
  };

  describe('signToken', () => {
    it('should create a valid JWT token', () => {
      const token = signToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = signToken(testPayload);
      const decoded = verifyToken(token);
      
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(testPayload.userId);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.role).toBe(testPayload.role);
    });

    it('should reject invalid token', () => {
      const decoded = verifyToken('invalid.token.here');
      expect(decoded).toBeNull();
    });

    it('should reject tampered token', () => {
      const token = signToken(testPayload);
      const tampered = token.slice(0, -5) + 'xxxxx';
      const decoded = verifyToken(tampered);
      expect(decoded).toBeNull();
    });
  });
});
