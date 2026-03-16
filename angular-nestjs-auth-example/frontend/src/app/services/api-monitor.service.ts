import { Injectable, signal } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import type { ApiCall, ApiRequest, ApiResponse } from '../types';

@Injectable({ providedIn: 'root' })
export class ApiMonitorService {
  private readonly _apiCalls = signal<ApiCall[]>([]);
  readonly apiCalls = this._apiCalls.asReadonly();

  addCall(request: Omit<ApiRequest, 'id' | 'timestamp' | 'status'>): string {
    const id =
      Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const apiRequest: ApiRequest = {
      id,
      timestamp: new Date(),
      status: 'pending',
      ...request,
    };
    const apiCall: ApiCall = { id, request: apiRequest };
    this._apiCalls.update((calls) => [apiCall, ...calls].slice(0, 50));
    return id;
  }

  updateCall(
    id: string,
    response: Omit<ApiResponse, 'id' | 'timestamp'>,
  ): void {
    this._apiCalls.update((calls) =>
      calls.map((call) => {
        if (call.id !== id) return call;
        const apiResponse: ApiResponse = {
          id,
          timestamp: new Date(),
          ...response,
        };
        const duration =
          apiResponse.timestamp.getTime() - call.request.timestamp.getTime();
        return {
          ...call,
          response: apiResponse,
          duration,
          request: {
            ...call.request,
            status:
              response.status >= 200 && response.status < 300
                ? ('success' as const)
                : ('error' as const),
          },
        };
      }),
    );
  }

  clearHistory(): void {
    this._apiCalls.set([]);
  }
}

export const apiMonitorInterceptor: HttpInterceptorFn = (req, next) => {
  const monitor = inject(ApiMonitorService);
  const startTime = Date.now();

  let body: unknown = null;
  if (req.body) {
    try {
      body =
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      body = req.body;
    }
  }

  const headers: Record<string, string> = {};
  req.headers.keys().forEach((key) => {
    headers[key] = req.headers.get(key) ?? '';
  });

  const callId = monitor.addCall({
    method: req.method,
    url: req.url,
    headers,
    body,
  });

  return next(req).pipe(
    tap((event) => {
      if ('status' in event && typeof event.status === 'number') {
        const responseHeaders: Record<string, string> = {};
        if ('headers' in event && event.headers) {
          event.headers.keys().forEach((key: string) => {
            responseHeaders[key] = event.headers.get(key) ?? '';
          });
        }
        monitor.updateCall(callId, {
          status: event.status,
          statusText: event.statusText ?? '',
          headers: responseHeaders,
          data: 'body' in event ? event.body : undefined,
          duration: Date.now() - startTime,
        });
      }
    }),
    catchError((error) => {
      monitor.updateCall(callId, {
        status: error.status ?? 0,
        statusText: error.statusText ?? 'Network Error',
        error: error.message ?? 'Unknown error',
        duration: Date.now() - startTime,
      });
      return throwError(() => error);
    }),
  );
};
