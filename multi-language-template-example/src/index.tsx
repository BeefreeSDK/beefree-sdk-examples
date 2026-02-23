import { createRoot } from 'react-dom/client'
import { App } from './components/App'
import './styles.css'

// StrictMode is intentionally omitted: in development it double-mounts
// components, which triggers a race condition inside the SDK wrapper
// ("Bee is not started") because useBuilder's internal effects fire
// before the <Builder> component has initialised the SDK instance.
export function bootstrap(rootElement: HTMLElement | null): void {
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  const root = createRoot(rootElement)
  root.render(<App />)
}

if (import.meta.env.MODE !== 'test') {
  bootstrap(document.getElementById('root'))
}
