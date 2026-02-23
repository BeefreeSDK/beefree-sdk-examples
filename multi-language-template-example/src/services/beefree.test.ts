import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authenticate } from './beefree'

describe('beefree service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('sends POST to AUTH_PROXY_URL with uid in body', async () => {
    const mockToken = { access_token: 'token-123', expires: 3600 }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockToken),
    } as Response)

    await authenticate('my-user')

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      '/auth/token',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: 'my-user' }),
      }),
    )
  })

  it('returns token when response is ok', async () => {
    const mockToken = { access_token: 'abc', expires: 3600 }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockToken),
    } as Response)

    const result = await authenticate()

    expect(result).toEqual(mockToken)
  })

  it('uses demo-user when uid is not provided', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: 'x', expires: 0 }),
    } as Response)

    await authenticate()

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ uid: 'demo-user' }),
      }),
    )
  })

  it('throws when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Server error', details: 'Bad credentials' }),
    } as Response)

    await expect(authenticate()).rejects.toThrow('Bad credentials')
  })

  it('throws when response is not ok and json fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.reject(new Error('Invalid JSON')),
    } as Response)

    await expect(authenticate()).rejects.toThrow(/Authentication failed/)
  })

  it('throws when fetch fails (network error)', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network failure'))

    await expect(authenticate()).rejects.toThrow('Network error')
  })

  it('throws when token has no access_token', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ expires: 3600 }),
    } as Response)

    await expect(authenticate()).rejects.toThrow('Invalid credentials: no access token returned')
  })
})
