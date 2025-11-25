import BeefreeSDK from '@beefree.io/sdk'
import { BeefreeEditor } from './BeefreeEditor'
import { ChatPanel } from './ChatPanel'
import { useState } from 'react'
import '../styles.css'

export const App = () => {
  const [, setBeefreeEditorInstance] = useState<BeefreeSDK | null>(null)

  const handleBeefreeInstanceCreated = (instance: BeefreeSDK) => {
    setBeefreeEditorInstance(instance)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 AI Email Designer</h1>
        </div>
      </header>
      
      <div className="main-content">
        <div className="editor-panel">
          <BeefreeEditor onInstanceCreated={handleBeefreeInstanceCreated} />
        </div>
        
        <ChatPanel />
      </div>
    </div>
  )
}
