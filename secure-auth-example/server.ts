import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

const app = express()
const PORT: number = parseInt(process.env.PORT || '3000', 10)

/**
 * Authenticate with Beefree SDK and get access token
 */
async function authenticateBeefree(clientId: string, clientSecret: string, uid: string): Promise<any> {
  const authUrl = 'https://auth.getbee.io/loginV2'
  
  const authData = {
    client_id: clientId,
    client_secret: clientSecret,
    uid: uid
  }

  console.log('🔐 Authenticating with Beefree SDK...')
  
  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Authentication failed: ${response.status} ${errorText}`)
  }

  const tokenData: any = await response.json()
  
  // Validate IToken structure from remote auth server
  if (!tokenData.access_token) {
    throw new Error('Invalid IToken response: missing access_token')
  }

  console.log('✅ Authentication successful')
  return tokenData
}

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any localhost origin on port 80xx (frontend examples) or 30xx (backend/proxy)
    if (origin.match(/^http:\/\/localhost:(80\d{2}|30\d{2})$/)) {
      return callback(null, true);
    }
    
    // Default allowed origins
    const allowedOrigins = [
      'http://localhost:8080', // secure-auth-example frontend
      'http://localhost:5173', // Vite default
      'http://localhost:5174'  // Vite default 2
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // For development convenience, we can log blocked origins
    console.log('⚠️ CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
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

// Setup authentication endpoint directly
app.post('/auth/token', async (req: Request, res: Response) => {
  try {
    const { uid } = req.body
    
    if (!uid) {
      res.status(400).json({ 
        error: 'Missing uid parameter' 
      })
      return
    }

    const clientId = process.env.BEEFREE_CLIENT_ID
    const clientSecret = process.env.BEEFREE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      res.status(500).json({ 
        error: 'Missing Beefree credentials in server configuration' 
      })
      return
    }

    const tokenData = await authenticateBeefree(clientId, clientSecret, uid)
    
    res.json(tokenData)
    
  } catch (error: any) {
    console.error('Authentication error:', error)
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message 
    })
  }
})

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
  console.log('   • GET /health - Health Check')
  console.log('📋 Environment check:')
  console.log(`   • BEEFREE_CLIENT_ID: ${process.env.BEEFREE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`)
  console.log(`   • BEEFREE_CLIENT_SECRET: ${process.env.BEEFREE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`)
  console.log(`   • MODE: ${isProduction ? '🏭 Production' : '🔧 Development'}`)
  console.log('🎯 Ready for secure authentication!')
  
  // Check if environment variables are set
  if (!process.env.BEEFREE_CLIENT_ID || !process.env.BEEFREE_CLIENT_SECRET) {
    console.warn('⚠️  Warning: Beefree SDK credentials not found in environment variables')
    console.warn('   Please copy .env.example to .env and add your credentials')
  }
})
