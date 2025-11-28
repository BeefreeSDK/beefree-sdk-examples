import { IPluginDisplayCondition } from '@beefree.io/sdk/dist/types/bee'
import { useState, useEffect } from 'react'

interface ConditionBuilderModalProps {
  isOpen: boolean
    onConfirm: (condition: IPluginDisplayCondition) => void
  onCancel: () => void
  currentCondition?: {
    type: string
    label: string
    description: string
    before: string
    after: string
  } | null
}

interface ConditionRule {
  field: string
  operator: string
  value: string
}

export const ConditionBuilderModal = ({
  isOpen,
  onConfirm,
  onCancel,
  currentCondition,
}: ConditionBuilderModalProps) => {
  const [conditionName, setConditionName] = useState('')
  const [conditionDescription, setConditionDescription] = useState('')
  const [rules, setRules] = useState<ConditionRule[]>([
    { field: 'customer.tier', operator: '==', value: 'premium' },
  ])
  const [syntaxPreview, setSyntaxPreview] = useState('')

  // Available fields for condition building
  const availableFields = [
    { value: 'customer.tier', label: 'Customer Tier' },
    { value: 'customer.region', label: 'Customer Region' },
    { value: 'customer.lastPurchaseDays', label: 'Days Since Last Purchase' },
    { value: 'customer.lifetimeValue', label: 'Lifetime Value' },
    { value: 'customer.hasCartItems', label: 'Has Cart Items' },
    { value: 'subscriber.lastOpenDays', label: 'Days Since Last Email Open' },
    { value: 'lastOrder.catalog', label: 'Last Order Catalog' },
    { value: 'customer.language', label: 'Customer Language' },
  ]

  const operators = [
    { value: '==', label: 'equals' },
    { value: '!=', label: 'not equals' },
    { value: '>', label: 'greater than' },
    { value: '<', label: 'less than' },
    { value: '>=', label: 'greater than or equal' },
    { value: '<=', label: 'less than or equal' },
  ]

  // Update syntax preview whenever rules change
  useEffect(() => {
    const conditions = rules
      .map((rule) => {
        // Quote string values (non-numeric)
        const formattedValue = isNaN(Number(rule.value)) ? `"${rule.value}"` : rule.value
        return `${rule.field} ${rule.operator} ${formattedValue}`
      })
      .join(' and ')

    const syntax = `{% if ${conditions} %}`
    setSyntaxPreview(syntax)
  }, [rules])

  // Load current condition if editing
  useEffect(() => {
    if (currentCondition) {
      setConditionName(currentCondition.label || '')
      setConditionDescription(currentCondition.description || '')
      // Try to parse the condition syntax (basic parsing)
      // This is a simplified version - in production you'd have more robust parsing
    }
  }, [currentCondition])

  const addRule = () => {
    setRules([...rules, { field: 'customer.tier', operator: '==', value: '' }])
  }

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  const updateRule = (index: number, field: keyof ConditionRule, value: string) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], [field]: value }
    setRules(newRules)
  }

  const handleConfirm = () => {
    const conditions = rules
      .map((rule) => {
        const formattedValue = isNaN(Number(rule.value)) ? `"${rule.value}"` : rule.value
        return `${rule.field} ${rule.operator} ${formattedValue}`
      })
      .join(' and ')

    onConfirm({
      type: 'BEE_CUSTOM_DISPLAY_CONDITION',
      label: conditionName || 'Custom Condition',
      description: conditionDescription || 'Custom built condition',
      before: `{% if ${conditions} %}`,
      after: '{% endif %}',
      isActive: true,
    })
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="condition-builder-modal">
        <div className="builder-header">
          <h2>🔧 Build Display Condition</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="builder-body">
          <div className="builder-section">
            <h3>Condition Details</h3>
            <div className="form-group">
              <label htmlFor="condition-name">Condition Name *</label>
              <input
                id="condition-name"
                type="text"
                value={conditionName}
                onChange={(e) => setConditionName(e.target.value)}
                placeholder="e.g., Premium VIP Customers"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="condition-description">Description</label>
              <textarea
                id="condition-description"
                value={conditionDescription}
                onChange={(e) => setConditionDescription(e.target.value)}
                placeholder="Describe when this condition should apply..."
                className="form-textarea"
                rows={2}
              />
            </div>
          </div>

          <div className="builder-section">
            <h3>Condition Rules</h3>
            <p className="section-hint">
              Define the rules that determine when this row should be displayed
            </p>

            {rules.map((rule, index) => (
              <div key={index} className="rule-row">
                <select
                  value={rule.field}
                  onChange={(e) => updateRule(index, 'field', e.target.value)}
                  className="rule-select"
                >
                  {availableFields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>

                <select
                  value={rule.operator}
                  onChange={(e) => updateRule(index, 'operator', e.target.value)}
                  className="rule-select rule-operator"
                >
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => updateRule(index, 'value', e.target.value)}
                  placeholder="value"
                  className="rule-input"
                />

                {rules.length > 1 && (
                  <button
                    onClick={() => removeRule(index)}
                    className="rule-remove"
                    aria-label="Remove rule"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button onClick={addRule} className="add-rule-btn">
              + Add Another Rule (AND)
            </button>
          </div>

          <div className="builder-section preview-section">
            <h3>Syntax Preview</h3>
            <div className="syntax-preview">
              <code>{syntaxPreview}</code>
              <div className="syntax-closing">
                <code>... row content ...</code>
              </div>
              <code>{'{% endif %}'}</code>
            </div>
            <p className="preview-note">
              This Liquid syntax will be added before and after the selected row
            </p>
          </div>
        </div>

        <div className="builder-footer">
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="btn-confirm"
            disabled={!conditionName.trim() || rules.some((r) => !r.value)}
          >
            Apply Condition
          </button>
        </div>
      </div>
    </div>
  )
}
