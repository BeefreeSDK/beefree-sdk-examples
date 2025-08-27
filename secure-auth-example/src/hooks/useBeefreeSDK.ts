import { useState, useCallback, useEffect } from 'react'
import { AuthToken } from '../types'
import { BeefreeService } from '../services/beefreeService'

const beefreeService = new BeefreeService()

export const useBeefreeSDK = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const initializeSDK = useCallback(async (token: AuthToken, uid: string) => {
    if (isInitialized) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await beefreeService.initializeSDK(token, uid)
      setIsInitialized(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize SDK'
      setError(errorMessage)
      console.error('❌ SDK initialization failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isInitialized])

  const destroySDK = useCallback(async () => {
    try {
      await beefreeService.destroySDK()
      setIsInitialized(false)
      setError(null)
    } catch (err) {
      console.error('❌ Error destroying SDK:', err)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isInitialized) {
        beefreeService.destroySDK()
      }
    }
  }, [isInitialized])

  return {
    isLoading,
    error,
    isInitialized,
    initializeSDK,
    destroySDK,
    getInstance: beefreeService.getInstance.bind(beefreeService)
  }
}
