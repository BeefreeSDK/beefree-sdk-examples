import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import configPlugin from './plugins/config.ts'
import corsPlugin from './plugins/cors.ts'
import sensiblePlugin from './plugins/sensible.ts'
import authRoutes from './routes/auth.ts'
import templateRoutes from './routes/templates.ts'
import healthRoutes from './routes/health.ts'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
      },
    },
  })

  await app.register(configPlugin)
  await app.register(corsPlugin)
  await app.register(sensiblePlugin)
  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(templateRoutes, { prefix: '/template' })
  await app.register(healthRoutes)

  return app
}
