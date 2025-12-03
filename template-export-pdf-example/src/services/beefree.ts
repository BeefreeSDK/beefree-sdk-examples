import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IEntityContentJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { AUTH_PROXY_URL, DEFAULT_TEMPLATE_URL, DEFAULT_CLIENT_CONFIG } from '../config/constants'

export const authenticate = async (uid: string): Promise<Response> => {
  return await fetch(AUTH_PROXY_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uid: uid
    })
  })
}

const loadTemplate = (): Promise<IEntityContentJson> => 
  fetch(DEFAULT_TEMPLATE_URL).then(response => response.json())

const removeLoadingOverlay = (): void => {
  const loadingOverlay = document.getElementById('loading-overlay')
  if (loadingOverlay) {
    loadingOverlay.remove()
  }
}

export const initializeBeefreeSDK = async (clientConfig: IBeeConfig): Promise<BeefreeSDK> => {
  try {
    const templateData = await loadTemplate()
    const tokenResponse = await authenticate(clientConfig.uid || DEFAULT_CLIENT_CONFIG.uid)
    const token: IToken = await tokenResponse.json()
    const BeePlugin = new BeefreeSDK(token)
    const bee = BeePlugin
    
    // Store instance globally for access from components
    window.bee = bee
    
    removeLoadingOverlay()
    bee.start(clientConfig ?? DEFAULT_CLIENT_CONFIG, templateData)
    
    console.log('🔐 Beefree SDK initialized for PDF export', bee)
    return bee
  } catch (error) {
    console.error('🔴 Error initializing Beefree SDK:', error)
    throw error
  }
}
