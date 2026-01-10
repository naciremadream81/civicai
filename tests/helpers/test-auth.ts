import { signToken } from '@/lib/auth/jwt';

export interface TestUser {
  id: string;
  email: string;
  role: string;
}

export function createTestAuthToken(user: TestUser): string {
  return signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
}

export function createTestAuthCookie(user: TestUser): string {
  const token = createTestAuthToken(user);
  return `auth-token=${token}`;
}
