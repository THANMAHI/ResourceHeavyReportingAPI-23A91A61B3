import { Report } from '../core/Report';

export class AccessDeniedError extends Error {
  constructor(message: string = 'Access Denied') {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

export class ProtectionReportProxy implements Report {
  private underlyingReport: Report;
  private requiredRole: string;

  constructor(underlyingReport: Report, requiredRole: string) {
    this.underlyingReport = underlyingReport;
    this.requiredRole = requiredRole;
  }

  public getId(): string {
    return this.underlyingReport.getId();
  }

  public getTitle(): string {
    return this.underlyingReport.getTitle();
  }

  public getRequiredRole(): string {
    return this.requiredRole;
  }

  public generate(userRole: string): string {
    if (!userRole || userRole !== this.requiredRole) {
      throw new AccessDeniedError('Access Denied');
    }
    return this.underlyingReport.generate(userRole);
  }

  public getUnderlyingReport(): Report {
    return this.underlyingReport;
  }
}
