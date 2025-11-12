import { Header } from './Header'
import BeefreeSDK from '@beefree.io/sdk'
import { BeefreeEditor } from './BeefreeEditor'
import { Footer } from './Footer'
import { ToastContainer } from './ToastContainer'
import { useToast } from '../hooks/useToast'
import '../styles.css'
import { useState } from 'react'

export const App = () => {
  const [beefreeEditorInstance, setbeefreeEditorInstance] = useState<BeefreeSDK | null>(null)
  const { toasts, addToast, removeToast } = useToast()

  const handleBeefreeInstanceCreated = (instance: BeefreeSDK) => {
    setbeefreeEditorInstance(instance)
  }

  const handleToggleComments = () => {
    if(beefreeEditorInstance) {
      beefreeEditorInstance.toggleComments()
    }
  }

  const handleShowComment = (commentId: string) => {
    if(beefreeEditorInstance) {
      // Show a toast notification about the feature
      addToast({
        type: 'new',
        message: 'Navigating to comment...',
        content: `Comment ID: ${commentId} (Demo feature - create real comments to test this!)`,
        duration: 4000
      })
      
      // In a real implementation, you would call:
      // beefreeEditorInstance.showComment(commentId)
      console.log('Show comment:', commentId)
    }
  }

  return (
    <>
      <div className="demo-container beefree-container">
        <Header 
          onToggleComments={handleToggleComments}
          onShowComment={handleShowComment}
          beefreeInstance={beefreeEditorInstance}
        />
        <BeefreeEditor 
          onInstanceCreated={handleBeefreeInstanceCreated}
          onCommentEvent={addToast}
        />
        <Footer />
      </div>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  )
}
