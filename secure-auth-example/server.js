const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import shared authentication module
const { setupAuthEndpoint } = require('../shared/auth.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

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

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Open http://localhost:${PORT} to view the example`);
  
  // Check if environment variables are set
  if (!process.env.BEEFREE_CLIENT_ID || !process.env.BEEFREE_CLIENT_SECRET) {
    console.warn('⚠️  Warning: Beefree SDK credentials not found in environment variables');
    console.warn('   Please copy .env.example to .env and add your credentials');
  }
});
