import { Report } from '../core/Report';
import { VirtualReportProxy } from '../proxies/VirtualReportProxy';
import { ProtectionReportProxy } from '../proxies/ProtectionReportProxy';
import { MetricsTracker } from '../core/MetricsTracker';

export class ReportRepository {
  private reports: Map<string, Report> = new Map();

  constructor() {
    this.seedReports();
  }

  public seedReports(): void {
    this.reports.clear();

    // report-1: Title "Financial Q1", Requires role: admin
    const r1Virtual = new VirtualReportProxy('report-1', 'Financial Q1', 'admin');
    const r1Protected = new ProtectionReportProxy(r1Virtual, 'admin');
    this.reports.set('report-1', r1Protected);

    // report-2: Title "User Analytics", Requires role: manager
    const r2Virtual = new VirtualReportProxy('report-2', 'User Analytics', 'manager');
    const r2Protected = new ProtectionReportProxy(r2Virtual, 'manager');
    this.reports.set('report-2', r2Protected);

    // report-3: Title "System Status", Requires role: guest
    const r3Virtual = new VirtualReportProxy('report-3', 'System Status', 'guest');
    const r3Protected = new ProtectionReportProxy(r3Virtual, 'guest');
    this.reports.set('report-3', r3Protected);
  }

  public getAll(): Report[] {
    return Array.from(this.reports.values());
  }

  public getById(id: string): Report | undefined {
    return this.reports.get(id);
  }

  public resetAll(): void {
    MetricsTracker.reset();
    this.seedReports();
  }
}

export const reportRepository = new ReportRepository();
