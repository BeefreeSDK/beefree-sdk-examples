import { buildApp } from './app.ts'

const app = await buildApp()

const port = app.config.PORT
await app.listen({ port, host: '0.0.0.0' })

app.log.info(`🚀 Fastify server running at http://localhost:${port}`)
app.log.info('   POST /auth/token — Authentication')
app.log.info('   GET  /template/sample — Sample template')
app.log.info('   GET  /template/blank — Blank template')
app.log.info('   GET  /health — Health check')
