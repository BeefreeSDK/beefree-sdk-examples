/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BEEFREE_AUTH_PROXY_URL?: string
  readonly VITE_BEEFREE_TEMPLATE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
