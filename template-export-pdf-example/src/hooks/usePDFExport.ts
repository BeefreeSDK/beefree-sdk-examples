import { useState, useCallback, useMemo } from 'react'
import { PDFExportService } from '../services/pdfExport'
import { ExportOptions, PDFExportState, ExportHistoryItem } from '../types'
import { DEFAULT_EXPORT_OPTIONS } from '../config/constants'

export const usePDFExport = () => {
  const [exportState, setExportState] = useState<PDFExportState>({
    isExporting: false,
    exportProgress: 0,
    exportHistory: []
  })

  const pdfService = useRef(new PDFExportService()).current

  const exportTemplate = useCallback(async (
    templateData: any,
    options: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ) => {
    setExportState(prev => ({
      ...prev,
      isExporting: true,
      exportProgress: 0
    }))

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportState(prev => ({
          ...prev,
          exportProgress: Math.min(prev.exportProgress + 10, 90)
        }))
      }, 200)

      const result = await pdfService.exportToPDF(templateData, options)
      
      clearInterval(progressInterval)
      
      console.log('🔍 Export result in hook:', result)
      console.log('🔍 PDF URL from result:', result.pdfUrl)
      
      // Create history item
      const historyItem: ExportHistoryItem = {
        id: Date.now().toString(),
        filename: result.filename || pdfService.generateFilename(options),
        pdfUrl: result.pdfUrl,
        timestamp: new Date(),
        options,
        success: result.success
      }
      
      console.log('🔍 History item created:', historyItem)

      setExportState(prev => ({
        ...prev,
        isExporting: false,
        exportProgress: 100,
        lastExportedFile: result.filename,
        exportHistory: [historyItem, ...prev.exportHistory.slice(0, 9)] // Keep last 10
      }))

      // Reset progress after a delay
      setTimeout(() => {
        setExportState(prev => ({
          ...prev,
          exportProgress: 0
        }))
      }, 2000)

      return result

    } catch (error) {
      setExportState(prev => ({
        ...prev,
        isExporting: false,
        exportProgress: 0
      }))
      throw error
    }
  }, [pdfService])

  const clearHistory = useCallback(() => {
    setExportState(prev => ({
      ...prev,
      exportHistory: []
    }))
  }, [])

  return {
    ...exportState,
    exportTemplate,
    clearHistory
  }
}
