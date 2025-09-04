import { IToken, BuilderType } from '../types'
import { AUTH_PROXY_URL, BUILDER_CONFIGS } from '../config/constants'

export class AuthService {
  /**
   * Authenticate user and get token for specific builder type
   */
  async authenticateUser(uid: string, builderType?: BuilderType): Promise<IToken> {
    try {
      console.log(`🔐 Authenticating user: ${uid}${builderType ? ` for ${builderType} builder` : ''}`)
      
      const requestBody: any = { uid }
      
      // Add builder-specific credentials if available
      if (builderType) {
        const builderConfig = BUILDER_CONFIGS[builderType]
        if (builderConfig.clientId) {
          requestBody.clientId = builderConfig.clientId
        }
        if (builderConfig.clientSecret) {
          requestBody.clientSecret = builderConfig.clientSecret
        }
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
