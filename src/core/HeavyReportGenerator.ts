import { Report } from './Report';
import { MetricsTracker } from './MetricsTracker';

export class HeavyReportGenerator implements Report {
  private id: string;
  private title: string;
  private requiredRole: string;

  constructor(id: string, title: string, requiredRole: string = 'guest') {
    this.id = id;
    this.title = title;
    this.requiredRole = requiredRole;
    MetricsTracker.increment();
  }

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getRequiredRole(): string {
    return this.requiredRole;
  }

  public generate(userRole: string): string {
    return `Report content for ${this.title}`;
  }
}
