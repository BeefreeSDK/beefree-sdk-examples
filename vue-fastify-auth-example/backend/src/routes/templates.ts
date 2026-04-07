import type { FastifyInstance } from 'fastify'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const sampleTemplate = JSON.parse(
  readFileSync(join(__dirname, '..', 'data', 'sample.json'), 'utf-8'),
) as Record<string, unknown>

const blankTemplate = JSON.parse(
  readFileSync(join(__dirname, '..', 'data', 'blank.json'), 'utf-8'),
) as Record<string, unknown>

export default async function templateRoutes(fastify: FastifyInstance) {
  fastify.get('/sample', async () => {
    return sampleTemplate
  })

  fastify.get('/blank', async () => {
    return blankTemplate
  })
}
