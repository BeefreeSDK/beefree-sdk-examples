import { useState } from 'react'
import { AuthFormProps } from '../types'

export const AuthForm = ({ authState, onAuthenticate }: AuthFormProps) => {
  const [uid, setUid] = useState('secure-auth-demo')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uid.trim()) {
      await onAuthenticate(uid.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any)
    }
  }

  return (
    <div className="controls">
      <div className="auth-section">
        <h2>🔑 Authentication Setup</h2>
        <p>Enter a unique identifier to authenticate with the Beefree SDK.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="uid">User Identifier (UID):</label>
            <input
              type="text"
              id="uid"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., user123, demo-user"
              disabled={authState.isAuthenticating}
            />
            <small>
              This identifier will be used to authenticate with the Beefree SDK.
            </small>
          </div>

          <button
            type="submit"
            id="authenticate-btn"
            disabled={authState.isAuthenticating || !uid.trim()}
          >
            {authState.isAuthenticating ? (
              <>
                <span className="spinner"></span>
                Authenticating...
              </>
            ) : (
              <>🚀 Authenticate & Load Editor</>
            )}
          </button>
        </form>

        {authState.error && (
          <div className="error-message">
            ❌ {authState.error}
          </div>
        )}

        <div className="info-section">
          <h3>ℹ️ How it works</h3>
          <ul>
            <li><strong>Secure Token:</strong> Backend generates JWT tokens</li>
            <li><strong>Frontend Safety:</strong> No credentials exposed in browser</li>
            <li><strong>Auto Refresh:</strong> Tokens refreshed automatically</li>
            <li><strong>Production Ready:</strong> Implements security best practices</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
