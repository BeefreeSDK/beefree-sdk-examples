// Backend server configuration
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '8083'
const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || 'localhost'

export const API_AUTH_URL = `http://${BACKEND_HOST}:8081`
export const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`
export const WS_URL = `ws://${BACKEND_HOST}:${BACKEND_PORT}`
export const AUTH_URL = `${BACKEND_URL}/auth/token`

export const AUTHORIZE_URL = `${API_AUTH_URL}/auth/token`

// Beefree SDK configuration
export const DEFAULT_UID = 'ai-agent-demo-user'
export const DEFAULT_CONTAINER = 'bee-plugin-container'
export const DEFAULT_SESSION_ID = 'ai-agent-session-001'

export const DEFAULT_CLIENT_CONFIG = {
  container: DEFAULT_CONTAINER,
  uid: DEFAULT_UID,
  mcpEditorClient: {
    enabled: true,
    sessionId: DEFAULT_SESSION_ID
  }
}

// Example prompts for quick testing
export const EXAMPLE_PROMPTS = [
  {
    id: 'welcome-email',
    title: 'Create welcome email',
    prompt: 'Create a welcome email with a hero section, company introduction, and sign-up CTA'
  },
  {
    id: 'newsletter',
    title: 'Build newsletter layout',
    prompt: 'Build a newsletter layout with header, featured article, and 3-column content grid'
  },
  {
    id: 'promotional',
    title: 'Design promotional campaign',
    prompt: 'Design a promotional email with product showcase, discount code, and urgency messaging'
  },
  {
    id: 'product-launch',
    title: 'Try product launch template →',
    prompt: 'Create a professional product launch email for our new AI-powered design tool. Include a hero section with the product image, feature highlights in a 3-column layout, customer testimonials, pricing tiers, and a strong CTA. Use #2563EB as primary color and #1E293B for text. Add social proof badges and ensure mobile optimization.'
  }
]