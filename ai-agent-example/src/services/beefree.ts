import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IToken } from '@beefree.io/sdk/dist/types/bee'
import { DEFAULT_CLIENT_CONFIG, AUTHORIZE_URL } from '../config/constants'
import type { BeefreeInstance } from '../types'

// Beefree SDK initialization
const authUrl = AUTHORIZE_URL

console.log('🔐 Auth URL:', AUTHORIZE_URL)

export const authenticate = async (uid: string): Promise<Response> => {
  return await fetch(authUrl, {
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

const removeLoadingOverlay = (): void => {
  const loadingOverlay = document.getElementById('loading-overlay')
  if (loadingOverlay) {
    loadingOverlay.remove()
  }
}

export const initializeBeefreeSDK = async (clientConfig: IBeeConfig): Promise<BeefreeSDK | undefined> => {
  // Initialize Beefree SDK when BeePlugin is available
  try {
    const tokenResponse = await authenticate(clientConfig.uid || DEFAULT_CLIENT_CONFIG.uid)
    const token: IToken = await tokenResponse.json()
    const BeePlugin = new BeefreeSDK(token)
    const bee = BeePlugin
    window.bee = bee as unknown as BeefreeInstance
    removeLoadingOverlay()
    await bee.start(clientConfig ?? DEFAULT_CLIENT_CONFIG, {})
    console.log('🔐 Beefree SDK initialized', bee)
    return BeePlugin
  } catch (error) {
    console.error('🔴 Error:', error)
    return undefined
  }
}
