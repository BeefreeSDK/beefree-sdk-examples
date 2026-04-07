import { ref, type Ref } from 'vue'
import type { ApiCall, ApiRequest, ApiResponse } from '../types'

export interface UseApiMonitor {
  apiCalls: Ref<ApiCall[]>
  monitoredFetch: typeof fetch
  clearHistory: () => void
}

export function useApiMonitor(): UseApiMonitor {
  const apiCalls = ref<ApiCall[]>([])

  function addCall(
    request: Omit<ApiRequest, 'id' | 'timestamp' | 'status'>,
  ): string {
    const id =
      Date.now().toString() + Math.random().toString(36).substring(2, 9)
    const apiRequest: ApiRequest = {
      id,
      timestamp: new Date(),
      status: 'pending',
      ...request,
    }
    const apiCall: ApiCall = { id, request: apiRequest }
    apiCalls.value = [apiCall, ...apiCalls.value].slice(0, 50)
    return id
  }

  function updateCall(
    id: string,
    response: Omit<ApiResponse, 'id' | 'timestamp'>,
  ): void {
    apiCalls.value = apiCalls.value.map((call) => {
      if (call.id !== id) return call
      const apiResponse: ApiResponse = {
        id,
        timestamp: new Date(),
        ...response,
      }
      const duration =
        apiResponse.timestamp.getTime() - call.request.timestamp.getTime()
      return {
        ...call,
        response: apiResponse,
        duration,
        request: {
          ...call.request,
          status:
            response.status >= 200 && response.status < 300
              ? ('success' as const)
              : ('error' as const),
        },
      }
    })
  }

  function clearHistory(): void {
    apiCalls.value = []
  }

  const monitoredFetch: typeof fetch = async (input, init?) => {
    const url = typeof input === 'string' ? input : (input as Request).url
    const method = init?.method?.toUpperCase() ?? 'GET'

    let body: unknown = null
    if (init?.body) {
      try {
        body =
          typeof init.body === 'string'
            ? JSON.parse(init.body)
            : init.body
      } catch {
        body = init.body
      }
    }

    const callId = addCall({ method, url, body })

    try {
      const response = await fetch(input, init)

      const cloned = response.clone()
      let data: unknown = null
      try {
        data = await cloned.json()
      } catch {
        // non-JSON response
      }

      updateCall(callId, {
        status: response.status,
        statusText: response.statusText,
        data,
      })

      return response
    } catch (err) {
      updateCall(callId, {
        status: 0,
        statusText: 'Network Error',
        error: err instanceof Error ? err.message : 'Unknown error',
      })
      throw err
    }
  }

  return {
    apiCalls,
    monitoredFetch,
    clearHistory,
  }
}
