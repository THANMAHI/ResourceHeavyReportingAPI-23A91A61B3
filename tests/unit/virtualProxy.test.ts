import { VirtualReportProxy } from '../../src/proxies/VirtualReportProxy';
import { MetricsTracker } from '../../src/core/MetricsTracker';

describe('VirtualReportProxy', () => {
  beforeEach(() => {
    MetricsTracker.reset();
  });

  test('should return metadata without instantiating HeavyReportGenerator', () => {
    const proxy = new VirtualReportProxy('rep-1', 'Annual Summary', 'admin');
    expect(proxy.getId()).toBe('rep-1');
    expect(proxy.getTitle()).toBe('Annual Summary');
    expect(proxy.getRequiredRole()).toBe('admin');
    expect(MetricsTracker.getCount()).toBe(0);
    expect(proxy.isInitialized()).toBe(false);
  });

  test('should instantiate HeavyReportGenerator lazily on first generate call', () => {
    const proxy = new VirtualReportProxy('rep-1', 'Annual Summary', 'admin');
    expect(MetricsTracker.getCount()).toBe(0);

    const content = proxy.generate('admin');
    expect(content).toBe('Report content for Annual Summary');
    expect(MetricsTracker.getCount()).toBe(1);
    expect(proxy.isInitialized()).toBe(true);
  });

  test('should reuse existing instance on subsequent generate calls', () => {
    const proxy = new VirtualReportProxy('rep-1', 'Annual Summary', 'admin');
    
    proxy.generate('admin');
    expect(MetricsTracker.getCount()).toBe(1);

    proxy.generate('admin');
    proxy.generate('admin');
    expect(MetricsTracker.getCount()).toBe(1);
  });
});
