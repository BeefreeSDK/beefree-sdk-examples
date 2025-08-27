import React from 'react'
import type { ThemeType } from '../types'

interface ThemeSelectorProps {
  currentTheme: ThemeType
  onThemeChange: (theme: ThemeType) => void
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onThemeChange(event.target.value as ThemeType)
  }

  return (
    <div className="control-group">
      <label htmlFor="theme-selector">🌈 Theme:</label>
      <select
        id="theme-selector"
        value={currentTheme}
        onChange={handleChange}
      >
        <option value="">Select a theme...</option>
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="high-contrast">High Contrast</option>
        <option value="coral">Coral</option>
      </select>
    </div>
  )
}
