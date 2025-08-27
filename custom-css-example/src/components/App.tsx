import { Header } from './Header'
import { BeefreeEditor } from './BeefreeEditor'
import { Footer } from './Footer'
import { useThemeManager } from '../hooks/useThemeManager'
import '../styles.css'

export const App = () => {
  const { currentTheme, changeTheme, getThemeUrl } = useThemeManager()

  return (
    <div className="demo-container beefree-container">
      <Header currentTheme={currentTheme} changeTheme={changeTheme} />
      <BeefreeEditor customCss={currentTheme ? getThemeUrl() : undefined} />
      <Footer />
    </div>
  )
}
