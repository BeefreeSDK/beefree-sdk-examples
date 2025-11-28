import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IEntityContentJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { 
  AUTH_PROXY_URL, DEFAULT_TEMPLATE_URL, DEFAULT_CLIENT_CONFIG,
  COMMENT_USER_HANDLE, COMMENT_USER, COMMENT_USER_COLOR, MOCKED_COMMENT_ID
} from '../config/constants'
import type { BeefreeInstance } from '../types'

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


const loadTemplate = async (): Promise<IEntityContentJson> => {
  const template = await fetch(templateUrl).then(response => response.json())
  // Add the comments object at the root level, alongside 'page'
  return {
    ...template,
    comments: {
      [MOCKED_COMMENT_ID]: {
        content: "This is a sample comment to demonstrate the showComment feature. In a real scenario, comments would be loaded from your system's database.",
        parentCommentId: null,
        elementId: "fe3aa935-3660-4822-858a-c79a8726f659",
        mentions: [],
        responses: [],
        timestamp: "2025-11-12T17:44:07.843Z",
        author: {
          userHandle: COMMENT_USER_HANDLE,
          username: COMMENT_USER,
          userColor: COMMENT_USER_COLOR
        }
      }
    }
  }
}

const removeLoadingOverlay = (): void => {
  const loadingOverlay = document.getElementById('loading-overlay')
  if (loadingOverlay) {
    loadingOverlay.remove()
  }
}

export const initializeBeefreeSDK = async (
  clientConfig: IBeeConfig, 
  onPlanCheck?: (plan: string) => void
): Promise<BeefreeSDK | undefined> => {
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

        // Check for incompatible plans (free or essentials)
        const plan = payload.plan || '';
        if ((plan.includes('free') || plan.includes('essentials')) && onPlanCheck) {
          onPlanCheck(plan);
          console.warn('⚠️ Plan restriction detected:', plan);
        }

      } catch (e) {
        console.warn('Could not decode token to check plan:', e);
      }
    }

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
