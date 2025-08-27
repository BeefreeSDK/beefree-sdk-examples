import { useState, useCallback, useEffect } from 'react'
import { AuthState } from '../types'
import { AuthService } from '../services/authService'

const authService = new AuthService()

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAuthenticating: false
  })

  const authenticate = useCallback(async (uid: string) => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticating: true,
      error: undefined
    }))

    try {
      const token = await authService.authenticateUser(uid)
      
      setAuthState({
        isAuthenticated: true,
        isAuthenticating: false,
        uid,
        token,
        error: undefined
      })

      // Setup token refresh
      authService.setupTokenRefresh(uid, (newToken) => {
        setAuthState(prev => ({
          ...prev,
          token: newToken
        }))
      })

    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticating: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }))
    }
  }, [])

  const logout = useCallback(() => {
    authService.clearTokenRefresh()
    setAuthState({
      isAuthenticated: false,
      isAuthenticating: false
    })
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      authService.clearTokenRefresh()
    }
  }, [])

  return {
    ...authState,
    authenticate,
    logout
  }
}
