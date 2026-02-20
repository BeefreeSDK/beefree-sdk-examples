import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3031;

app.use(cors());
app.use(express.json());

// Serve compiled LWC bundle
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve static assets (CSS, images)
app.use('/public', express.static(path.join(__dirname, 'public')));

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

app.post('/auth/token', async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    const clientId = process.env.BEEFREE_CLIENT_ID;
    const clientSecret = process.env.BEEFREE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing Beefree credentials');
      return res.status(500).json({ error: 'Missing Beefree credentials configuration' });
    }

    if (uid && typeof uid !== 'string') {
      return res.status(400).json({ error: 'Invalid uid parameter' });
    }

    const tokenData = await authenticateBeefree(clientId, clientSecret, uid || 'salesforce-lwc-example');
    res.json(tokenData);
  } catch (error: any) {
    console.error('Auth endpoint error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Beefree SDK Salesforce LWC Example Server'
  });
});

// SPA fallback — serve index.html for all other routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((error: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`\nBeefree SDK Salesforce LWC Example Server`);
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  POST /auth/token     - Authentication`);
  console.log(`  GET  /api/health     - Health Check`);
  console.log(`\nEnvironment check:`);
  console.log(`  BEEFREE_CLIENT_ID:     ${process.env.BEEFREE_CLIENT_ID ? 'Set' : 'Missing'}`);
  console.log(`  BEEFREE_CLIENT_SECRET: ${process.env.BEEFREE_CLIENT_SECRET ? 'Set' : 'Missing'}`);
  console.log(`\nReady!`);
});
