import { envs } from '../env'

export const AUTH_PROXY_URL = envs.AUTH_PROXY_URL
export const DEFAULT_TEMPLATE_URL = envs.TEMPLATE_URL
export const DEFAULT_UID = 'pdf-export-demo'
export const DEFAULT_CONTAINER = 'bee-plugin-container'

export const EXPORT_API_URL = '/api/export/pdf'

export const DEFAULT_EXPORT_OPTIONS = {
  pageSize: 'A4' as const,
  orientation: 'Portrait' as const,
  quality: 'High' as const,
  scale: 1
}

export const DEFAULT_CLIENT_CONFIG = {
  container: DEFAULT_CONTAINER,
  uid: DEFAULT_UID,
}
