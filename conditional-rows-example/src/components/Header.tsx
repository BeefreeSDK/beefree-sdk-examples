import { useState } from 'react'
import { ConditionsModal } from './ConditionsModal'
import { ExtendingConditionsModal } from './ExtendingConditionsModal'

export const Header = () => {
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false)
  const [isExtendingModalOpen, setIsExtendingModalOpen] = useState(false)

  return (
    <>
      <div className="demo-header">
        <div className="header-content">
          {/* Title Section */}
          <div className="header-title">
            <h1>🔀 Beefree SDK Display Conditions Demo</h1>
            <p className="header-subtitle">
              Create personalized content that changes based on recipient attributes - no code required
            </p>
          </div>

          <div className="header-right">
            {/* Action Buttons */}
            <div className="header-actions">
              <button 
                className="action-button action-info"
                onClick={() => setIsConditionsModalOpen(true)}
              >
                <span className="button-icon">📋</span>
                <span className="button-text">View Available Conditions</span>
              </button>
              <button 
                className="action-button action-secondary"
                onClick={() => setIsExtendingModalOpen(true)}
              >
                <span className="button-icon">🔧</span>
                <span className="button-text">How to Build Custom Conditions</span>
              </button>
            </div>

            {/* Documentation Link */}
            <a
              href="https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/display-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="docs-link"
            >
              <span className="docs-icon">📚</span>
              <span className="docs-text">
                <strong>Display Conditions Docs</strong>
                <small>Full Documentation</small>
              </span>
            </a>
          </div>
        </div>
      </div>

      <ConditionsModal 
        isOpen={isConditionsModalOpen} 
        onClose={() => setIsConditionsModalOpen(false)} 
      />
      <ExtendingConditionsModal 
        isOpen={isExtendingModalOpen} 
        onClose={() => setIsExtendingModalOpen(false)} 
      />
    </>
  )
}
