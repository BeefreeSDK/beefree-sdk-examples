export const AUTH_PROXY_URL = import.meta.env.VITE_BEEFREE_AUTH_PROXY_URL || '/auth/token'

export const TEMPLATE_URLS: Record<string, string> = {
  emailBuilder: import.meta.env.VITE_EMAIL_TEMPLATE_URL || 'https://rsrc.getbee.io/api/templates/m-bee',
  pageBuilder: import.meta.env.VITE_PAGE_TEMPLATE_URL || 'https://raw.githubusercontent.com/BeefreeSDK/beefree-sdk-assets-templates/main/v3/bee-templates/blank.json',
  popupBuilder: import.meta.env.VITE_POPUP_TEMPLATE_URL || 'https://raw.githubusercontent.com/BeefreeSDK/beefree-sdk-assets-templates/main/v3/bee-templates/blank.json',
  fileManager: '',
}
