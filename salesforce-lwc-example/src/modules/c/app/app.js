import { LightningElement } from 'lwc'
import getAuthToken from '@salesforce/apex/BeefreeAuthController.getAuthToken'
import getTemplate from '@salesforce/apex/BeefreeAuthController.getTemplate'

const DEFAULT_UID = 'salesforce-lwc-example'
const DEFAULT_TEMPLATE_ID = 'm-bee'

export default class App extends LightningElement {
  tokenData = null
  templateJson = null
  error = null
  isLoading = true
  sdkVersion = '1.0.2'

  get isReady() {
    return !this.isLoading && !this.error && this.tokenData && this.templateJson
  }

  /**
   * Returns the c-beefree-editor child component instance.
   */
  get editorComponent() {
    return this.template.querySelector('c-beefree-editor')
  }

  async connectedCallback() {
    try {
      const [token, template] = await Promise.all([
        this.fetchToken(),
        this.fetchTemplate(),
      ])
      this.tokenData = token
      this.templateJson = template
    } catch (err) {
      this.error = err.message
      console.error('[c-app] Initialization failed', err)
    } finally {
      this.isLoading = false
    }
  }

  async fetchToken() {
    const result = await getAuthToken({ uid: DEFAULT_UID })
    return typeof result === 'string' ? JSON.parse(result) : result
  }

  async fetchTemplate() {
    const result = await getTemplate({ templateId: DEFAULT_TEMPLATE_ID })
    return typeof result === 'string' ? JSON.parse(result) : result
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Toolbar action handlers – delegate to c-beefree-editor public API
  // ─────────────────────────────────────────────────────────────────────────

  handleUndo() {
    this.editorComponent?.undo()
  }

  handleRedo() {
    this.editorComponent?.redo()
  }

  handleToggleStructure() {
    this.editorComponent?.toggleStructure()
  }

  handleTogglePreview() {
    this.editorComponent?.togglePreview()
  }

  handleSave() {
    this.editorComponent?.save()
  }

  handleSaveAsTemplate() {
    this.editorComponent?.saveAsTemplate()
  }
}
