import { useEffect } from 'react'
import { BeefreeEditorProps } from '../types'
import { useBeefreeSDK } from '../hooks/useBeefreeSDK'

export const BeefreeEditor = ({
  authState,
  monitoredFetch,
  coEditingConfig,
  onBackToAuth
}: BeefreeEditorProps) => {
  const { initializeCoEditingSDK, isLoading, error, getSessionInfo } = useBeefreeSDK()

  useEffect(() => {
    if (authState.isAuthenticated && authState.token && coEditingConfig) {
      initializeCoEditingSDK(
        authState.token,
        authState.uid!,
        coEditingConfig.userColor,
        coEditingConfig.username,
        coEditingConfig.sessionId,
        monitoredFetch
      )
    }
  }, [
    authState.isAuthenticated,
    authState.token,
    authState.uid,
    coEditingConfig,
    initializeCoEditingSDK,
    monitoredFetch
  ])

  if (error) {
    return (
      <div className="editor-container">
        <div className="error-message">
          ❌ Failed to initialize Beefree SDK: {error}
        </div>
      </div>
    )
  }

  const sessionInfo = getSessionInfo()

  return (
    <div className="editor-container">
      <div className="coedit-header">
        <div className="session-info">
          <h3>🤝 Co-editing Session</h3>
          <div className="session-details">
            <span className="user-info">
              👤 {coEditingConfig?.username}
              <span
                className="user-color"
                style={{ backgroundColor: coEditingConfig?.userColor }}
              />
            </span>
            {sessionInfo.sessionId && (
              <div className="session-id-group">
                <span className="session-id">🔗 Session: {sessionInfo.sessionId.slice(0, 8)}...</span>
                <button
                  className="copy-session-btn"
                  onClick={() => navigator.clipboard.writeText(sessionInfo.sessionId)}
                  title="Copy session ID"
                >
                  📋 Copy ID
                </button>
                <button
                  className="new-tab-btn"
                  onClick={() => window.open(window.location.href, '_blank')}
                  title="Open new tab to test collaboration"
                >
                  🆕 New Tab
                </button>
              </div>
            )}
          </div>
        </div>
        <button className="back-button" onClick={onBackToAuth}>
          ← Back to Setup
        </button>
      </div>

      <div className="builder-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="spinner"></div>
              <span>Setting up co-editing session...</span>
            </div>
          </div>
        )}

        <div id="bee-plugin-container" />
      </div>
    </div>
  )
}
