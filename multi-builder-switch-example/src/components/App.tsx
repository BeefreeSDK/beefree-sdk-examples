import { useBuilderManager } from '../hooks/useBuilderManager'
import { Header } from './Header'
import { BeefreeEditor } from './BeefreeEditor'
import { DEFAULT_UID } from '../config/constants'

export const App = () => {
  const {
    currentBuilder,
    isTransitioning,
    isInitialized,
    error,
    token,
    switchBuilder,
    retry,
    initializeFirstBuilder
  } = useBuilderManager(DEFAULT_UID)

  // Error state
  if (error && !isInitialized) {
    return (
      <div className="app-container error-container">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h2 className="error-title">Failed to Initialize Builder</h2>
          <p className="error-message">{error}</p>
          <button onClick={retry} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  // Always render the editor component which will handle its own loading states

  return (
    <div className="app-container">
      <Header
        currentBuilder={currentBuilder}
        onBuilderChange={switchBuilder}
        isTransitioning={isTransitioning}
        uid={DEFAULT_UID}
      />
      
      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button onClick={retry} className="error-retry">
              Retry
            </button>
          </div>
        )}
        
        <BeefreeEditor
          builderType={currentBuilder}
          token={token}
          uid={DEFAULT_UID}
          isInitialized={isInitialized}
          onInitialize={initializeFirstBuilder}
          onError={(errorMessage) => {
            console.error('Editor error:', errorMessage)
          }}
        />
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <strong>Beefree SDK Multi-Builder Switch Example</strong> - 
            Demonstrating seamless switching between Email, Page, and Popup builders
          </p>
          <div className="footer-links">
            <a 
              href="https://docs.beefree.io/beefree-sdk/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              📖 SDK Documentation
            </a>
            <a 
              href="https://developers.beefree.io" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              🔑 Developer Portal
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
