import { PrismaClient, UserRole, PermitStatus, TaskStatus, DocumentCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_SEED_PASSWORD || 'admin123',
    SALT_ROUNDS
  );
  const coordPassword = await bcrypt.hash(
    process.env.COORD_SEED_PASSWORD || 'coord123',
    SALT_ROUNDS
  );
  const billingPassword = await bcrypt.hash(
    process.env.BILLING_SEED_PASSWORD || 'billing123',
    SALT_ROUNDS
  );

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      passwordHash: adminPassword,
    },
  });

  const coordinator = await prisma.user.upsert({
    where: { email: 'coord@example.com' },
    update: {},
    create: {
      email: 'coord@example.com',
      name: 'Coordinator User',
      role: UserRole.COORDINATOR,
      passwordHash: coordPassword,
    },
  });

  const billing = await prisma.user.upsert({
    where: { email: 'billing@example.com' },
    update: {},
    create: {
      email: 'billing@example.com',
      name: 'Billing User',
      role: UserRole.BILLING,
      passwordHash: billingPassword,
    },
  });

  console.log('Created users:', { admin, coordinator, billing });

  const contractor = await prisma.contractor.create({
    data: {
      name: 'ABC Construction LLC',
      email: 'contact@abcconstruction.com',
      phone: '555-1234',
      licenseNo: 'LIC-2024-001',
    },
  });

  console.log('Created contractor:', contractor);

  const job = await prisma.job.create({
    data: {
      jobNumber: 'JOB-2024-001',
      customerName: 'John Smith',
      address: '123 Main St, Springfield',
      contractorId: contractor.id,
    },
  });

  console.log('Created job:', job);

  const permit = await prisma.permit.create({
    data: {
      permitNo: 'PERMIT-2024-001',
      type: 'Building Permit',
      description: 'Residential addition',
      status: PermitStatus.PENDING,
      jobId: job.id,
    },
  });

  console.log('Created permit:', permit);

  const task1 = await prisma.task.create({
    data: {
      title: 'Submit application documents',
      description: 'Gather and submit all required application forms',
      status: TaskStatus.COMPLETED,
      permitId: permit.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Schedule inspection',
      description: 'Contact inspector for initial site review',
      status: TaskStatus.TODO,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      permitId: permit.id,
    },
  });

  console.log('Created tasks:', { task1, task2 });

  const event = await prisma.activityEvent.create({
    data: {
      action: 'PERMIT_CREATED',
      entityType: 'Permit',
      entityId: permit.id,
      userId: coordinator.id,
      metadata: { permitNo: permit.permitNo, type: permit.type },
    },
  });

  console.log('Created activity event:', event);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
