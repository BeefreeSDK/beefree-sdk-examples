import { IToken, BuilderType } from '../types'
import { AUTH_PROXY_URL, BUILDER_CONFIGS } from '../config/constants'

export class AuthService {
  /**
   * Authenticate user and get token for specific builder type
   */
  async authenticateUser(uid: string, builderType?: BuilderType): Promise<IToken> {
    try {
      console.log(`🔐 Authenticating user: ${uid}${builderType ? ` for ${builderType} builder` : ''}`)
      
      // Send builder type to backend so it can use the correct credentials
      // The backend will use builder-specific Client ID/Secret based on builderType
      const requestBody: any = { 
        uid,
        builderType // Send builder type to backend
      }

      const response = await fetch(AUTH_PROXY_URL, {
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
      console.log('✅ Authentication successful')
      return token

    } catch (error) {
      console.error('❌ Authentication failed:', error)
      throw error
    }
  }

  /**
   * Refresh token for current user
   */
  async refreshToken(uid: string, builderType?: BuilderType): Promise<IToken> {
    // For now, just re-authenticate (same as initial auth)
    return this.authenticateUser(uid, builderType)
  }
}
