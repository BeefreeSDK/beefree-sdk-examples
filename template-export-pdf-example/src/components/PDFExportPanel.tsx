import { useState, useCallback } from 'react'
import { ExportOptions, PDFExportPanelProps } from '../types'
import { DEFAULT_EXPORT_OPTIONS } from '../config/constants'

export const PDFExportPanel = ({ pdfExport }: PDFExportPanelProps) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>(DEFAULT_EXPORT_OPTIONS)

  const handleExport = useCallback(async () => {
    try {
      console.log('🔍 Starting PDF export process...')
      
      // First, trigger Beefree SDK save to get fresh JSON and HTML
      const bee = (window as any).bee
      if (bee?.save) {
        console.log('💾 Triggering Beefree SDK save...')
        const saveResult = await bee.save()
        console.log('✅ Save result:', saveResult)
      } else {
        console.warn('⚠️ Beefree SDK save method not available')
      }

      // Wait a moment for onSave callback to update window.currentTemplate
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Get the saved template data (both JSON and HTML)
      const templateJson = window.currentTemplate?.jsonFile
      const templateHtml = window.currentTemplate?.htmlFile
      
      console.log('🔍 Template JSON available:', !!templateJson)
      console.log('🔍 Template HTML available:', !!templateHtml)
      console.log('🔍 Export options:', exportOptions)
      
      if (!templateJson && !templateHtml) {
        alert('❌ No template data available!\n\n📝 Please:\n1. Create or modify content in the editor above\n2. The system will automatically save when you click Export\n3. Make sure you have some content in your template')
        return
      }

      // Prepare template data - prefer HTML for PDF export
      let templateData
      if (templateHtml) {
        console.log('📄 Using HTML template for export')
        templateData = templateHtml
      } else if (templateJson) {
        console.log('📄 Using JSON template for export') 
        templateData = templateJson
      }
      
      await pdfExport.exportTemplate(templateData, exportOptions)
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [exportOptions, pdfExport])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <>
      {/* Main controls row */}
      <div className="pdf-export-panel">
        <div className="export-settings">
          <div className="control-group">
            <label htmlFor="pageSize">Page Size:</label>
            <select 
              id="pageSize"
              value={exportOptions.pageSize}
              onChange={(e) => setExportOptions(prev => ({
                ...prev,
                pageSize: e.target.value as 'A4' | 'Letter'
              }))}
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="orientation">Orientation:</label>
            <select 
              id="orientation"
              value={exportOptions.orientation}
              onChange={(e) => setExportOptions(prev => ({
                ...prev,
                orientation: e.target.value as 'Portrait' | 'Landscape'
              }))}
            >
              <option value="Portrait">Portrait</option>
              <option value="Landscape">Landscape</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="quality">Quality:</label>
            <select 
              id="quality"
              value={exportOptions.quality}
              onChange={(e) => setExportOptions(prev => ({
                ...prev,
                quality: e.target.value as 'High' | 'Medium' | 'Low'
              }))}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <button 
          className="export-btn"
          onClick={handleExport}
          disabled={pdfExport.isExporting}
        >
          {pdfExport.isExporting ? (
            <>
              <span className="spinner-small"></span>
              Exporting...
            </>
          ) : (
            '📄 Export to PDF'
          )}
        </button>

        {/* Progress Bar */}
        {pdfExport.isExporting && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${pdfExport.exportProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {pdfExport.exportProgress}% Complete
            </div>
          </div>
        )}
      </div>

      {/* Export History - full width below controls */}
      {pdfExport.exportHistory.length > 0 && (
        <div className="export-history-section">
          <div className="export-history">
            <div className="history-header">
              <h4>Recent Exports</h4>
              <button
                className="clear-history-btn"
                onClick={pdfExport.clearHistory}
              >
                🗑️ Clear
              </button>
            </div>

            <div className="history-list">
              {pdfExport.exportHistory.slice(0, 5).map((item) => {
                console.log('📋 History item:', item); // Debug log
                return (
                <div key={item.id} className={`history-item ${item.success ? 'success' : 'failed'}`}>
                  <div className="history-info">
                    <span className="filename">{item.filename}</span>
                    <span className="timestamp">{formatDate(item.timestamp)}</span>
                  </div>
                  <div className="history-options">
                    <span className="options-text">
                      {item.options.pageSize} • {item.options.orientation} • {item.options.quality}
                    </span>
                    <div className="history-actions">
                      {item.success && item.pdfUrl ? (
                        <a 
                          href={item.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="pdf-link"
                          style={{ 
                            display: 'inline-block', 
                            color: '#4f46e5',
                            textDecoration: 'none',
                            padding: '4px 8px',
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        >
                          📄 Apri PDF
                        </a>
                      ) : (
                        <span style={{ fontSize: '10px', color: '#999' }}>
                          {item.success ? 'No URL' : 'Failed'}
                        </span>
                      )}
                      <span className="status-icon">
                        {item.success ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Extend window interface for template storage
declare global {
  interface Window {
    currentTemplate?: {
      jsonFile?: any
      htmlFile?: string
    }
  }
}