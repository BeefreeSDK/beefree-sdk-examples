import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UnauthInfo from './UnauthInfo.vue'

describe('UnauthInfo', () => {
  it('renders all 4 steps', () => {
    const wrapper = mount(UnauthInfo)
    const steps = wrapper.findAll('.step')
    expect(steps).toHaveLength(4)
  })

  it('renders security note', () => {
    const wrapper = mount(UnauthInfo)
    expect(wrapper.find('.security-note').exists()).toBe(true)
    expect(wrapper.text()).toContain('Security')
  })

  it('mentions POST /auth/token', () => {
    const wrapper = mount(UnauthInfo)
    expect(wrapper.text()).toContain('POST /auth/token')
  })

  it('mentions Fastify backend', () => {
    const wrapper = mount(UnauthInfo)
    expect(wrapper.text()).toContain('Fastify')
  })
})
