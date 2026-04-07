import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApiMonitor } from './useApiMonitor'

describe('useApiMonitor', () => {
  let monitor: ReturnType<typeof useApiMonitor>

  beforeEach(() => {
    monitor = useApiMonitor()
  })

  it('starts with empty calls', () => {
    expect(monitor.apiCalls.value).toEqual([])
  })

  describe('monitoredFetch', () => {
    it('records a successful GET request', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        clone: () => ({
          json: () => Promise.resolve({ data: 'test' }),
        }),
      }
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        mockResponse as unknown as Response,
      )

      const result = await monitor.monitoredFetch('/api/test')

      expect(result).toBe(mockResponse)
      expect(monitor.apiCalls.value).toHaveLength(1)
      expect(monitor.apiCalls.value[0].request.method).toBe('GET')
      expect(monitor.apiCalls.value[0].request.url).toBe('/api/test')
      expect(monitor.apiCalls.value[0].request.status).toBe('success')
      expect(monitor.apiCalls.value[0].response?.status).toBe(200)
      expect(monitor.apiCalls.value[0].response?.data).toEqual({
        data: 'test',
      })
    })

    it('records a POST request with JSON body', async () => {
      const body = JSON.stringify({ uid: 'user1' })
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 200,
        statusText: 'OK',
        clone: () => ({
          json: () => Promise.resolve({ access_token: 'tok' }),
        }),
      } as unknown as Response)

      await monitor.monitoredFetch('/auth/token', {
        method: 'POST',
        body,
      })

      expect(monitor.apiCalls.value[0].request.method).toBe('POST')
      expect(monitor.apiCalls.value[0].request.body).toEqual({ uid: 'user1' })
    })

    it('handles non-JSON body gracefully', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 200,
        statusText: 'OK',
        clone: () => ({
          json: () => Promise.resolve(null),
        }),
      } as unknown as Response)

      await monitor.monitoredFetch('/api/x', {
        method: 'POST',
        body: 'not-json{',
      })

      expect(monitor.apiCalls.value[0].request.body).toBe('not-json{')
    })

    it('records error responses (4xx/5xx)', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 404,
        statusText: 'Not Found',
        clone: () => ({
          json: () => Promise.resolve({ error: 'missing' }),
        }),
      } as unknown as Response)

      await monitor.monitoredFetch('/not-found')

      expect(monitor.apiCalls.value[0].request.status).toBe('error')
      expect(monitor.apiCalls.value[0].response?.status).toBe(404)
    })

    it('handles network errors', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(
        new Error('Network Error'),
      )

      await expect(monitor.monitoredFetch('/fail')).rejects.toThrow(
        'Network Error',
      )

      expect(monitor.apiCalls.value[0].request.status).toBe('error')
      expect(monitor.apiCalls.value[0].response?.status).toBe(0)
      expect(monitor.apiCalls.value[0].response?.error).toBe('Network Error')
    })

    it('handles non-Error throw in network errors', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue('string-error')

      await expect(monitor.monitoredFetch('/fail2')).rejects.toBe(
        'string-error',
      )

      expect(monitor.apiCalls.value[0].response?.error).toBe('Unknown error')
    })

    it('handles non-JSON response body', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 200,
        statusText: 'OK',
        clone: () => ({
          json: () => Promise.reject(new Error('not json')),
        }),
      } as unknown as Response)

      await monitor.monitoredFetch('/text-response')

      expect(monitor.apiCalls.value[0].response?.data).toBeNull()
    })

    it('extracts URL from Request object', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 200,
        statusText: 'OK',
        clone: () => ({
          json: () => Promise.resolve(null),
        }),
      } as unknown as Response)

      await monitor.monitoredFetch(
        new Request('http://localhost/api/data'),
      )

      expect(monitor.apiCalls.value[0].request.url).toBe(
        'http://localhost/api/data',
      )
    })

    it('defaults method to GET when not specified', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 200,
        statusText: 'OK',
        clone: () => ({
          json: () => Promise.resolve(null),
        }),
      } as unknown as Response)

      await monitor.monitoredFetch('/test', {})

      expect(monitor.apiCalls.value[0].request.method).toBe('GET')
    })

    it('handles non-string non-json body', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 200,
        statusText: 'OK',
        clone: () => ({
          json: () => Promise.resolve(null),
        }),
      } as unknown as Response)

      const formData = new FormData()
      await monitor.monitoredFetch('/upload', {
        method: 'POST',
        body: formData,
      })

      expect(monitor.apiCalls.value[0].request.body).toBe(formData)
    })
  })

  describe('clearHistory', () => {
    it('removes all calls', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 200,
        statusText: 'OK',
        clone: () => ({
          json: () => Promise.resolve(null),
        }),
      } as unknown as Response)

      await monitor.monitoredFetch('/a')
      await monitor.monitoredFetch('/b')
      expect(monitor.apiCalls.value).toHaveLength(2)

      monitor.clearHistory()
      expect(monitor.apiCalls.value).toEqual([])
    })
  })

  describe('call limit', () => {
    it('keeps only the latest 50 calls', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 200,
        statusText: 'OK',
        clone: () => ({
          json: () => Promise.resolve(null),
        }),
      } as unknown as Response)

      for (let i = 0; i < 55; i++) {
        await monitor.monitoredFetch(`/call/${i}`)
      }

      expect(monitor.apiCalls.value).toHaveLength(50)
    })
  })
})
