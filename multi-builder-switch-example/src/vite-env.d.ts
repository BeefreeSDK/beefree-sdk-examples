/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BEEFREE_AUTH_PROXY_URL: string
  readonly VITE_EMAIL_TEMPLATE_URL: string
  readonly VITE_PAGE_TEMPLATE_URL: string
  readonly VITE_POPUP_TEMPLATE_URL: string
  readonly VITE_DEFAULT_BUILDER: string
  readonly VITE_EMAIL_CLIENT_ID: string
  readonly VITE_EMAIL_CLIENT_SECRET: string
  readonly VITE_PAGE_CLIENT_ID: string
  readonly VITE_PAGE_CLIENT_SECRET: string
  readonly VITE_POPUP_CLIENT_ID: string
  readonly VITE_POPUP_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
