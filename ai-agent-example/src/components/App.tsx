import BeefreeSDK from '@beefree.io/sdk'
import { BeefreeEditor } from './BeefreeEditor'
import { ChatPanel } from './ChatPanel'
import { Footer } from './Footer'
import '../styles.css'
import Header from './Header'

export const App = () => {

  const handleBeefreeInstanceCreated = (_: BeefreeSDK) => {
    //BeefreeEditor instance is not used in this component. If needed in future, handle it with an internal state')
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
