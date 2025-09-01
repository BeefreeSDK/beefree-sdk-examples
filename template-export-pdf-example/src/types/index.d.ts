// Re-export official Beefree SDK types for convenience
export type { IBeeConfig, IToken, IEntityContentJson } from '@beefree.io/sdk/dist/types/bee'

// Our custom types for authentication
export interface AuthResponse {
  access_token: string
}

export interface ExportOptions {
  pageSize?: 'A4' | 'Letter'
  orientation?: 'Portrait' | 'Landscape'
  quality?: 'High' | 'Medium' | 'Low'
  scale?: number
}

export interface ExportRequest {
  templateHtml?: string
  templateJson?: IEntityContentJson
  exportOptions?: ExportOptions
}

export interface ExportResponse {
  success: boolean
  downloadUrl?: string
  pdfUrl?: string
  filename?: string
  error?: string
  message?: string
}

export interface PDFExportState {
  isExporting: boolean
  exportProgress: number
  lastExportedFile?: string
  exportHistory: ExportHistoryItem[]
}

export interface ExportHistoryItem {
  id: string
  filename: string
  pdfUrl?: string
  timestamp: Date
  options: ExportOptions
  success: boolean
}

// Props interface for PDFExportPanel component
export interface PDFExportPanelProps {
  pdfExport: {
    isExporting: boolean
    exportProgress: number
    lastExportedFile?: string
    exportHistory: ExportHistoryItem[]
    exportTemplate: (templateData: any, options?: ExportOptions) => Promise<any>
    clearHistory: () => void
  }
}

// Global window interface extension for Beefree SDK instance
declare global {
  interface Window {
    bee?: any
  }
}
