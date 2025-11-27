import { useState } from 'react'
import { ConditionsModal } from './ConditionsModal'

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

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

          {/* Action Button */}
          <div className="header-actions">
            <button 
              className="action-button action-info"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="button-icon">📋</span>
              <span className="button-text">View Available Conditions</span>
            </button>
          </div>
        </div>
      </div>

      <ConditionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
