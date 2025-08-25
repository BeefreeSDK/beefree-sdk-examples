/**
 * Beefree SDK Template Export PDF Example
 * Main application logic for PDF export functionality
 */

class BeefreeExportApp {
    constructor() {
        this.beeInstance = null;
        this.pdfExporter = null;
        this.currentTemplate = null;
        this.isBuilderLoaded = false;
        
        this.initializeApp();
    }

    async initializeApp() {
        // Initialize PDF exporter
        this.pdfExporter = new PDFExporter();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up export progress listener
        this.setupProgressListener();
        
        // Set up export history listener
        this.setupHistoryListener();
        
        // Initialize UI
        this.initializeUI();
        
        this.updateStatus('Ready to load Beefree SDK for PDF export functionality');
    }

    setupEventListeners() {
        // Load builder
        document.getElementById('load-builder-btn').addEventListener('click', () => {
            this.loadBuilder();
        });
        
        // Export to PDF
        document.getElementById('export-pdf-btn').addEventListener('click', () => {
            this.exportCurrentTemplate();
        });
        
        // Batch export
        document.getElementById('batch-export-btn').addEventListener('click', () => {
            this.showBatchExportDialog();
        });
        
        // Save template button was removed from HTML
        
        // Preview template button was removed from HTML
        
        // Scale slider
        const scaleSlider = document.getElementById('scale');
        const scaleValue = document.getElementById('scale-value');
        scaleSlider.addEventListener('input', (e) => {
            scaleValue.textContent = e.target.value;
        });
    }

    setupProgressListener() {
        window.addEventListener('exportProgress', (e) => {
            const { exportId, progress, message, type } = e.detail;
            this.updateProgress(progress, message, type);
        });
    }

    setupHistoryListener() {
        // Export history listener removed - no UI panel for history
    }

    initializeUI() {
        // Export history UI removed
    }

    async loadBuilder() {
        const loadBtn = document.getElementById('load-builder-btn');
        
        try {
            loadBtn.disabled = true;
            loadBtn.textContent = '⏳ Loading...';
            
            this.updateStatus('🚀 Initializing Beefree SDK...');
            
            // Get authentication token
            const uid = document.getElementById('uid').value.trim() || 'pdf-demo-user';
            const token = await this.getAuthToken(uid);
            
            // Configure Beefree SDK
            const beeConfig = {
                uid: uid,
                container: 'bee-plugin-container',
                language: 'en-US',
                authToken: token,
                
                // Builder configuration
                workspace: {
                    type: 'mixed'
                },

                onSave: (jsonFile, htmlFile) => {
                    console.log('📄 Template saved:', { jsonFile, htmlFile });
                    // Store template data for export
                    this.currentTemplateData = {
                        jsonFile: jsonFile,
                        htmlFile: htmlFile
                    };
                    
                    // If export is pending, continue with export
                    if (this.exportPending) {
                        this.exportPending = false;
                        this.continueExport(this.currentTemplateData);
                    }
                    this.updateStatus('✅ Template saved successfully!');
                },

                onSaveAsTemplate: (jsonFile) => {
                    console.log('💾 Saved as template:', jsonFile);
                    this.updateStatus('✅ Template saved to catalog!');
                },

                onPreview: (htmlFile) => {
                    console.log('👀 Preview generated:', htmlFile);
                    this.updateStatus('👀 Preview generated');
                },

                onLoad: () => {
                    this.onBuilderLoaded();
                },

                onError: (errorMessage) => {
                    console.error('❌ Beefree SDK Error:', errorMessage);
                    this.updateStatus(`❌ SDK Error: ${errorMessage}`, 'error');
                }
            };

            // Initialize Beefree SDK
            this.beeInstance = await new Promise((resolve, reject) => {
                BeePlugin.create(token, beeConfig, (beePluginInstance) => {
                    console.log('✅ BeePlugin instance created successfully');
                    
                    // Load default template from Beefree
                    console.log('🚀 Loading default template...');
                    fetch("https://rsrc.getbee.io/api/templates/m-bee")
                        .then(res => res.json())
                        .then(template => {
                            console.log('📧 Template loaded, starting editor...');
                            beePluginInstance.start(template);
                            resolve(beePluginInstance);
                        })
                        .catch(err => {
                            console.error('❌ Template load failed:', err);
                            // Fallback to start without template
                            beePluginInstance.start();
                            resolve(beePluginInstance);
                        });
                }, (error) => {
                    reject(new Error(`Beefree SDK initialization failed: ${error}`));
                });
            });
            
        } catch (error) {
            console.error('Failed to load Beefree SDK:', error);
            this.updateStatus(`❌ Failed to load builder: ${error.message}`, 'error');
            loadBtn.disabled = false;
            loadBtn.textContent = '🚀 Load Builder';
        }
    }

    onBuilderLoaded() {
        console.log('✅ Builder loaded successfully');
        
        // Enable export buttons (check if elements exist first)
        const exportBtn = document.getElementById('export-pdf-btn');
        const batchBtn = document.getElementById('batch-export-btn');
        const saveBtn = document.getElementById('save-template-btn');
        const previewBtn = document.getElementById('preview-btn');
        
        if (exportBtn) exportBtn.disabled = false;
        if (batchBtn) batchBtn.disabled = false;
        if (saveBtn) saveBtn.disabled = false;
        if (previewBtn) previewBtn.disabled = false;
        
        this.updateStatus('🎉 Beefree SDK loaded! Create or edit a template, then export to PDF.');
    }

    async getAuthToken(uid) {
        const response = await fetch('/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uid })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Authentication failed');
        }

        const data = await response.json();
        return data;
    }

    exportCurrentTemplate() {
        if (!this.beeInstance) {
            this.updateStatus('❌ Builder not loaded yet', 'error');
            return;
        }

        this.updateStatus('📄 Preparing template for PDF export...');
        
        // Set flag to indicate export is pending
        this.exportPending = true;
        
        // Trigger save which will call onSave callback
        this.beeInstance.save();
    }

    async continueExport(templateData) {
        try {
            // Check if templateData has the required properties
            if (!templateData || !templateData.htmlFile) {
                console.error('❌ Template data structure:', templateData);
                throw new Error('Template data is incomplete - missing HTML content');
            }
            
            // Get export options from UI
            const options = this.pdfExporter.getExportOptionsFromUI();
            
            this.updateStatus('🚀 Starting PDF export...');
            
            // Export to PDF (map htmlFile/jsonFile to html/json for PDFExporter)
            const exportRecord = await this.pdfExporter.exportToPDF({
                html: templateData.htmlFile,
                json: templateData.jsonFile,
                name: 'Current Template'
            }, options);
            
            this.updateStatus('✅ PDF export completed! Check export history for download.', 'success');
            
            // Auto-download if available
            if (exportRecord.downloadUrl) {
                setTimeout(() => {
                    this.pdfExporter.downloadPDF(exportRecord);
                }, 1000);
            }
            
        } catch (error) {
            console.error('Export failed:', error);
            this.updateStatus(`❌ Export failed: ${error.message}`, 'error');
        }
    }

    async saveCurrentTemplate() {
        if (!this.beeInstance) {
            this.updateStatus('❌ Builder not loaded yet', 'error');
            return;
        }

        try {
            const templateData = await this.beeInstance.save();
            this.currentTemplate = templateData;
            this.updateStatus('💾 Template saved for export');
        } catch (error) {
            console.error('Save failed:', error);
            this.updateStatus(`❌ Save failed: ${error.message}`, 'error');
        }
    }

    async previewCurrentTemplate() {
        if (!this.beeInstance) {
            this.updateStatus('❌ Builder not loaded yet', 'error');
            return;
        }

        try {
            const htmlContent = await this.beeInstance.preview();
            
            // Open preview in new window
            const previewWindow = window.open('', '_blank');
            previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Template Preview</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        .preview-header { 
                            background: #667eea; 
                            color: white; 
                            padding: 20px; 
                            margin: -20px -20px 20px -20px;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="preview-header">
                        <h1>📧 Template Preview</h1>
                        <p>Ready for PDF Export</p>
                    </div>
                    ${htmlContent}
                </body>
                </html>
            `);
            previewWindow.document.close();
            
            this.updateStatus('👀 Preview opened in new window');
            
        } catch (error) {
            console.error('Preview failed:', error);
            this.updateStatus(`❌ Preview failed: ${error.message}`, 'error');
        }
    }

    showBatchExportDialog() {
        // For demo purposes, create sample templates
        const sampleTemplates = [
            {
                id: 'template1',
                html: '<h1>Sample Template 1</h1><p>This is a demo template for batch export.</p>',
                json: { type: 'email', content: 'Sample 1' }
            },
            {
                id: 'template2', 
                html: '<h1>Sample Template 2</h1><p>Another demo template for batch export.</p>',
                json: { type: 'email', content: 'Sample 2' }
            }
        ];

        if (confirm(`Start batch export of ${sampleTemplates.length} sample templates?`)) {
            this.batchExportTemplates(sampleTemplates);
        }
    }

    async batchExportTemplates(templates) {
        try {
            this.updateStatus(`📦 Starting batch export of ${templates.length} templates...`);
            
            const options = this.pdfExporter.getExportOptionsFromUI();
            const result = await this.pdfExporter.batchExport(templates, options);
            
            this.updateStatus(`✅ Batch export completed: ${result.successfulExports}/${result.totalTemplates} successful`, 'success');
            
        } catch (error) {
            console.error('Batch export failed:', error);
            this.updateStatus(`❌ Batch export failed: ${error.message}`, 'error');
        }
    }

    updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('status');
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;
        statusEl.classList.remove('hidden');
        
        console.log(`Status: ${message}`);
    }

    updateProgress(progress, message, type = 'info') {
        const progressContainer = document.getElementById('progress-container');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progress > 0) {
            progressContainer.classList.remove('hidden');
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% - ${message}`;
        } else {
            progressContainer.classList.add('hidden');
        }
        
        if (progress >= 100) {
            setTimeout(() => {
                progressContainer.classList.add('hidden');
            }, 3000);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.beefreeApp = new BeefreeExportApp();
});

// Global error handlers
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
