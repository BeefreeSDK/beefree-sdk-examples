import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './styles.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// StrictMode is intentionally omitted: in development it double-mounts
// components, which triggers a race condition inside the SDK wrapper
// ("Bee is not started") because useBuilder's internal effects fire
// before the <Builder> component has initialised the SDK instance.
const root = ReactDOM.createRoot(rootElement)
root.render(<App />)
