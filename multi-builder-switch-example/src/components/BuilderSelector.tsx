import React from 'react'
import { BuilderSelectorProps } from '../types'

export const BuilderSelector: React.FC<BuilderSelectorProps> = ({
  currentBuilder,
  onBuilderChange,
  disabled = false,
  availableBuilders
}) => {
  return (
    <div className="builder-selector">
      <label className="builder-selector-label">
        Choose Builder Type:
      </label>
      <div className="builder-buttons">
        {availableBuilders.map((builder) => (
          <button
            key={builder.type}
            onClick={() => onBuilderChange(builder.type)}
            disabled={disabled}
            className={`builder-button ${
              currentBuilder === builder.type ? 'active' : ''
            } ${disabled ? 'disabled' : ''}`}
            title={builder.description}
          >
            <span className="builder-icon" role="img" aria-label={builder.label}>
              {builder.icon}
            </span>
            <span className="builder-label">{builder.label}</span>
          </button>
        ))}
      </div>
      {disabled && (
        <div className="builder-selector-status">
          <span className="loading-indicator">⏳</span>
          Switching builders...
        </div>
      )}
    </div>
  )
}
