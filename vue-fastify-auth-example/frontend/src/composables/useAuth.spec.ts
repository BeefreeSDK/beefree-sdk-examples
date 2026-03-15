import { describe, it, expect, vi } from 'vitest'
import { useAuth } from './useAuth'

vi.mock('../services/authService', () => ({
  getToken: vi.fn(),
}))

import { getToken } from '../services/authService'

describe('useAuth', () => {
  it('starts with default state', () => {
    const auth = useAuth()
    expect(auth.isAuthenticated.value).toBe(false)
    expect(auth.isAuthenticating.value).toBe(false)
    expect(auth.uid.value).toBe('')
    expect(auth.token.value).toBeNull()
    expect(auth.error.value).toBe('')
  })

  it('authenticates successfully', async () => {
    vi.mocked(getToken).mockResolvedValue({ access_token: 'tok' })
    const auth = useAuth()

    await auth.authenticate('u1')

    expect(getToken).toHaveBeenCalledWith('u1', undefined)
    expect(auth.isAuthenticated.value).toBe(true)
    expect(auth.uid.value).toBe('u1')
    expect(auth.token.value).toEqual({ access_token: 'tok' })
    expect(auth.isAuthenticating.value).toBe(false)
    expect(auth.error.value).toBe('')
  })

  it('passes fetchFn to getToken', async () => {
    vi.mocked(getToken).mockResolvedValue({ access_token: 'tok2' })
    const auth = useAuth()
    const customFetch = vi.fn()

    await auth.authenticate('u2', customFetch as unknown as typeof fetch)

    expect(getToken).toHaveBeenCalledWith('u2', customFetch)
  })

  it('handles Error authentication failures', async () => {
    vi.mocked(getToken).mockRejectedValue(new Error('bad creds'))
    const auth = useAuth()

    await auth.authenticate('u3')

    expect(auth.isAuthenticated.value).toBe(false)
    expect(auth.error.value).toBe('bad creds')
    expect(auth.isAuthenticating.value).toBe(false)
  })

  it('handles non-Error authentication failures', async () => {
    vi.mocked(getToken).mockRejectedValue('boom')
    const auth = useAuth()

    await auth.authenticate('u4')

    expect(auth.error.value).toBe('Authentication failed')
    expect(auth.isAuthenticating.value).toBe(false)
  })

  it('logs out and resets state', async () => {
    vi.mocked(getToken).mockResolvedValue({ access_token: 'tok' })
    const auth = useAuth()

    await auth.authenticate('u5')
    expect(auth.isAuthenticated.value).toBe(true)

    auth.logout()

    expect(auth.isAuthenticated.value).toBe(false)
    expect(auth.token.value).toBeNull()
    expect(auth.uid.value).toBe('')
    expect(auth.error.value).toBe('')
  })
})
