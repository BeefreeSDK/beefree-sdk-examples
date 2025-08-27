import { HeaderProps } from '../types'

export const Header = ({ authState, onLogout }: HeaderProps) => {
  return (
    <div className="header">
      <h1>🔐 Secure Authentication</h1>
      <p>Advanced Beefree SDK Authentication with React & TypeScript</p>
      
      {authState.isAuthenticated && (
        <div className="auth-status">
          <div className="auth-info">
            <span className="status-indicator">✅ Authenticated</span>
            <span className="uid-display">UID: {authState.uid}</span>
          </div>
          <button 
            className="logout-btn"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  )
}
