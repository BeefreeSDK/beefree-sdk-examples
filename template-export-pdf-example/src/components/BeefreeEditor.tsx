import { useEffect, useRef } from 'react'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { initializeBeefreeSDK } from '../services/beefree'
import { clientConfig } from '../config/clientConfig'

export const BeefreeEditor = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializationRef = useRef(false)

  useEffect(() => {
    const initializeEditor = async () => {
      if (initializationRef.current) return
      initializationRef.current = true

      try {
        const config: IBeeConfig = {
          ...clientConfig,
          onSave: (jsonFile: any, htmlFile: string) => {
            console.log('📄 Template saved:', { jsonFile, htmlFile })
            window.currentTemplate = { jsonFile, htmlFile }
          },
          onSaveAsTemplate: (jsonFile: any) => {
            console.log('💾 Template saved as template:', jsonFile)
          },
          onAutoSave: (jsonFile: any) => {
            console.log('🔄 Auto-save:', jsonFile)
            window.currentTemplate = { jsonFile }
          }
        }

        await initializeBeefreeSDK(config)
        console.log('🚀 Beefree SDK PDF Export demo initialized')
      } catch (error) {
        console.error('Failed to initialize Beefree SDK:', error)
        initializationRef.current = false
      }
    }

    // Small delay to ensure DOM is ready (same as custom-css-example)
    const timer = setTimeout(initializeEditor, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="builder-wrapper">
      <div id="loading-overlay" className="loading-overlay">
        <div className="spinner"></div>
        <span>Loading Beefree SDK...</span>
      </div>
      <div 
        id="bee-plugin-container" 
        ref={containerRef}
      ></div>
    </div>
  )
}

// Extend window interface for template storage and Beefree SDK
declare global {
  interface Window {
    currentTemplate?: {
      jsonFile?: any
      htmlFile?: string
    }
  }
}
