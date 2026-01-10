import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { testPrisma } from '../helpers/test-db';

export const testUsers = {
  admin: {
    email: 'admin@test.com',
    name: 'Test Admin',
    role: UserRole.ADMIN,
    password: 'admin123',
  },
  coordinator: {
    email: 'coord@test.com',
    name: 'Test Coordinator',
    role: UserRole.COORDINATOR,
    password: 'coord123',
  },
  billing: {
    email: 'billing@test.com',
    name: 'Test Billing',
    role: UserRole.BILLING,
    password: 'billing123',
  },
};

export async function createTestUser(userData: typeof testUsers.admin) {
  const { testPrisma } = await import('../helpers/test-db');
  const passwordHash = await bcrypt.hash(userData.password, 12);
  
  return testPrisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      passwordHash,
    },
  });
}
