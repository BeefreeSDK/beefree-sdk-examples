import { createElement } from 'lwc'
import BeefreeEditor from 'c/beefreeEditor'
import { loadScript } from 'lightning/platformResourceLoader'

// Mock the lightning module
jest.mock('lightning/platformResourceLoader')

describe('c-beefree-editor', () => {
  let element
  let mockSdkInstance

  const mockTokenData = { token: 'test-token-123' }
  const mockTemplateJson = { page: { rows: [] } }

  beforeEach(() => {
    // Clear all mocks
    loadScript.mockClear()
    
    // Setup mock SDK instance
    mockSdkInstance = {
      start: jest.fn(),
      saveAsTemplate: jest.fn(),
      save: jest.fn(),
      preview: jest.fn(),
      toggleStructure: jest.fn(),
      togglePreview: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
    }
    
    // Mock BeePlugin.create() - calls callback with instance
    window.BeePlugin = {
      create: jest.fn((token, config, callback) => {
        callback(mockSdkInstance)
      })
    }
    
    // loadScript resolves immediately
    loadScript.mockResolvedValue(undefined)
  })

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
    jest.clearAllMocks()
    delete window.BeePlugin
  })

  function createComponent(props = {}) {
    element = createElement('c-beefree-editor', { is: BeefreeEditor })
    Object.assign(element, props)
    document.body.appendChild(element)
    return element
  }

  // Helper to flush promises
  function flushPromises() {
    return new Promise(resolve => setTimeout(resolve, 0))
  }

  it('should render container element', async () => {
    const el = createComponent()
    await flushPromises()
    
    const container = el.shadowRoot.querySelector('.beefree-container')
    expect(container).not.toBeNull()
  })

  it('should not initialize SDK without tokenData', async () => {
    createComponent({ templateJson: mockTemplateJson })
    await flushPromises()
    
    expect(loadScript).not.toHaveBeenCalled()
  })

  it('should not initialize SDK without templateJson', async () => {
    createComponent({ tokenData: mockTokenData })
    await flushPromises()
    
    expect(loadScript).not.toHaveBeenCalled()
  })

  it('should skip loadScript when BeePlugin is already on window', async () => {
    // BeePlugin is already set in beforeEach
    createComponent({
      tokenData: mockTokenData,
      templateJson: mockTemplateJson,
    })
    await flushPromises()
    
    // loadScript should NOT be called since BeePlugin is already available
    expect(loadScript).not.toHaveBeenCalled()
    // But SDK should still be initialized
    expect(window.BeePlugin.create).toHaveBeenCalled()
  })

  it('should call loadScript when BeePlugin is not on window (Salesforce path)', async () => {
    // Remove BeePlugin to simulate Salesforce environment
    const originalBeePlugin = window.BeePlugin
    delete window.BeePlugin
    
    // loadScript will "load" BeePlugin
    loadScript.mockImplementation(() => {
      window.BeePlugin = originalBeePlugin
      return Promise.resolve()
    })
    
    createComponent({
      tokenData: mockTokenData,
      templateJson: mockTemplateJson,
    })
    await flushPromises()
    
    expect(loadScript).toHaveBeenCalled()
    expect(window.BeePlugin.create).toHaveBeenCalled()
  })

  it('should initialize SDK after loadScript completes', async () => {
    createComponent({
      tokenData: mockTokenData,
      templateJson: mockTemplateJson,
    })
    await flushPromises()
    
    expect(window.BeePlugin.create).toHaveBeenCalledWith(
      mockTokenData,
      expect.objectContaining({ container: expect.any(Element) }),
      expect.any(Function)
    )
    expect(mockSdkInstance.start).toHaveBeenCalled()
  })

  it('should pass correct config to SDK.start', async () => {
    createComponent({
      tokenData: mockTokenData,
      templateJson: mockTemplateJson,
      uid: 'custom-uid',
    })
    await flushPromises()
    
    // BeePlugin.create receives token and config
    expect(window.BeePlugin.create).toHaveBeenCalledWith(
      mockTokenData,
      expect.objectContaining({
        uid: 'custom-uid',
        container: expect.any(Element),
      }),
      expect.any(Function)
    )
    // instance.start receives template and options
    expect(mockSdkInstance.start).toHaveBeenCalledWith(
      mockTemplateJson,
      { shared: false }
    )
  })

  it('should use default uid if not provided', async () => {
    createComponent({
      tokenData: mockTokenData,
      templateJson: mockTemplateJson,
    })
    await flushPromises()
    
    expect(window.BeePlugin.create).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        uid: 'salesforce-lwc-example',
      }),
      expect.any(Function)
    )
  })

  it('should not re-initialize SDK on subsequent renders', async () => {
    const el = createComponent({
      tokenData: mockTokenData,
      templateJson: mockTemplateJson,
    })
    await flushPromises()
    
    const initialCreateCalls = window.BeePlugin.create.mock.calls.length
    
    // Force a re-render by changing a property
    el.uid = 'new-uid'
    await flushPromises()
    
    // BeePlugin.create should still only be called once
    expect(window.BeePlugin.create).toHaveBeenCalledTimes(initialCreateCalls)
  })

  it('should handle loadScript failure gracefully', async () => {
    // Remove BeePlugin from window to force loadScript path
    delete window.BeePlugin
    
    loadScript.mockRejectedValue(new Error('Failed to load'))
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()

    createComponent({
      tokenData: mockTokenData,
      templateJson: mockTemplateJson,
    })
    await flushPromises()
    
    expect(errorSpy).toHaveBeenCalledWith(
      '[c-beefree-editor] Failed to load BeePlugin',
      expect.any(Error)
    )

    errorSpy.mockRestore()
  })

  it('should handle BeePlugin.create throwing an error', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    // Make BeePlugin.create throw an error
    window.BeePlugin.create = jest.fn(() => {
      throw new Error('SDK creation failed')
    })

    createComponent({
      tokenData: mockTokenData,
      templateJson: mockTemplateJson,
    })
    await flushPromises()
    
    expect(errorSpy).toHaveBeenCalledWith(
      '[c-beefree-editor] SDK initialization failed',
      expect.any(Error)
    )
    errorSpy.mockRestore()
  })

  it('should call onError callback when SDK reports error', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    // Capture the config passed to BeePlugin.create
    let capturedConfig
    window.BeePlugin.create = jest.fn((token, config, callback) => {
      capturedConfig = config
      callback(mockSdkInstance)
    })

    createComponent({
      tokenData: mockTokenData,
      templateJson: mockTemplateJson,
    })
    await flushPromises()
    
    // Simulate SDK calling onError
    expect(capturedConfig.onError).toBeDefined()
    capturedConfig.onError({ message: 'SDK error occurred' })
    
    expect(errorSpy).toHaveBeenCalledWith(
      '[c-beefree-editor] SDK onError callback:',
      { message: 'SDK error occurred' }
    )
    errorSpy.mockRestore()
  })

  it('should unwrap proxy objects before passing to SDK', async () => {
    // Simulate LWC proxy behavior with nested objects
    const proxyTokenData = { token: 'proxy-token', nested: { value: 123 } }
    const proxyTemplateJson = { page: { rows: [{ id: 1 }] } }

    createComponent({
      tokenData: proxyTokenData,
      templateJson: proxyTemplateJson,
    })
    await flushPromises()
    
    // BeePlugin.create should receive plain objects (unwrapped)
    expect(window.BeePlugin.create).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'proxy-token' }),
      expect.any(Object),
      expect.any(Function)
    )
    // instance.start should receive plain template
    expect(mockSdkInstance.start).toHaveBeenCalledWith(
      expect.objectContaining({ page: { rows: [{ id: 1 }] } }),
      expect.anything()
    )
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Public @api method tests
  // ─────────────────────────────────────────────────────────────────────────

  describe('public @api methods', () => {
    async function createInitializedComponent() {
      const el = createComponent({
        tokenData: mockTokenData,
        templateJson: mockTemplateJson,
      })
      await flushPromises()
      return el
    }

    it('saveAsTemplate() should call SDK saveAsTemplate', async () => {
      const el = await createInitializedComponent()
      el.saveAsTemplate()
      expect(mockSdkInstance.saveAsTemplate).toHaveBeenCalledTimes(1)
    })

    it('save() should call SDK save', async () => {
      const el = await createInitializedComponent()
      el.save()
      expect(mockSdkInstance.save).toHaveBeenCalledTimes(1)
    })

    it('preview() should call SDK preview', async () => {
      const el = await createInitializedComponent()
      el.preview()
      expect(mockSdkInstance.preview).toHaveBeenCalledTimes(1)
    })

    it('toggleStructure() should call SDK toggleStructure', async () => {
      const el = await createInitializedComponent()
      el.toggleStructure()
      expect(mockSdkInstance.toggleStructure).toHaveBeenCalledTimes(1)
    })

    it('togglePreview() should call SDK togglePreview', async () => {
      const el = await createInitializedComponent()
      el.togglePreview()
      expect(mockSdkInstance.togglePreview).toHaveBeenCalledTimes(1)
    })

    it('undo() should call SDK undo', async () => {
      const el = await createInitializedComponent()
      el.undo()
      expect(mockSdkInstance.undo).toHaveBeenCalledTimes(1)
    })

    it('redo() should call SDK redo', async () => {
      const el = await createInitializedComponent()
      el.redo()
      expect(mockSdkInstance.redo).toHaveBeenCalledTimes(1)
    })

    it('should not throw when SDK instance is not initialized', () => {
      const el = createComponent() // No tokenData/templateJson
      expect(() => el.saveAsTemplate()).not.toThrow()
      expect(() => el.save()).not.toThrow()
      expect(() => el.preview()).not.toThrow()
      expect(() => el.undo()).not.toThrow()
      expect(() => el.redo()).not.toThrow()
    })
  })
})
