import { Request, Response } from 'express';
import { MetricsTracker } from '../../core/MetricsTracker';
import { reportRepository } from '../../repository/ReportRepository';

export const getMetrics = (req: Request, res: Response): void => {
  res.status(200).json({
    total_instantiations: MetricsTracker.getCount(),
  });
};

export const resetMetrics = (req: Request, res: Response): void => {
  reportRepository.resetAll();
  res.status(200).json({
    message: 'Metrics reset successfully',
  });
};
