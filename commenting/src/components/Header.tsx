import { ThemeSelector } from './ThemeSelector'
import type { ThemeType } from '../types'

interface HeaderProps {
  currentTheme: ThemeType
  changeTheme: (theme: ThemeType) => void
}

export const Header = ({ currentTheme, changeTheme }: HeaderProps) => {
  return (
    <div className="demo-header">
      <h1>🎨 Custom CSS Styling</h1>
      <p>Advanced Beefree SDK Interface Customization with React & TypeScript</p>
      <ThemeSelector 
        currentTheme={currentTheme}
        onThemeChange={changeTheme}
      />
    </div>
  )
}
