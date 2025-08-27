import { Header } from './Header'
import { AuthForm } from './AuthForm'
import { BeefreeEditor } from './BeefreeEditor'
import { useAuth } from '../hooks/useAuth'
import '../styles.css'

export const App = () => {
  const auth = useAuth()

  return (
    <div className="container">
      <Header authState={auth} onLogout={auth.logout} />
      
      {!auth.isAuthenticated ? (
        <AuthForm 
          authState={auth} 
          onAuthenticate={auth.authenticate}
        />
      ) : (
        <BeefreeEditor authState={auth} />
      )}
    </div>
  )
}
