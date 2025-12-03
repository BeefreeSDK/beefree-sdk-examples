import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv
dotenv.config();

// Note: This server handles both PDF export and Authentication

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from dist directory (for production build)
app.use(express.static(path.join(__dirname, 'dist')));

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

// Beefree SDK Authentication helper
// Uses local credentials
async function getBeefreeToken() {
  const clientId = process.env.BEEFREE_CLIENT_ID;
  const clientSecret = process.env.BEEFREE_CLIENT_SECRET;
  const uid = 'pdf-export-demo';

  if (!clientId || !clientSecret) {
    throw new Error('Missing Beefree credentials (BEEFREE_CLIENT_ID, BEEFREE_CLIENT_SECRET)');
  }

  try {
    const tokenData = await authenticateBeefree(clientId, clientSecret, uid);
    return tokenData.access_token;
  } catch (error) {
    console.error('❌ Authentication error:', error);
    throw error;
  }
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

    const tokenData = await authenticateBeefree(clientId, clientSecret, uid || 'pdf-export-demo');
    res.json(tokenData);
  } catch (error: any) {
    console.error('❌ Auth endpoint error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// Export template to PDF using Content Services API
app.post('/api/export/pdf', async (req: Request, res: Response) => {
  try {
    const { templateHtml, templateJson, exportOptions = {} } = req.body;
    
    console.log('🔍 Received request body:', {
      hasTemplateHtml: !!templateHtml,
      hasTemplateJson: !!templateJson,
      templateJsonType: typeof templateJson,
      templateJsonLength: templateJson ? JSON.stringify(templateJson).length : 0,
      templateJsonPreview: templateJson ? JSON.stringify(templateJson).substring(0, 200) : null,
      exportOptions
    });

    if (!templateHtml && !templateJson) {
      return res.status(400).json({
        error: 'Missing template data',
        message: 'Either templateHtml or templateJson is required'
      });
    }

    // Check if templateJson is empty or invalid
    if (templateJson && (JSON.stringify(templateJson) === '{}' || Object.keys(templateJson).length === 0)) {
      return res.status(400).json({
        error: 'Empty template data',
        message: 'Template JSON appears to be empty. Please create or modify a template first.'
      });
    }

    console.log('🔄 Starting PDF export...');
    console.log('📋 Export options:', exportOptions);

    // Get Beefree token for Content Services API
    const token = await getBeefreeToken();

    // Prepare export request according to Beefree API format
    const exportData: any = {};

    // Add template data - for PDF export, we need HTML or JSON (not both)
    if (templateHtml) {
      exportData.html = templateHtml;
      console.log('📄 Using HTML template for PDF export');
    } else if (templateJson) {
      // If we only have JSON, we need to pass it as 'json' field
      exportData.json = templateJson;
      console.log('📄 Using JSON template for PDF export');
    }

    // Add export options according to API documentation (underscore format)
    if (exportOptions.pageSize) {
      exportData.page_size = exportOptions.pageSize.toLowerCase(); // API expects page_size with underscore
    }
    if (exportOptions.orientation) {
      exportData.page_orientation = exportOptions.orientation.toLowerCase(); // API expects page_orientation with underscore
    }
    
    console.log('📋 Final export data structure:', {
      hasHtml: !!exportData.html,
      hasJson: !!exportData.json,
      page_size: exportData.page_size,
      page_orientation: exportData.page_orientation
    });

    console.log('🚀 Calling Content Services API...');

    // Call Beefree Content Services API
    const csApiUrl = process.env.BEEFREE_CS_API_URL || 'https://api.getbee.io';
    const response = await fetch(`${csApiUrl}/v1/message/pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(exportData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Content Services API error:', response.status, errorData);
      
      return res.status(response.status).json({
        success: false,
        error: 'Export failed',
        message: `Content Services API error: ${response.status} ${errorData}`,
        details: errorData
      });
    }

    // Handle different response types
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/pdf')) {
      // Direct PDF response - stream it to client
      console.log('✅ PDF generated successfully, streaming to client...');
      
      const filename = generateFilename(exportOptions);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache');
      
      // Stream the PDF data
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.send(buffer);
      
    } else {
      // JSON response with download URL or status
      const result = await response.json();
      console.log('📄 Export result:', result);
      
      if (result.downloadUrl) {
        // Proxy the download URL if needed
        const pdfResponse = await fetch(result.downloadUrl);
        const filename = generateFilename(exportOptions);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        const arrayBuffer = await pdfResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.send(buffer);
        
      } else {
        res.json({
          success: true,
          ...result,
          filename: generateFilename(exportOptions)
        });
      }
    }

  } catch (error: any) {
    console.error('❌ PDF export error:', error);
    res.status(500).json({
      success: false,
      error: 'Export failed',
      message: error.message,
      details: error.stack
    });
  }
});

// Generate filename for PDF export
function generateFilename(options: any) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const { pageSize = 'A4', orientation = 'Portrait' } = options;
  return `beefree-template-${pageSize}-${orientation}-${timestamp}.pdf`;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: [
      'PDF Export',
      'React + TypeScript',
      'Content Services API',
      'Self-contained Authentication'
    ]
  });
});

// Serve React app for all other routes (SPA fallback)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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
  console.log(`\n🚀 Beefree SDK PDF Export Example Server`);
  console.log(`📄 Version: 2.0.0`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`🔧 API endpoints:`);
  console.log(`   • POST /api/export/pdf - PDF Export`);
  console.log(`   • POST /auth/token     - Authentication`);
  console.log(`   • GET /api/health      - Health Check`);
  console.log(`\n📋 Environment check:`);
  console.log(`   • BEEFREE_CLIENT_ID: ${process.env.BEEFREE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   • BEEFREE_CLIENT_SECRET: ${process.env.BEEFREE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   • BEEFREE_CS_API_URL: ${process.env.BEEFREE_CS_API_URL || 'https://api.getbee.io (default)'}`);
  console.log(`\n🎯 Ready for operations!`);
});

