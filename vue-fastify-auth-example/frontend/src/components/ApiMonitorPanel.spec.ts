import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ApiMonitorPanel from './ApiMonitorPanel.vue'
import type { ApiCall } from '../types'

function makeCall(overrides: Partial<ApiCall> = {}): ApiCall {
  return {
    id: '1',
    request: {
      id: '1',
      method: 'GET',
      url: '/test',
      timestamp: new Date('2024-01-01T12:00:00Z'),
      status: 'success',
    },
    response: {
      id: '1',
      status: 200,
      statusText: 'OK',
      timestamp: new Date('2024-01-01T12:00:01Z'),
      data: { result: true },
    },
    duration: 1000,
    ...overrides,
  }
}

describe('ApiMonitorPanel', () => {
  it('shows empty state when no calls', () => {
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [] },
    })
    expect(wrapper.find('.no-calls').exists()).toBe(true)
    expect(wrapper.text()).toContain('No API calls yet')
  })

  it('shows call count badge', () => {
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [makeCall()] },
    })
    expect(wrapper.find('.call-count').text()).toBe('1')
  })

  it('renders call list items', () => {
    const calls = [
      makeCall({ id: '1' }),
      makeCall({ id: '2', request: { ...makeCall().request, id: '2', method: 'POST', url: '/auth' } }),
    ]
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: calls },
    })
    const items = wrapper.findAll('.call-item')
    expect(items).toHaveLength(2)
  })

  it('emits clear when clear button is clicked', async () => {
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [makeCall()] },
    })
    await wrapper.find('.clear-btn').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('disables clear button when no calls', () => {
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [] },
    })
    const btn = wrapper.find('.clear-btn')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('selects a call on click', async () => {
    const call = makeCall()
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')
    expect(wrapper.find('.call-details').exists()).toBe(true)
  })

  it('shows call details with request and response', async () => {
    const call = makeCall()
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')

    expect(wrapper.text()).toContain('/test')
    expect(wrapper.text()).toContain('200')
    expect(wrapper.text()).toContain('1000ms')
  })

  it('closes details when close button clicked', async () => {
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [makeCall()] },
    })
    await wrapper.find('.call-item').trigger('click')
    expect(wrapper.find('.call-details').exists()).toBe(true)

    await wrapper.find('.close-details').trigger('click')
    expect(wrapper.find('.call-details').exists()).toBe(false)
  })

  it('applies selected class to selected call', async () => {
    const call = makeCall()
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')
    expect(wrapper.find('.call-item').classes()).toContain('selected')
  })

  it('shows pending status', () => {
    const call = makeCall({
      request: { ...makeCall().request, status: 'pending' },
      response: undefined,
      duration: undefined,
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    expect(wrapper.find('.status-badge').text()).toBe('pending')
  })

  it('shows error status color for error calls', () => {
    const call = makeCall({
      request: { ...makeCall().request, status: 'error' },
      response: undefined,
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.status-badge')
    expect(badge.attributes('style')).toContain('color: rgb(220, 53, 69)')
  })

  it('shows unknown string status color', () => {
    const call = makeCall({
      request: { ...makeCall().request, status: 'pending' },
      response: undefined,
    })
    // Override status with unknown value to test default branch
    call.request.status = 'something' as 'pending'
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.status-badge')
    expect(badge.attributes('style')).toContain('color: rgb(108, 117, 125)')
  })

  it('shows response status for 3xx codes', () => {
    const call = makeCall({
      response: { ...makeCall().response!, status: 302, statusText: 'Found' },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badges = wrapper.findAll('.status-badge')
    // The status badge on the call list shows 302
    expect(badges[0].text()).toBe('302')
    expect(badges[0].attributes('style')).toContain('color: rgb(255, 193, 7)')
  })

  it('renders undefined response status', () => {
    const call = makeCall({ response: undefined })
    call.request.status = 'pending'
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.status-badge')
    expect(badge.text()).toBe('pending')
  })

  it('shows error response data in details', async () => {
    const call = makeCall({
      response: {
        ...makeCall().response!,
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Something broke',
      },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')
    expect(wrapper.find('.error-display').text()).toBe('Something broke')
  })

  it('shows request body in details', async () => {
    const call = makeCall({
      request: { ...makeCall().request, body: { uid: 'test' } },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')
    expect(wrapper.find('.json-display').text()).toContain('"uid"')
  })

  it('displays method color for PUT', () => {
    const call = makeCall({
      request: { ...makeCall().request, method: 'PUT' },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.method-badge')
    expect(badge.attributes('style')).toContain('background-color: rgb(255, 193, 7)')
  })

  it('displays method color for DELETE', () => {
    const call = makeCall({
      request: { ...makeCall().request, method: 'DELETE' },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.method-badge')
    expect(badge.attributes('style')).toContain('background-color: rgb(220, 53, 69)')
  })

  it('displays method color for PATCH', () => {
    const call = makeCall({
      request: { ...makeCall().request, method: 'PATCH' },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.method-badge')
    expect(badge.attributes('style')).toContain('background-color: rgb(111, 66, 193)')
  })

  it('displays default method color for unknown methods', () => {
    const call = makeCall({
      request: { ...makeCall().request, method: 'OPTIONS' },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.method-badge')
    expect(badge.attributes('style')).toContain('background-color: rgb(108, 117, 125)')
  })

  it('displays method color for POST', () => {
    const call = makeCall({
      request: { ...makeCall().request, method: 'POST' },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.method-badge')
    expect(badge.attributes('style')).toContain('background-color: rgb(40, 167, 69)')
  })

  it('displays method color for GET', () => {
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [makeCall()] },
    })
    const badge = wrapper.find('.method-badge')
    expect(badge.attributes('style')).toContain('background-color: rgb(23, 162, 184)')
  })

  it('does not show duration when absent', () => {
    const call = makeCall({ duration: undefined })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    expect(wrapper.find('.duration').exists()).toBe(false)
  })

  it('handles hint list in empty state', () => {
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [] },
    })
    const hints = wrapper.findAll('.no-calls-hint li')
    expect(hints).toHaveLength(4)
  })

  it('formats null data as null', async () => {
    const call = makeCall({
      request: { ...makeCall().request, body: null },
      response: { ...makeCall().response!, data: null },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')
    // Response data is null, so no data section shown via v-if
    expect(wrapper.find('.call-details').exists()).toBe(true)
  })

  it('formats string data as-is', async () => {
    const call = makeCall({
      request: { ...makeCall().request, body: 'raw-string' },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')
    expect(wrapper.text()).toContain('raw-string')
  })

  it('formats circular reference data with String fallback', async () => {
    const cyclic: { self?: unknown } = {}
    cyclic.self = cyclic
    const call = makeCall({
      request: { ...makeCall().request, body: cyclic },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')
    expect(wrapper.text()).toContain('[object Object]')
  })

  it('formats undefined data as null', async () => {
    const call = makeCall({
      response: { ...makeCall().response!, data: undefined },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')
    expect(wrapper.find('.call-details').exists()).toBe(true)
  })

  it('shows timestamp in call list', () => {
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [makeCall()] },
    })
    expect(wrapper.find('.timestamp').exists()).toBe(true)
    expect(wrapper.find('.timestamp').text()).toBeTruthy()
  })

  it('shows datetime in details view', async () => {
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [makeCall()] },
    })
    await wrapper.find('.call-item').trigger('click')
    // The formatDateTime is used in the details section
    expect(wrapper.text()).toContain('Timestamp')
  })

  it('shows success status color for string success', () => {
    const call = makeCall({
      request: { ...makeCall().request, status: 'success' },
      response: undefined,
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.status-badge')
    expect(badge.attributes('style')).toContain('color: rgb(40, 167, 69)')
  })

  it('shows status color for falsy numeric status (0)', () => {
    const call = makeCall({
      response: { ...makeCall().response!, status: 0, statusText: 'Network Error' },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    const badge = wrapper.find('.status-badge')
    expect(badge.text()).toBe('0')
    expect(badge.attributes('style')).toContain('color: rgb(220, 53, 69)')
  })

  it('formats undefined request body correctly', async () => {
    const call = makeCall({
      request: { ...makeCall().request, body: undefined },
    })
    const wrapper = mount(ApiMonitorPanel, {
      props: { apiCalls: [call] },
    })
    await wrapper.find('.call-item').trigger('click')
    // No body section should be shown since body is undefined
    const detailItems = wrapper.findAll('.detail-item')
    const bodyItem = detailItems.filter(i => i.text().includes('Body:'))
    expect(bodyItem).toHaveLength(0)
  })
})
