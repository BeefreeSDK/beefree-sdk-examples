import type { FastifyInstance, FastifyRequest } from 'fastify'

const bodySchema = {
  type: 'object',
  required: ['uid'],
  properties: {
    uid: { type: 'string', minLength: 1 },
  },
} as const

interface AuthBody {
  uid: string
}

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: AuthBody }>(
    '/token',
    { schema: { body: bodySchema } },
    async (request: FastifyRequest<{ Body: AuthBody }>) => {
      const { uid } = request.body
      const { BEEFREE_CLIENT_ID, BEEFREE_CLIENT_SECRET } = fastify.config

      if (!BEEFREE_CLIENT_ID || !BEEFREE_CLIENT_SECRET) {
        throw fastify.httpErrors.internalServerError(
          'Missing Beefree credentials in server configuration',
        )
      }

      request.log.info({ uid }, 'Authenticating')

      const response = await fetch('https://auth.getbee.io/loginV2', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: BEEFREE_CLIENT_ID,
          client_secret: BEEFREE_CLIENT_SECRET,
          uid,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        request.log.error({ status: response.status, errorText }, 'Auth failed')
        throw fastify.httpErrors.badRequest(
          `Authentication failed: ${response.status}`,
        )
      }

      const tokenData = (await response.json()) as Record<string, unknown>

      if (!tokenData.access_token) {
        throw fastify.httpErrors.internalServerError(
          'Invalid response: missing access_token',
        )
      }

      request.log.info('Authentication successful')
      return tokenData
    },
  )
}
