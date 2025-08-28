// Beefree SDK Types (only import what we actually use)

// Our custom token structure from auth server
export interface AuthToken {
  access_token: string
  v2?: boolean
}

export interface BeefreeInstance {
  save(): Promise<any>
  load(template: any): Promise<any>
  reload(): Promise<any>
  join(template: any): Promise<any>
  start(): Promise<any>
  destroy(): Promise<any>
}

export interface AuthState {
  isAuthenticated: boolean
  isAuthenticating: boolean
  uid?: string
  token?: AuthToken
  error?: string
}

export interface AuthFormProps {
  authState: AuthState
  onAuthenticate: (uid: string) => Promise<void>
}

export interface BeefreeEditorProps {
  authState: AuthState
  monitoredFetch: (url: string, options?: RequestInit) => Promise<Response>
}

export interface HeaderProps {
  authState: AuthState
  onLogout: () => void
}

// Global window interface extensions
declare global {
  interface Window {
    bee?: BeefreeInstance
    BeePlugin?: any
  }
}

// API Monitoring Types
export interface ApiRequest {
  id: string
  timestamp: Date
  method: string
  url: string
  headers?: Record<string, string>
  body?: any
  status?: 'pending' | 'success' | 'error'
}

export interface ApiResponse {
  id: string
  timestamp: Date
  status: number
  statusText: string
  headers?: Record<string, string>
  data?: any
  error?: string
  duration?: number
}

export interface ApiCall {
  id: string
  request: ApiRequest
  response?: ApiResponse
  duration?: number
}

export interface ApiMonitorProps {
  apiCalls: ApiCall[]
  onClearHistory: () => void
}

// Export only what we need
export type { AuthToken, AuthState, BeefreeInstance }
