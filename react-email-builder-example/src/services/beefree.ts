import type { IToken } from '@beefree.io/react-email-builder'
import { AUTH_PROXY_URL } from '../config/constants'

export const authenticate = async (uid: string, builderType: string): Promise<IToken> => {
  let response: Response
  try {
    response = await fetch(AUTH_PROXY_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid, builderType })
    })
  } catch {
    throw new Error('Network error: unable to reach authentication server. Is the backend running?')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }))
    throw new Error(errorData.details || errorData.error || `Authentication failed: ${response.status}`)
  }

  const token: IToken = await response.json()
  if (!token || !token.access_token) {
    throw new Error('Invalid credentials: no access token returned')
  }

  return token
}
