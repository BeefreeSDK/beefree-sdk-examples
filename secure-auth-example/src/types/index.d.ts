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

// Export only what we need
export type { AuthToken, AuthState, BeefreeInstance }
