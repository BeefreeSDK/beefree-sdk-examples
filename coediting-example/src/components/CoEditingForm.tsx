import { useState } from 'react'

interface CoEditingFormProps {
  onStartCoEditing: (username: string, userColor: string, sessionId?: string) => void
  isLoading?: boolean
}

export const CoEditingForm = ({ onStartCoEditing, isLoading = false }: CoEditingFormProps) => {
  const [sessionId, setSessionId] = useState('')
  const [username, setUsername] = useState('Demo User')
  const [userColor, setUserColor] = useState('#FF6B6B')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onStartCoEditing(
        username.trim(),
        userColor,
        sessionId.trim() || undefined
      )
    }
  }

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]

  return (
    <div className="coedit-form">
      <div className="form-header">
        <h2>🤝 Start Co-editing Session</h2>
        <p>Create a new session or join an existing one using a session ID</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="sessionId">Session ID (Optional):</label>
          <input
            type="text"
            id="sessionId"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Enter existing session ID to join"
            disabled={isLoading}
          />
          <small>Leave empty to create a new session, or enter a session ID from someone else to join</small>
        </div>

        <div className="form-group">
          <label htmlFor="username">Your Name:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your display name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="userColor">Your Color:</label>
          <div className="color-picker">
            <input
              type="color"
              id="userColor"
              value={userColor}
              onChange={(e) => setUserColor(e.target.value)}
              disabled={isLoading}
            />
            <div className="color-presets">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-preset ${userColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setUserColor(color)}
                  disabled={isLoading}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={isLoading || !username.trim()}
        >
          {isLoading ? '🔄 Starting Session...' : sessionId.trim() ? '🔗 Join Session' : '🚀 Create New Session'}
        </button>
      </form>

      <div className="info-section">
        <h3>How it works:</h3>
        <ul>
          <li>🆕 <strong>Create new session:</strong> Leave Session ID empty to start a new collaborative session</li>
          <li>🔗 <strong>Join existing session:</strong> Enter a Session ID shared by someone else to join their session</li>
          <li>📋 <strong>Share session:</strong> Once in a session, share the Session ID with others to collaborate</li>
          <li>👥 <strong>Live collaboration:</strong> See changes from other users in real-time</li>
          <li>🎨 <strong>User identification:</strong> Your cursor and changes are shown in your chosen color</li>
        </ul>
      </div>
    </div>
  )
}