import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { buildApp } from '../app.ts'
import type { FastifyInstance } from 'fastify'

describe('template routes', () => {
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

  it('returns sample template', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/template/sample',
    })

    assert.equal(response.statusCode, 200)
    const body = response.json()
    assert.ok(body.page, 'sample template should have a page property')
  })

  it('returns blank template', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/template/blank',
    })

    assert.equal(response.statusCode, 200)
    const body = response.json()
    assert.ok(body.page, 'blank template should have a page property')
  })
})
