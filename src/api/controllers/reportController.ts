import { Request, Response } from 'express';
import { reportRepository } from '../../repository/ReportRepository';
import { AccessDeniedError } from '../../proxies/ProtectionReportProxy';

export const getReports = (req: Request, res: Response): void => {
  const reports = reportRepository.getAll().map((report) => ({
    id: report.getId(),
    title: report.getTitle(),
    required_role: report.getRequiredRole(),
  }));

  res.status(200).json(reports);
};

export const generateReport = (req: Request, res: Response): void => {
  const id = String(req.params.id);
  const role = String(req.query.role || '');

  const report = reportRepository.getById(id);
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  try {
    const content = report.generate(role);
    res.status(200).json({
      id: report.getId(),
      content: content,
    });
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      res.status(403).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
