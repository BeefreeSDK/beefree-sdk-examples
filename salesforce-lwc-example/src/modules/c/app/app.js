import { LightningElement } from 'lwc'
import getAuthToken from '@salesforce/apex/BeefreeAuthController.getAuthToken'
import getTemplate from '@salesforce/apex/BeefreeAuthController.getTemplate'

const DEFAULT_UID = 'salesforce-lwc-example'
const DEFAULT_TEMPLATE_ID = 'm-bee'

/**
 * Downloads content as a file in the browser.
 * Uses data URI approach that works with Salesforce Locker Service.
 */
function downloadFile(content, filename, mimeType = 'text/html') {
  // Encode content as base64 for data URI
  const base64Content = btoa(unescape(encodeURIComponent(content)))
  const dataUri = `data:${mimeType};base64,${base64Content}`
  
  // Create a temporary anchor and trigger download
  // Using a self-contained approach that works in Locker Service
  const link = document.createElement('a')
  link.href = dataUri
  link.download = filename
  link.style.display = 'none'
  link.target = '_blank'
  
  // For Salesforce compatibility, we need to handle this differently
  // Try the standard approach first, fall back to opening in new tab
  try {
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch {
    // Fallback: open data URI in new window
    // This will prompt user to save the page
    window.open(dataUri, '_blank')
  }
}

export default class App extends LightningElement {
  tokenData = null
  templateJson = null
  error = null
  isLoading = true
  exampleAppVersion = '1.0.6'
  appConfig = {
    sidebarPosition: 'left',
    // Add any custom configuration for the editor here
    onLoad: () => {
      console.log('[c-app] SDK onLoad callback')
    },
    onError: (error) => {
      console.error('[c-app] SDK onError callback:', error)
    },
    onSave: (json, html) => {
      console.log('[c-app] SDK onSave callback - json:', json)
      console.log('[c-app] SDK onSave callback - HTML length:', html?.length)
      if (html) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
        downloadFile(html, `beefree-export-${timestamp}.html`)
      }
    }, 
    onSaveAsTemplate: (json) => {
      console.log('[c-app] SDK onSaveAsTemplate callback:', json)
      if (json) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
        const content = json
        downloadFile(content, `beefree-template-${timestamp}.json`, 'application/json')
      }
    }
  }

  get isReady() {
    return !this.isLoading && !this.error && this.tokenData && this.templateJson
  }

  /**
   * Returns the c-beefree-editor child component instance.
   */
  get editorComponent() {
    return this.template.querySelector('c-beefree-editor')
  }

  get appVersion() {
    return this.exampleAppVersion
  }

  get editorConfig() {
    return this.appConfig
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
    return result
  }

  async fetchTemplate() {
    const result = await getTemplate({ templateId: DEFAULT_TEMPLATE_ID })
    return result
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Toolbar action handlers – delegate to c-beefree-editor public API
  // ─────────────────────────────────────────────────────────────────────────

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

  handleLoad() {
    // Create a hidden file input to trigger the file picker
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.style.display = 'none'
    
    input.addEventListener('change', (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result)
          console.log('[c-app] Loaded template from file:', file.name)
          this.editorComponent?.load(json)
        } catch (err) {
          console.error('[c-app] Failed to parse JSON file:', err)
          // eslint-disable-next-line no-alert
          alert('Invalid JSON file. Please select a valid Beefree template.')
        }
      }
      reader.onerror = () => {
        console.error('[c-app] Failed to read file')
      }
      reader.readAsText(file)
      
      // Clean up
      document.body.removeChild(input)
    })
    
    document.body.appendChild(input)
    input.click()
  }
}
