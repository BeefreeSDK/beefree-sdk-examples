import { useState } from 'react'
import { ApiMonitorProps, ApiCall } from '../types'

export const ApiMonitorPanel = ({ apiCalls, onClearHistory }: ApiMonitorProps) => {
  const [selectedCall, setSelectedCall] = useState<ApiCall | null>(null)

  const formatJson = (data: unknown): string => {
    if (data === null || data === undefined) return 'null'
    if (typeof data === 'string') return data
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }

  const getStatusColor = (status?: number | string) => {
    if (typeof status === 'string') {
      switch (status) {
        case 'pending': return '#ffa500'
        case 'success': return '#28a745'
        case 'error': return '#dc3545'
        default: return '#6c757d'
      }
    }
    
    if (!status) return '#dc3545'
    if (status >= 200 && status < 300) return '#28a745'
    if (status >= 400) return '#dc3545'
    return '#ffc107'
  }

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return '#17a2b8'
      case 'POST': return '#28a745'
      case 'PUT': return '#ffc107'
      case 'DELETE': return '#dc3545'
      case 'PATCH': return '#6f42c1'
      default: return '#6c757d'
    }
  }

  return (
    <div className="api-monitor-panel">
      <div className="api-monitor-header">
        <div className="header-left">
          <h3>🔍 API Monitor</h3>
          <span className="call-count">
            {apiCalls.length} {apiCalls.length === 1 ? 'call' : 'calls'}
          </span>
        </div>
        <div className="header-controls">
          <button 
            className="clear-btn"
            onClick={onClearHistory}
            disabled={apiCalls.length === 0}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="api-monitor-content">
        <div className="api-calls-list">
          <div className="calls-header">
            <span>Recent API Calls</span>
          </div>
          
          {apiCalls.length === 0 ? (
            <div className="no-calls">
              <div className="no-calls-icon">🔍</div>
              <p>No API calls yet</p>
              <small>Authenticate or interact with the SDK to see API calls here</small>
              <div className="no-calls-hint">
                <strong>💡 What you'll see:</strong>
                <ul>
                  <li>Authentication requests</li>
                  <li>Template loading calls</li>
                  <li>SDK configuration data</li>
                  <li>Request/response details</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="calls-list">
              {apiCalls.map((call) => (
                <div
                  key={call.id}
                  className={`call-item ${selectedCall?.id === call.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCall(call)}
                >
                  <div className="call-summary">
                    <div className="method-url">
                      <span 
                        className="method-badge"
                        style={{ backgroundColor: getMethodColor(call.request.method) }}
                      >
                        {call.request.method}
                      </span>
                      <span className="url">{call.request.url}</span>
                    </div>
                    
                    <div className="call-meta">
                      <span 
                        className="status-badge"
                        style={{ color: getStatusColor(call.response?.status || call.request.status) }}
                      >
                        {call.response?.status || call.request.status || 'pending'}
                      </span>
                      {call.duration && (
                        <span className="duration">{call.duration}ms</span>
                      )}
                      <span className="timestamp">
                        {call.request.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedCall && (
          <div className="call-details">
            <div className="details-header">
              <h4>📋 Call Details</h4>
              <button 
                className="close-details"
                onClick={() => setSelectedCall(null)}
              >
                ✕
              </button>
            </div>

            <div className="details-content">
              {/* Request Details */}
              <div className="section">
                <h5>📤 Request</h5>
                <div className="detail-item">
                  <strong>Method:</strong> 
                  <span 
                    className="method-badge inline"
                    style={{ backgroundColor: getMethodColor(selectedCall.request.method) }}
                  >
                    {selectedCall.request.method}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>URL:</strong> 
                  <code>{selectedCall.request.url}</code>
                </div>
                <div className="detail-item">
                  <strong>Timestamp:</strong> 
                  <span>{selectedCall.request.timestamp.toLocaleString()}</span>
                </div>
                
                {selectedCall.request.headers && Object.keys(selectedCall.request.headers).length > 0 && (
                  <div className="detail-item">
                    <strong>Headers:</strong>
                    <pre className="json-display">
                      {formatJson(selectedCall.request.headers)}
                    </pre>
                  </div>
                )}
                
                                  {selectedCall.request.body != null && (
                    <div className="detail-item">
                      <strong>Body:</strong>
                      <pre className="json-display">
                        {formatJson(selectedCall.request.body)}
                      </pre>
                    </div>
                  )}
              </div>

              {/* Response Details */}
              {selectedCall.response && (
                <div className="section">
                  <h5>📥 Response</h5>
                  <div className="detail-item">
                    <strong>Status:</strong> 
                    <span 
                      className="status-badge inline"
                      style={{ color: getStatusColor(selectedCall.response.status) }}
                    >
                      {selectedCall.response.status} {selectedCall.response.statusText}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Duration:</strong> 
                    <span>{selectedCall.duration}ms</span>
                  </div>
                  <div className="detail-item">
                    <strong>Timestamp:</strong> 
                    <span>{selectedCall.response.timestamp.toLocaleString()}</span>
                  </div>
                  
                  {selectedCall.response.headers && Object.keys(selectedCall.response.headers).length > 0 && (
                    <div className="detail-item">
                      <strong>Headers:</strong>
                      <pre className="json-display">
                        {formatJson(selectedCall.response.headers)}
                      </pre>
                    </div>
                  )}
                  
                                      {selectedCall.response.data != null && (
                      <div className="detail-item">
                        <strong>Data:</strong>
                        <pre className="json-display">
                          {formatJson(selectedCall.response.data)}
                        </pre>
                      </div>
                    )}
                  
                  {selectedCall.response.error && (
                    <div className="detail-item">
                      <strong>Error:</strong>
                      <pre className="error-display">
                        {selectedCall.response.error}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}