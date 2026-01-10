import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import { testPrisma, setupTestDatabase, teardownTestDatabase } from '@tests/helpers/test-db';
import { createTestUser, testUsers } from '@tests/fixtures/users';

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await setupTestDatabase();
    await createTestUser(testUsers.admin);
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  it('should login with valid credentials', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.admin.email,
        password: testUsers.admin.password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(testUsers.admin.email);
    expect(response.cookies.get('auth-token')).toBeDefined();
  });

  it('should reject invalid email', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@test.com',
        password: 'password123',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('should reject invalid password', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.admin.email,
        password: 'wrongpassword',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('should validate input schema', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'not-an-email',
        password: '',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
