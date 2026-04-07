import { AUTH_API_URL } from '../config/constants'
import type { IToken } from '../types'

export async function getToken(
  uid: string,
  fetchFn: typeof fetch = fetch,
): Promise<IToken> {
  const response = await fetchFn(AUTH_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Authentication failed: ${response.status}`)
  }

  return (await response.json()) as IToken
}
