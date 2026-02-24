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
const PORT = process.env.PORT || 3032;

app.use(cors());
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));
} else {
  app.use(express.static(path.join(__dirname)));
}

async function authenticateBeefree(clientId: string, clientSecret: string, uid: string) {
  const authUrl = 'https://auth.getbee.io/loginV2';
  let response: globalThis.Response;
  try {
    response = await fetch(authUrl, {
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
  } catch (error: any) {
    throw new Error(`Network error contacting Beefree auth service: ${error.message}`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed: ${response.status} ${errorText}`);
  }
  return await response.json();
}

function resolveCredentials(builderType: string | undefined): { clientId: string | undefined; clientSecret: string | undefined } {
  switch (builderType) {
    case 'emailBuilder':
      return {
        clientId: process.env.EMAIL_CLIENT_ID || process.env.BEEFREE_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET || process.env.BEEFREE_CLIENT_SECRET,
      };
    case 'pageBuilder':
      return {
        clientId: process.env.PAGE_CLIENT_ID || process.env.BEEFREE_CLIENT_ID,
        clientSecret: process.env.PAGE_CLIENT_SECRET || process.env.BEEFREE_CLIENT_SECRET,
      };
    case 'popupBuilder':
      return {
        clientId: process.env.POPUP_CLIENT_ID || process.env.BEEFREE_CLIENT_ID,
        clientSecret: process.env.POPUP_CLIENT_SECRET || process.env.BEEFREE_CLIENT_SECRET,
      };
    case 'fileManager':
      return {
        clientId: process.env.FILE_MANAGER_CLIENT_ID || process.env.BEEFREE_CLIENT_ID,
        clientSecret: process.env.FILE_MANAGER_CLIENT_SECRET || process.env.BEEFREE_CLIENT_SECRET,
      };
    default:
      return {
        clientId: process.env.EMAIL_CLIENT_ID || process.env.BEEFREE_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET || process.env.BEEFREE_CLIENT_SECRET,
      };
  }
}

app.post('/auth/token', async (req: Request, res: Response) => {
  try {
    const { uid, builderType } = req.body;

    console.log(`🔐 Auth request: builderType=${builderType || 'default'}, uid=${uid || 'demo-user'}`);

    const { clientId, clientSecret } = resolveCredentials(builderType);

    if (!clientId || !clientSecret) {
      console.error('❌ Missing Beefree credentials for', builderType || 'default');
      return res.status(500).json({
        error: 'Missing Beefree credentials configuration',
        details: `No credentials found for ${builderType || 'default'} builder. Check your .env file.`
      });
    }

    const tokenData = await authenticateBeefree(clientId, clientSecret, uid || 'react-email-builder-demo');
    console.log(`✅ Authentication successful for ${builderType || 'default'} builder`);
    res.json(tokenData);
  } catch (error: any) {
    console.error('❌ Auth endpoint error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Beefree SDK React Email Builder Example'
  });
});

app.get('*', (req: Request, res: Response) => {
  if (isProduction && fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.use((error: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

app.listen(PORT, () => {
  const hasEmailCreds = !!(process.env.EMAIL_CLIENT_ID && process.env.EMAIL_CLIENT_SECRET);
  const hasPageCreds = !!(process.env.PAGE_CLIENT_ID && process.env.PAGE_CLIENT_SECRET);
  const hasPopupCreds = !!(process.env.POPUP_CLIENT_ID && process.env.POPUP_CLIENT_SECRET);
  const hasFileManagerCreds = !!(process.env.FILE_MANAGER_CLIENT_ID && process.env.FILE_MANAGER_CLIENT_SECRET);
  const hasDefaultCreds = !!(process.env.BEEFREE_CLIENT_ID && process.env.BEEFREE_CLIENT_SECRET);

  console.log(`\n🚀 Beefree SDK React Email Builder Example Server`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`🔧 API endpoints:`);
  console.log(`   • POST /auth/token     - Authentication`);
  console.log(`   • GET /api/health      - Health Check`);
  console.log(`\n📋 Credentials Status:`);
  console.log(`   • Email Builder:   ${hasEmailCreds ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   • Page Builder:    ${hasPageCreds ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   • Popup Builder:   ${hasPopupCreds ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   • File Manager:    ${hasFileManagerCreds ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   • Default (Fallback): ${hasDefaultCreds ? '✅ Configured' : '⚠️  Not set'}`);

  if (!hasEmailCreds && !hasPageCreds && !hasPopupCreds && !hasFileManagerCreds && !hasDefaultCreds) {
    console.log(`\n⚠️  WARNING: No credentials configured! Authentication will fail.`);
  }

  console.log(`\n🎯 Ready for operations!`);
});
