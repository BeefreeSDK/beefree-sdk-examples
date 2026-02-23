import { describe, expect, it } from 'vitest'
import {
  decodeTokenPayload,
  getLanguageLimitForPlan,
  getPlanFromToken,
  isPlanEqualOrAbove,
  parsePlanFromRaw,
  type Plan,
} from './plan'

/** Build a minimal JWT whose payload carries the given JSON object. */
function makeJwt(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const enc = (obj: Record<string, unknown>) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  return `${enc(header)}.${enc(payload as Record<string, unknown>)}.sig`
}

describe('parsePlanFromRaw', () => {
  it.each([
    // Canonical names (various casings)
    ['Free', 'Free'],
    ['free', 'Free'],
    ['FREE', 'Free'],
    ['Essentials', 'Essentials'],
    ['essentials', 'Essentials'],
    ['Core', 'Core'],
    ['core', 'Core'],
    ['Superpowers', 'Superpowers'],
    ['superpowers', 'Superpowers'],
    ['Enterprise', 'Enterprise'],
    ['enterprise', 'Enterprise'],
  ] as [string, Plan][])('maps canonical "%s" → %s', (raw, expected) => {
    expect(parsePlanFromRaw(raw)).toBe(expected)
  })

  it.each([
    // Legacy beeplugin_* prefixed names
    ['beeplugin_free', 'Free'],
    ['beeplugin_startup', 'Essentials'],
    ['beeplugin_startup_annual', 'Essentials'],
    ['beeplugin_silver', 'Essentials'],
    ['beeplugin_silver_annual', 'Essentials'],
    ['beeplugin_core', 'Core'],
    ['beeplugin_gold', 'Superpowers'],
    ['beeplugin_gold_annual', 'Superpowers'],
    ['beeplugin_enterprise', 'Enterprise'],
    ['beeplugin_enterprise_annual', 'Enterprise'],
  ] as [string, Plan][])('maps legacy "%s" → %s', (raw, expected) => {
    expect(parsePlanFromRaw(raw)).toBe(expected)
  })

  it.each([
    // Legacy short names
    ['startup', 'Essentials'],
    ['silver', 'Essentials'],
    ['gold', 'Superpowers'],
    ['Gold', 'Superpowers'],
  ] as [string, Plan][])('maps legacy short name "%s" → %s', (raw, expected) => {
    expect(parsePlanFromRaw(raw)).toBe(expected)
  })

  it('returns Unknown for undefined', () => {
    expect(parsePlanFromRaw(undefined)).toBe('Unknown')
  })

  it('returns Unknown for null', () => {
    expect(parsePlanFromRaw(null)).toBe('Unknown')
  })

  it('returns Unknown for empty string', () => {
    expect(parsePlanFromRaw('')).toBe('Unknown')
  })

  it('returns Unknown for unrecognised plan name', () => {
    expect(parsePlanFromRaw('platinum')).toBe('Unknown')
    expect(parsePlanFromRaw('beeplugin_platinum')).toBe('Unknown')
  })

  it('trims whitespace before matching', () => {
    expect(parsePlanFromRaw('  Superpowers  ')).toBe('Superpowers')
  })
})

describe('isPlanEqualOrAbove', () => {
  it('returns true when plan equals minimumPlan', () => {
    expect(isPlanEqualOrAbove('Free', 'Free')).toBe(true)
    expect(isPlanEqualOrAbove('Superpowers', 'Superpowers')).toBe(true)
    expect(isPlanEqualOrAbove('Enterprise', 'Enterprise')).toBe(true)
  })

  it('returns true when plan is above minimumPlan', () => {
    expect(isPlanEqualOrAbove('Enterprise', 'Superpowers')).toBe(true)
    expect(isPlanEqualOrAbove('Superpowers', 'Free')).toBe(true)
    expect(isPlanEqualOrAbove('Core', 'Essentials')).toBe(true)
    expect(isPlanEqualOrAbove('Enterprise', 'Free')).toBe(true)
  })

  it('returns false when plan is below minimumPlan', () => {
    expect(isPlanEqualOrAbove('Free', 'Superpowers')).toBe(false)
    expect(isPlanEqualOrAbove('Essentials', 'Enterprise')).toBe(false)
    expect(isPlanEqualOrAbove('Core', 'Superpowers')).toBe(false)
  })

  it('returns false when plan is Unknown', () => {
    expect(isPlanEqualOrAbove('Unknown', 'Free')).toBe(false)
    expect(isPlanEqualOrAbove('Unknown', 'Superpowers')).toBe(false)
  })

  it('returns false when minimumPlan is Unknown', () => {
    expect(isPlanEqualOrAbove('Enterprise', 'Unknown')).toBe(false)
  })

  it('returns false when both are Unknown', () => {
    expect(isPlanEqualOrAbove('Unknown', 'Unknown')).toBe(false)
  })

  it('validates the full ordering: Free < Essentials < Core < Superpowers < Enterprise', () => {
    const plans: Plan[] = ['Free', 'Essentials', 'Core', 'Superpowers', 'Enterprise']
    for (let i = 0; i < plans.length; i++) {
      for (let j = 0; j < plans.length; j++) {
        expect(isPlanEqualOrAbove(plans[i], plans[j])).toBe(i >= j)
      }
    }
  })
})

describe('decodeTokenPayload', () => {
  it('returns decoded payload from a valid JWT', () => {
    const payload = { plan: 'Superpowers', uid: 'test-user' }
    const jwt = makeJwt(payload)
    expect(decodeTokenPayload(jwt)).toEqual(payload)
  })

  it('returns null for undefined', () => {
    expect(decodeTokenPayload(undefined)).toBeNull()
  })

  it('returns null for null', () => {
    expect(decodeTokenPayload(null)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(decodeTokenPayload('')).toBeNull()
  })

  it('returns null for malformed JWT (no dots)', () => {
    expect(decodeTokenPayload('not-a-jwt')).toBeNull()
  })

  it('returns null for JWT with invalid base64 payload', () => {
    expect(decodeTokenPayload('header.!!!invalid!!!.sig')).toBeNull()
  })

  it('returns null when payload is not a JSON object', () => {
    const b64 = btoa('"just a string"')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    expect(decodeTokenPayload(`header.${b64}.sig`)).toBeNull()
  })
})

describe('getPlanFromToken', () => {
  it('returns canonical plan from JWT payload', () => {
    expect(getPlanFromToken(makeJwt({ plan: 'beeplugin_gold' }))).toBe('Superpowers')
    expect(getPlanFromToken(makeJwt({ plan: 'enterprise' }))).toBe('Enterprise')
    expect(getPlanFromToken(makeJwt({ plan: 'Free' }))).toBe('Free')
  })

  it('returns Unknown when token has no plan field', () => {
    expect(getPlanFromToken(makeJwt({ uid: 'test' }))).toBe('Unknown')
  })

  it('returns Unknown for null/undefined token', () => {
    expect(getPlanFromToken(null)).toBe('Unknown')
    expect(getPlanFromToken(undefined)).toBe('Unknown')
  })

  it('returns Unknown for malformed token', () => {
    expect(getPlanFromToken('not.valid')).toBe('Unknown')
  })
})

describe('getLanguageLimitForPlan', () => {
  it('returns 21 for Enterprise', () => {
    expect(getLanguageLimitForPlan('Enterprise')).toBe(21)
  })

  it('returns 7 for Superpowers', () => {
    expect(getLanguageLimitForPlan('Superpowers')).toBe(7)
  })

  it('returns 7 for other plans', () => {
    expect(getLanguageLimitForPlan('Free')).toBe(7)
    expect(getLanguageLimitForPlan('Essentials')).toBe(7)
    expect(getLanguageLimitForPlan('Core')).toBe(7)
    expect(getLanguageLimitForPlan('Unknown')).toBe(7)
  })
})
