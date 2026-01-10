import { PrismaClient } from '@prisma/client';

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

export async function cleanupDatabase() {
  // Delete in order to respect foreign key constraints
  await testPrisma.activityEvent.deleteMany();
  await testPrisma.note.deleteMany();
  await testPrisma.document.deleteMany();
  await testPrisma.task.deleteMany();
  await testPrisma.permit.deleteMany();
  await testPrisma.job.deleteMany();
  await testPrisma.contractor.deleteMany();
  await testPrisma.user.deleteMany();
}

export async function setupTestDatabase() {
  await cleanupDatabase();
}

export async function teardownTestDatabase() {
  await cleanupDatabase();
  await testPrisma.$disconnect();
}
