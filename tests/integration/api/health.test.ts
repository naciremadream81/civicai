import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  it('should return healthy status when database is connected', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.services.database).toBe('ok');
    expect(data.timestamp).toBeDefined();
  });
});
