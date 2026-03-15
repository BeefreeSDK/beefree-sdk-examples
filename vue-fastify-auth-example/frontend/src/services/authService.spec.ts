import { describe, it, expect, vi } from 'vitest'
import { getToken } from './authService'

describe('authService', () => {
  it('posts uid and returns token', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access_token: 'abc123' }),
    })

    const token = await getToken('user-1', mockFetch)

    expect(mockFetch).toHaveBeenCalledWith('/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: 'user-1' }),
    })
    expect(token).toEqual({ access_token: 'abc123' })
  })

  it('throws on non-ok response with error text', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Invalid credentials'),
    })

    await expect(getToken('bad', mockFetch)).rejects.toThrow(
      'Invalid credentials',
    )
  })

  it('throws with status when error text is empty', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve(''),
    })

    await expect(getToken('x', mockFetch)).rejects.toThrow(
      'Authentication failed: 500',
    )
  })
})
