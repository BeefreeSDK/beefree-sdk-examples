// Re-export official Beefree SDK types for convenience
export type { IBeeConfig, IToken, IEntityContentJson } from '@beefree.io/sdk/dist/types/bee'

// Our custom types for the theming system
export type ThemeType = 'default' | 'dark' | 'high-contrast' | 'coral' | ''

// Global window interface extension for Beefree SDK instance
declare global {
  interface Window {
    bee?: any
  }
}
