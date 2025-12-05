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
  onSave: (json: any, html: string) => {
    console.log('💾 Content saved!', { json, html: html.substring(0, 50) + '...' })
  },
  onChange: (json: any, response: any) => {
    // Form changes trigger this
    console.log('📝 Content changed', { response })
  },
  onError: (errorMessage: string) => {
    console.error('❌ Editor error:', errorMessage)
  }
}

// Get all available builders as array
export const AVAILABLE_BUILDERS = Object.values(BUILDER_CONFIGS)

// Default form configuration for Page Builder
// This enables the Form block in the Page Builder sidebar
// See: https://docs.beefree.io/beefree-sdk/forms/integrating-and-using-the-form-block/passing-forms-to-the-builder
export const DEFAULT_FORM_CONFIG = {
  structure: {
    title: "Auto Loan Pre-Approval",
    description: "Check if you're pre-approved for an auto loan with Modern Bank.",
    fields: {
      full_name: {
        type: "text",
        label: "Full Name *",
        canBeRemovedFromLayout: true,
        removeFromLayout: false,
        canBeModified: true,
        attributes: {
          required: true,
          placeholder: "Enter your full name",
        },
      },
      email: {
        type: "email",
        label: "Email *",
        canBeRemovedFromLayout: false,
        removeFromLayout: false,
        canBeModified: true,
        attributes: {
          required: true,
          placeholder: "Enter your email",
        },
      },
      message: {
        type: "textarea",
        label: "Your message",
        canBeRemovedFromLayout: true,
        removeFromLayout: false,
        canBeModified: true,
        attributes: {
          rows: 4,
          placeholder: "Enter your message",
        },
      },
      submit_button: {
        type: "submit",
        label: "",
        canBeRemovedFromLayout: false,
        removeFromLayout: false,
        attributes: {
          value: "SUBMIT",
          name: "submit_button",
        },
      },
    },
    layout: [
      ["full_name"],
      ["email"],
      ["message"],
      ["submit_button"],
    ],
    attributes: {
      "accept-charset": "UTF-8",
      action: "http://example.com/read-form",
      autocomplete: "on",
      enctype: "multipart/form-data",
      method: "post",
      novalidate: false,
      target: "_self",
    },
  }
}
