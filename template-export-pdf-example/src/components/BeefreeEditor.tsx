import { useEffect, useRef } from 'react'
import { IBeeConfig, IEntityContentJson } from '@beefree.io/sdk/dist/types/bee'
import { initializeBeefreeSDK } from '../services/beefree'
import { clientConfig } from '../config/clientConfig'
import { useBeefree } from '../context/BeefreeContext'
import { LoadingOverlay } from './LoadingOverlay'

export const BeefreeEditor = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializationRef = useRef(false)
  const { updateTemplateData, registerSaveHandler } = useBeefree()

  useEffect(() => {
    const initializeEditor = async () => {
      if (initializationRef.current) return
      initializationRef.current = true

      try {
        const config: IBeeConfig = {
          ...clientConfig,
          onSave: (jsonFile: string, htmlFile: string) => {
            console.log('📄 Template saved:', { jsonFile, htmlFile })
            const parsedJson = (typeof jsonFile === 'string' ? JSON.parse(jsonFile) : jsonFile) as IEntityContentJson
            updateTemplateData({ jsonFile: parsedJson, htmlFile })
          },
          onSaveAsTemplate: (jsonFile: string) => {
            const parsedJson = (typeof jsonFile === 'string' ? JSON.parse(jsonFile) : jsonFile) as IEntityContentJson
            console.log('💾 Template saved as template:', parsedJson)
          },
          onAutoSave: (jsonFile: string) => {
            console.log('🔄 Auto-save:', jsonFile)
            const parsedJson = (typeof jsonFile === 'string' ? JSON.parse(jsonFile) : jsonFile) as IEntityContentJson
            updateTemplateData({ jsonFile: parsedJson })
          }
        }

        const beeInstance = await initializeBeefreeSDK(config)
        if (beeInstance) {
          registerSaveHandler(() => {
            beeInstance.save()
          })
        }
        
        console.log('🚀 Beefree SDK PDF Export demo initialized')
      } catch (error) {
        console.error('Failed to initialize Beefree SDK:', error)
        initializationRef.current = false
      }
    }

    // Small delay to ensure DOM is ready (same as custom-css-example)
    const timer = setTimeout(initializeEditor, 100)
    return () => clearTimeout(timer)
  }, [updateTemplateData, registerSaveHandler])

  return (
    <div className="builder-wrapper">
      <LoadingOverlay />
      <div 
        id="bee-plugin-container" 
        ref={containerRef}
      ></div>
    </div>
  )
}

