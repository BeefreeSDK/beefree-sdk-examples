import { Header } from './Header'
import { AuthForm } from './AuthForm'
import { BeefreeEditor } from './BeefreeEditor'
import { ApiMonitorPanel } from './ApiMonitorPanel'
import { useAuth } from '../hooks/useAuth'
import { useApiMonitor } from '../hooks/useApiMonitor'
import '../styles.css'

export const App = () => {
  const apiMonitor = useApiMonitor()
  const auth = useAuth(apiMonitor.monitoredFetch)

  return (
    <div className="container">
      <Header authState={auth} onLogout={auth.logout} />
      
      <div className="main-layout">
        <div className="content-area">
          {!auth.isAuthenticated ? (
            <AuthForm 
              authState={auth} 
              onAuthenticate={auth.authenticate}
            />
          ) : (
            <BeefreeEditor 
              authState={auth} 
              monitoredFetch={apiMonitor.monitoredFetch}
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
