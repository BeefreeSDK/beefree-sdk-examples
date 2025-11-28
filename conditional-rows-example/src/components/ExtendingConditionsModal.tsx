interface ExtendingConditionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ExtendingConditionsModal = ({ isOpen, onClose }: ExtendingConditionsModalProps) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>🔧 Extending Display Conditions Guide</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="extending-intro">
            <h3>📖 What is "Extending Display Conditions"?</h3>
            <p>
              The <strong>Content Dialog</strong> feature allows you to extend Beefree SDK's display conditions
              by providing a custom UI for users to build conditions on-the-fly. Instead of being limited to
              pre-configured conditions, users can create their own using your custom interface.
            </p>
          </div>

          <div className="extending-section">
            <h3>🎯 How to Use the Custom Condition Builder</h3>
            <ol className="extending-steps">
              <li>
                <strong>Select a Row</strong>
                <p>Click on any row in the email editor to select it</p>
              </li>
              <li>
                <strong>Open Display Conditions</strong>
                <p>Click the row settings (gear icon) and go to the "Display Conditions" tab</p>
              </li>
              <li>
                <strong>Choose Your Option</strong>
                <p>You'll see two ways to add conditions:</p>
                <ul>
                  <li><strong>Browse & Select:</strong> Choose from 14 pre-configured conditions</li>
                  <li><strong>Build Custom:</strong> Click "Build Custom Condition" button to open the visual builder</li>
                </ul>
              </li>
              <li>
                <strong>Build Your Condition</strong>
                <p>In the custom builder:</p>
                <ul>
                  <li>Enter a name and description for your condition</li>
                  <li>Select a field (e.g., "Customer Tier", "Customer Region")</li>
                  <li>Choose an operator (equals, greater than, etc.)</li>
                  <li>Enter a value to compare against</li>
                  <li>Add multiple rules with AND logic if needed</li>
                  <li>Preview the generated Liquid syntax in real-time</li>
                </ul>
              </li>
              <li>
                <strong>Apply & Test</strong>
                <p>Click "Apply Condition" to add it to your row, then test using Preview mode</p>
              </li>
            </ol>
          </div>

          <div className="extending-section">
            <h3>💡 Example Use Cases</h3>
            <div className="use-cases">
              <div className="use-case-card">
                <h4>🎁 VIP Customer Promotions</h4>
                <p>Show exclusive offers only to customers with lifetime value over $5000</p>
                <code>customer.lifetimeValue {'>'} 5000</code>
              </div>
              <div className="use-case-card">
                <h4>🌍 Regional Content</h4>
                <p>Display location-specific content based on customer region</p>
                <code>customer.region == "north_america"</code>
              </div>
              <div className="use-case-card">
                <h4>🛒 Cart Recovery</h4>
                <p>Target customers who have items in cart but haven't purchased recently</p>
                <code>customer.hasCartItems and customer.lastPurchaseDays {'>'} 30</code>
              </div>
              <div className="use-case-card">
                <h4>📧 Re-engagement</h4>
                <p>Show special content to inactive subscribers</p>
                <code>subscriber.lastOpenDays {'>'} 90</code>
              </div>
            </div>
          </div>

          <div className="extending-section">
            <h3>🛠️ Technical Details</h3>
            <div className="tech-details">
              <h4>Content Dialog Configuration</h4>
              <p>This example implements the <code>contentDialog.rowDisplayConditions</code> handler:</p>
              <pre className="code-block">
{`contentDialog: {
  rowDisplayConditions: {
    label: 'Build Custom Condition',
    handler: (resolve, reject, currentCondition) => {
      // Opens custom modal
      // Returns built condition via resolve()
      // Cancels via reject()
    }
  }
}`}
              </pre>

              <h4>Returned Condition Format</h4>
              <p>The builder returns a condition object:</p>
              <pre className="code-block">
{`{
  type: 'BEE_CUSTOM_DISPLAY_CONDITION',
  label: 'Custom Condition Name',
  description: 'What the condition does',
  before: '{% if customer.tier == "premium" %}',
  after: '{% endif %}'
}`}
              </pre>
            </div>
          </div>

          <div className="extending-section">
            <h3>📚 Learn More</h3>
            <p>
              For complete documentation on extending display conditions with Content Dialog, visit:
            </p>
            <a
              href="https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/content-dialog"
              target="_blank"
              rel="noopener noreferrer"
              className="docs-link-button"
            >
              📖 Content Dialog Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
