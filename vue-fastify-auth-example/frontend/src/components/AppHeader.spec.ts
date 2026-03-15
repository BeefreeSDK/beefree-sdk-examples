import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from './AppHeader.vue'

describe('AppHeader', () => {
  it('renders Beefree logo', () => {
    const wrapper = mount(AppHeader)
    const logo = wrapper.find('.left-side img')
    expect(logo.attributes('alt')).toBe('Beefree SDK')
    expect(logo.attributes('src')).toBe('/images/logo.svg')
  })

  it('renders Fastify and Vue logos', () => {
    const wrapper = mount(AppHeader)
    const imgs = wrapper.findAll('.right-side img')
    expect(imgs).toHaveLength(2)
    const alts = imgs.map((img) => img.attributes('alt'))
    expect(alts).toContain('Fastify')
    expect(alts).toContain('Vue.js')
  })
})
