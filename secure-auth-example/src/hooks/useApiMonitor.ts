import { useState, useCallback } from 'react'
import { ApiCall, ApiRequest, ApiResponse } from '../types'

export const useApiMonitor = () => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([])

  const addApiCall = useCallback((request: Omit<ApiRequest, 'id' | 'timestamp' | 'status'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const apiRequest: ApiRequest = {
      id,
      timestamp: new Date(),
      status: 'pending',
      ...request
    }

    const apiCall: ApiCall = {
      id,
      request: apiRequest
    }

    setApiCalls(prev => [apiCall, ...prev.slice(0, 49)]) // Keep last 50 calls
    return id
  }, [])

  const updateApiCall = useCallback((id: string, response: Omit<ApiResponse, 'id' | 'timestamp'>) => {
    setApiCalls(prev => prev.map(call => {
      if (call.id === id) {
        const apiResponse: ApiResponse = {
          id,
          timestamp: new Date(),
          ...response
        }
        
        const duration = apiResponse.timestamp.getTime() - call.request.timestamp.getTime()
        
        return {
          ...call,
          response: apiResponse,
          duration,
          request: {
            ...call.request,
            status: response.status >= 200 && response.status < 300 ? 'success' : 'error'
          }
        }
      }
      return call
    }))
  }, [])

  const clearHistory = useCallback(() => {
    setApiCalls([])
  }, [])

  // Interceptor function for fetch calls
  const monitoredFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const startTime = Date.now()
    
    // Extract request details
    const method = options.method || 'GET'
    const headers = options.headers as Record<string, string> || {}
    let body: unknown = options.body

    // Try to parse JSON body for display
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        // Keep as string if not valid JSON
      }
    }

    // Add the API call to monitoring
    const callId = addApiCall({
      method,
      url,
      headers,
      body
    })

    try {
      const response = await fetch(url, options)
      const endTime = Date.now()
      const duration = endTime - startTime

      // Clone response to read body without consuming it
      const responseClone = response.clone()
      let responseData: unknown

      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          responseData = await responseClone.json()
        } else {
          responseData = await responseClone.text()
        }
      } catch {
        responseData = 'Unable to parse response body'
      }

      // Extract response headers
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Update the API call with response
      updateApiCall(callId, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        duration
      })

      return response
    } catch (error) {
      const endTime = Date.now()
      const duration = endTime - startTime

      // Update the API call with error
      updateApiCall(callId, {
        status: 0,
        statusText: 'Network Error',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      })

      throw error
    }
  }, [addApiCall, updateApiCall])

  return {
    apiCalls,
    clearHistory,
    monitoredFetch
  }
}

