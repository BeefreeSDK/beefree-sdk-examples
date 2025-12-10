import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007; // Default to 3007 for this example

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory (for production build)
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));
} else {
  app.use(express.static(path.join(__dirname)));
}

// Authenticate with Beefree SDK
async function authenticateBeefree(clientId: string, clientSecret: string, uid: string) {
  const authUrl = 'https://auth.getbee.io/loginV2';
  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      uid: uid
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed: ${response.status} ${errorText}`);
  }
  return await response.json();
}

// Authentication endpoint for frontend
app.post('/auth/token', async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    const clientId = process.env.BEEFREE_CLIENT_ID;
    const clientSecret = process.env.BEEFREE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Missing Beefree credentials');
      return res.status(500).json({ error: 'Missing Beefree credentials configuration' });
    }

    const tokenData = await authenticateBeefree(clientId, clientSecret, uid || 'custom-css-demo');
    res.json(tokenData);
  } catch (error: any) {
    console.error('❌ Auth endpoint error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Beefree SDK Custom CSS Example Server'
  });
});

// Serve React app for all other routes (SPA fallback)
app.get('*', (req: Request, res: Response) => {
  if (isProduction && fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Beefree SDK Custom CSS Example Server`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`🔧 API endpoints:`);
  console.log(`   • POST /auth/token     - Authentication`);
  console.log(`   • GET /api/health      - Health Check`);
  console.log(`\n📋 Environment check:`);
  console.log(`   • BEEFREE_CLIENT_ID: ${process.env.BEEFREE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   • BEEFREE_CLIENT_SECRET: ${process.env.BEEFREE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`\n🎯 Ready for operations!`);
});

