import { describe, expect, it } from 'vitest'

describe('constants', () => {
  it('AUTH_PROXY_URL defaults to /auth/token when env is not set', async () => {
    const { AUTH_PROXY_URL } = await import('./constants')
    expect(AUTH_PROXY_URL).toBe('/auth/token')
  })

})
