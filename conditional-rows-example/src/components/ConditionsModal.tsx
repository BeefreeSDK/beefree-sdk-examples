import { rowDisplayConditions } from '../config/clientConfig'

interface ConditionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ConditionsModal = ({ isOpen, onClose }: ConditionsModalProps) => {
  if (!isOpen) return null

  const conditionsByType = rowDisplayConditions.reduce((acc, condition) => {
    if (!acc[condition.type]) {
      acc[condition.type] = []
    }
    acc[condition.type].push(condition)
    return acc
  }, {} as Record<string, typeof rowDisplayConditions>)

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>📋 Available Display Conditions</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-instructions">
            <h3>🎯 How to Use Display Conditions</h3>
            <ol>
              <li>Select any <strong>row</strong> in the email editor</li>
              <li>Click the <strong>row settings</strong> icon (gear icon)</li>
              <li>Go to the <strong>"Display Conditions"</strong> tab</li>
              <li>
                <strong>Option A:</strong> Browse or search for a pre-configured condition and select one
              </li>
              <li>
                <strong>Option B:</strong> Click <strong>"Build Custom Condition"</strong> to create your own condition using the visual builder
              </li>
              <li>That row will now only show to recipients matching that condition</li>
              <li>Test it live: Click <strong>Actions</strong> (top left) → <strong>Preview</strong> to see how conditions affect the final email</li>
            </ol>
            <div className="advanced-feature">
              <h4>🔧 Advanced: Custom Condition Builder</h4>
              <p>
                This example demonstrates the <strong>Content Dialog</strong> feature for extending display conditions.
                Instead of being limited to pre-configured conditions, users can build custom conditions on-the-fly
                using a visual interface with dropdowns and form fields.
              </p>
            </div>
          </div>

          <div className="conditions-reference">
            <h3>📚 Pre-configured Conditions ({rowDisplayConditions.length} available)</h3>
            {Object.entries(conditionsByType).map(([type, conditions]) => (
              <div key={type} className="condition-category">
                <h4>{type}</h4>
                <div className="condition-list">
                  {conditions.map((condition, index) => (
                    <div key={index} className="condition-item">
                      <div className="condition-header">
                        <strong>{condition.label}</strong>
                      </div>
                      <p className="condition-description">{condition.description}</p>
                      <code className="condition-syntax">
                        {condition.before} ... {condition.after}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
