import { TestBed } from '@angular/core/testing';
import { ApiMonitorPanelComponent } from './api-monitor-panel.component';
import { ApiMonitorService } from '../../services/api-monitor.service';

describe('ApiMonitorPanelComponent', () => {
  let component: ApiMonitorPanelComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ApiMonitorService] });
    component = TestBed.runInInjectionContext(() => new ApiMonitorPanelComponent());
  });

  it('selects a call', () => {
    const call = {
      id: '1',
      request: {
        id: '1',
        method: 'GET',
        url: '/x',
        timestamp: new Date(),
        status: 'pending' as const,
      },
    };
    component.selectCall(call);
    expect(component.selectedCall()).toEqual(call);
  });

  it('formats json values', () => {
    expect(component.formatJson(null)).toBe('null');
    expect(component.formatJson(undefined)).toBe('null');
    expect(component.formatJson('raw')).toBe('raw');
    expect(component.formatJson({ a: 1 })).toContain('"a": 1');

    const cyclic: { self?: unknown } = {};
    cyclic.self = cyclic;
    expect(component.formatJson(cyclic)).toContain('[object Object]');
  });

  it('returns method colors', () => {
    expect(component.getMethodColor('GET')).toBe('#17a2b8');
    expect(component.getMethodColor('POST')).toBe('#28a745');
    expect(component.getMethodColor('PUT')).toBe('#ffc107');
    expect(component.getMethodColor('DELETE')).toBe('#dc3545');
    expect(component.getMethodColor('PATCH')).toBe('#6f42c1');
    expect(component.getMethodColor('HEAD')).toBe('#6c757d');
  });

  it('returns status colors for string states and numeric statuses', () => {
    expect(component.getStatusColor('pending')).toBe('#ffa500');
    expect(component.getStatusColor('success')).toBe('#28a745');
    expect(component.getStatusColor('error')).toBe('#dc3545');
    expect(component.getStatusColor('unknown')).toBe('#6c757d');

    expect(component.getStatusColor(undefined)).toBe('#dc3545');
    expect(component.getStatusColor(201)).toBe('#28a745');
    expect(component.getStatusColor(404)).toBe('#dc3545');
    expect(component.getStatusColor(302)).toBe('#ffc107');
  });
});
