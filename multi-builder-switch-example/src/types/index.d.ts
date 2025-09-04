// Re-export official Beefree SDK types for convenience
export type { IBeeConfig, IToken, IEntityContentJson } from '@beefree.io/sdk/dist/types/bee'

// Builder types supported by the multi-builder example
export type BuilderType = 'email' | 'page' | 'popup'

// Builder configuration for each type
export interface BuilderConfig {
  type: BuilderType
  label: string
  icon: string
  templateUrl: string
  clientId?: string
  clientSecret?: string
  description: string
}

// Builder state management
export interface BuilderState {
  currentBuilder: BuilderType
  isTransitioning: boolean
  isInitialized: boolean
  error?: string
}

// Beefree SDK instance interface for proper typing
export interface BeefreeInstance {
  save(): Promise<any>
  load(template: any): Promise<any>
  start(config: any, template?: any): Promise<any>
  destroy(): Promise<any>
}

// Global window interface extension for Beefree SDK instance
declare global {
  interface Window {
    bee?: BeefreeInstance
  }
}

// Component props interfaces
export interface BuilderSelectorProps {
  currentBuilder: BuilderType
  onBuilderChange: (builder: BuilderType) => void
  disabled?: boolean
  availableBuilders: BuilderConfig[]
}

export interface BeefreeEditorProps {
  builderType: BuilderType
  token: IToken | null
  uid: string
  isInitialized: boolean
  onInitialize: () => void
  onError?: (error: string) => void
}

export interface HeaderProps {
  currentBuilder: BuilderType
  onBuilderChange: (builder: BuilderType) => void
  isTransitioning: boolean
  uid?: string
}
