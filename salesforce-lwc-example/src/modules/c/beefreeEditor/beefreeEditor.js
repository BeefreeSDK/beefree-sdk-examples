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

/**
 * Extract functions from an object (they can't survive JSON.stringify).
 * Returns { data, functions } where data is the serializable part.
 */
function extractFunctions(obj) {
  if (!obj || typeof obj !== 'object') {
    return { data: obj, functions: {} }
  }
  const functions = {}
  const data = {}
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'function') {
      functions[key] = obj[key]
    } else {
      data[key] = obj[key]
    }
  }
  return { data, functions }
}

export default class BeefreeEditor extends LightningElement {
  @api tokenData
  @api templateJson
  @api uid = 'salesforce-lwc-example'
  @api config = {}

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

    // BeePlugin.js is loaded globally (CDN in local dev, Static Resource in Salesforce)
    const BeePlugin = window.BeePlugin
    if (!BeePlugin) {
      console.error('[c-beefree-editor] BeePlugin not found on window')
      this._initInProgress = false
      return
    }

    const token = unwrap(this.tokenData)
    const template = unwrap(this.templateJson)
    
    // Extract functions (callbacks) before unwrapping to preserve them
    const { data: configData, functions: configCallbacks } = extractFunctions(this.config || {})
    const customConfig = configData ? unwrap(configData) : {}

    const beeConfig = {
      uid: this.uid,
      container,
      ...this._baseConfig,
      ...customConfig,
      ...configCallbacks, // Merge callbacks back (onLoad, onSave, onError, etc.)
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
   * Load a template
   */
  @api
  load(templateJson) {
    if (!this._sdkInstance) return
    this._sdkInstance.load(templateJson)
  }
}
