import { Header } from './Header'
import { BeefreeEditor } from './BeefreeEditor'
import { PDFExportPanel } from './PDFExportPanel'
import { usePDFExport } from '../hooks/usePDFExport'
import { BeefreeProvider } from '../context/BeefreeContext'
import '../styles.css'

export const App = () => {
  const pdfExport = usePDFExport()

  return (
    <BeefreeProvider>
      <div className="demo-container beefree-container">
        <Header pdfExport={pdfExport} />
        <PDFExportPanel pdfExport={pdfExport} />
        <BeefreeEditor />
      </div>
    </BeefreeProvider>
  )
}
