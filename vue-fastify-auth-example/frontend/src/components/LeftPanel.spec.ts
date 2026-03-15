import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LeftPanel from './LeftPanel.vue'

describe('LeftPanel', () => {
  const monitoredFetch = vi.fn() as unknown as typeof fetch

  it('shows UnauthInfo when not authenticated', () => {
    const wrapper = mount(LeftPanel, {
      props: {
        isAuthenticated: false,
        token: null,
        uid: '',
        monitoredFetch,
      },
    })
    expect(wrapper.text()).toContain('How Authentication Works')
    expect(wrapper.find('.builder-area').exists()).toBe(false)
  })

  it('shows BuilderArea when authenticated', () => {
    const wrapper = mount(LeftPanel, {
      props: {
        isAuthenticated: true,
        token: { access_token: 'tok' },
        uid: 'u1',
        monitoredFetch,
      },
    })
    expect(wrapper.find('.builder-area').exists()).toBe(true)
  })
})
