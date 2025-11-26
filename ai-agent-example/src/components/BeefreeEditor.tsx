import { useEffect, useRef } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { initializeBeefreeSDK } from '../services/beefree'
import { clientConfig } from '../config/clientConfig'

interface BeefreeEditorProps {
  onInstanceCreated: (instance: BeefreeSDK) => void
}

export const BeefreeEditor = ({ onInstanceCreated }: BeefreeEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializationRef = useRef(false)

  useEffect(() => {
    const initializeEditor = async () => {
      if (initializationRef.current) return
      initializationRef.current = true

      try {
        const config: IBeeConfig = {
          ...clientConfig,
          onChange: () => {
            // Track changes if needed
          },
          onSave: (jsonFile, htmlFile) => {
            console.log('📧 Email saved:', { jsonFile, htmlFile })
          }
        }

        const instance = await initializeBeefreeSDK(config)
        console.log('🚀 Beefree SDK initialized with MCP enabled')
        
        if (instance) {
          onInstanceCreated(instance)
        }
      } catch (error) {
        console.error('Failed to initialize Beefree SDK:', error)
        initializationRef.current = false
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeEditor, 100)
    return () => clearTimeout(timer)
  }, [onInstanceCreated])

  return (
    <div className="editor-container">
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
