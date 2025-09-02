import { IToken } from '../types'
import { AUTH_API_URL } from '../config/constants'

export class AuthService {
  private tokenRefreshTimer: ReturnType<typeof setInterval> | null = null
  private monitoredFetch?: (url: string, options?: RequestInit) => Promise<Response>

  setMonitoredFetch(monitoredFetch: (url: string, options?: RequestInit) => Promise<Response>) {
    this.monitoredFetch = monitoredFetch
  }

  async authenticateUser(uid: string): Promise<IToken> {
    try {
      const fetchFn = this.monitoredFetch || fetch
      const response = await fetchFn(AUTH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Authentication failed: ${response.status} ${errorData}`)
      }

      return await response.json()
    } catch (error) {
      console.error('❌ Authentication error:', error)
      throw error instanceof Error ? error : new Error('Unknown authentication error')
    }
  }

  async refreshToken(uid: string): Promise<IToken> {
    return this.authenticateUser(uid)
  }

  setupTokenRefresh(uid: string, onTokenRefresh: (token: IToken) => void, intervalMs: number = 300000) {
    this.clearTokenRefresh()
    
    this.tokenRefreshTimer = setInterval(async () => {
      try {
        const newToken = await this.refreshToken(uid)
        onTokenRefresh(newToken)
      } catch (error) {
        console.error('❌ Token refresh failed:', error)
      }
    }, intervalMs)
  }

  clearTokenRefresh() {
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer)
      this.tokenRefreshTimer = null
    }
  }
}
