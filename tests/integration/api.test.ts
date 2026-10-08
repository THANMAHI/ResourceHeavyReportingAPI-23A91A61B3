import request from 'supertest';
import { createServer } from '../../src/api/server';
import { reportRepository } from '../../src/repository/ReportRepository';

const app = createServer();

describe('API Core Requirements Integration Tests', () => {
  beforeEach(() => {
    reportRepository.resetAll();
  });

  test('Health Check: GET /health returns 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  test('Requirement 1: GET /api/metrics initially returns total_instantiations = 0', async () => {
    const response = await request(app).get('/api/metrics');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ total_instantiations: 0 });
  });

  test('Requirement 2: GET /api/reports lists 3 seeded reports and does NOT instantiate heavy objects', async () => {
    const response = await request(app).get('/api/reports');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 'report-1', title: 'Financial Q1', required_role: 'admin' },
      { id: 'report-2', title: 'User Analytics', required_role: 'manager' },
      { id: 'report-3', title: 'System Status', required_role: 'guest' },
    ]);

    const metricsResponse = await request(app).get('/api/metrics');
    expect(metricsResponse.status).toBe(200);
    expect(metricsResponse.body).toEqual({ total_instantiations: 0 });
  });

  test('Requirement 3: GET /api/reports/report-3/generate?role=guest instantiates HeavyReportGenerator for first time', async () => {
    const genResponse = await request(app).get('/api/reports/report-3/generate?role=guest');
    expect(genResponse.status).toBe(200);
    expect(genResponse.body).toEqual({
      id: 'report-3',
      content: 'Report content for System Status',
    });

    const metricsResponse = await request(app).get('/api/metrics');
    expect(metricsResponse.status).toBe(200);
    expect(metricsResponse.body).toEqual({ total_instantiations: 1 });
  });

  test('Requirement 4: Virtual Proxy caches real subject on subsequent calls', async () => {
    await request(app).get('/api/reports/report-3/generate?role=guest');
    
    // Call 3 more times
    await request(app).get('/api/reports/report-3/generate?role=guest');
    await request(app).get('/api/reports/report-3/generate?role=guest');
    const res = await request(app).get('/api/reports/report-3/generate?role=guest');
    
    expect(res.status).toBe(200);

    const metricsResponse = await request(app).get('/api/metrics');
    expect(metricsResponse.status).toBe(200);
    expect(metricsResponse.body).toEqual({ total_instantiations: 1 });
  });

  test('Requirement 5: Protection Proxy rejects unauthorized requests with 403 Forbidden without instantiating heavy object', async () => {
    // Generate report-3 first to have 1 instantiation
    await request(app).get('/api/reports/report-3/generate?role=guest');

    // Attempt unauthorized access to report-1 (requires admin) with guest role
    const response = await request(app).get('/api/reports/report-1/generate?role=guest');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Access Denied' });

    // Ensure total_instantiations remains 1
    const metricsResponse = await request(app).get('/api/metrics');
    expect(metricsResponse.status).toBe(200);
    expect(metricsResponse.body).toEqual({ total_instantiations: 1 });
  });

  test('Requirement 6: Protection Proxy delegates authorized request for report-1', async () => {
    // Generate report-3 first (1 instantiation)
    await request(app).get('/api/reports/report-3/generate?role=guest');

    // Authorized request for report-1 with admin role
    const response = await request(app).get('/api/reports/report-1/generate?role=admin');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'report-1',
      content: 'Report content for Financial Q1',
    });

    // Count should increase to 2
    const metricsResponse = await request(app).get('/api/metrics');
    expect(metricsResponse.status).toBe(200);
    expect(metricsResponse.body).toEqual({ total_instantiations: 2 });
  });

  test('Requirement 7: POST /api/metrics/reset resets metrics counter to 0', async () => {
    await request(app).get('/api/reports/report-3/generate?role=guest');
    let metricsResponse = await request(app).get('/api/metrics');
    expect(metricsResponse.body.total_instantiations).toBe(1);

    const resetResponse = await request(app).post('/api/metrics/reset');
    expect(resetResponse.status).toBe(200);
    expect(resetResponse.body).toEqual({ message: 'Metrics reset successfully' });

    metricsResponse = await request(app).get('/api/metrics');
    expect(metricsResponse.status).toBe(200);
    expect(metricsResponse.body).toEqual({ total_instantiations: 0 });
  });

  test('Requirement 10: GET /api/reports/non-existent-report/generate returns 404 Not Found', async () => {
    const response = await request(app).get('/api/reports/non-existent-report/generate?role=admin');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Report not found' });
  });
});
