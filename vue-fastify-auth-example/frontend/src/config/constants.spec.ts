import { describe, it, expect } from 'vitest'
import { AUTH_API_URL, TEMPLATE_SAMPLE_URL, TEMPLATE_BLANK_URL } from './constants'

describe('constants', () => {
  it('defines AUTH_API_URL with fallback', () => {
    expect(AUTH_API_URL).toBe('/auth/token')
  })

  it('defines TEMPLATE_SAMPLE_URL', () => {
    expect(TEMPLATE_SAMPLE_URL).toBe('/template/sample')
  })

  it('defines TEMPLATE_BLANK_URL', () => {
    expect(TEMPLATE_BLANK_URL).toBe('/template/blank')
  })
})
