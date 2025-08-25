/**
 * PDF Exporter Utility Class
 * Handles PDF export operations for Beefree SDK templates
 */

class PDFExporter {
    constructor() {
        this.exportHistory = [];
        this.activeExports = new Map();
        this.loadExportHistory();
    }

    /**
     * Export a single template to PDF
     */
    async exportToPDF(templateData, options = {}) {
        const exportId = this.generateExportId();
        
        try {
            this.updateProgress(exportId, 0, 'Starting PDF export...');
            
            const exportPayload = {
                templateHtml: templateData.html,
                templateJson: templateData.json,
                exportOptions: {
                    pageSize: options.pageSize || 'A4',
                    orientation: options.orientation || 'portrait',
                    quality: options.quality || 'high',
                    scale: options.scale || 1,
                    margins: options.margins || {
                        top: '20mm',
                        right: '20mm',
                        bottom: '20mm',
                        left: '20mm'
                    },
                    printBackground: options.printBackground !== false,
                    displayHeaderFooter: options.displayHeaderFooter || false,
                    headerTemplate: options.headerTemplate || '',
                    footerTemplate: options.footerTemplate || ''
                }
            };

            this.updateProgress(exportId, 25, 'Sending export request...');

            const response = await fetch('/api/export/pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exportPayload)
            });

            this.updateProgress(exportId, 50, 'Processing export...');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Export failed');
            }

            const result = await response.json();
            
            this.updateProgress(exportId, 75, 'Finalizing export...');

            // Handle different response types
            if (result.downloadUrl && result.status === 'completed') {
                // Immediate download available
                this.updateProgress(exportId, 100, 'Export completed!');
                
                const exportRecord = {
                    id: exportId,
                    timestamp: new Date().toISOString(),
                    status: 'completed',
                    downloadUrl: result.downloadUrl,
                    options: options,
                    templateName: templateData.name || 'Untitled Template'
                };
                
                this.addToHistory(exportRecord);
                return exportRecord;
                
            } else if (result.exportId) {
                // Async export - need to poll for status
                return await this.pollExportStatus(result.exportId, exportId, options);
                
            } else {
                throw new Error('Invalid export response: ' + JSON.stringify(result));
            }

        } catch (error) {
            this.updateProgress(exportId, 0, `Export failed: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Poll export status for async exports
     */
    async pollExportStatus(serverExportId, localExportId, options) {
        const maxAttempts = 30; // 5 minutes max (10s intervals)
        let attempts = 0;

        return new Promise((resolve, reject) => {
            const pollInterval = setInterval(async () => {
                attempts++;
                
                try {
                    const response = await fetch(`/api/export/status/${serverExportId}`);
                    
                    if (!response.ok) {
                        throw new Error('Status check failed');
                    }

                    const statusData = await response.json();
                    const progress = Math.min(75 + (statusData.progress || 0) * 0.25, 100);
                    
                    this.updateProgress(localExportId, progress, `Processing: ${statusData.status}`);

                    if (statusData.status === 'completed') {
                        clearInterval(pollInterval);
                        
                        const exportRecord = {
                            id: localExportId,
                            serverExportId: serverExportId,
                            timestamp: new Date().toISOString(),
                            status: 'completed',
                            downloadUrl: statusData.downloadUrl,
                            options: options,
                            templateName: 'Exported Template'
                        };
                        
                        this.addToHistory(exportRecord);
                        this.updateProgress(localExportId, 100, 'Export completed!');
                        resolve(exportRecord);
                        
                    } else if (statusData.status === 'failed') {
                        clearInterval(pollInterval);
                        const error = new Error(statusData.error || 'Export failed');
                        this.updateProgress(localExportId, 0, `Export failed: ${error.message}`, 'error');
                        reject(error);
                        
                    } else if (attempts >= maxAttempts) {
                        clearInterval(pollInterval);
                        const error = new Error('Export timeout');
                        this.updateProgress(localExportId, 0, 'Export timeout', 'error');
                        reject(error);
                    }

                } catch (error) {
                    if (attempts >= maxAttempts) {
                        clearInterval(pollInterval);
                        this.updateProgress(localExportId, 0, `Status check failed: ${error.message}`, 'error');
                        reject(error);
                    }
                }
            }, 10000); // Poll every 10 seconds
        });
    }

    /**
     * Export multiple templates in batch
     */
    async batchExport(templates, options = {}) {
        const batchId = this.generateExportId();
        
        try {
            this.updateProgress(batchId, 0, `Starting batch export of ${templates.length} templates...`);

            const response = await fetch('/api/export/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    templates: templates,
                    exportOptions: options
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Batch export failed');
            }

            const result = await response.json();
            
            this.updateProgress(batchId, 100, `Batch export completed: ${result.successfulExports}/${result.totalTemplates} successful`);

            // Add successful exports to history
            result.results.forEach((exportResult, index) => {
                if (exportResult.success) {
                    const exportRecord = {
                        id: `${batchId}-${index}`,
                        timestamp: new Date().toISOString(),
                        status: 'completed',
                        downloadUrl: exportResult.downloadUrl,
                        options: options,
                        templateName: `Batch Template ${index + 1}`,
                        batchId: batchId
                    };
                    this.addToHistory(exportRecord);
                }
            });

            return result;

        } catch (error) {
            this.updateProgress(batchId, 0, `Batch export failed: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Download a PDF file
     */
    async downloadPDF(exportRecord) {
        try {
            if (exportRecord.downloadUrl) {
                // Direct download URL
                const link = document.createElement('a');
                link.href = exportRecord.downloadUrl;
                link.download = `template-${exportRecord.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
            } else if (exportRecord.serverExportId) {
                // Download via server endpoint
                const response = await fetch(`/api/export/download/${exportRecord.serverExportId}`);
                
                if (!response.ok) {
                    throw new Error('Download failed');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `template-${exportRecord.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }

            console.log(`📥 Downloaded PDF: ${exportRecord.templateName}`);

        } catch (error) {
            console.error('Download failed:', error);
            throw error;
        }
    }

    /**
     * Update export progress
     */
    updateProgress(exportId, progress, message, type = 'info') {
        this.activeExports.set(exportId, {
            progress: progress,
            message: message,
            type: type,
            timestamp: new Date().toISOString()
        });

        // Dispatch progress event
        window.dispatchEvent(new CustomEvent('exportProgress', {
            detail: {
                exportId: exportId,
                progress: progress,
                message: message,
                type: type
            }
        }));
    }

    /**
     * Add export to history
     */
    addToHistory(exportRecord) {
        this.exportHistory.unshift(exportRecord);
        
        // Keep only last 20 exports
        if (this.exportHistory.length > 20) {
            this.exportHistory = this.exportHistory.slice(0, 20);
        }
        
        this.saveExportHistory();
        
        // Dispatch history update event
        window.dispatchEvent(new CustomEvent('exportHistoryUpdated', {
            detail: { history: this.exportHistory }
        }));
    }

    /**
     * Get export history
     */
    getHistory() {
        return this.exportHistory;
    }

    /**
     * Clear export history
     */
    clearHistory() {
        this.exportHistory = [];
        this.saveExportHistory();
        
        window.dispatchEvent(new CustomEvent('exportHistoryUpdated', {
            detail: { history: this.exportHistory }
        }));
    }

    /**
     * Generate unique export ID
     */
    generateExportId() {
        return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Save export history to localStorage
     */
    saveExportHistory() {
        try {
            localStorage.setItem('beefree-export-history', JSON.stringify(this.exportHistory));
        } catch (error) {
            console.warn('Could not save export history:', error);
        }
    }

    /**
     * Load export history from localStorage
     */
    loadExportHistory() {
        try {
            const saved = localStorage.getItem('beefree-export-history');
            if (saved) {
                this.exportHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Could not load export history:', error);
            this.exportHistory = [];
        }
    }

    /**
     * Get export options from UI
     */
    getExportOptionsFromUI() {
        return {
            pageSize: document.getElementById('page-size')?.value || 'A4',
            orientation: document.getElementById('orientation')?.value || 'portrait',
            quality: document.getElementById('quality')?.value || 'high',
            scale: parseFloat(document.getElementById('scale')?.value || 1),
            margins: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        };
    }
}

// Export for global use
window.PDFExporter = PDFExporter;
