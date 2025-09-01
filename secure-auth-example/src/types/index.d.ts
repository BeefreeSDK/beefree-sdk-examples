// Re-export official Beefree SDK types for convenience
export type {
  IToken,
  IBeeConfig, 
  IEntityContentJson,
  IBeeOptions,
  BeeSaveOptions,
  ILanguage,
  ILoadStageMode,
  ILoadConfig,
  LoadWorkspaceOptions,
  ExecCommands,
  IExecCommandOptions,
  ITemplateJson
} from '@beefree.io/sdk'

// Our custom token structure from auth server (maps to IToken)
export interface AuthToken {
  access_token: string
  v2?: boolean
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

// API Monitoring Types
export interface ApiRequest {
  id: string
  timestamp: Date
  method: string
  url: string
  headers?: Record<string, string>
  body?: unknown
  status?: 'pending' | 'success' | 'error'
}

export interface ApiResponse {
  id: string
  timestamp: Date
  status: number
  statusText: string
  headers?: Record<string, string>
  data?: unknown
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

// Global window interface extension for Beefree SDK instance
declare global {
  interface Window {
    bee?: any
  }
}
