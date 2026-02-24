import { useEffect, useState } from 'react'
import { BeefreeExample } from './BeefreeExample'

const UI_LANGUAGES = [
  'en-US', 'it-IT', 'es-ES', 'fr-FR', 'de-DE', 'pt-BR',
  'id-ID', 'ja-JP', 'zh-CN', 'zh-HK', 'cs-CZ', 'nb-NO',
  'da-DK', 'sv-SE', 'pl-PL', 'hu-HU', 'ru-RU', 'ko-KR',
  'nl-NL', 'fi-FI', 'ro-RO', 'sl-SI',
]

const REACT_LOGO_DATA_URI = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-11.5 -10.232 23 20.463'%3e%3ccircle r='2.05' fill='white'/%3e%3cg stroke='white' fill='none'%3e%3cellipse rx='11' ry='4.2'/%3e%3cellipse rx='11' ry='4.2' transform='rotate(60)'/%3e%3cellipse rx='11' ry='4.2' transform='rotate(120)'/%3e%3c/g%3e%3c/svg%3e"

export const App = () => {
  const [selectedBuilderType, setSelectedBuilderType] = useState('emailBuilder')
  const [selectedBuilderLanguage, setSelectedBuilderLanguage] = useState('en-US')
  const [showToast, setShowToast] = useState(false)
  const [toastExiting, setToastExiting] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setShowToast(true), 500))
    timers.push(setTimeout(() => setToastExiting(true), 5000))
    timers.push(setTimeout(() => {
      setShowToast(false)
      setToastExiting(false)
    }, 5400))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <main className="main">
      <header>
        <div className="left-side">
          <img src="/images/logo.svg" height="40" alt="Beefree SDK" />
        </div>
        <div className="right-side">
          <div className="header-controls">
            <div className="header-select-group">
              <label htmlFor="headerBuilderType">Builder:</label>
              <select
                id="headerBuilderType"
                value={selectedBuilderType}
                onChange={(e) => setSelectedBuilderType(e.target.value)}
              >
                <option value="emailBuilder">Email Builder</option>
                <option value="pageBuilder">Page Builder</option>
                <option value="popupBuilder">Popup Builder</option>
                <option value="fileManager">File Manager</option>
              </select>
            </div>
            <div className="header-select-group">
              <label htmlFor="headerLanguage">Language:</label>
              <select
                id="headerLanguage"
                value={selectedBuilderLanguage}
                onChange={(e) => setSelectedBuilderLanguage(e.target.value)}
              >
                {UI_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="react-brand">
            <img src={REACT_LOGO_DATA_URI} alt="React" />
            <span>React</span>
          </div>
        </div>
      </header>
      <div className="content">
        <BeefreeExample
          builderType={selectedBuilderType}
          builderLanguage={selectedBuilderLanguage}
        />
      </div>

      {showToast && (
        <div className={`toast${toastExiting ? ' toast-exit' : ''}`}>
          <h3>Congratulations!</h3>
          <p>Your React Beefree SDK app is up and running.</p>
        </div>
      )}
    </main>
  )
}
