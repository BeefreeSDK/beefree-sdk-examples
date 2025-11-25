import type { IToken } from "@beefree.io/sdk/dist/types/bee"
import { envs } from "../env";

export class Authorizer {
  authUrl: string;
  uid: string;

  constructor(authUrl: string, uid: string) {
    this.authUrl = authUrl;
    this.uid = uid;
  }


  async getToken(): Promise<IToken> {
    try {
      const requestBody = { uid: this.uid }
      const response = await fetch(this.authUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Authentication failed: ${response.status} - ${errorText}`)
      }

      const token: IToken = await response.json()
      return token

    } catch (error) {
      console.error('❌ Authentication failed:', error)
      throw error
    }
  }
}

// Default UID - matches the editor config uid
// In a real app, this would come from your user session/authentication
const DEFAULT_UID = 'user_id'

export const authorizer = new Authorizer(
  envs.AUTH_PROXY_URL,
  DEFAULT_UID,
)
