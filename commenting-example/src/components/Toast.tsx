import { useEffect } from 'react'

export interface ToastProps {
  message: string
  type: 'new' | 'edited' | 'deleted' | 'resolved' | 'reopened'
  author?: {
    username: string
    userColor: string
  }
  content?: string
  onClose: () => void
  duration?: number
}

export const Toast = ({ message, type, author, content, onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const getIcon = () => {
    switch (type) {
      case 'new':
        return '💬'
      case 'edited':
        return '✏️'
      case 'deleted':
        return '🗑️'
      case 'resolved':
        return '✅'
      case 'reopened':
        return '🔄'
      default:
        return '💬'
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'new':
        return 'New Comment'
      case 'edited':
        return 'Comment Edited'
      case 'deleted':
        return 'Comment Deleted'
      case 'resolved':
        return 'Thread Resolved'
      case 'reopened':
        return 'Thread Reopened'
      default:
        return 'Comment'
    }
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-header">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-type">{getTypeLabel()}</span>
        <button className="toast-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className="toast-body">
        {author && (
          <div className="toast-author">
            <span 
              className="toast-author-indicator" 
              style={{ backgroundColor: author.userColor }}
            />
            <span className="toast-author-name">{author.username}</span>
          </div>
        )}
        {message && <p className="toast-message">{message}</p>}
        {content && (
          <div className="toast-content">
            <p>"{content}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
