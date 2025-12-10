import { BuilderType } from '../types'
import { AVAILABLE_BUILDERS } from '../config/constants'
import { BuilderSelector } from './BuilderSelector'

interface HeaderProps {
  currentBuilder: BuilderType
  onBuilderChange: (builder: BuilderType) => void
  isTransitioning: boolean
  uid?: string
}

export const Header = ({
  currentBuilder,
  onBuilderChange,
  isTransitioning,
  uid
}: HeaderProps) => {
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
