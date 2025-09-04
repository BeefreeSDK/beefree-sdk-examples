import React, { useEffect } from 'react'
import { BeefreeEditorProps } from '../types'
import { BUILDER_CONFIGS } from '../config/constants'

export const BeefreeEditor: React.FC<BeefreeEditorProps> = ({
  builderType,
  token,
  uid,
  isInitialized,
  onInitialize,
  onError
}) => {
  const builderConfig = BUILDER_CONFIGS[builderType]

  useEffect(() => {
    // Initialize the builder only after the container is mounted in the DOM
    // and only if not already initialized
    if (!isInitialized) {
      // Small delay to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        onInitialize()
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [isInitialized, onInitialize])

  return (
    <div className="beefree-editor">
      <div className="editor-info">
        <div className="current-builder">
          <span className="builder-icon">{builderConfig.icon}</span>
          <div className="builder-details">
            <h3 className="builder-name">{builderConfig.label}</h3>
            <p className="builder-description">{builderConfig.description}</p>
          </div>
        </div>
        
        <div className="editor-meta">
          <div className="meta-item">
            <span className="meta-label">User ID:</span>
            <span className="meta-value">{uid}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Builder Type:</span>
            <span className="meta-value">{builderType}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Template:</span>
            <span className="meta-value">{builderConfig.templateUrl}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Status:</span>
            <span className="meta-value">
              {!token ? 'Authenticating...' : !isInitialized ? 'Initializing...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* This is the container where Beefree SDK will be mounted */}
      <div 
        id="bee-plugin-container" 
        className="bee-plugin-container"
        role="application"
        aria-label={`${builderConfig.label} editor interface`}
      >
        {!token ? (
          <div className="container-placeholder">
            <div className="placeholder-content">
              <span className="placeholder-icon">🔐</span>
              <p>Authenticating user...</p>
            </div>
          </div>
        ) : !isInitialized ? (
          <div className="container-placeholder">
            <div className="placeholder-content">
              <span className="placeholder-icon">⏳</span>
              <p>Initializing {builderConfig.label}...</p>
            </div>
          </div>
        ) : (
          // Beefree SDK will render here when initialized
          <></>
        )}
      </div>
    </div>
  )
}
