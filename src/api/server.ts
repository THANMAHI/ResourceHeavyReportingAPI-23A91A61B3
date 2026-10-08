import express, { Express } from 'express';
import { getReports, generateReport } from './controllers/reportController';
import { getMetrics, resetMetrics } from './controllers/metricsController';

export const createServer = (): Express => {
  const app = express();

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  // API Routes
  app.get('/api/reports', getReports);
  app.get('/api/reports/:id/generate', generateReport);
  app.get('/api/metrics', getMetrics);
  app.post('/api/metrics/reset', resetMetrics);

  return app;
};
