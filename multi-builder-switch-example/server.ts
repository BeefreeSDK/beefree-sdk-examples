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

// Configure dotenv - load environment variables from .env file
dotenv.config();

// Log environment variable status on startup
console.log('\n📋 Environment Variables Status:');
console.log('   • EMAIL_CLIENT_ID:', process.env.EMAIL_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('   • EMAIL_CLIENT_SECRET:', process.env.EMAIL_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('   • PAGE_CLIENT_ID:', process.env.PAGE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('   • PAGE_CLIENT_SECRET:', process.env.PAGE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('   • POPUP_CLIENT_ID:', process.env.POPUP_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('   • POPUP_CLIENT_SECRET:', process.env.POPUP_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('   • BEEFREE_CLIENT_ID:', process.env.BEEFREE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('   • BEEFREE_CLIENT_SECRET:', process.env.BEEFREE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('');

const app = express();
const PORT = process.env.PORT || 3006; // Use port 3006 for multi-builder example

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
    const { uid, builderType } = req.body;
    
    console.log('🔐 Auth request received:', { uid, builderType, bodyKeys: Object.keys(req.body) });
    
    // Determine which credentials to use based on builder type
    // Each builder type should have its own application in Developer Console
    // The builder type determines which sidebar options are available (e.g., Form for Page builder)
    let clientId: string | undefined;
    let clientSecret: string | undefined;
    
    // Check available env vars for debugging
    const availableEnvVars = {
      hasEmailId: !!process.env.EMAIL_CLIENT_ID,
      hasEmailSecret: !!process.env.EMAIL_CLIENT_SECRET,
      hasPageId: !!process.env.PAGE_CLIENT_ID,
      hasPageSecret: !!process.env.PAGE_CLIENT_SECRET,
      hasPopupId: !!process.env.POPUP_CLIENT_ID,
      hasPopupSecret: !!process.env.POPUP_CLIENT_SECRET,
      hasDefaultId: !!process.env.BEEFREE_CLIENT_ID,
      hasDefaultSecret: !!process.env.BEEFREE_CLIENT_SECRET,
    };
    console.log('📋 Available environment variables:', availableEnvVars);
    
    if (builderType === 'email') {
      clientId = process.env.EMAIL_CLIENT_ID || process.env.BEEFREE_CLIENT_ID;
      clientSecret = process.env.EMAIL_CLIENT_SECRET || process.env.BEEFREE_CLIENT_SECRET;
      console.log(`📧 Using Email builder credentials:`, { 
        usingEmailSpecific: !!process.env.EMAIL_CLIENT_ID,
        clientIdSet: !!clientId,
        clientSecretSet: !!clientSecret
      });
    } else if (builderType === 'page') {
      clientId = process.env.PAGE_CLIENT_ID || process.env.BEEFREE_CLIENT_ID;
      clientSecret = process.env.PAGE_CLIENT_SECRET || process.env.BEEFREE_CLIENT_SECRET;
      console.log(`📄 Using Page builder credentials:`, { 
        usingPageSpecific: !!process.env.PAGE_CLIENT_ID,
        clientIdSet: !!clientId,
        clientSecretSet: !!clientSecret
      });
    } else if (builderType === 'popup') {
      clientId = process.env.POPUP_CLIENT_ID || process.env.BEEFREE_CLIENT_ID;
      clientSecret = process.env.POPUP_CLIENT_SECRET || process.env.BEEFREE_CLIENT_SECRET;
      console.log(`🎯 Using Popup builder credentials:`, { 
        usingPopupSpecific: !!process.env.POPUP_CLIENT_ID,
        clientIdSet: !!clientId,
        clientSecretSet: !!clientSecret
      });
    } else {
      // Fallback: try email first, then default
      // This handles cases where builderType might be undefined or unexpected
      clientId = process.env.EMAIL_CLIENT_ID || process.env.BEEFREE_CLIENT_ID;
      clientSecret = process.env.EMAIL_CLIENT_SECRET || process.env.BEEFREE_CLIENT_SECRET;
      console.log(`⚙️ Using fallback credentials (builderType: ${builderType || 'undefined'})`);
    }

    if (!clientId || !clientSecret) {
      const missingCreds = [];
      if (!clientId) missingCreds.push('Client ID');
      if (!clientSecret) missingCreds.push('Client Secret');
      
      console.error('❌ Missing Beefree credentials', { 
        builderType: builderType || 'undefined',
        missing: missingCreds,
        availableEnvVars
      });
      
      const builderSpecificVars = builderType === 'email' ? 'EMAIL_CLIENT_ID and EMAIL_CLIENT_SECRET' :
                                  builderType === 'page' ? 'PAGE_CLIENT_ID and PAGE_CLIENT_SECRET' :
                                  builderType === 'popup' ? 'POPUP_CLIENT_ID and POPUP_CLIENT_SECRET' :
                                  'EMAIL_CLIENT_ID/EMAIL_CLIENT_SECRET or BEEFREE_CLIENT_ID/BEEFREE_CLIENT_SECRET';
      
      return res.status(500).json({ 
        error: 'Missing Beefree credentials configuration',
        details: `No credentials found for ${builderType || 'default'} builder. Please set ${builderSpecificVars} in your .env file.`
      });
    }

    console.log(`🔐 Authenticating for ${builderType || 'default'} builder with client ID: ${clientId.substring(0, 8)}...`);
    
    try {
      const tokenData = await authenticateBeefree(clientId, clientSecret, uid || 'multi-builder-demo');
      console.log(`✅ Authentication successful for ${builderType || 'default'} builder`);
      res.json(tokenData);
    } catch (authError: any) {
      console.error('❌ Beefree API authentication failed:', {
        builderType: builderType || 'default',
        clientIdPrefix: clientId.substring(0, 8) + '...',
        errorMessage: authError.message,
        usedCredentials: builderType === 'email' ? 'EMAIL_CLIENT_ID/EMAIL_CLIENT_SECRET' :
                        builderType === 'page' ? 'PAGE_CLIENT_ID/PAGE_CLIENT_SECRET' :
                        builderType === 'popup' ? 'POPUP_CLIENT_ID/POPUP_CLIENT_SECRET' :
                        'EMAIL_CLIENT_ID/EMAIL_CLIENT_SECRET (fallback)'
      });
      throw authError; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error('❌ Auth endpoint error:', error);
    
    // Provide more helpful error message
    const errorMessage = error.message || 'Unknown error';
    const isCredentialError = errorMessage.includes('client_id') || errorMessage.includes('client_secret') || errorMessage.includes('credentials');
    
    res.status(500).json({ 
      error: 'Authentication failed', 
      details: isCredentialError 
        ? `Invalid credentials for ${builderType || 'default'} builder. Please verify your ${builderType === 'email' ? 'EMAIL' : builderType === 'page' ? 'PAGE' : builderType === 'popup' ? 'POPUP' : 'EMAIL'} credentials in .env file.`
        : errorMessage
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Beefree SDK Multi-Builder Example Server'
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
  console.log(`\n🚀 Beefree SDK Multi-Builder Example Server`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`🔧 API endpoints:`);
  console.log(`   • POST /auth/token     - Authentication`);
  console.log(`   • GET /api/health      - Health Check`);
  
  // Check if we have at least one set of builder credentials
  const hasEmailCreds = !!(process.env.EMAIL_CLIENT_ID && process.env.EMAIL_CLIENT_SECRET);
  const hasPageCreds = !!(process.env.PAGE_CLIENT_ID && process.env.PAGE_CLIENT_SECRET);
  const hasPopupCreds = !!(process.env.POPUP_CLIENT_ID && process.env.POPUP_CLIENT_SECRET);
  const hasDefaultCreds = !!(process.env.BEEFREE_CLIENT_ID && process.env.BEEFREE_CLIENT_SECRET);
  
  console.log(`\n📋 Credentials Status:`);
  console.log(`   • Email Builder: ${hasEmailCreds ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   • Page Builder: ${hasPageCreds ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   • Popup Builder: ${hasPopupCreds ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   • Default (Fallback): ${hasDefaultCreds ? '✅ Configured' : '⚠️  Not set (using builder-specific only)'}`);
  
  if (!hasEmailCreds && !hasPageCreds && !hasPopupCreds && !hasDefaultCreds) {
    console.log(`\n⚠️  WARNING: No credentials configured! Authentication will fail.`);
  }
  
  console.log(`\n🎯 Ready for operations!`);
});

