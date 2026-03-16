import { describe, it, before, after, mock } from 'node:test'
import assert from 'node:assert/strict'
import { buildApp } from '../app.ts'
import type { FastifyInstance } from 'fastify'

describe('auth route', () => {
  let app: FastifyInstance

  before(async () => {
    process.env.BEEFREE_CLIENT_ID = 'test-id'
    process.env.BEEFREE_CLIENT_SECRET = 'test-secret'
    app = await buildApp()
  })

  after(async () => {
    await app.close()
    delete process.env.BEEFREE_CLIENT_ID
    delete process.env.BEEFREE_CLIENT_SECRET
    mock.restoreAll()
  })

  it('returns a token on valid request', async () => {
    mock.method(globalThis, 'fetch', () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test-token-123' }),
      }),
    )

    const response = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: { uid: 'user-1' },
    })

    assert.equal(response.statusCode, 200)
    const body = response.json()
    assert.equal(body.access_token, 'test-token-123')

    mock.restoreAll()
  })

  it('rejects request without uid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: {},
    })

    assert.equal(response.statusCode, 400)
  })

  it('rejects request with empty uid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: { uid: '' },
    })

    assert.equal(response.statusCode, 400)
  })

  it('handles upstream auth failure', async () => {
    mock.method(globalThis, 'fetch', () =>
      Promise.resolve({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      }),
    )

    const response = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: { uid: 'user-2' },
    })

    assert.equal(response.statusCode, 400)
    const body = response.json()
    assert.ok(body.message.includes('Authentication failed'))

    mock.restoreAll()
  })

  it('handles missing access_token in response', async () => {
    mock.method(globalThis, 'fetch', () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token_type: 'bearer' }),
      }),
    )

    const response = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: { uid: 'user-3' },
    })

    assert.equal(response.statusCode, 500)
    const body = response.json()
    assert.ok(body.message.includes('missing access_token'))

    mock.restoreAll()
  })

  it('handles missing credentials', async () => {
    // Create a separate app instance with empty credentials
    const originalId = process.env.BEEFREE_CLIENT_ID
    const originalSecret = process.env.BEEFREE_CLIENT_SECRET
    process.env.BEEFREE_CLIENT_ID = ''
    process.env.BEEFREE_CLIENT_SECRET = ''

    const noCredsApp = await buildApp()

    const response = await noCredsApp.inject({
      method: 'POST',
      url: '/auth/token',
      payload: { uid: 'user-4' },
    })

    assert.equal(response.statusCode, 500)
    const body = response.json()
    assert.ok(body.message.includes('Missing Beefree credentials'))

    await noCredsApp.close()
    process.env.BEEFREE_CLIENT_ID = originalId
    process.env.BEEFREE_CLIENT_SECRET = originalSecret
  })
})
