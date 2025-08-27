// TypeScript definitions for PDF Export Example
import { IBeeConfig, IToken, IEntityContentJson } from '@beefree.io/sdk/dist/types/bee'

export interface BeefreeInstance {
  start(config: IBeeConfig, template?: IEntityContentJson): void
  save(): Promise<IEntityContentJson>
}

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

declare global {
  interface Window {
    bee?: BeefreeInstance
  }
}

declare module '@beefree.io/sdk' {
  export default class BeefreeSDK {
    constructor(token: IToken)
    start(config: IBeeConfig, template?: IEntityContentJson): void
    save(): Promise<IEntityContentJson>
  }
}
