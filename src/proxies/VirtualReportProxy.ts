import { Report } from '../core/Report';
import { HeavyReportGenerator } from '../core/HeavyReportGenerator';

export class VirtualReportProxy implements Report {
  private id: string;
  private title: string;
  private requiredRole: string;
  private realSubject: HeavyReportGenerator | null = null;

  constructor(id: string, title: string, requiredRole: string = 'guest') {
    this.id = id;
    this.title = title;
    this.requiredRole = requiredRole;
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
    if (this.realSubject === null) {
      this.realSubject = new HeavyReportGenerator(this.id, this.title, this.requiredRole);
    }
    return this.realSubject.generate(userRole);
  }

  public isInitialized(): boolean {
    return this.realSubject !== null;
  }

  public resetCache(): void {
    this.realSubject = null;
  }
}
