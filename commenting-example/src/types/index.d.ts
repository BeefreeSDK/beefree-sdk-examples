// Re-export official Beefree SDK types for convenience
export type { IBeeConfig, IToken, IEntityContentJson } from '@beefree.io/sdk/dist/types/bee'

// Beefree SDK instance interface for proper typing
export interface BeefreeInstance {
  save(): Promise<unknown>
  load(template: IEntityContentJson): Promise<unknown>
  start(config: IBeeConfig, template?: IEntityContentJson): Promise<unknown>
  toggleComments(): void
}

// Global window interface extension for Beefree SDK instance
declare global {
  interface Window {
    bee?: BeefreeInstance
  }
}
