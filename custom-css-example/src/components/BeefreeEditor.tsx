import { useEffect, useRef, useState } from 'react'
import { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { initializeBeefreeSDK } from '../services/beefree'
import { clientConfig } from '../config/clientConfig'
import { PlanWarningModal } from './PlanWarningModal'

interface BeefreeEditorProps {
  customCss?: string
}

export const BeefreeEditor = ({ customCss }: BeefreeEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializationRef = useRef(false)
  const [showPlanWarning, setShowPlanWarning] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('')

  useEffect(() => {
    const initializeEditor = async () => {
      if (initializationRef.current) return
      initializationRef.current = true

      try {
        const config: IBeeConfig = {
          ...clientConfig,
          ...(customCss && { customCss }),
          onError: (error) => {
            console.error('❌ Beefree SDK Error:', error)
            // Check for plan-related errors or feature restriction errors
            if (error.message?.toLowerCase().includes('plan') || error.message?.toLowerCase().includes('feature')) {
              setCurrentPlan('Current Plan')
              setShowPlanWarning(true)
            }
          },
        }

        await initializeBeefreeSDK(config, (plan) => {
          setCurrentPlan(plan)
          setShowPlanWarning(true)
        })
        console.log('🚀 Beefree SDK demo application initialized')
      } catch (error) {
        console.error('Failed to initialize Beefree SDK:', error)
        initializationRef.current = false
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeEditor, 100)
    return () => clearTimeout(timer)
  }, [customCss])

  return (
    <div className="builder-wrapper">
      <PlanWarningModal 
        isOpen={showPlanWarning} 
        onClose={() => setShowPlanWarning(false)} 
        plan={currentPlan}
      />
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
