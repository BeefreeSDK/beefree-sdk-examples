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

export const initializeBeefreeSDK = async (
  clientConfig: IBeeConfig,
  onPlanCheck?: (plan: string) => void
): Promise<void> => {
  // Initialize Beefree SDK when BeePlugin is available
  try {
    const templateData = await loadTemplate()
    const tokenResponse = await authenticate(clientConfig.uid || DEFAULT_CLIENT_CONFIG.uid)
    const token: IToken = await tokenResponse.json()

    // Check plan restrictions
    if (token.access_token) {
      try {
        const base64Url = token.access_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        console.log('🔍 Decoded Token Payload:', payload);

        // Check for incompatible plans (not superpowers or enterprise)
        // We want to warn if plan is free, essentials, or core (assuming custom CSS needs higher tiers)
        const plan = payload.plan || '';
        const allowedPlans = ['gold', 'superpowers', 'enterprise'];
        const isAllowed = allowedPlans.some(p => plan.includes(p));

        if (!isAllowed && onPlanCheck) {
          onPlanCheck(plan);
          console.warn('⚠️ Plan restriction detected:', plan);
        }

      } catch (e) {
        console.warn('Could not decode token to check plan:', e);
      }
    }

    const BeePlugin = new BeefreeSDK(token)
    const bee = BeePlugin
    window.bee = bee
    removeLoadingOverlay()
    bee.start(clientConfig ?? DEFAULT_CLIENT_CONFIG, templateData)
    console.log('🔐 Beefree SDK initialized', bee)
  } catch (error) {
    console.error('🔴 Error:', error)
  }
}
