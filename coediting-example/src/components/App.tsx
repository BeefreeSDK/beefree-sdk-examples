import { useState } from 'react'
import { Header } from './Header'
import { BeefreeEditor } from './BeefreeEditor'
import { CoEditingForm } from './CoEditingForm'
import { ApiMonitorPanel } from './ApiMonitorPanel'
import { useAuth } from '../hooks/useAuth'
import { useApiMonitor } from '../hooks/useApiMonitor'
import '../styles.css'

export const App = () => {
  const apiMonitor = useApiMonitor()
  const auth = useAuth(apiMonitor.monitoredFetch)
  const [coEditingConfig, setCoEditingConfig] = useState<{
    username: string
    userColor: string
    sessionId?: string
  } | undefined>(undefined)

  const handleStartCoEditing = async (username: string, userColor: string, sessionId?: string) => {
    setCoEditingConfig({ username, userColor, sessionId })
    const uid = `coedit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    await auth.authenticate(uid)
  }

  const handleBackToSetup = () => {
    setCoEditingConfig(undefined)
    auth.logout()
  }

  return (
    <div className="container">
      <Header authState={auth} onLogout={auth.logout} />

      <div className="main-layout">
        <div className="content-area">
          {!auth.isAuthenticated ? (
            <CoEditingForm
              onStartCoEditing={handleStartCoEditing}
              isLoading={auth.isAuthenticating}
            />
          ) : (
            <BeefreeEditor
              authState={auth}
              monitoredFetch={apiMonitor.monitoredFetch}
              coEditingConfig={coEditingConfig}
              onBackToAuth={handleBackToSetup}
            />
          )}
        </div>

        <div className="api-monitor-area">
          <ApiMonitorPanel
            apiCalls={apiMonitor.apiCalls}
            onClearHistory={apiMonitor.clearHistory}
          />
        </div>
      </div>
    </div>
  )
}
