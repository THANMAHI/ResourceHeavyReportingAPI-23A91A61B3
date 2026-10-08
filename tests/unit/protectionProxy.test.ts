import { VirtualReportProxy } from '../../src/proxies/VirtualReportProxy';
import { ProtectionReportProxy, AccessDeniedError } from '../../src/proxies/ProtectionReportProxy';
import { MetricsTracker } from '../../src/core/MetricsTracker';

describe('ProtectionReportProxy', () => {
  beforeEach(() => {
    MetricsTracker.reset();
  });

  test('should pass metadata requests through without triggering instantiation', () => {
    const virtualProxy = new VirtualReportProxy('rep-2', 'Financial Audit', 'admin');
    const protectedProxy = new ProtectionReportProxy(virtualProxy, 'admin');

    expect(protectedProxy.getId()).toBe('rep-2');
    expect(protectedProxy.getTitle()).toBe('Financial Audit');
    expect(protectedProxy.getRequiredRole()).toBe('admin');
    expect(MetricsTracker.getCount()).toBe(0);
  });

  test('should throw AccessDeniedError when user role does not match required role', () => {
    const virtualProxy = new VirtualReportProxy('rep-2', 'Financial Audit', 'admin');
    const protectedProxy = new ProtectionReportProxy(virtualProxy, 'admin');

    expect(() => protectedProxy.generate('guest')).toThrow(AccessDeniedError);
    expect(MetricsTracker.getCount()).toBe(0);
  });

  test('should delegate to underlying report when user role matches required role', () => {
    const virtualProxy = new VirtualReportProxy('rep-2', 'Financial Audit', 'admin');
    const protectedProxy = new ProtectionReportProxy(virtualProxy, 'admin');

    const content = protectedProxy.generate('admin');
    expect(content).toBe('Report content for Financial Audit');
    expect(MetricsTracker.getCount()).toBe(1);
  });
});
