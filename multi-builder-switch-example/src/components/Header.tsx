import React from 'react'
import { HeaderProps } from '../types'
import { AVAILABLE_BUILDERS } from '../config/constants'
import { BuilderSelector } from './BuilderSelector'

export const Header: React.FC<HeaderProps> = ({
  currentBuilder,
  onBuilderChange,
  isTransitioning,
  uid
}) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <span className="logo">🏗️</span>
            Multi-Builder Switch Example
          </h1>
          {uid && (
            <div className="user-info">
              <span className="user-label">User:</span>
              <span className="user-id">{uid}</span>
            </div>
          )}
        </div>
        
        <div className="header-center">
          <BuilderSelector
            currentBuilder={currentBuilder}
            onBuilderChange={onBuilderChange}
            disabled={isTransitioning}
            availableBuilders={AVAILABLE_BUILDERS}
          />
        </div>
        
        <div className="header-right">
          <div className="status-indicator">
            {isTransitioning ? (
              <span className="status transitioning">
                <span className="spinner">⏳</span>
                Switching...
              </span>
            ) : (
              <span className="status ready">
                <span className="indicator">✅</span>
                Ready
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
