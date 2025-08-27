import type { PDFExportState } from '../types'

interface HeaderProps {
  pdfExport: PDFExportState & {
    exportTemplate: (templateData: any, options?: any) => Promise<any>
    clearHistory: () => void
  }
}

export const Header = ({ pdfExport }: HeaderProps) => {
  return (
    <div className="demo-header">
      <div className="header-left">
        <h1>📄 PDF Export Example</h1>
        <p>Advanced Beefree SDK PDF Export with React & TypeScript</p>
      </div>
      
      <div className="header-right">
        <div className="export-status">
          {pdfExport.isExporting && (
            <div className="export-indicator">
              <span className="spinner-small"></span>
              <span>Exporting... {pdfExport.exportProgress}%</span>
            </div>
          )}
          {pdfExport.lastExportedFile && !pdfExport.isExporting && (
            <div className="last-export-indicator">
              <span>✅</span>
              <span>Last: {pdfExport.lastExportedFile}</span>
            </div>
          )}
        </div>
        <div className="feature-badges">
          <span className="badge">⚛️ React</span>
          <span className="badge">🔷 TypeScript</span>
          <span className="badge">📄 PDF Export</span>
          <span className="badge">🔧 Content Services API</span>
        </div>
      </div>
    </div>
  )
}
