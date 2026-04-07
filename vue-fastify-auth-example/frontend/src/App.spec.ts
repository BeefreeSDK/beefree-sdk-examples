import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from './App.vue'

const mockAuthenticate = vi.fn()
const mockLogout = vi.fn()
const mockClearHistory = vi.fn()
const mockMonitoredFetch = vi.fn()

vi.mock('./composables/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: { value: false },
    isAuthenticating: { value: false },
    uid: { value: '' },
    token: { value: null },
    error: { value: '' },
    authenticate: mockAuthenticate,
    logout: mockLogout,
  }),
}))

vi.mock('./composables/useApiMonitor', () => ({
  useApiMonitor: () => ({
    apiCalls: { value: [] },
    monitoredFetch: mockMonitoredFetch,
    clearHistory: mockClearHistory,
  }),
}))

describe('App', () => {
  it('renders the main layout', () => {
    const wrapper = mount(App)
    expect(wrapper.find('.app').exists()).toBe(true)
  })

  it('renders header', () => {
    const wrapper = mount(App)
    expect(wrapper.find('header').exists()).toBe(true)
  })

  it('renders auth section', () => {
    const wrapper = mount(App)
    expect(wrapper.find('.auth-strip').exists()).toBe(true)
  })

  it('renders split layout', () => {
    const wrapper = mount(App)
    expect(wrapper.find('.split-container').exists()).toBe(true)
  })

  it('calls authenticate with uid and monitoredFetch', async () => {
    const wrapper = mount(App)
    const authSection = wrapper.findComponent({ name: 'AuthSection' })

    authSection.vm.$emit('authenticate', 'test-user')
    await flushPromises()

    expect(mockAuthenticate).toHaveBeenCalledWith('test-user', mockMonitoredFetch)
  })

  it('calls logout on endSession', async () => {
    const wrapper = mount(App)
    const authSection = wrapper.findComponent({ name: 'AuthSection' })

    authSection.vm.$emit('endSession')
    await flushPromises()

    expect(mockLogout).toHaveBeenCalled()
  })

  it('calls clearHistory on clear event', async () => {
    const wrapper = mount(App)
    const monitorPanel = wrapper.findComponent({ name: 'ApiMonitorPanel' })

    monitorPanel.vm.$emit('clear')
    await flushPromises()

    expect(mockClearHistory).toHaveBeenCalled()
  })
})
