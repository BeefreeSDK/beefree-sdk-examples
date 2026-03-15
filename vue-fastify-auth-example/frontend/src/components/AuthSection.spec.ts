import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthSection from './AuthSection.vue'

const baseProps = {
  isAuthenticating: false,
  isAuthenticated: false,
  uid: '',
  error: '',
}

describe('AuthSection', () => {
  it('shows input and Authenticate button when not authenticated', () => {
    const wrapper = mount(AuthSection, { props: baseProps })
    expect(wrapper.find('#uid-input').exists()).toBe(true)
    expect(wrapper.find('button').text()).toContain('Authenticate')
  })

  it('emits authenticate with trimmed uid', async () => {
    const wrapper = mount(AuthSection, { props: baseProps })
    const input = wrapper.find('#uid-input')
    await input.setValue('  user-1  ')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('authenticate')).toEqual([['user-1']])
  })

  it('does not emit authenticate when uid is blank', async () => {
    const wrapper = mount(AuthSection, { props: baseProps })
    const input = wrapper.find('#uid-input')
    await input.setValue('   ')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('authenticate')).toBeUndefined()
  })

  it('emits authenticate on Enter key', async () => {
    const wrapper = mount(AuthSection, { props: baseProps })
    const input = wrapper.find('#uid-input')
    await input.setValue('enter-user')
    await input.trigger('keyup.enter')

    expect(wrapper.emitted('authenticate')).toEqual([['enter-user']])
  })

  it('shows authenticated state with uid and end session button', () => {
    const wrapper = mount(AuthSection, {
      props: { ...baseProps, isAuthenticated: true, uid: 'user-42' },
    })
    expect(wrapper.text()).toContain('user-42')
    expect(wrapper.find('.end-session-btn').exists()).toBe(true)
    expect(wrapper.find('#uid-input').exists()).toBe(false)
  })

  it('emits endSession when button is clicked', async () => {
    const wrapper = mount(AuthSection, {
      props: { ...baseProps, isAuthenticated: true, uid: 'user-42' },
    })
    await wrapper.find('.end-session-btn').trigger('click')

    expect(wrapper.emitted('endSession')).toHaveLength(1)
  })

  it('shows spinner during authentication', () => {
    const wrapper = mount(AuthSection, {
      props: { ...baseProps, isAuthenticating: true },
    })
    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Authenticating...')
  })

  it('disables button during authentication', () => {
    const wrapper = mount(AuthSection, {
      props: { ...baseProps, isAuthenticating: true },
    })
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('shows error text', () => {
    const wrapper = mount(AuthSection, {
      props: { ...baseProps, error: 'Auth failed' },
    })
    expect(wrapper.find('.error-text').text()).toBe('Auth failed')
  })

  it('shows secure authentication label', () => {
    const wrapper = mount(AuthSection, { props: baseProps })
    expect(wrapper.text()).toContain('Secure Authentication')
  })

  it('has default uid value', () => {
    const wrapper = mount(AuthSection, { props: baseProps })
    const input = wrapper.find('#uid-input')
    expect((input.element as HTMLInputElement).value).toBe('vue-fastify-demo')
  })
})
