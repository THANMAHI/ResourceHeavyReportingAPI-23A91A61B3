export class MetricsTracker {
  public static instantiations: number = 0;

  public static increment(): void {
    MetricsTracker.instantiations++;
  }

  public static getCount(): number {
    return MetricsTracker.instantiations;
  }

  public static reset(): void {
    MetricsTracker.instantiations = 0;
  }
}
