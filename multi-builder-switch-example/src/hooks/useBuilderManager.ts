import { useState, useCallback, useRef, useEffect } from 'react'
import { BuilderType, BuilderState, IToken } from '../types'
import { BeefreeMultiService } from '../services/beefreeMultiService'
import { AuthService } from '../services/authService'
import { DEFAULT_BUILDER, DEFAULT_UID } from '../config/constants'

export const useBuilderManager = (uid: string = DEFAULT_UID) => {
  // State management
  const [builderState, setBuilderState] = useState<BuilderState>({
    currentBuilder: DEFAULT_BUILDER,
    isTransitioning: false,
    isInitialized: false,
    error: undefined
  })

  const [token, setToken] = useState<IToken | null>(null)

  // Services
  const beefreeServiceRef = useRef<BeefreeMultiService>(new BeefreeMultiService())
  const authServiceRef = useRef<AuthService>(new AuthService())

  // Get service instances
  const beefreeService = beefreeServiceRef.current
  const authService = authServiceRef.current

  // Remove automatic initialization - will be triggered by BeefreeEditor component

  /**
   * Initialize the first builder
   */
  const initializeFirstBuilder = useCallback(async () => {
    try {
      setBuilderState(prev => ({ 
        ...prev, 
        isTransitioning: true, 
        error: undefined 
      }))

      // Authenticate user
      const authToken = await authService.authenticateUser(uid, DEFAULT_BUILDER)
      setToken(authToken)

      // Initialize the default builder
      await beefreeService.initializeBuilder(authToken, uid, DEFAULT_BUILDER)

      setBuilderState(prev => ({
        ...prev,
        currentBuilder: DEFAULT_BUILDER,
        isTransitioning: false,
        isInitialized: true
      }))

      console.log(`✅ First builder (${DEFAULT_BUILDER}) initialized successfully`)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('❌ Failed to initialize first builder:', error)
      
      setBuilderState(prev => ({
        ...prev,
        isTransitioning: false,
        isInitialized: false,
        error: errorMessage
      }))
    }
  }, [uid, authService, beefreeService])

  /**
   * Switch to a different builder type
   */
  const switchBuilder = useCallback(async (newBuilderType: BuilderType) => {
    if (builderState.currentBuilder === newBuilderType) {
      console.log(`🔄 Already using ${newBuilderType} builder`)
      return
    }

    if (builderState.isTransitioning) {
      console.log('⏳ Builder switch already in progress')
      return
    }

    try {
      setBuilderState(prev => ({ 
        ...prev, 
        isTransitioning: true, 
        error: undefined 
      }))

      console.log(`🔄 Switching from ${builderState.currentBuilder} to ${newBuilderType}`)

      // Get fresh token for the new builder type
      const authToken = await authService.authenticateUser(uid, newBuilderType)
      setToken(authToken)

      // Switch to the new builder
      await beefreeService.switchBuilder(authToken, uid, newBuilderType)

      setBuilderState(prev => ({
        ...prev,
        currentBuilder: newBuilderType,
        isTransitioning: false,
        isInitialized: true
      }))

      console.log(`✅ Successfully switched to ${newBuilderType} builder`)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch builder'
      console.error(`❌ Failed to switch to ${newBuilderType} builder:`, error)
      
      setBuilderState(prev => ({
        ...prev,
        isTransitioning: false,
        error: errorMessage
      }))
    }
  }, [builderState.currentBuilder, builderState.isTransitioning, uid, authService, beefreeService])

  /**
   * Retry initialization after error
   */
  const retry = useCallback(async () => {
    if (builderState.isInitialized) {
      // If already initialized, try switching to current builder
      await switchBuilder(builderState.currentBuilder)
    } else {
      // If not initialized, try initializing first builder
      await initializeFirstBuilder()
    }
  }, [builderState.isInitialized, builderState.currentBuilder, switchBuilder, initializeFirstBuilder])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      beefreeService.destroyBuilder().catch(console.error)
    }
  }, [beefreeService])

  return {
    // State
    currentBuilder: builderState.currentBuilder,
    isTransitioning: builderState.isTransitioning,
    isInitialized: builderState.isInitialized,
    error: builderState.error,
    token,
    
    // Actions
    switchBuilder,
    retry,
    initializeFirstBuilder,
    
    // Service access (for advanced usage)
    beefreeService,
    authService
  }
}
