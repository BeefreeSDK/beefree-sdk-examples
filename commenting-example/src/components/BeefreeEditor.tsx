import { useEffect, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, BeePluginOnCommentPayload, BeePluginRoles } from '@beefree.io/sdk/dist/types/bee'
import { initializeBeefreeSDK } from '../services/beefree'
import { clientConfig } from '../config/clientConfig'
import { ToastProps } from './Toast'
import { PlanWarningModal } from './PlanWarningModal'

interface BeefreeEditorProps {
  onInstanceCreated: (instance: BeefreeSDK) => void
  onCommentEvent?: (toast: Omit<ToastProps, 'onClose'>) => void
}

export const BeefreeEditor = ({ onInstanceCreated, onCommentEvent }: BeefreeEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializationRef = useRef(false)
  const [showPlanWarning, setShowPlanWarning] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('')

  useEffect(() => {
    const initializeEditor = async () => {
      if (initializationRef.current) return
      initializationRef.current = true

      try {
        // Check for role in URL params
        const params = new URLSearchParams(window.location.search)
        const role = params.get('role') as BeePluginRoles.REVIEWER | undefined
        
        const config: IBeeConfig = {
          ...clientConfig,
          role: role,
          onError: (error) => {
            console.error('❌ Beefree SDK Error:', error)
            // Check for plan-related errors or feature restriction errors
            if (error.message?.toLowerCase().includes('plan') || error.message?.toLowerCase().includes('feature')) {
              // We might not have the plan name here, but we know it failed due to restriction
              setCurrentPlan('Current Plan')
              setShowPlanWarning(true)
            }
          },
          hooks: {
            getMentions: {
               handler: async (resolve, _, searchText) => {
                const mockUsers = [
                  { uid: '1', value: 'Alice', username: 'alice@example.com', userColor: '#FF6B6B' },
                  { uid: '2', value: 'Bob', username: 'bob@example.com', userColor: '#4ECDC4' },
                  { uid: '3', value: 'Charlie', username: 'charlie@example.com', userColor: '#45B7D1' },
                  { uid: '4', value: 'Diana', username: 'diana@example.com', userColor: '#FFA07A' },
                  { uid: '5', value: 'Eve', username: 'eve@example.com', userColor: '#98D8C8' }
                ]

                const filteredUsers = typeof searchText === 'string' ? mockUsers.filter(user => 
                  user.username.toLowerCase().includes(searchText.toLowerCase())
                ) : mockUsers

                resolve(filteredUsers)
               }
            }
          },
          onComment: (data: BeePluginOnCommentPayload) => {
            if (onCommentEvent) {
              const changeType = data.change?.type
              const payload = data.change?.payload
              
              if (!changeType || !payload) return
              
              // Determine toast type based on change type
              let toastType: ToastProps['type'] = 'new'
              let message = ''
              
              switch (changeType) {
                case 'NEW_COMMENT':
                  toastType = 'new'
                  message = 'added a new comment'
                  break
                case 'COMMENT_EDITED':
                  toastType = 'edited'
                  message = 'edited a comment'
                  break
                case 'COMMENT_DELETED':
                  toastType = 'deleted'
                  message = 'deleted a comment'
                  break
                case 'COMMENT_THREAD_RESOLVED':
                  toastType = 'resolved'
                  message = 'resolved a thread'
                  break
                case 'COMMENT_THREAD_REOPENED':
                  toastType = 'reopened'
                  message = 'reopened a thread'
                  break
                default:
                  return
              }
              
              // Get comment content - payload structure varies by change type
              let content = ''
              let author
              
              if ('comment' in payload) {
                // NEW_COMMENT or COMMENT_DELETED
                content = payload.comment.content || ''
                author = payload.comment.author
              } else if ('update' in payload) {
                // COMMENT_EDITED
                content = payload.update.content || ''
                author = data.comments?.[payload.commentId]?.author
              }
              
              onCommentEvent({
                type: toastType,
                message: message,
                author: author ? {
                  username: author.username,
                  userColor: author.userColor
                } : undefined,
                content: content,
                duration: 5000
              })
            }
          }
        }

        const instance = await initializeBeefreeSDK(config, (plan) => {
          setCurrentPlan(plan)
          setShowPlanWarning(true)
        })
        console.log('🚀 Beefree SDK demo application initialized')
        
        if (instance) {
          onInstanceCreated(instance)
        }
      } catch (error) {
        console.error('Failed to initialize Beefree SDK:', error)
        initializationRef.current = false
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeEditor, 100)
    return () => clearTimeout(timer)
  }, [onInstanceCreated, onCommentEvent])

  return (
    <div>
      <PlanWarningModal 
        isOpen={showPlanWarning} 
        onClose={() => setShowPlanWarning(false)} 
        plan={currentPlan}
      />
      <div id="loading-overlay" className="loading-overlay">
        <div className="spinner"></div>
        <span>Loading Beefree SDK...</span>
      </div>
      <div 
        id="bee-plugin-container" 
        ref={containerRef}
      ></div>
    </div>
  )
}
