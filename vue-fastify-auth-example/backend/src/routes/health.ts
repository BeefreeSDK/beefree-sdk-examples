import type { FastifyInstance } from 'fastify'

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return {
      status: 'healthy',
      service: 'Beefree SDK Vue + Fastify Auth Example',
      timestamp: new Date().toISOString(),
    }
  })
}
