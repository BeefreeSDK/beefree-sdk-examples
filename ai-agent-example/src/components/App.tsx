import BeefreeSDK from '@beefree.io/sdk'
import { BeefreeEditor } from './BeefreeEditor'
import { ChatPanel } from './ChatPanel'
import { Footer } from './Footer'
import { useState } from 'react'
import '../styles.css'
import Header from './Header'

export const App = () => {
  const [, setBeefreeEditorInstance] = useState<BeefreeSDK | null>(null)

  const handleBeefreeInstanceCreated = (instance: BeefreeSDK) => {
    setBeefreeEditorInstance(instance)
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <div className="editor-panel">
          <BeefreeEditor onInstanceCreated={handleBeefreeInstanceCreated} />
        </div>
        <ChatPanel />
      </div>
      <Footer />
    </div>
  )
}
