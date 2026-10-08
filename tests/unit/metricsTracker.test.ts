import { MetricsTracker } from '../../src/core/MetricsTracker';
import { HeavyReportGenerator } from '../../src/core/HeavyReportGenerator';

describe('MetricsTracker', () => {
  beforeEach(() => {
    MetricsTracker.reset();
  });

  test('should initialize with 0 instantiations', () => {
    expect(MetricsTracker.getCount()).toBe(0);
  });

  test('should increment count on HeavyReportGenerator instantiation', () => {
    expect(MetricsTracker.getCount()).toBe(0);
    new HeavyReportGenerator('test-1', 'Test Report');
    expect(MetricsTracker.getCount()).toBe(1);
    new HeavyReportGenerator('test-2', 'Test Report 2');
    expect(MetricsTracker.getCount()).toBe(2);
  });

  test('should reset count to 0', () => {
    new HeavyReportGenerator('test-1', 'Test Report');
    expect(MetricsTracker.getCount()).toBe(1);
    MetricsTracker.reset();
    expect(MetricsTracker.getCount()).toBe(0);
  });
});
