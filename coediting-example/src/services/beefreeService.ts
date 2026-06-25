import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IEntityContentJson, IToken } from '../types'
import { BEEFREE_CONFIG, DEFAULT_TEMPLATE_URL } from '../config/constants'

export class BeefreeService {
  private beeInstance: any = null
  private monitoredFetch?: (url: string, options?: RequestInit) => Promise<Response>
  private currentSessionId?: string
  private lastVersion = 1
  private isInitialized = false

  setMonitoredFetch(monitoredFetch: (url: string, options?: RequestInit) => Promise<Response>) {
    this.monitoredFetch = monitoredFetch
  }

  async createSession(template: IEntityContentJson, userId: string) {
    const fetchFn = this.monitoredFetch || fetch
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3004'

    const response = await fetchFn(`${backendUrl}/coedit/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template, userId })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Session creation failed: ${response.status} - ${errorText}`)
    }

    const sessionResult = await response.json()
    console.log(`✅ Co-editing session created: ${sessionResult.sessionId}`)
    return sessionResult
  }

  async fetchSessionInfo(sessionId: string) {
    const fetchFn = this.monitoredFetch || fetch
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3004'

    const response = await fetchFn(`${backendUrl}/coedit/session/${sessionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Session ${sessionId} not found: ${response.status}`)
    }

    const sessionInfo = await response.json()
    console.log(`✅ Joining existing session: ${sessionId}`)
    return sessionInfo
  }

  async loadTemplate(url = DEFAULT_TEMPLATE_URL): Promise<IEntityContentJson> {
    console.log('🔄 Loading template from:', url)
    const fetchFn = this.monitoredFetch || fetch
    const response = await fetchFn(url)

    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.status}`)
    }

    const template = await response.json()
    console.log('✅ Template loaded successfully:', template.page?.title)
    return template
  }

  async initializeSDK(token: IToken, uid: string) {
    const container = document.getElementById(BEEFREE_CONFIG.container)
    if (!container) {
      throw new Error(`Container element with id '${BEEFREE_CONFIG.container}' not found in DOM`)
    }

    const templateData = await this.loadTemplate()
    this.beeInstance = new BeefreeSDK(token)

    const clientConfig: IBeeConfig = {
      container: BEEFREE_CONFIG.container,
      uid,
    }

    window.bee = this.beeInstance
    this.beeInstance.start(clientConfig, templateData)
    return this.beeInstance
  }

  async initializeCoEditingSDK(
    token: IToken,
    uid: string,
    userColor?: string,
    username?: string,
    sessionId?: string
  ) {
    if (this.isInitialized) {
      return this.beeInstance
    }

    const container = document.getElementById(BEEFREE_CONFIG.container)
    if (!container) {
      throw new Error(`Container element with id '${BEEFREE_CONFIG.container}' not found in DOM`)
    }

    if (sessionId?.trim()) {
      const sessionInfo = await this.fetchSessionInfo(sessionId)
      this.currentSessionId = sessionId
      this.lastVersion = sessionInfo.historyEntry?.version || 1
    } else {
      const templateData = await this.loadTemplate()
      const sessionResult = await this.createSession(templateData, uid)
      this.currentSessionId = sessionResult.sessionId
      this.lastVersion = sessionResult.historyEntry?.version || 1
    }

    this.beeInstance = new BeefreeSDK(token)

    const clientConfig: IBeeConfig = {
      container: BEEFREE_CONFIG.container,
      uid,
      username: username || uid,
      userColor: userColor || '#FF6B6B',
      isShared: true,
      sessionId: this.currentSessionId,
      onChange: (json: any, updateInfo: any) => {
        this.handleOnChange(json, updateInfo)
      },
      onSessionStarted: (session: any) => {
        console.log('🚀 Co-editing session started:', session)
      },
      onSessionChange: (session: any) => {
        console.log('🔄 Session status changed:', session)
      },
      onRemoteChange: (_json: any, updateInfo: any) => {
        console.log('👥 Remote change detected:', updateInfo)
      }
    }

    window.bee = this.beeInstance
    this.beeInstance.join(clientConfig, this.currentSessionId)

    this.isInitialized = true
    console.log(`✅ Co-editing SDK initialized with session: ${this.currentSessionId}`)
    return this.beeInstance
  }

  private handleOnChange(_json: any, updateInfo: any) {
    const newVersion = updateInfo?.version || 1

    if (newVersion >= this.lastVersion) {
      this.lastVersion = newVersion
      console.log(`💾 Saving version ${newVersion}`, updateInfo)

      if (updateInfo?.code === 1609) {
        console.log('📚 User browsing history - skipping auto-save')
        return
      }

      console.log('🔄 Template updated:', { version: newVersion, changeId: updateInfo?.changeId })
    } else {
      console.log(`⚠️ Version ${newVersion} <= ${this.lastVersion}, possible network sync issue`)
    }
  }

  async destroySDK() {
    if (!this.beeInstance) return

    try {
      if (typeof this.beeInstance.destroy === 'function') {
        await this.beeInstance.destroy()
      }
      this.beeInstance = null
      window.bee = undefined
      this.isInitialized = false
      console.log('🗑️ Beefree SDK destroyed')
    } catch (error) {
      console.error('❌ Error destroying SDK:', error)
    }
  }

  getInstance(): any {
    return this.beeInstance
  }

  getSessionInfo() {
    return {
      sessionId: this.currentSessionId,
      version: this.lastVersion
    }
  }
}