import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { WebSocketServer, WebSocket } from 'ws'
import http from 'http'
import { Agent, run, MCPServerStreamableHttp } from '@openai/agents'
import { z } from 'zod'

// Environment validation
const envSchema = z.object({
  BEEFREE_CLIENT_ID: z.string().min(1, 'BEEFREE_CLIENT_ID is required'),
  BEEFREE_CLIENT_SECRET: z.string().min(1, 'BEEFREE_CLIENT_SECRET is required'),
  BEEFREE_MCP_API_KEY: z.string().min(1, 'BEEFREE_MCP_API_KEY is required'),
  BEEFREE_UID: z.string().default('ai-agent-user'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  PORT: z.string().default('8083'),
  VITE_PORT: z.string().default('8082'),
})

let env: z.infer<typeof envSchema>

try {
  env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment configuration error:')
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`)
    })
    process.exit(1)
  }
  throw error
}

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

// Middleware
app.use(cors({
  origin: [
    `http://localhost:${env.VITE_PORT}`,
    `http://127.0.0.1:${env.VITE_PORT}`,
    'http://localhost:8083'
  ],
  credentials: true
}))
app.use(express.json())


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'beefree-ai-agent-server',
    timestamp: new Date().toISOString()
  })
})

// Initialize MCP server for Beefree
const beefreeMcpServer = new MCPServerStreamableHttp({
  url: 'https://api.getbee.io/v1/sdk/mcp',
  name: 'Beefree SDK MCP Server',
  requestInit: {
    headers: {
      'Authorization': `Bearer ${env.BEEFREE_MCP_API_KEY}`,
      'x-bee-mcp-session-id': 'ai-agent-session-001',
      'x-bee-uid': env.BEEFREE_UID,
    }
  }
})

// Connect to MCP server
await beefreeMcpServer.connect()

// Initialize AI agent with Beefree MCP tools
const emailDesignAgent = new Agent({
  name: 'Email Design Assistant',
  instructions: `You are an expert email design assistant powered by the Beefree SDK. You help users create professional, 
responsive email templates using natural language instructions.

Your capabilities include:
- Creating email structure with sections, columns, and rows
- Adding content blocks: titles, paragraphs, images, buttons, icons, dividers, spacers, social links
- Applying styling: colors, fonts, spacing, backgrounds
- Searching and cloning templates from a library of 1,500+ designs
- Validating emails for accessibility, broken links, and best practices
- Searching for stock images via Pexels API

IMPORTANT: When you start working on a user's request, break it down into clear steps and execute them methodically.
Always provide progress updates to keep the user informed.

Examples of what you can help with:
- "Create a welcome email" → Set up basic structure with header, content, and footer sections
- "Add a hero section with CTA" → Add section, insert image, add button with styling
- "Make it look professional" → Apply consistent spacing, colors, and typography
- "Find templates for product launch" → Search template catalog with relevant keywords
- "Check for accessibility issues" → Run validation and report findings

Be creative, helpful, and proactive in suggesting improvements to make emails look great!`,
  mcpServers: [beefreeMcpServer],
  model: 'gpt-4o-mini' // Using cost-effective model, can upgrade to gpt-4o for better results
})

// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
  console.log('🔌 WebSocket client connected')

  ws.on('message', async (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString())
      
      if (data.type === 'chat') {
        const userMessage = data.message as string
        console.log('📨 Received message:', userMessage)

        // Send acknowledgment
        ws.send(JSON.stringify({
          type: 'start',
          message: 'Processing your request...'
        }))

        try {
          // Run agent with streaming
          const streamResult = await run(emailDesignAgent, userMessage, {
            stream: true
          })

          let finalOutput = ''

          // Stream AI responses back to client
          for await (const event of streamResult) {
            if (event.type === 'raw_model_stream_event' && 
                event.data.type === 'model' && 
                event.data.event.type === 'response.output_text.delta') {
              const deltaText = event.data.event.delta || ''
              finalOutput += deltaText
              ws.send(JSON.stringify({
                type: 'stream',
                content: deltaText
              }))
            }
          }

          // Send completion message
          ws.send(JSON.stringify({
            type: 'complete',
            message: finalOutput || 'Task completed successfully!'
          }))

        } catch (agentError) {
          console.error('❌ Agent error:', agentError)
          ws.send(JSON.stringify({
            type: 'error',
            message: agentError instanceof Error ? agentError.message : 'Failed to process request'
          }))
        }
      }
    } catch (error) {
      console.error('❌ WebSocket message error:', error)
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }))
    }
  })

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected')
  })

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error)
  })
})

// Start server
const PORT = parseInt(env.PORT)
server.listen(PORT, () => {
  console.log(`
🚀 Beefree AI Agent Server started!
   
   HTTP Server: http://localhost:${PORT}
   WebSocket: ws://localhost:${PORT}
   Health Check: http://localhost:${PORT}/health
   
   Frontend should be running on: http://localhost:${env.VITE_PORT}
   
   Environment:
   - Beefree UID: ${env.BEEFREE_UID}
   - OpenAI Model: gpt-4o-mini
   - MCP Endpoint: https://api.getbee.io/v1/sdk/mcp
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})
