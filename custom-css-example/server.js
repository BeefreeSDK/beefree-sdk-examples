const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import shared authentication module
const { setupAuthEndpoint } = require('../shared/auth');

const app = express();
const PORT = process.env.PORT || 8081;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files with proper MIME types
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Serve static files from current directory
app.use(express.static(__dirname));

// Setup authentication endpoint using shared module
setupAuthEndpoint(app, process.env.BEEFREE_CLIENT_ID, process.env.BEEFREE_CLIENT_SECRET);

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Custom CSS Example Server Running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎨 Custom CSS Example Server running on http://localhost:${PORT}`);
    console.log(`📖 Open http://localhost:${PORT} to view the example`);
});

module.exports = app;
