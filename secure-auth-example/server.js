import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import dotenv from 'dotenv';

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Import shared authentication module (CommonJS)
const require = createRequire(import.meta.url);
const { setupAuthEndpoint } = require('../shared/auth.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist in production, current directory in development
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && require('fs').existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));
  console.log('📦 Serving React build from dist/');
} else {
  app.use(express.static(path.join(__dirname)));
  console.log('🔧 Serving static files from current directory');
}

// Setup shared authentication endpoint
setupAuthEndpoint(app, process.env.BEEFREE_CLIENT_ID, process.env.BEEFREE_CLIENT_SECRET);

// Legacy endpoint for backward compatibility
app.post('/auth/beefree', async (req, res) => {
  // Redirect to the new shared endpoint
  req.url = '/auth/token';
  app._router.handle(req, res);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Beefree SDK Secure Auth Example',
    timestamp: new Date().toISOString()
  });
});

// Serve the React app
app.get('/', (req, res) => {
  if (isProduction && require('fs').existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    // Serve React build from dist
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    // Serve React HTML for development
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Route for React app (catch-all for client-side routing)
app.get('*', (req, res) => {
  if (isProduction && require('fs').existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Beefree SDK Secure Authentication Example');
  console.log(`📄 Version: 2.0.0 (React + TypeScript)`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log('🔧 API endpoints:');
  console.log('   • POST /auth/token - Authentication');
  console.log('   • GET /health - Health Check');
  console.log('📋 Environment check:');
  console.log(`   • BEEFREE_CLIENT_ID: ${process.env.BEEFREE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   • BEEFREE_CLIENT_SECRET: ${process.env.BEEFREE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   • MODE: ${isProduction ? '🏭 Production' : '🔧 Development'}`);
  console.log('🎯 Ready for secure authentication!');
  
  // Check if environment variables are set
  if (!process.env.BEEFREE_CLIENT_ID || !process.env.BEEFREE_CLIENT_SECRET) {
    console.warn('⚠️  Warning: Beefree SDK credentials not found in environment variables');
    console.warn('   Please copy .env.example to .env and add your credentials');
  }
});
