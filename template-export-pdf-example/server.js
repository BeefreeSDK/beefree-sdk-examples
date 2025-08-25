const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

// Import shared authentication module
const { setupAuthEndpoint } = require('../shared/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Configure multer for file uploads
const upload = multer({ 
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  storage: multer.memoryStorage()
});

// Beefree SDK Authentication using shared module
async function getBeefreeToken() {
  try {
    const { authenticateBeefree } = require('../shared/auth');
    const tokenData = await authenticateBeefree(
      process.env.BEEFREE_CLIENT_ID,
      process.env.BEEFREE_CLIENT_SECRET,
      'pdf-export-demo'
    );
    return tokenData.access_token;
  } catch (error) {
    console.error('❌ Authentication error:', error);
    throw error;
  }
}

// Export template to PDF using Content Services API
app.post('/api/export/pdf', async (req, res) => {
  try {
    const { templateHtml, templateJson, exportOptions = {} } = req.body;

    if (!templateHtml && !templateJson) {
      return res.status(400).json({
        error: 'Missing template data',
        message: 'Either templateHtml or templateJson is required'
      });
    }

    console.log('📄 Starting PDF export...');

    // Prepare export payload according to Beefree Content Services API
    const exportPayload = {
      page_size: exportOptions.pageSize || 'A4',
      page_orientation: exportOptions.orientation || 'portrait',
      html: templateHtml
    };

    // Call Content Services API for PDF export using API key authentication  
    const apiUrl = process.env.BEEFREE_CS_API_URL || 'https://api.getbee.io';
    const exportResponse = await fetch(`${apiUrl}/v1/message/pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BEEFREE_CS_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(exportPayload)
    });

    if (!exportResponse.ok) {
      const errorData = await exportResponse.text();
      console.error('❌ Export API error:', errorData);
      
      return res.status(exportResponse.status).json({
        error: 'PDF export failed',
        message: 'Content Services API export failed',
        details: errorData
      });
    }

    const exportResult = await exportResponse.json();

    console.log('✅ PDF export successful:', exportResult);

    // The API returns the PDF URL directly in the response
    const pdfUrl = exportResult.body?.url || exportResult.url || exportResult.downloadUrl;
    
    res.json({
      success: true,
      downloadUrl: pdfUrl,
      status: 'completed',
      message: 'PDF export completed successfully'
    });

  } catch (error) {
    console.error('❌ PDF export error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred during PDF export',
      details: error.message
    });
  }
});

// Check export status (for async exports)
app.get('/api/export/status/:exportId', async (req, res) => {
  try {
    const { exportId } = req.params;
    
    console.log(`🔍 Checking export status: ${exportId}`);

    const token = await getBeefreeToken();

    const statusResponse = await fetch(`${process.env.BEEFREE_CS_API_URL}/v1/export/${exportId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!statusResponse.ok) {
      return res.status(statusResponse.status).json({
        error: 'Status check failed',
        message: 'Could not retrieve export status'
      });
    }

    const statusData = await statusResponse.json();

    res.json({
      success: true,
      exportId: exportId,
      status: statusData.status,
      progress: statusData.progress || 0,
      downloadUrl: statusData.downloadUrl,
      error: statusData.error,
      message: statusData.message
    });

  } catch (error) {
    console.error('❌ Status check error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to check export status',
      details: error.message
    });
  }
});

// Download PDF file
app.get('/api/export/download/:exportId', async (req, res) => {
  try {
    const { exportId } = req.params;
    
    console.log(`📥 Downloading PDF: ${exportId}`);

    const token = await getBeefreeToken();

    const downloadResponse = await fetch(`${process.env.BEEFREE_CS_API_URL}/v1/export/${exportId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!downloadResponse.ok) {
      return res.status(downloadResponse.status).json({
        error: 'Download failed',
        message: 'Could not download PDF file'
      });
    }

    // Stream the PDF file to client
    const filename = `template-${exportId}-${Date.now()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    downloadResponse.body.pipe(res);

  } catch (error) {
    console.error('❌ Download error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to download PDF',
      details: error.message
    });
  }
});

// Batch export multiple templates
app.post('/api/export/batch', async (req, res) => {
  try {
    const { templates, exportOptions = {} } = req.body;

    if (!Array.isArray(templates) || templates.length === 0) {
      return res.status(400).json({
        error: 'Invalid templates',
        message: 'Templates array is required and must not be empty'
      });
    }

    console.log(`📄 Starting batch PDF export for ${templates.length} templates...`);

    const token = await getBeefreeToken();
    const exportResults = [];

    // Process each template
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      
      try {
        const exportPayload = {
          html: template.html,
          json: template.json,
          format: 'pdf',
          options: {
            pageSize: exportOptions.pageSize || 'A4',
            orientation: exportOptions.orientation || 'portrait',
            quality: exportOptions.quality || 'high',
            margins: exportOptions.margins || {
              top: '20mm',
              right: '20mm', 
              bottom: '20mm',
              left: '20mm'
            }
          }
        };

        const exportResponse = await fetch(`${process.env.BEEFREE_CS_API_URL}/v1/export`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(exportPayload)
        });

        if (exportResponse.ok) {
          const result = await exportResponse.json();
          exportResults.push({
            index: i,
            templateId: template.id || i,
            success: true,
            exportId: result.exportId,
            downloadUrl: result.downloadUrl,
            status: result.status
          });
        } else {
          exportResults.push({
            index: i,
            templateId: template.id || i,
            success: false,
            error: `Export failed with status ${exportResponse.status}`
          });
        }

      } catch (error) {
        exportResults.push({
          index: i,
          templateId: template.id || i,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = exportResults.filter(r => r.success).length;
    
    console.log(`✅ Batch export completed: ${successCount}/${templates.length} successful`);

    res.json({
      success: true,
      totalTemplates: templates.length,
      successfulExports: successCount,
      failedExports: templates.length - successCount,
      results: exportResults,
      message: `Batch export completed: ${successCount}/${templates.length} successful`
    });

  } catch (error) {
    console.error('❌ Batch export error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Batch export failed',
      details: error.message
    });
  }
});

// Setup shared authentication endpoint
setupAuthEndpoint(app, process.env.BEEFREE_CLIENT_ID, process.env.BEEFREE_CLIENT_SECRET);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Beefree SDK PDF Export Example',
    timestamp: new Date().toISOString()
  });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Open http://localhost:${PORT} to view the PDF export example`);
  
  // Check environment variables
  if (!process.env.BEEFREE_CLIENT_ID || !process.env.BEEFREE_CLIENT_SECRET) {
    console.warn('⚠️  Warning: Beefree SDK credentials not found');
    console.warn('   Please copy .env.example to .env and add your credentials');
  }
  
  if (!process.env.BEEFREE_CS_API_KEY) {
    console.warn('⚠️  Warning: Content Services API key not found');
    console.warn('   PDF export functionality may be limited');
  }
});
