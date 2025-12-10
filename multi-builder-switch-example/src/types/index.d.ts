// Re-export official Beefree SDK types for convenience
export type { IBeeConfig, IToken, IEntityContentJson } from '@beefree.io/sdk'

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
  save(): Promise<IEntityContentJson>
  load(template: IEntityContentJson): Promise<void>
  start(config: IBeeConfig, template?: IEntityContentJson): Promise<void>
  destroy(): Promise<void>
}

// Global window interface extension for Beefree SDK instance
declare global {
  interface Window {
    bee?: BeefreeInstance
  }
}
