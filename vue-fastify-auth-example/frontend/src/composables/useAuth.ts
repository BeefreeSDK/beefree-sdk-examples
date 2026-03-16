import { ref, type Ref } from 'vue'
import type { IToken } from '../types'
import { getToken } from '../services/authService'

export interface UseAuth {
  isAuthenticated: Ref<boolean>
  isAuthenticating: Ref<boolean>
  uid: Ref<string>
  token: Ref<IToken | null>
  error: Ref<string>
  authenticate: (uid: string, fetchFn?: typeof fetch) => Promise<void>
  logout: () => void
}

export function useAuth(): UseAuth {
  const isAuthenticated = ref(false)
  const isAuthenticating = ref(false)
  const uid = ref('')
  const token = ref<IToken | null>(null)
  const error = ref('')

  async function authenticate(userUid: string, fetchFn?: typeof fetch) {
    isAuthenticating.value = true
    error.value = ''
    try {
      const tokenData = await getToken(userUid, fetchFn)
      token.value = tokenData
      uid.value = userUid
      isAuthenticated.value = true
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed'
      error.value = message
    } finally {
      isAuthenticating.value = false
    }
  }

  function logout() {
    isAuthenticated.value = false
    token.value = null
    uid.value = ''
    error.value = ''
  }

  return {
    isAuthenticated,
    isAuthenticating,
    uid,
    token,
    error,
    authenticate,
    logout,
  }
}
