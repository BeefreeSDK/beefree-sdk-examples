import { useEffect, useRef, useState } from 'react'
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IPluginDisplayCondition, RowDisplayConditionsHandler } from '@beefree.io/sdk/dist/types/bee'
import { initializeBeefreeSDK } from '../services/beefree'
import { clientConfig } from '../config/clientConfig'
import { ConditionBuilderModal } from './ConditionBuilderModal'

interface BeefreeEditorProps {
  onInstanceCreated: (instance: BeefreeSDK) => void
}

export const BeefreeEditor = ({ onInstanceCreated }: BeefreeEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializationRef = useRef(false)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [currentCondition, setCurrentCondition] = useState<RowDisplayConditionsHandler | null>(null)
  const [conditionResolve, setConditionResolve] = useState<((value: IPluginDisplayCondition) => void) | null>(null)
  const [conditionReject, setConditionReject] = useState<(() => void) | null>(null)

  useEffect(() => {
    const initializeEditor = async () => {
      if (initializationRef.current) return
      initializationRef.current = true

      try {
        const config: IBeeConfig = {
          ...clientConfig,
          contentDialog: {
            rowDisplayConditions: {
              label: 'Build Custom Condition',
              handler: async (resolve: (value: RowDisplayConditionsHandler) => void, reject: () => void, current?: RowDisplayConditionsHandler) => {
                setCurrentCondition(current || null)
                setConditionResolve(() => resolve)
                setConditionReject(() => reject)
                setIsBuilderOpen(true)
              },
            },
          },
        }

        const instance = await initializeBeefreeSDK(config)
        console.log('🚀 Beefree SDK demo application initialized')
        console.log('✨ Content Dialog enabled: Users can build custom conditions')
        
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

  const handleConditionConfirm = (condition: IPluginDisplayCondition) => {
    if (conditionResolve) {
      conditionResolve(condition)
    }
    setIsBuilderOpen(false)
    setConditionResolve(null)
    setConditionReject(null)
    setCurrentCondition(null)
  }

  const handleConditionCancel = () => {
    if (conditionReject) {
      conditionReject()
    }
    setIsBuilderOpen(false)
    setConditionResolve(null)
    setConditionReject(null)
    setCurrentCondition(null)
  }

  return (
    <div>
      <div id="loading-overlay" className="loading-overlay">
        <div className="spinner"></div>
        <span>Loading Beefree SDK...</span>
      </div>
      <div 
        id="bee-plugin-container" 
        ref={containerRef}
      ></div>

      <ConditionBuilderModal
        isOpen={isBuilderOpen}
        onConfirm={handleConditionConfirm}
        onCancel={handleConditionCancel}
        currentCondition={currentCondition}
      />
    </div>
  )
}
