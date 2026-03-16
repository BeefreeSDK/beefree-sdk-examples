import fp from 'fastify-plugin'
import envSchema from 'env-schema'
import { Type, type Static } from '@sinclair/typebox'

export const configSchema = Type.Object({
  BEEFREE_CLIENT_ID: Type.String(),
  BEEFREE_CLIENT_SECRET: Type.String(),
  PORT: Type.Number({ default: 3033 }),
})

export type Config = Static<typeof configSchema>

export default fp(async function configPlugin(fastify) {
  const config = envSchema<Config>({
    schema: configSchema,
    dotenv: true,
  })

  fastify.decorate('config', config)
}, { name: 'config' })
