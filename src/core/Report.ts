export interface Report {
  getId(): string;
  getTitle(): string;
  getRequiredRole(): string;
  generate(userRole: string): string;
}
