import { BuilderConfig, BuilderType } from '../types'

// Authentication configuration
export const AUTH_PROXY_URL = import.meta.env.VITE_BEEFREE_AUTH_PROXY_URL || 'http://localhost:3006/auth/token'

// Default values
export const DEFAULT_UID = 'multi-builder-demo'
export const DEFAULT_CONTAINER = 'bee-plugin-container'
export const DEFAULT_BUILDER: BuilderType = (import.meta.env.VITE_DEFAULT_BUILDER as BuilderType) || 'email'

// Builder configurations
export const BUILDER_CONFIGS: Record<BuilderType, BuilderConfig> = {
  email: {
    type: 'email',
    label: 'Email Builder',
    icon: '📧',
    templateUrl: import.meta.env.VITE_EMAIL_TEMPLATE_URL || 'https://rsrc.getbee.io/api/templates/m-bee',
    clientId: import.meta.env.VITE_EMAIL_CLIENT_ID,
    clientSecret: import.meta.env.VITE_EMAIL_CLIENT_SECRET,
    description: 'Create responsive email campaigns with drag-and-drop simplicity'
  },
  page: {
    type: 'page',
    label: 'Page Builder',
    icon: '📄',
    templateUrl: import.meta.env.VITE_PAGE_TEMPLATE_URL || 'https://rsrc.getbee.io/api/templates/m-bee-page',
    clientId: import.meta.env.VITE_PAGE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_PAGE_CLIENT_SECRET,
    description: 'Design stunning landing pages and web content'
  },
  popup: {
    type: 'popup',
    label: 'Popup Builder',
    icon: '🎯',
    templateUrl: import.meta.env.VITE_POPUP_TEMPLATE_URL || 'https://rsrc.getbee.io/api/templates/m-bee-popup',
    clientId: import.meta.env.VITE_POPUP_CLIENT_ID,
    clientSecret: import.meta.env.VITE_POPUP_CLIENT_SECRET,
    description: 'Build engaging popups and overlay content'
  }
}

// Beefree SDK base configuration
export const BASE_BEEFREE_CONFIG = {
  container: DEFAULT_CONTAINER,
  uid: DEFAULT_UID,
}

// Get all available builders as array
export const AVAILABLE_BUILDERS = Object.values(BUILDER_CONFIGS)
