import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { buildApp } from '../app.ts'
import type { FastifyInstance } from 'fastify'

describe('health route', () => {
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
  })

  it('returns health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    })

    assert.equal(response.statusCode, 200)
    const body = response.json()
    assert.equal(body.status, 'healthy')
    assert.equal(body.service, 'Beefree SDK Vue + Fastify Auth Example')
    assert.ok(body.timestamp)
  })
})
