import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { ApiMonitorService, apiMonitorInterceptor } from './api-monitor.service';

describe('ApiMonitorService', () => {
  let service: ApiMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ApiMonitorService] });
    service = TestBed.inject(ApiMonitorService);
  });

  it('adds, updates, and clears calls', () => {
    const id = service.addCall({ method: 'GET', url: '/a', headers: { a: '1' }, body: { x: 1 } });
    expect(id).toBeTruthy();
    expect(service.apiCalls().length).toBe(1);
    expect(service.apiCalls()[0].request.status).toBe('pending');

    service.updateCall(id, { status: 200, statusText: 'OK', data: { ok: true } });
    expect(service.apiCalls()[0].request.status).toBe('success');
    expect(service.apiCalls()[0].response?.status).toBe(200);

    service.updateCall(id, { status: 500, statusText: 'ERR' });
    expect(service.apiCalls()[0].request.status).toBe('error');

    service.updateCall('unknown-id', { status: 200, statusText: 'OK' });
    expect(service.apiCalls().length).toBe(1);

    service.clearHistory();
    expect(service.apiCalls()).toEqual([]);
  });

  it('keeps only the latest 50 calls', () => {
    for (let i = 0; i < 51; i += 1) {
      service.addCall({ method: 'GET', url: `/u/${i}` });
    }
    expect(service.apiCalls().length).toBe(50);
  });
});

describe('apiMonitorInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ApiMonitorService] });
  });

  it('records successful responses', async () => {
    const req = {
      method: 'POST',
      url: '/ok',
      body: JSON.stringify({ a: 1 }),
      headers: new HttpHeaders({ 'x-test': '1' }),
    } as never;

    const events: HttpResponse<unknown> = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: { ok: true },
      headers: new HttpHeaders({ 'x-res': '1' }),
    });

    await TestBed.runInInjectionContext(async () => {
      const stream = apiMonitorInterceptor(req, () => of(events) as Observable<never>);
      await new Promise<void>((resolve, reject) => {
        stream.subscribe({
          complete: () => resolve(),
          error: reject,
        });
      });
    });

    const monitor = TestBed.inject(ApiMonitorService);
    expect(monitor.apiCalls().length).toBe(1);
    expect(monitor.apiCalls()[0].request.method).toBe('POST');
    expect(monitor.apiCalls()[0].response?.status).toBe(200);
    expect(monitor.apiCalls()[0].request.status).toBe('success');
  });

  it('handles object request body and null-valued headers', async () => {
    const reqHeaders = {
      keys: () => ['x-null'],
      get: () => null,
    };
    const resHeaders = {
      keys: () => ['x-null-res'],
      get: () => null,
    };

    const req = {
      method: 'PUT',
      url: '/object-body',
      body: { nested: true },
      headers: reqHeaders,
    } as never;

    await TestBed.runInInjectionContext(async () => {
      const stream = apiMonitorInterceptor(
        req,
        () =>
          of({
            status: 202,
            statusText: 'Accepted',
            body: { ok: true },
            headers: resHeaders,
          } as never) as Observable<never>,
      );
      await new Promise<void>((resolve, reject) => {
        stream.subscribe({ complete: resolve, error: reject });
      });
    });

    const monitor = TestBed.inject(ApiMonitorService);
    expect(monitor.apiCalls()[0].request.body).toEqual({ nested: true });
    expect(monitor.apiCalls()[0].request.headers?.['x-null']).toBe('');
    expect(monitor.apiCalls()[0].response?.headers?.['x-null-res']).toBe('');
  });

  it('handles invalid JSON body and records errors', async () => {
    const req = {
      method: 'GET',
      url: '/err',
      body: '{not-json}',
      headers: new HttpHeaders(),
    } as never;

    const err = new HttpErrorResponse({
      status: 503,
      statusText: 'Service Unavailable',
      error: 'down',
      url: '/err',
    });

    await TestBed.runInInjectionContext(async () => {
      const stream = apiMonitorInterceptor(
        req,
        () => throwError(() => err) as Observable<never>,
      );
      await new Promise<void>((resolve) => {
        stream.subscribe({
          error: () => resolve(),
        });
      });
    });

    const monitor = TestBed.inject(ApiMonitorService);
    expect(monitor.apiCalls().length).toBe(1);
    expect(monitor.apiCalls()[0].request.body).toBe('{not-json}');
    expect(monitor.apiCalls()[0].response?.status).toBe(503);
    expect(monitor.apiCalls()[0].request.status).toBe('error');
  });

  it('handles request without body and response events without status', async () => {
    const req = {
      method: 'GET',
      url: '/event-only',
      headers: new HttpHeaders(),
    } as never;

    await TestBed.runInInjectionContext(async () => {
      const stream = apiMonitorInterceptor(
        req,
        () => of({ type: 0 } as never) as Observable<never>,
      );
      await new Promise<void>((resolve, reject) => {
        stream.subscribe({
          complete: () => resolve(),
          error: reject,
        });
      });
    });

    const monitor = TestBed.inject(ApiMonitorService);
    expect(monitor.apiCalls()[0].request.body).toBeNull();
    expect(monitor.apiCalls()[0].response).toBeUndefined();
  });

  it('handles response with status but without headers/body', async () => {
    const req = {
      method: 'GET',
      url: '/status-only',
      headers: new HttpHeaders(),
      body: null,
    } as never;

    await TestBed.runInInjectionContext(async () => {
      const stream = apiMonitorInterceptor(
        req,
        () => of({ status: 204, statusText: undefined } as never) as Observable<never>,
      );
      await new Promise<void>((resolve, reject) => {
        stream.subscribe({
          complete: () => resolve(),
          error: reject,
        });
      });
    });

    const monitor = TestBed.inject(ApiMonitorService);
    expect(monitor.apiCalls()[0].response?.statusText).toBe('');
    expect(monitor.apiCalls()[0].response?.data).toBeUndefined();
  });

  it('uses default error status text and message for unknown errors', async () => {
    const req = {
      method: 'POST',
      url: '/network',
      headers: new HttpHeaders(),
    } as never;

    await TestBed.runInInjectionContext(async () => {
      const stream = apiMonitorInterceptor(
        req,
        () => throwError(() => ({})) as Observable<never>,
      );
      await new Promise<void>((resolve) => {
        stream.subscribe({ error: () => resolve() });
      });
    });

    const monitor = TestBed.inject(ApiMonitorService);
    expect(monitor.apiCalls()[0].response?.status).toBe(0);
    expect(monitor.apiCalls()[0].response?.statusText).toBe('Network Error');
    expect(monitor.apiCalls()[0].response?.error).toBe('Unknown error');
  });
});
