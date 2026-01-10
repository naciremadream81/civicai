import { PermitStatus } from '@prisma/client';
import { testPrisma } from '../helpers/test-db';

export const testPermits = {
  permit1: {
    permitNo: 'TEST-PERMIT-001',
    type: 'Building Permit',
    description: 'Test permit description',
    status: PermitStatus.PENDING,
  },
};

export async function createTestPermit(jobId: string, data = testPermits.permit1) {
  return testPrisma.permit.create({
    data: {
      ...data,
      jobId,
    },
  });
}
