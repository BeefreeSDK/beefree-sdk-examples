import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3021
const VITE_PORT = process.env.VITE_PORT || 8921

app.use(cors())
app.use(express.json())

const isProduction = process.env.NODE_ENV === 'production'
if (isProduction && fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')))
} else {
  app.use(express.static(path.join(__dirname)))
}

async function authenticateBeefree(
  clientId: string,
  clientSecret: string,
  uid: string,
): Promise<unknown> {
  const authUrl = 'https://auth.getbee.io/loginV2'
  let response: globalThis.Response
  try {
    response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        uid,
      }),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Network error contacting Beefree auth service: ${message}`)
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Authentication failed: ${response.status} ${errorText}`)
  }
  return await response.json()
}

app.post('/auth/token', async (req: Request, res: Response) => {
  try {
    const uid = req.body?.uid ?? 'multi-language-template-demo'

    const clientId = process.env.BEEFREE_CLIENT_ID
    const clientSecret = process.env.BEEFREE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: 'Missing Beefree credentials configuration',
        details: 'Set BEEFREE_CLIENT_ID and BEEFREE_CLIENT_SECRET in .env',
      })
    }

    const tokenData = await authenticateBeefree(clientId, clientSecret, uid)
    res.json(tokenData)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Auth endpoint error:', error)
    res.status(500).json({ error: 'Authentication failed', details: message })
  }
})

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Beefree SDK Multi-language Template Example',
  })
})

app.get('*', (req: Request, res: Response) => {
  if (isProduction && fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  } else {
    res.sendFile(path.join(__dirname, 'index.html'))
  }
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', error)
  const message = error instanceof Error ? error.message : String(error)
  res.status(500).json({ error: 'Internal server error', message })
})

app.listen(PORT, () => {
  const hasCreds = !!(process.env.BEEFREE_CLIENT_ID && process.env.BEEFREE_CLIENT_SECRET)
  console.log(`\nBeefree SDK Multi-language Template Example Server`)
  console.log(`Server: http://localhost:${PORT}`)
  console.log(`Credentials: ${hasCreds ? 'Configured ✅' : 'Missing (set BEEFREE_CLIENT_ID/SECRET in .env) ⚠️'}`)
  console.log(`\nReady. Open http://localhost:${VITE_PORT} for the frontend.\n`)
})
