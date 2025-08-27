// TypeScript definitions for Beefree SDK
import { IBeeConfig, IToken, IEntityContentJson } from '@beefree.io/sdk/dist/types/bee'

export interface BeefreeInstance {
  start(config: IBeeConfig, template?: IEntityContentJson): void
}

export interface AuthResponse {
  access_token: string
}

export type ThemeType = 'default' | 'dark' | 'high-contrast' | 'coral' | ''

declare global {
  interface Window {
    bee?: BeefreeInstance
  }
}

declare module '@beefree.io/sdk' {
  export default class BeefreeSDK {
    constructor(token: BeefreeToken)
    start(config: IBeeConfig, template?: IEntityContentJson): void
  }
}
