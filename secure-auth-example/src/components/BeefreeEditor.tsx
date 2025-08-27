import { useEffect } from 'react'
import { BeefreeEditorProps } from '../types'
import { useBeefreeSDK } from '../hooks/useBeefreeSDK'

export const BeefreeEditor = ({ authState }: BeefreeEditorProps) => {
  const { initializeSDK, isLoading, error } = useBeefreeSDK()

  useEffect(() => {
    if (authState.isAuthenticated && authState.token) {
      initializeSDK(authState.token, authState.uid!)
    }
  }, [authState.isAuthenticated, authState.token, authState.uid, initializeSDK])

  if (error) {
    return (
      <div className="editor-container">
        <div className="error-message">
          ❌ Failed to initialize Beefree SDK: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="editor-container">
      <div className="builder-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="spinner"></div>
              <span>Loading Beefree SDK...</span>
            </div>
          </div>
        )}
        
        <div id="bee-plugin-container" />
      </div>
    </div>
  )
}
