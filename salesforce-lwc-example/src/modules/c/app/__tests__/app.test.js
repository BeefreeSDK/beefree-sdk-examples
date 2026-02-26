import { createElement } from 'lwc'
import App from 'c/app'
import getAuthToken from '@salesforce/apex/BeefreeAuthController.getAuthToken'
import getTemplate from '@salesforce/apex/BeefreeAuthController.getTemplate'

// Mock the Apex methods
jest.mock('@salesforce/apex/BeefreeAuthController.getAuthToken')
jest.mock('@salesforce/apex/BeefreeAuthController.getTemplate')

describe('c-app', () => {
  let element

  const mockTokenData = { token: 'test-token-123' }
  const mockTemplateJson = { page: { rows: [] } }

  beforeEach(() => {
    getAuthToken.mockClear()
    getTemplate.mockClear()
    
    // Mock BeefreeSDK on window to prevent console.error from child component
    window.BeefreeSDK = jest.fn(() => ({
      start: jest.fn()
    }))
  })

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
    jest.clearAllMocks()
    delete window.BeefreeSDK
  })

  function createComponent() {
    element = createElement('c-app', { is: App })
    document.body.appendChild(element)
    return element
  }

  function setupSuccessfulMocks() {
    getAuthToken.mockResolvedValue(mockTokenData)
    getTemplate.mockResolvedValue(mockTemplateJson)
  }

  // Helper to flush promises
  function flushPromises() {
    return new Promise(resolve => setTimeout(resolve, 0))
  }

  it('should display loading state initially', () => {
    setupSuccessfulMocks()
    const el = createComponent()
    
    const spinner = el.shadowRoot.querySelector('.spinner')
    const loadingText = el.shadowRoot.querySelector('.status-message p')
    
    expect(spinner).not.toBeNull()
    expect(loadingText.textContent).toBe('Loading Beefree Editor…')
  })

  it('should call Apex methods on connectedCallback', async () => {
    setupSuccessfulMocks()
    createComponent()

    await flushPromises()

    expect(getAuthToken).toHaveBeenCalledTimes(1)
    expect(getAuthToken).toHaveBeenCalledWith({ uid: 'salesforce-lwc-example' })
    expect(getTemplate).toHaveBeenCalledTimes(1)
  })

  it('should render beefree-editor when data is loaded', async () => {
    setupSuccessfulMocks()
    const el = createComponent()

    await flushPromises()
    await flushPromises() // Extra flush for render cycle

    const spinner = el.shadowRoot.querySelector('.spinner')
    const editor = el.shadowRoot.querySelector('c-beefree-editor')
    
    expect(spinner).toBeNull()
    expect(editor).not.toBeNull()
  })

  it('should display error message on authentication failure', async () => {
    const mockError = new Error('Authentication failed')
    getAuthToken.mockRejectedValue(mockError)
    getTemplate.mockResolvedValue(mockTemplateJson)
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()

    const el = createComponent()

    await flushPromises()
    await flushPromises()

    const errorMessage = el.shadowRoot.querySelector('.status-message.error p')
    expect(errorMessage).not.toBeNull()
    expect(errorMessage.textContent).toContain('Authentication failed')
    
    errorSpy.mockRestore()
  })

  it('should display error message on template fetch failure', async () => {
    getAuthToken.mockResolvedValue(mockTokenData)
    const mockError = new Error('Failed to load template')
    getTemplate.mockRejectedValue(mockError)
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()

    const el = createComponent()

    await flushPromises()
    await flushPromises()

    const errorMessage = el.shadowRoot.querySelector('.status-message.error p')
    expect(errorMessage).not.toBeNull()
    expect(errorMessage.textContent).toContain('Failed to load template')

    errorSpy.mockRestore()
  })

  it('should not render editor when loading', () => {
    setupSuccessfulMocks()
    const el = createComponent()

    const editor = el.shadowRoot.querySelector('c-beefree-editor')
    expect(editor).toBeNull()
  })

  it('should display hint text on error', async () => {
    getAuthToken.mockRejectedValue(new Error('Network error'))
    getTemplate.mockResolvedValue(mockTemplateJson)
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()

    const el = createComponent()

    await flushPromises()
    await flushPromises()

    const hint = el.shadowRoot.querySelector('.hint')
    expect(hint).not.toBeNull()
    expect(hint.textContent).toContain('Check the server is running')

    errorSpy.mockRestore()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Toolbar tests
  // ─────────────────────────────────────────────────────────────────────────

  describe('toolbar', () => {
    async function createReadyComponent() {
      setupSuccessfulMocks()
      const el = createComponent()
      await flushPromises()
      await flushPromises()
      return el
    }

    it('should render toolbar when editor is ready', async () => {
      const el = await createReadyComponent()
      const toolbar = el.shadowRoot.querySelector('.toolbar')
      expect(toolbar).not.toBeNull()
    })

    it('should render toolbar brand', async () => {
      const el = await createReadyComponent()
      const brand = el.shadowRoot.querySelector('.toolbar-brand')
      expect(brand).not.toBeNull()
      expect(brand.textContent).toContain('Beefree SDK')
    })

    it('should render Undo button', async () => {
      const el = await createReadyComponent()
      const btn = el.shadowRoot.querySelector('.toolbar-btn[title="Undo"]')
      expect(btn).not.toBeNull()
      expect(btn.textContent).toContain('Undo')
    })

    it('should render Redo button', async () => {
      const el = await createReadyComponent()
      const btn = el.shadowRoot.querySelector('.toolbar-btn[title="Redo"]')
      expect(btn).not.toBeNull()
      expect(btn.textContent).toContain('Redo')
    })

    it('should render Structure button', async () => {
      const el = await createReadyComponent()
      const btn = el.shadowRoot.querySelector('.toolbar-btn[title="Toggle Structure"]')
      expect(btn).not.toBeNull()
      expect(btn.textContent).toContain('Structure')
    })

    it('should render Preview button', async () => {
      const el = await createReadyComponent()
      const btn = el.shadowRoot.querySelector('.toolbar-btn[title="Toggle Preview"]')
      expect(btn).not.toBeNull()
      expect(btn.textContent).toContain('Preview')
    })

    it('should render Save button', async () => {
      const el = await createReadyComponent()
      const btn = el.shadowRoot.querySelector('.toolbar-btn[title="Save"]')
      expect(btn).not.toBeNull()
      expect(btn.textContent).toContain('Save')
    })

    it('should render Save as Template button', async () => {
      const el = await createReadyComponent()
      const btn = el.shadowRoot.querySelector('.toolbar-btn[title="Save as Template"]')
      expect(btn).not.toBeNull()
      expect(btn.textContent).toContain('Save JSON')
    })

    it('should call editorComponent.undo when Undo button is clicked', async () => {
      const el = await createReadyComponent()
      const editor = el.shadowRoot.querySelector('c-beefree-editor')
      editor.undo = jest.fn()
      
      const undoBtn = el.shadowRoot.querySelector('.toolbar-btn[title="Undo"]')
      undoBtn.click()
      
      expect(editor.undo).toHaveBeenCalledTimes(1)
    })

    it('should call editorComponent.redo when Redo button is clicked', async () => {
      const el = await createReadyComponent()
      const editor = el.shadowRoot.querySelector('c-beefree-editor')
      editor.redo = jest.fn()
      
      const redoBtn = el.shadowRoot.querySelector('.toolbar-btn[title="Redo"]')
      redoBtn.click()
      
      expect(editor.redo).toHaveBeenCalledTimes(1)
    })

    it('should call editorComponent.save when Save button is clicked', async () => {
      const el = await createReadyComponent()
      const editor = el.shadowRoot.querySelector('c-beefree-editor')
      editor.save = jest.fn()
      
      const saveBtn = el.shadowRoot.querySelector('.toolbar-btn[title="Save"]')
      saveBtn.click()
      
      expect(editor.save).toHaveBeenCalledTimes(1)
    })

    it('should call editorComponent.saveAsTemplate when Save as Template button is clicked', async () => {
      const el = await createReadyComponent()
      const editor = el.shadowRoot.querySelector('c-beefree-editor')
      editor.saveAsTemplate = jest.fn()
      
      const saveTemplateBtn = el.shadowRoot.querySelector('.toolbar-btn[title="Save as Template"]')
      saveTemplateBtn.click()
      
      expect(editor.saveAsTemplate).toHaveBeenCalledTimes(1)
    })

    it('should call editorComponent.toggleStructure when Structure button is clicked', async () => {
      const el = await createReadyComponent()
      const editor = el.shadowRoot.querySelector('c-beefree-editor')
      editor.toggleStructure = jest.fn()
      
      const structureBtn = el.shadowRoot.querySelector('.toolbar-btn[title="Toggle Structure"]')
      structureBtn.click()
      
      expect(editor.toggleStructure).toHaveBeenCalledTimes(1)
    })

    it('should call editorComponent.togglePreview when Preview button is clicked', async () => {
      const el = await createReadyComponent()
      const editor = el.shadowRoot.querySelector('c-beefree-editor')
      editor.togglePreview = jest.fn()
      
      const previewBtn = el.shadowRoot.querySelector('.toolbar-btn[title="Toggle Preview"]')
      previewBtn.click()
      
      expect(editor.togglePreview).toHaveBeenCalledTimes(1)
    })
  })
})
