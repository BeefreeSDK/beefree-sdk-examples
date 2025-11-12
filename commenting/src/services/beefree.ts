import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IEntityContentJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { AUTH_PROXY_URL, DEFAULT_TEMPLATE_URL, DEFAULT_CLIENT_CONFIG } from '../config/constants'

// Beefree SDK initialization
const authProxyUrl = AUTH_PROXY_URL // Use server side auth proxy url
const templateUrl = DEFAULT_TEMPLATE_URL // Define your template url here

console.log('🔐 Auth proxy URL:', AUTH_PROXY_URL)

export const authenticate = async (uid: string): Promise<Response> => {
  return await fetch(authProxyUrl, {
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
  fetch(templateUrl).then(response => response.json())

const removeLoadingOverlay = (): void => {
  const loadingOverlay = document.getElementById('loading-overlay')
  if (loadingOverlay) {
    loadingOverlay.remove()
  }
}

export const initializeBeefreeSDK = async (clientConfig: IBeeConfig): Promise<BeefreeSDK | undefined> => {
  // Initialize Beefree SDK when BeePlugin is available
  try {
    const templateData = await loadTemplate()
    const tokenResponse = await authenticate(clientConfig.uid || DEFAULT_CLIENT_CONFIG.uid)
    const token: IToken = await tokenResponse.json()
    const BeePlugin = new BeefreeSDK(token)
    const bee = BeePlugin
    window.bee = bee as unknown as BeefreeInstance
    removeLoadingOverlay()
    await bee.start(clientConfig ?? DEFAULT_CLIENT_CONFIG, templateData)
    console.log('🔐 Beefree SDK initialized', bee)
    return BeePlugin
  } catch (error) {
    console.error('🔴 Error:', error)
    return undefined
  }
}
