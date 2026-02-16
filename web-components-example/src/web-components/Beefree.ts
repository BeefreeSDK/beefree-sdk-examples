import BeefreeSDK from '@beefree.io/sdk'
import type { IBeeConfig, IBeeOptions, IEntityContentJson, IToken } from '@beefree.io/sdk/dist/types/bee'

const DEFAULT_CONTAINER_ID = 'bee-plugin-container'
const DEFAULT_CONTAINER_CLASS = 'beefree-container'

interface BeefreeComponentConfig {
  beeConfig?: Partial<IBeeConfig>
  startOptions?: IBeeOptions
}

type BeefreePropertyKey = 'config' | 'token' | 'template' | 'sessionId'

class Beefree extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['config', 'token', 'template']
  }

  private state: {
    config: BeefreeComponentConfig | null
    token: IToken | string | null
    template: IEntityContentJson | string | null
    sessionId: string | null
  }

  private sdkInstance: BeefreeSDK | null
  private container: HTMLDivElement
  private shadowStyle: HTMLStyleElement

  constructor() {
    super()

    this.state = {
      config: null,
      token: null,
      template: null,
      sessionId: null,
    }

    this.sdkInstance = null

    this.attachShadow({ mode: 'open' })

    this.container = document.createElement('div')
    this.shadowStyle = document.createElement('style')
    this.shadowStyle.textContent = `
    .beefree-container {
      position: absolute;
      top:65px;
      bottom:10px;
      left:10px;
      right:10px;
      overflow: hidden;
      border-radius: 5px;
    }`
    this.shadowRoot!.appendChild(this.shadowStyle)
    this.container.id = DEFAULT_CONTAINER_ID
    this.container.className = DEFAULT_CONTAINER_CLASS
    this.shadowRoot!.appendChild(this.container)

    this.initializeProperty('config')
    this.initializeProperty('token')
    this.initializeProperty('template')
    this.initializeProperty('sessionId')
  }

  connectedCallback(): void {
    this.syncInitialAttributes()
    this.tryInit()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) {
      return
    }

    const trimmed = typeof newValue === 'string' ? newValue.trim() : newValue
    this.updateStateFromAttribute(name, trimmed)
  }

  private syncInitialAttributes(): void {
    Beefree.observedAttributes.forEach((attribute) => {
      const value = this.getAttribute(attribute)
      if (value !== null) {
        this.updateStateFromAttribute(attribute, value)
      }
    })
  }

  private updateStateFromAttribute(name: string, value: string | null): void {
    switch (name) {
      case 'config':
        this.config = value
        break
      case 'token':
        this.token = value
        break
      case 'template':
        this.template = value
        break
      default:
        break
    }
  }

  private resolveConfigValue(value: unknown): BeefreeComponentConfig | null {
    if (value === undefined || value === null || value === '') {
      return null
    }

    if (typeof value === 'object') {
      return value as BeefreeComponentConfig
    }

    try {
      return JSON.parse(value as string) as BeefreeComponentConfig
    } catch (error) {
      console.error('[beefree-component] Failed to parse config attribute', error)
      return null
    }
  }

  private resolveTokenValue(value: unknown): IToken | string | null {
    if (value === undefined || value === null || value === '') {
      return null
    }

    return typeof value === 'string' ? value.trim() || null : (value as IToken)
  }

  private parseTemplate(value: unknown): IEntityContentJson | string | null {
    if (value === undefined || value === null || value === '') {
      return null
    }

    if (typeof value !== 'string') {
      return value as IEntityContentJson
    }

    try {
      return JSON.parse(value) as IEntityContentJson
    } catch (error) {
      console.warn('[beefree-component] Using raw template attribute value', error)
      return value
    }
  }

  set config(value: unknown) {
    this.state.config = this.resolveConfigValue(value)
    this.tryInit()
  }

  get config(): BeefreeComponentConfig | null {
    return this.state.config
  }

  set token(value: unknown) {
    this.state.token = this.resolveTokenValue(value)
    this.tryInit()
  }

  get token(): IToken | string | null {
    return this.state.token
  }

  set template(value: unknown) {
    if (typeof value === 'string') {
      this.state.template = this.parseTemplate(value)
    } else {
      this.state.template = (value as IEntityContentJson) ?? null
    }
    this.tryInit()
  }

  get template(): IEntityContentJson | string | null {
    return this.state.template
  }

  set sessionId(value: string | null) {
    this.state.sessionId = value
    this.tryInit()
  }

  get sessionId(): string | null {
    return this.state.sessionId
  }

  /**
   * Captures any properties set on the element before the custom element
   * definition was registered, then re-applies them through the setters.
   */
  private initializeProperty(propertyName: BeefreePropertyKey): void {
    if (Object.prototype.hasOwnProperty.call(this, propertyName)) {
      const self = this as unknown as Record<string, unknown>
      const value = self[propertyName]
      delete self[propertyName]
      self[propertyName] = value
    }
  }

  private tryInit(): void {
    const { config, token, template, sessionId } = this.state
    if (!config || !token || (!template && !sessionId)) {
      return
    }

    if (this.sdkInstance) {
      console.warn('[beefree-component] SDK already initialised; attribute updates after init are not supported yet.')
      return
    }

    const beeConfigOverride = typeof config.beeConfig === 'object' ? config.beeConfig : {}
    const startOptions = typeof config.startOptions === 'object' ? config.startOptions : { shared: false }

    const beeConfig = {
      ...beeConfigOverride,
      container: this.container,
    } as IBeeConfig

    try {
      this.sdkInstance = new BeefreeSDK(token as IToken)

      if (sessionId) {
        this.sdkInstance.join(beeConfig, sessionId)
      } else {
        this.sdkInstance.start(beeConfig, template as IEntityContentJson, undefined, startOptions)
      }
    } catch (error) {
      console.error('[beefree-component] Failed to initialise BeefreeSDK', error)
    }
  }
}

export { Beefree }

customElements.define('beefree-component', Beefree)
