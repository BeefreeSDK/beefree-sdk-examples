import { MouseEvent } from 'react'
import { createPortal } from 'react-dom'

interface PlanWarningModalProps {
  isOpen: boolean
  onClose: () => void
  plan: string
}

export const PlanWarningModal = ({ isOpen, onClose, plan }: PlanWarningModalProps) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="condition-builder-modal" style={{ maxWidth: '600px' }}>
        <div className="builder-header" style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
          <h2>⚠️ Feature Unavailable</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="builder-body">
          <div className="modal-instructions" style={{ borderLeftColor: '#f59e0b', background: '#fffbeb' }}>
            <h3 style={{ color: '#92400e' }}>Plan Restriction Detected</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
              The <strong>Custom CSS</strong> feature is not available on your current plan (<strong>{plan}</strong>).
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', marginTop: '16px' }}>
              This feature requires one of the following plans:
            </p>
            <ul style={{ marginTop: '12px', marginBottom: '24px' }}>
              <li><strong>Superpowers</strong></li>
              <li><strong>Enterprise</strong></li>
            </ul>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Please check the pricing page for more details on available features for each plan.
            </p>
          </div>
        </div>

        <div className="builder-footer">
          <button onClick={onClose} className="btn-cancel">
            Close
          </button>
          <a 
            href="https://developers.beefree.io/pricing-plans" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-confirm"
            style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            View Pricing Plans
          </a>
        </div>
      </div>
    </div>,
    document.body
  )
}

