import { LightningElement, api } from 'lwc'
import { loadScript } from 'lightning/platformResourceLoader'
import BEEFREE_SDK from '@salesforce/resourceUrl/beefree_sdk'

/**
 * LWC wraps @api values in reactive Proxy objects (membrane pattern).
 * The Beefree SDK uses postMessage internally, which requires data to be
 * structured-clone-compatible. Proxies are not cloneable, so we strip them.
 */
function unwrap(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default class BeefreeEditor extends LightningElement {
  @api tokenData
  @api templateJson
  @api uid = 'salesforce-lwc-example'

  _sdkInstance = null
  _initInProgress = false
  _initialized = false
  _sdkLoaded = false

  _baseConfig = {
    topBarEnabled: false,
  }

  renderedCallback() {
    console.log('[c-beefree-editor] renderedCallback', {
      _initialized: this._initialized,
      _initInProgress: this._initInProgress,
      hasTokenData: !!this.tokenData,
      hasTemplateJson: !!this.templateJson,
    })
    if (this._initialized || this._initInProgress || !this.tokenData || !this.templateJson) {
      return
    }
    this._initInProgress = true
    this.loadSdkAndInit()
  }

  async loadSdkAndInit() {
    console.log('[c-beefree-editor] loadSdkAndInit started')
    
    // Check if BeePlugin is already loaded (e.g., from index.html in local dev)
    if (window.BeePlugin) {
      console.log('[c-beefree-editor] BeePlugin already available on window')
      this._sdkLoaded = true
    }
    
    // If not loaded, load from Salesforce Static Resource
    if (!this._sdkLoaded) {
      try {
        console.log('[c-beefree-editor] Loading BeePlugin from Static Resource:', BEEFREE_SDK)
        await loadScript(this, BEEFREE_SDK)
        this._sdkLoaded = true
        console.log('[c-beefree-editor] BeePlugin loaded successfully from Static Resource')
      } catch (error) {
        console.error('[c-beefree-editor] Failed to load BeePlugin', error)
        this._initInProgress = false
        return
      }
    }
    this.initEditor()
  }

  initEditor() {
    console.log('[c-beefree-editor] initEditor started')
    const container = this.template.querySelector('.beefree-container')
    if (!container) {
      console.error('[c-beefree-editor] Container element not found')
      this._initInProgress = false
      return
    }
    console.log('[c-beefree-editor] Container found:', container)

    // BeePlugin.js is loaded globally (CDN in local dev, Static Resource in Salesforce)
    const BeePlugin = window.BeePlugin
    if (!BeePlugin) {
      console.error('[c-beefree-editor] BeePlugin not found on window')
      this._initInProgress = false
      return
    }
    console.log('[c-beefree-editor] BeePlugin found on window')

    const token = unwrap(this.tokenData)
    const template = unwrap(this.templateJson)
    console.log('[c-beefree-editor] Token:', JSON.stringify(token))
    console.log('[c-beefree-editor] Template:', JSON.stringify(template).substring(0, 500))

    const beeConfig = {
      uid: this.uid,
      container,
      ...this._baseConfig,
      onLoad: () => {
        console.log('[c-beefree-editor] SDK onLoad callback - editor ready!')
      },
      onError: (error) => {
        console.error('[c-beefree-editor] SDK onError callback:', error)
      },
    }

    try {
      console.log('[c-beefree-editor] Creating BeePlugin instance...')
      BeePlugin.create(token, beeConfig, (instance) => {
        console.log('[c-beefree-editor] BeePlugin instance created, starting...')
        this._sdkInstance = instance
        instance.start(template, { shared: false })
        console.log('[c-beefree-editor] BeePlugin start() called successfully')
        this._initialized = true
        this._initInProgress = false
      })
    } catch (error) {
      console.error('[c-beefree-editor] SDK initialization failed', error)
      this._initInProgress = false
    }
  }

  disconnectedCallback() {
    this._sdkInstance = null
    this._initialized = false
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API methods – callable from parent component via querySelector
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Save the current design as a template.
   * Triggers onSaveAsTemplate callback with the JSON.
   */
  @api
  saveAsTemplate() {
    if (!this._sdkInstance) return
    this._sdkInstance.saveAsTemplate()
  }

  /**
   * Save the current design.
   * Triggers onSave callback with JSON and HTML.
   */
  @api
  save() {
    if (!this._sdkInstance) return
    this._sdkInstance.save()
  }

  /**
   * Open the preview modal.
   */
  @api
  preview() {
    if (!this._sdkInstance) return
    this._sdkInstance.preview()
  }

  /**
   * Toggle the structure outline view.
   */
  @api
  toggleStructure() {
    if (!this._sdkInstance) return
    this._sdkInstance.toggleStructure()
  }

  /**
   * Toggle the preview mode.
   */
  @api
  togglePreview() {
    if (!this._sdkInstance) return
    this._sdkInstance.togglePreview()
  }

  /**
   * Undo the last action.
   */
  @api
  undo() {
    if (!this._sdkInstance) return
    this._sdkInstance.undo()
  }

  /**
   * Redo the last undone action.
   */
  @api
  redo() {
    if (!this._sdkInstance) return
    this._sdkInstance.redo()
  }
}
