import fp from 'fastify-plugin'
import cors from '@fastify/cors'

export default fp(async function corsPlugin(fastify) {
  await fastify.register(cors, {
    origin: 'http://localhost:8033',
  })
}, { name: 'cors' })
