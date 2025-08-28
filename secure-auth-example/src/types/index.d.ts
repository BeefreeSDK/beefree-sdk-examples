// Import official Beefree SDK types
import { 
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

// Use the official Beefree SDK interface for the instance
export interface BeefreeInstance {
  token: IToken
  instance: any
  start: (config: IBeeConfig, template: IEntityContentJson | object, bucketDir?: string, options?: IBeeOptions) => Promise<unknown>
  join: (config: IBeeConfig, sessionId: string, bucketDir?: string) => Promise<unknown>
  load: (template: IEntityContentJson) => any
  save: (options?: BeeSaveOptions) => any
  reload: (template: IEntityContentJson, options?: IBeeOptions) => any
  loadWorkspace: (type: LoadWorkspaceOptions) => any
  loadStageMode: (args: ILoadStageMode) => any
  loadConfig: (args: ILoadConfig) => any
  updateToken: (updateTokenArgs: IToken) => any
  getConfig: () => IBeeConfig
  switchTemplateLanguage: (args: ILanguage) => any
  switchPreview: (args?: ILanguage) => any
  execCommand: (command: ExecCommands, options?: IExecCommandOptions) => any
  getTemplateJson: () => Promise<ITemplateJson>
  destroy: () => Promise<any>
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

// Export both our custom types and official SDK types
export type { AuthToken, AuthState, BeefreeInstance }

// Re-export useful official SDK types for convenience
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
