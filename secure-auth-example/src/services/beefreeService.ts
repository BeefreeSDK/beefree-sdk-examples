import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IEntityContentJson, IToken } from '../types'
import { BEEFREE_CONFIG, DEFAULT_TEMPLATE_URL } from '../config/constants'

export class BeefreeService {
  private beeInstance: any = null
  private monitoredFetch?: (url: string, options?: RequestInit) => Promise<Response>

  setMonitoredFetch(monitoredFetch: (url: string, options?: RequestInit) => Promise<Response>) {
    this.monitoredFetch = monitoredFetch
  }

  async loadTemplate(url: string = DEFAULT_TEMPLATE_URL): Promise<IEntityContentJson> {
    try {
      const fetchFn = this.monitoredFetch || fetch
      const response = await fetchFn(url)
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('❌ Template loading error:', error)
      throw error
    }
  }

  async initializeSDK(token: IToken, uid: string): Promise<any> {
    try {
      // Check if container exists in DOM
      const container = document.getElementById(BEEFREE_CONFIG.container)
      if (!container) {
        throw new Error(`Container element with id '${BEEFREE_CONFIG.container}' not found in DOM`)
      }

      // Load template first
      const templateData = await this.loadTemplate()
      
      // Use IToken directly from remote auth server - no transformation needed
      this.beeInstance = new BeefreeSDK(token)
      
      // Client configuration
      const clientConfig: IBeeConfig = {
        container: BEEFREE_CONFIG.container,
        uid: uid,
      }
      
      // Store reference globally and start SDK
      window.bee = this.beeInstance
      this.beeInstance.start(clientConfig, templateData)
      return this.beeInstance

    } catch (error) {
      console.error('❌ Beefree SDK initialization failed:', error)
      throw error
    }
  }

  async destroySDK(): Promise<void> {
    if (this.beeInstance) {
      try {
        // The official SDK uses a different method name or structure
        // Check if destroy method exists before calling it
        if (typeof this.beeInstance.destroy === 'function') {
          await this.beeInstance.destroy()
        }
        this.beeInstance = null
        window.bee = undefined
        console.log('🗑️ Beefree SDK destroyed')
      } catch (error) {
        console.error('❌ Error destroying SDK:', error)
      }
    }
  }

  getInstance(): any {
    return this.beeInstance
  }
}