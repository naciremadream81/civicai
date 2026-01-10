import { testPrisma } from '../helpers/test-db';

export const testContractors = {
  contractor1: {
    name: 'Test Construction LLC',
    email: 'test@construction.com',
    phone: '555-0001',
    licenseNo: 'TEST-LIC-001',
  },
};

export async function createTestContractor(data = testContractors.contractor1) {
  return testPrisma.contractor.create({ data });
}
