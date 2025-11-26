import { Header } from './Header'
import BeefreeSDK from '@beefree.io/sdk'
import { BeefreeEditor } from './BeefreeEditor'
import { Footer } from './Footer'
import '../styles.css'

export const App = () => {
  const handleBeefreeInstanceCreated = (_: BeefreeSDK) => {
    // BeefreeEditor instance is not used in this component. If needed in future, handle it with an internal state
  }


  return (
    <>
      <div className="demo-container beefree-container">
        <Header />
        <BeefreeEditor 
          onInstanceCreated={handleBeefreeInstanceCreated}
        />
        <Footer />
      </div>
    </>
  )
}
