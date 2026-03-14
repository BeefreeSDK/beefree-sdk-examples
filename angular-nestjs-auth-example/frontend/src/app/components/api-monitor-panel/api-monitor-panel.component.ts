import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiMonitorService } from '../../services/api-monitor.service';
import type { ApiCall } from '../../types';

@Component({
  selector: 'app-api-monitor-panel',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="monitor-panel">
      <!-- Black top bar -->
      <div class="monitor-header">
        <span>🔍 API Monitor</span>
      </div>

      <!-- Grey sub-bar -->
      <div class="monitor-subheader">
        <div class="subheader-left">
          <span>Recent API Calls</span>
          <span class="call-count">{{ monitor.apiCalls().length }}</span>
        </div>
        <button
          class="clear-btn"
          (click)="monitor.clearHistory()"
          [disabled]="monitor.apiCalls().length === 0"
        >
          🗑️ Clear
        </button>
      </div>

      <!-- Content area -->
      <div class="monitor-content">
        @if (monitor.apiCalls().length === 0) {
          <div class="no-calls">
            <div class="no-calls-icon">🔍</div>
            <p>No API calls yet</p>
            <small>Authenticate or interact with the SDK to see API calls here</small>
            <div class="no-calls-hint">
              <strong>💡 What you'll see:</strong>
              <ul>
                <li>Authentication requests</li>
                <li>Template loading calls</li>
                <li>SDK configuration data</li>
                <li>Request/response details</li>
              </ul>
            </div>
          </div>
        } @else {
          <div class="calls-list">
            @for (call of monitor.apiCalls(); track call.id) {
              <div
                class="call-item"
                [class.selected]="selectedCall()?.id === call.id"
                (click)="selectCall(call)"
              >
                <div class="call-summary">
                  <div class="method-url">
                    <span
                      class="method-badge"
                      [style.backgroundColor]="getMethodColor(call.request.method)"
                    >
                      {{ call.request.method }}
                    </span>
                    <span class="url">{{ call.request.url }}</span>
                  </div>
                  <div class="call-meta">
                    <span
                      class="status-badge"
                      [style.color]="getStatusColor(call.response?.status ?? call.request.status)"
                    >
                      {{ call.response?.status ?? call.request.status }}
                    </span>
                    @if (call.duration) {
                      <span class="duration">{{ call.duration }}ms</span>
                    }
                    <span class="timestamp">
                      {{ call.request.timestamp | date:'mediumTime' }}
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Call details -->
        @if (selectedCall(); as call) {
          <div class="call-details">
            <div class="details-header">
              <h4>📋 Call Details</h4>
              <button class="close-details" (click)="selectedCall.set(null)">✕</button>
            </div>
            <div class="details-content">
              <div class="section">
                <h5>📤 Request</h5>
                <div class="detail-item">
                  <strong>Method:</strong>
                  <span
                    class="method-badge inline"
                    [style.backgroundColor]="getMethodColor(call.request.method)"
                  >{{ call.request.method }}</span>
                </div>
                <div class="detail-item">
                  <strong>URL:</strong>
                  <code>{{ call.request.url }}</code>
                </div>
                <div class="detail-item">
                  <strong>Timestamp:</strong>
                  <span>{{ call.request.timestamp | date:'medium' }}</span>
                </div>
                @if (call.request.body) {
                  <div class="detail-item">
                    <strong>Body:</strong>
                    <pre class="json-display">{{ formatJson(call.request.body) }}</pre>
                  </div>
                }
              </div>

              @if (call.response) {
                <div class="section">
                  <h5>📥 Response</h5>
                  <div class="detail-item">
                    <strong>Status:</strong>
                    <span
                      class="status-badge inline"
                      [style.color]="getStatusColor(call.response.status)"
                    >{{ call.response.status }} {{ call.response.statusText }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Duration:</strong>
                    <span>{{ call.duration }}ms</span>
                  </div>
                  @if (call.response.data) {
                    <div class="detail-item">
                      <strong>Data:</strong>
                      <pre class="json-display">{{ formatJson(call.response.data) }}</pre>
                    </div>
                  }
                  @if (call.response.error) {
                    <div class="detail-item">
                      <strong>Error:</strong>
                      <pre class="error-display">{{ call.response.error }}</pre>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .monitor-panel {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #fff;
    }

    /* Black top bar */
    .monitor-header {
      background: #262626;
      color: white;
      padding: 0 16px;
      height: 48px;
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 600;
      flex-shrink: 0;
    }

    /* Grey sub-bar */
    .monitor-subheader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #e1e5e9;
      flex-shrink: 0;
    }
    .subheader-left {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #495057;
    }
    .call-count {
      background: #7638ff;
      color: white;
      font-size: 12px;
      font-weight: 600;
      min-width: 22px;
      height: 22px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }
    .clear-btn {
      background: none;
      border: 1px solid #ccc;
      color: #666;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s;
    }
    .clear-btn:hover:not(:disabled) {
      background: #eee;
    }
    .clear-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Content */
    .monitor-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Empty state */
    .no-calls {
      padding: 30px 20px;
      text-align: center;
      color: #6c757d;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .no-calls-icon {
      font-size: 32px;
      opacity: 0.5;
    }
    .no-calls p {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #495057;
    }
    .no-calls small {
      font-size: 12px;
      opacity: 0.8;
    }
    .no-calls-hint {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
      text-align: left;
      width: 100%;
      max-width: 280px;
    }
    .no-calls-hint strong {
      display: block;
      font-size: 12px;
      color: #495057;
      margin-bottom: 8px;
    }
    .no-calls-hint ul {
      margin: 0;
      padding-left: 16px;
      font-size: 11px;
      line-height: 1.4;
    }
    .no-calls-hint li {
      margin-bottom: 2px;
      color: #6c757d;
    }

    /* Calls list */
    .calls-list {
      flex: 1;
      overflow-y: auto;
      border-bottom: 1px solid #e1e5e9;
    }
    .call-item {
      padding: 12px 16px;
      border-bottom: 1px solid #f1f3f4;
      cursor: pointer;
      transition: background 0.2s;
    }
    .call-item:hover {
      background: #f8f9fa;
    }
    .call-item.selected {
      background: #e3f2fd;
      border-left: 3px solid #2196f3;
    }
    .call-summary {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .method-url {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .method-badge {
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      min-width: 45px;
      text-align: center;
    }
    .method-badge.inline {
      display: inline-block;
      margin-left: 8px;
    }
    .url {
      font-size: 12px;
      color: #495057;
      word-break: break-all;
      flex: 1;
    }
    .call-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 11px;
    }
    .status-badge {
      font-weight: 600;
    }
    .status-badge.inline {
      margin-left: 8px;
    }
    .duration {
      color: #6c757d;
    }
    .timestamp {
      color: #6c757d;
      margin-left: auto;
    }

    /* Call details */
    .call-details {
      flex: 0 0 50%;
      overflow-y: auto;
      border-top: 1px solid #e1e5e9;
    }
    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #e1e5e9;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .details-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #495057;
    }
    .close-details {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      border-radius: 4px;
    }
    .close-details:hover {
      background: #e9ecef;
    }
    .details-content {
      padding: 16px;
      overflow-y: auto;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h5 {
      margin: 0 0 10px;
      font-size: 14px;
      font-weight: 600;
      color: #495057;
      padding-bottom: 6px;
      border-bottom: 1px solid #e1e5e9;
    }
    .detail-item {
      margin-bottom: 10px;
    }
    .detail-item strong {
      display: block;
      font-size: 11px;
      color: #6c757d;
      margin-bottom: 3px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .detail-item code {
      background: #f8f9fa;
      padding: 3px 6px;
      border-radius: 3px;
      font-size: 11px;
      word-break: break-all;
    }
    .json-display {
      background: #f8f9fa;
      border: 1px solid #e1e5e9;
      border-radius: 4px;
      padding: 10px;
      font-size: 11px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 200px;
      overflow-y: auto;
      margin: 4px 0;
      line-height: 1.4;
    }
    .error-display {
      background: #fff5f5;
      border: 1px solid #fed7d7;
      border-radius: 4px;
      padding: 10px;
      font-size: 11px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      white-space: pre-wrap;
      word-break: break-word;
      color: #c53030;
      margin: 4px 0;
    }
  `,
})
export class ApiMonitorPanelComponent {
  monitor = inject(ApiMonitorService);
  selectedCall = signal<ApiCall | null>(null);

  selectCall(call: ApiCall) {
    this.selectedCall.set(call);
  }

  formatJson(data: unknown): string {
    if (data === null || data === undefined) return 'null';
    if (typeof data === 'string') return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }

  getMethodColor(method: string): string {
    switch (method.toUpperCase()) {
      case 'GET': return '#17a2b8';
      case 'POST': return '#28a745';
      case 'PUT': return '#ffc107';
      case 'DELETE': return '#dc3545';
      case 'PATCH': return '#6f42c1';
      default: return '#6c757d';
    }
  }

  getStatusColor(status: number | string | undefined): string {
    if (typeof status === 'string') {
      switch (status) {
        case 'pending': return '#ffa500';
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        default: return '#6c757d';
      }
    }
    if (!status) return '#dc3545';
    if (status >= 200 && status < 300) return '#28a745';
    if (status >= 400) return '#dc3545';
    return '#ffc107';
  }
}
