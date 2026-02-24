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
    if (this._initialized || this._initInProgress || !this.tokenData || !this.templateJson) {
      return
    }
    this._initInProgress = true
    this.loadSdkAndInit()
  }

  async loadSdkAndInit() {
    if (!this._sdkLoaded) {
      try {
        await loadScript(this, BEEFREE_SDK)
        this._sdkLoaded = true
      } catch (error) {
        console.error('[c-beefree-editor] Failed to load Beefree SDK', error)
        this._initInProgress = false
        return
      }
    }
    this.initEditor()
  }

  initEditor() {
    const container = this.template.querySelector('.beefree-container')
    if (!container) {
      console.error('[c-beefree-editor] Container element not found')
      this._initInProgress = false
      return
    }

    const BeefreeSDK = window.BeefreeSDK
    if (!BeefreeSDK) {
      console.error('[c-beefree-editor] BeefreeSDK not found on window')
      this._initInProgress = false
      return
    }

    const token = unwrap(this.tokenData)
    const template = unwrap(this.templateJson)

    const beeConfig = {
      uid: this.uid,
      container,
      ...this._baseConfig,
    }

    try {
      this._sdkInstance = new BeefreeSDK(token)
      this._sdkInstance.start(beeConfig, template, undefined, {
        shared: false,
      })
      this._initialized = true
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
