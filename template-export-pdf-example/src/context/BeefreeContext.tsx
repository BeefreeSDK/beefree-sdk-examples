import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react'
import { IEntityContentJson } from '@beefree.io/sdk/dist/types/bee'

interface TemplateData {
  jsonFile?: IEntityContentJson
  htmlFile?: string
}

interface BeefreeContextType {
  templateData: TemplateData
  updateTemplateData: (data: TemplateData) => void
  triggerSave: () => Promise<TemplateData>
  registerSaveHandler: (handler: () => void) => void
}

const BeefreeContext = createContext<BeefreeContextType | undefined>(undefined)

export const BeefreeProvider = ({ children }: { children: ReactNode }) => {
  const [templateData, setTemplateData] = useState<TemplateData>({})
  
  // We use a ref for the resolve function of the pending save promise
  const pendingSaveResolve = useRef<((data: TemplateData) => void) | null>(null)
  
  // Reference to the bee instance's save method (registered by BeefreeEditor)
  const saveHandlerRef = useRef<(() => void) | null>(null)
  
  // Keep track of timeout to clear it on unmount
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      pendingSaveResolve.current = null
    }
  }, [])

  const updateTemplateData = useCallback((data: TemplateData) => {
    setTemplateData(data)
    
    // If there's a pending save promise, resolve it with the new data
    if (pendingSaveResolve.current) {
      console.log('✅ Resolving pending save promise with new data')
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
      
      pendingSaveResolve.current(data)
      pendingSaveResolve.current = null
    }
  }, [])

  const registerSaveHandler = useCallback((handler: () => void) => {
    saveHandlerRef.current = handler
  }, [])

  const triggerSave = useCallback((): Promise<TemplateData> => {
    return new Promise((resolve, reject) => {
      if (!saveHandlerRef.current) {
        console.error('❌ No save handler registered (Beefree SDK not initialized?)')
        reject(new Error('Editor not initialized'))
        return
      }

      console.log('💾 Triggering save via Context...')
      // Store the resolve function to be called when updateTemplateData is triggered
      pendingSaveResolve.current = resolve
      
      try {
        // Trigger the actual save in the editor
        saveHandlerRef.current()
        
        // Safety timeout: if onSave doesn't fire in 10 seconds, reject
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        
        saveTimeoutRef.current = setTimeout(() => {
          if (pendingSaveResolve.current) {
            console.error('❌ Save timed out')
            pendingSaveResolve.current = null
            reject(new Error('Save operation timed out'))
          }
          saveTimeoutRef.current = null
        }, 10000)
        
      } catch (error) {
        console.error('❌ Failed to trigger save:', error)
        pendingSaveResolve.current = null
        reject(error)
      }
    })
  }, [])

  return (
    <BeefreeContext.Provider value={{ 
      templateData, 
      updateTemplateData, 
      triggerSave, 
      registerSaveHandler 
    }}>
      {children}
    </BeefreeContext.Provider>
  )
}

export const useBeefree = () => {
  const context = useContext(BeefreeContext)
  if (context === undefined) {
    throw new Error('useBeefree must be used within a BeefreeProvider')
  }
  return context
}

