import { ExportRequest, ExportResponse, ExportOptions } from '../types'
import { EXPORT_API_URL, DEFAULT_EXPORT_OPTIONS } from '../config/constants'

export class PDFExportService {
  
  async exportToPDF(
    templateData: any,
    options: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ): Promise<ExportResponse> {
    try {
      // Check if templateData is HTML string or JSON object
      const isHtml = typeof templateData === 'string' && templateData.includes('<html')
      
      const exportRequest: ExportRequest = {
        ...(isHtml ? { templateHtml: templateData } : { templateJson: templateData }),
        exportOptions: options
      }
      
      console.log('📤 Sending export request:', {
        hasHtml: !!exportRequest.templateHtml,
        hasJson: !!exportRequest.templateJson,
        isHtmlDetected: isHtml,
        options
      })

      const response = await fetch(EXPORT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportRequest)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Export failed')
      }

      // Handle JSON response with PDF URL
      const result = await response.json()
      console.log('📄 Export API response:', result)
      
      if (result.success && result.body && result.body.url) {
        console.log('📄 PDF URL found in response:', result.body.url)
        
        const exportResult = {
          success: true,
          filename: result.filename || result.body.filename || 'template.pdf',
          pdfUrl: result.body.url, // Use the URL from the API response
          message: 'PDF exported successfully'
        }
        
        console.log('📄 Returning export result with URL:', exportResult)
        return exportResult
      }
      
      // Fallback for other response formats
      return result

    } catch (error) {
      console.error('PDF export error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown export error'
      }
    }
  }



  generateFilename(options: ExportOptions): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const { pageSize, orientation } = options
    return `beefree-template-${pageSize}-${orientation}-${timestamp}.pdf`
  }
}
