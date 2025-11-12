import { useState, useEffect } from 'react'
import BeefreeSDK from '@beefree.io/sdk'

interface HeaderProps {
  onToggleComments: () => void
  onShowComment: (commentId: string) => void
  beefreeInstance: BeefreeSDK | null
}

export const Header = ({ onToggleComments, onShowComment, beefreeInstance }: HeaderProps) => {
  const [isReviewerMode, setIsReviewerMode] = useState(false)

  useEffect(() => {
    // Check URL params for role on mount
    const params = new URLSearchParams(window.location.search)
    const role = params.get('role')
    setIsReviewerMode(role === 'reviewer')
  }, [])

  const handleToggleReviewerMode = () => {
    // Toggle reviewer mode by reloading with different role
    const newRole = isReviewerMode ? 'editor' : 'reviewer'
    const url = new URL(window.location.href)
    url.searchParams.set('role', newRole)
    window.location.href = url.toString()
  }

  const handleShowMockedComment = () => {
    // Mock comment ID - in a real scenario, this would be a real comment from your system
    const mockCommentId = 'demo-comment-123'
    onShowComment(mockCommentId)
  }

  return (
    <div className="demo-header">
      <div className="header-content">
        {/* Title Section */}
        <div className="header-title">
          <h1>💬 Beefree SDK Commenting Demo</h1>
          <p className="header-subtitle">
            Explore real-time collaboration features for email, page, and popup design
          </p>
        </div>

        {/* Action Buttons Section */}
        <div className="header-actions">
          <div className="action-group">
            <span className="action-label">Demo Actions:</span>
            
            <button 
              className="action-button action-primary"
              onClick={onToggleComments}
              title="Toggle the comments panel on/off"
            >
              <span className="button-icon">💬</span>
              <span className="button-text">Toggle Comments</span>
            </button>

            <button 
              className="action-button action-secondary"
              onClick={handleShowMockedComment}
              title="Navigate to a specific comment (demo)"
              disabled={!beefreeInstance}
            >
              <span className="button-icon">🔍</span>
              <span className="button-text">Show Comment</span>
            </button>

            <button 
              className={`action-button ${isReviewerMode ? 'action-warning' : 'action-info'}`}
              onClick={handleToggleReviewerMode}
              title="Switch between Editor and Reviewer roles"
            >
              <span className="button-icon">{isReviewerMode ? '✏️' : '👁️'}</span>
              <span className="button-text">
                {isReviewerMode ? 'Switch to Editor' : 'Enable Reviewer Mode'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="header-info">
        <div className="info-item">
          <span className="info-icon">💬</span>
          <span className="info-text"><strong>Toggle Comments:</strong> Open/close the comments panel</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🔍</span>
          <span className="info-text"><strong>Show Comment:</strong> Jump to specific comment (demo navigation)</span>
        </div>
        <div className="info-item">
          <span className="info-icon">👁️</span>
          <span className="info-text"><strong>Reviewer Mode:</strong> Comment-only access (no design edits)</span>
        </div>
      </div>
    </div>
  )
}
