// Main entry point for Vite
import { clientConfig } from './clientConfig.js'
import { initializeBeefreeSDK } from './beefree.js'
import { themeManager, getThemeUrl } from './theme-manager.js'

(async () => {
  setTimeout(async () => {
    await initializeBeefreeSDK({...clientConfig, customCss: getThemeUrl()})
    console.log('🚀 Beefree SDK demo application initialized')
    themeManager()
  }, 1)
})()