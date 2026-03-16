import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import BuilderArea from './BuilderArea.vue'
import { useBuilder } from '@beefree.io/vue-email-builder'

describe('BuilderArea', () => {
  const mockMonitoredFetch = vi.fn()
  const builderApi = useBuilder() as { load: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockMonitoredFetch.mockReset()
    builderApi.load.mockReset()
  })

  it('renders menu bar with Load buttons', () => {
    const wrapper = mount(BuilderArea, {
      props: {
        token: null,
        uid: 'test-user',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })
    const buttons = wrapper.findAll('.builder-menu-bar button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('Load Sample Template')
    expect(buttons[1].text()).toBe('Load Blank Template')
  })

  it('does not render Builder when token is null', () => {
    const wrapper = mount(BuilderArea, {
      props: {
        token: null,
        uid: 'test-user',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })
    expect(wrapper.find('.mock-builder').exists()).toBe(false)
  })

  it('loads sample template when token is provided', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    mount(BuilderArea, {
      props: {
        token: { access_token: 'tok' },
        uid: 'test-user',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()

    expect(mockMonitoredFetch).toHaveBeenCalledWith('/template/sample')
  })

  it('renders Builder when token and template are present', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    const wrapper = mount(BuilderArea, {
      props: {
        token: { access_token: 'tok' },
        uid: 'test-user',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()

    expect(wrapper.find('.mock-builder').exists()).toBe(true)
  })

  it('loads blank template on button click', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    const wrapper = mount(BuilderArea, {
      props: {
        token: null,
        uid: 'test-user',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    const buttons = wrapper.findAll('.builder-menu-bar button')

    // initial state has no template loaded in the SDK runtime
    expect(builderApi.load).not.toHaveBeenCalled()

    await buttons[1].trigger('click')
    await flushPromises()

    expect(mockMonitoredFetch).toHaveBeenCalledWith('/template/blank')
    expect(builderApi.load).not.toHaveBeenCalled()
  })

  it('loads fetched template into an already-mounted builder', async () => {
    const sampleTemplate = { page: { title: 'sample' }, comments: {} }
    const blankTemplate = { page: { title: 'blank' }, comments: {} }

    mockMonitoredFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(sampleTemplate) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(blankTemplate) })

    const wrapper = mount(BuilderArea, {
      props: {
        token: { access_token: 'tok' },
        uid: 'test-user',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()
    expect(wrapper.find('.mock-builder').exists()).toBe(true)

    const buttons = wrapper.findAll('.builder-menu-bar button')
    await buttons[1].trigger('click')
    await flushPromises()

    expect(builderApi.load).toHaveBeenCalledTimes(1)
    expect(builderApi.load).toHaveBeenCalledWith(blankTemplate)
  })

  it('loads sample template on button click', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    const wrapper = mount(BuilderArea, {
      props: {
        token: null,
        uid: 'test-user',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    const buttons = wrapper.findAll('.builder-menu-bar button')
    await buttons[0].trigger('click')
    await flushPromises()

    expect(mockMonitoredFetch).toHaveBeenCalledWith('/template/sample')
  })

  it('handles fetch errors gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    mockMonitoredFetch.mockRejectedValue(new Error('Network error'))

    mount(BuilderArea, {
      props: {
        token: { access_token: 'tok' },
        uid: 'test-user',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()

    expect(errorSpy).toHaveBeenCalledWith('Failed to load template:', expect.any(Error))
  })

  it('does not initialize twice when token changes', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    const wrapper = mount(BuilderArea, {
      props: {
        token: { access_token: 'tok1' },
        uid: 'test-user',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()
    const firstCallCount = mockMonitoredFetch.mock.calls.length

    await wrapper.setProps({ token: { access_token: 'tok2' } })
    await flushPromises()

    // Should not have made additional fetch calls
    expect(mockMonitoredFetch.mock.calls.length).toBe(firstCallCount)
  })

  it('uses uid in builder config', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    const wrapper = mount(BuilderArea, {
      props: {
        token: { access_token: 'tok' },
        uid: 'custom-uid',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()

    expect(wrapper.find('.mock-builder').text()).toContain('custom-uid')
  })

  it('falls back to default uid when empty', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    const wrapper = mount(BuilderArea, {
      props: {
        token: { access_token: 'tok' },
        uid: '',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()

    expect(wrapper.find('.mock-builder').text()).toContain('vue-fastify-demo')
  })

  it('onSave callback triggers file download', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    const createObjectURL = vi.fn().mockReturnValue('blob:abc')
    const revokeObjectURL = vi.fn()
    globalThis.URL.createObjectURL = createObjectURL
    globalThis.URL.revokeObjectURL = revokeObjectURL

    const clickFn = vi.fn()
    const origCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return { click: clickFn, href: '', download: '' } as unknown as HTMLAnchorElement
      }
      return origCreateElement(tag)
    })

    const wrapper = mount(BuilderArea, {
      props: {
        token: { access_token: 'tok' },
        uid: 'u1',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()

    const mockBuilder = wrapper.findComponent({ name: 'MockBuilder' })
    const config = mockBuilder.props('config') as { onSave: (json: string, html: string) => void }
    config.onSave('{}', '<html>test</html>')

    expect(createObjectURL).toHaveBeenCalled()
    expect(clickFn).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:abc')
  })

  it('onSaveAsTemplate downloads JSON from string', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    const createObjectURL = vi.fn().mockReturnValue('blob:def')
    const revokeObjectURL = vi.fn()
    globalThis.URL.createObjectURL = createObjectURL
    globalThis.URL.revokeObjectURL = revokeObjectURL

    const clickFn = vi.fn()
    const origCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return { click: clickFn, href: '', download: '' } as unknown as HTMLAnchorElement
      }
      return origCreateElement(tag)
    })

    const wrapper = mount(BuilderArea, {
      props: {
        token: { access_token: 'tok' },
        uid: 'u1',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()

    const mockBuilder = wrapper.findComponent({ name: 'MockBuilder' })
    const config = mockBuilder.props('config') as { onSaveAsTemplate: (json: string | Record<string, unknown>) => void }
    config.onSaveAsTemplate('{"x":1}')

    expect(createObjectURL).toHaveBeenCalled()
    expect(clickFn).toHaveBeenCalled()
  })

  it('onSaveAsTemplate downloads JSON from object', async () => {
    mockMonitoredFetch.mockResolvedValue({
      json: () => Promise.resolve({ page: {}, comments: {} }),
    })

    const createObjectURL = vi.fn().mockReturnValue('blob:ghi')
    const revokeObjectURL = vi.fn()
    globalThis.URL.createObjectURL = createObjectURL
    globalThis.URL.revokeObjectURL = revokeObjectURL

    const clickFn = vi.fn()
    const origCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return { click: clickFn, href: '', download: '' } as unknown as HTMLAnchorElement
      }
      return origCreateElement(tag)
    })

    const wrapper = mount(BuilderArea, {
      props: {
        token: { access_token: 'tok' },
        uid: 'u1',
        monitoredFetch: mockMonitoredFetch as unknown as typeof fetch,
      },
    })

    await flushPromises()

    const mockBuilder = wrapper.findComponent({ name: 'MockBuilder' })
    const config = mockBuilder.props('config') as { onSaveAsTemplate: (json: string | Record<string, unknown>) => void }
    config.onSaveAsTemplate({ y: 2 })

    expect(createObjectURL).toHaveBeenCalled()
    expect(clickFn).toHaveBeenCalled()
  })
})
