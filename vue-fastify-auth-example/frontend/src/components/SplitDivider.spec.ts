import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SplitDivider from './SplitDivider.vue'

describe('SplitDivider', () => {
  const baseProps = { splitPosition: 60, isDragging: false }

  it('renders with separator role', () => {
    const wrapper = mount(SplitDivider, { props: baseProps })
    const divider = wrapper.find('[role="separator"]')
    expect(divider.exists()).toBe(true)
    expect(divider.attributes('aria-orientation')).toBe('vertical')
    expect(divider.attributes('aria-valuenow')).toBe('60')
    expect(divider.attributes('aria-valuemin')).toBe('25')
    expect(divider.attributes('aria-valuemax')).toBe('75')
    expect(divider.attributes('tabindex')).toBe('0')
  })

  it('emits mousedown on mouse down', async () => {
    const wrapper = mount(SplitDivider, { props: baseProps })
    await wrapper.find('.split-divider').trigger('mousedown')
    expect(wrapper.emitted('mousedown')).toHaveLength(1)
  })

  it('emits keydown on key down', async () => {
    const wrapper = mount(SplitDivider, { props: baseProps })
    await wrapper.find('.split-divider').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('keydown')).toHaveLength(1)
  })

  it('applies dragging class when isDragging is true', () => {
    const wrapper = mount(SplitDivider, {
      props: { ...baseProps, isDragging: true },
    })
    expect(wrapper.find('.split-divider').classes()).toContain('dragging')
  })

  it('does not apply dragging class when isDragging is false', () => {
    const wrapper = mount(SplitDivider, { props: baseProps })
    expect(wrapper.find('.split-divider').classes()).not.toContain('dragging')
  })

  it('renders the handle element', () => {
    const wrapper = mount(SplitDivider, { props: baseProps })
    expect(wrapper.find('.split-divider-handle').exists()).toBe(true)
  })
})
