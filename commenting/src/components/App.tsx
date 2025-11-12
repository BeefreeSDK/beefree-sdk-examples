import { Header } from './Header'
import BeefreeSDK from '@beefree.io/sdk'
import { BeefreeEditor } from './BeefreeEditor'
import { Footer } from './Footer'
import '../styles.css'
import { useState } from 'react'

export const App = () => {

  const [beefreeEditorInstance, setbeefreeEditorInstance] = useState<BeefreeSDK | null>(null);

  const handleBeefreeInstanceCreated = (instance: BeefreeSDK) => {
    setbeefreeEditorInstance(instance);

    
  }

  const handleToggleComments = () => {
    if(beefreeEditorInstance) {
      beefreeEditorInstance.toggleComments();
    }
  }

  return (
    <div className="demo-container beefree-container">
      <Header onToggleComments={handleToggleComments} />
      <BeefreeEditor onInstanceCreated={handleBeefreeInstanceCreated} />
      <Footer />
    </div>
  )
}
