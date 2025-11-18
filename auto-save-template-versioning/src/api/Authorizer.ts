import type { IToken } from "@beefree.io/sdk/dist/types/bee"
import { envs } from "../env";

export class Authorizer {
  authUrl: string;
  clientId: string;
  clientSecret: string;

  constructor(authUrl: string, clientId: string, clientSecret: string) {
    this.authUrl = authUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }


  async getToken(): Promise<IToken> {
    try {
      const requestBody = {  client_id: this.clientId, client_secret: this.clientSecret }
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

export const authorizer = new Authorizer(
  envs.AUTH_PROXY_URL,
  envs.BEEFREE_SDK_CLIENT_ID,
  envs.BEEFREE_SDK_CLIENT_SECRET,
)
