import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

// Import shared authentication module (CommonJS)
const require = createRequire(import.meta.url)
const { setupAuthEndpoint } = require('../shared/auth.js')

const app = express()
const PORT: number = parseInt(process.env.PORT || '3000', 10)

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080',  // secure-auth-example frontend
    'http://localhost:8081',  // custom-css-example
    'http://localhost:8082',  // custom-css-example fallback
    'http://localhost:5174'   // template-export-pdf-example
  ],
  credentials: true
}))
app.use(express.json())

// Serve static files from dist in production, current directory in development
const isProduction: boolean = process.env.NODE_ENV === 'production'
if (isProduction && fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')))
  console.log('📦 Serving React build from dist/')
} else {
  app.use(express.static(path.join(__dirname)))
  console.log('🔧 Serving static files from current directory')
}

// Setup shared authentication endpoint
setupAuthEndpoint(app, process.env.BEEFREE_CLIENT_ID, process.env.BEEFREE_CLIENT_SECRET)

// In-memory session storage (replace with database in production)
interface SessionData {
  sessionId: string
  documentId: string
  lastVersion: number
  createdAt: Date
}

const sessions = new Map<string, SessionData>()

// Co-editing session creation endpoint
app.post('/coedit/session', async (req: Request, res: Response) => {
  const { template, userId } = req.body

  if (!template || !userId) {
    return res.status(400).json({ error: 'template and userId are required' })
  }

  try {
    const authToken = await getBeefreeToken()

    const sessionResponse = await fetch('https://api.getbee.io/v1/coedit/session/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken.access_token}`
      },
      body: JSON.stringify({
        template,
        userid: userId
      })
    })

    if (!sessionResponse.ok) {
      const errorText = await sessionResponse.text()
      console.error(`❌ Session creation failed: ${sessionResponse.status} - ${errorText}`)
      throw new Error(`Session creation failed: ${sessionResponse.status}`)
    }

    const sessionResult = await sessionResponse.json()
    console.log(`✅ Co-editing session created: ${sessionResult.sessionId}`)
    res.json(sessionResult)
  } catch (error) {
    console.error('❌ Session creation error:', error)
    res.status(500).json({ error: 'Failed to create session' })
  }
})

// Get co-editing session info endpoint
app.get('/coedit/session/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params

  try {
    const authToken = await getBeefreeToken()

    const sessionResponse = await fetch(`https://api.getbee.io/v1/coedit/session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken.access_token}`
      }
    })

    if (!sessionResponse.ok) {
      const errorText = await sessionResponse.text()
      console.error(`❌ Session fetch failed: ${sessionResponse.status} - ${errorText}`)
      throw new Error(`Session fetch failed: ${sessionResponse.status}`)
    }

    const sessionResult = await sessionResponse.json()
    console.log(`✅ Session info retrieved: ${sessionId}`)
    res.json(sessionResult)
  } catch (error) {
    console.error('❌ Session fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch session' })
  }
})

// Helper function to get Beefree token
async function getBeefreeToken() {
  const authResponse = await fetch('https://auth.getbee.io/apiauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.BEEFREE_CLIENT_ID,
      client_secret: process.env.BEEFREE_CLIENT_SECRET
    })
  })

  if (!authResponse.ok) {
    throw new Error(`Beefree auth failed: ${authResponse.status}`)
  }

  return await authResponse.json()
}

// Legacy endpoint for backward compatibility
app.post('/auth/beefree', async (req: Request, res: Response) => {
  // Redirect to the new shared endpoint
  req.url = '/auth/token'
  app._router.handle(req, res)
})

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    service: 'Beefree SDK Secure Auth Example',
    timestamp: new Date().toISOString()
  })
})

// Serve the React app
app.get('/', (_req: Request, res: Response) => {
  if (isProduction && fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    // Serve React build from dist
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  } else {
    // Serve React HTML for development
    res.sendFile(path.join(__dirname, 'index.html'))
  }
})

// Route for React app (catch-all for client-side routing)
app.get('*', (_req: Request, res: Response) => {
  if (isProduction && fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  } else {
    res.sendFile(path.join(__dirname, 'index.html'))
  }
})

// Start server
app.listen(PORT, () => {
  console.log('🚀 Beefree SDK Secure Authentication Example')
  console.log(`📄 Version: 2.0.0 (React + TypeScript + TS Server)`)
  console.log(`🌐 Server running at: http://localhost:${PORT}`)
  console.log('🔧 API endpoints:')
  console.log('   • POST /auth/token - Authentication')
  console.log('   • POST /coedit/session - Create new session')
  console.log('   • GET /health - Health Check')
  console.log('📋 Environment check:')
  console.log(`   • BEEFREE_CLIENT_ID: ${process.env.BEEFREE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`)
  console.log(`   • BEEFREE_CLIENT_SECRET: ${process.env.BEEFREE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`)
  console.log(`   • BEEFREE_API_KEY: ${process.env.BEEFREE_API_KEY ? '✅ Set' : '❌ Missing'}`)
  console.log(`   • MODE: ${isProduction ? '🏭 Production' : '🔧 Development'}`)
  console.log('🎯 Ready for co-editing!')

  // Check if environment variables are set
  if (!process.env.BEEFREE_CLIENT_ID || !process.env.BEEFREE_CLIENT_SECRET) {
    console.warn('⚠️  Warning: Beefree SDK credentials not found in environment variables')
    console.warn('   Please copy .env.example to .env and add your credentials')
  }
  if (!process.env.BEEFREE_API_KEY) {
    console.warn('⚠️  Warning: BEEFREE_API_KEY not found - co-editing API will not work')
  }
})
