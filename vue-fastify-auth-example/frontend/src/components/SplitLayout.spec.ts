import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SplitLayout from './SplitLayout.vue'

describe('SplitLayout', () => {
  it('renders left and right slots', () => {
    const wrapper = mount(SplitLayout, {
      slots: {
        left: '<div class="test-left">Left</div>',
        right: '<div class="test-right">Right</div>',
      },
    })
    expect(wrapper.find('.test-left').exists()).toBe(true)
    expect(wrapper.find('.test-right').exists()).toBe(true)
  })

  it('renders split container', () => {
    const wrapper = mount(SplitLayout)
    expect(wrapper.find('.split-container').exists()).toBe(true)
  })

  it('renders the split divider', () => {
    const wrapper = mount(SplitLayout)
    expect(wrapper.find('.split-divider').exists()).toBe(true)
  })

  it('has default 60% left width', () => {
    const wrapper = mount(SplitLayout)
    const leftPanel = wrapper.find('.left-panel')
    expect(leftPanel.attributes('style')).toContain('width: 60%')
  })

  it('has right panel width complementary to left', () => {
    const wrapper = mount(SplitLayout)
    const rightPanel = wrapper.find('.right-panel')
    expect(rightPanel.attributes('style')).toContain('width: 40%')
  })
})
