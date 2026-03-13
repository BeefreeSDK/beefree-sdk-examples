import type { Static } from '@sinclair/typebox'
import type { configSchema } from '../plugins/config.ts'

type Config = Static<typeof configSchema>

declare module 'fastify' {
  interface FastifyInstance {
    config: Config
  }
}

export type { Config }
