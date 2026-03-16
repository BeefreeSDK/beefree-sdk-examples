export type { IToken } from '@beefree.io/vue-email-builder'

export interface AuthState {
  isAuthenticated: boolean
  isAuthenticating: boolean
  uid?: string
  token?: IToken
  error?: string
}

export interface ApiCall {
  id: string
  request: ApiRequest
  response?: ApiResponse
  duration?: number
}

export interface ApiRequest {
  id: string
  method: string
  url: string
  headers?: Record<string, string>
  body?: unknown
  timestamp: Date
  status: 'pending' | 'success' | 'error'
}

export interface ApiResponse {
  id: string
  status: number
  statusText: string
  headers?: Record<string, string>
  data?: unknown
  error?: string
  timestamp: Date
  duration?: number
}

// Re-export the IToken type alias for convenience
import type { IToken } from '@beefree.io/vue-email-builder'
export type Token = IToken
