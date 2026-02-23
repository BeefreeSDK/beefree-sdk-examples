import { describe, expect, it } from 'vitest'
import { getMltWarningReason, MLT_MINIMUM_PLAN, type MltWarningReason } from './tokenPayload'
import type { Plan } from './plan'

describe('tokenPayload', () => {
  describe('MLT_MINIMUM_PLAN', () => {
    it('is Superpowers', () => {
      expect(MLT_MINIMUM_PLAN).toBe('Superpowers')
    })
  })

  describe('getMltWarningReason', () => {
    it('returns null for Superpowers (minimum eligible plan)', () => {
      expect(getMltWarningReason('Superpowers')).toBeNull()
    })

    it('returns null for Enterprise (above minimum)', () => {
      expect(getMltWarningReason('Enterprise')).toBeNull()
    })

    it('returns "plan" for Free', () => {
      expect(getMltWarningReason('Free')).toBe('plan')
    })

    it('returns "plan" for Essentials', () => {
      expect(getMltWarningReason('Essentials')).toBe('plan')
    })

    it('returns "plan" for Core', () => {
      expect(getMltWarningReason('Core')).toBe('plan')
    })

    it('returns "unknown" for Unknown', () => {
      expect(getMltWarningReason('Unknown')).toBe('unknown')
    })

    it.each([
      ['Superpowers', null],
      ['Enterprise', null],
      ['Free', 'plan'],
      ['Essentials', 'plan'],
      ['Core', 'plan'],
      ['Unknown', 'unknown'],
    ] as [Plan, MltWarningReason | null][])('getMltWarningReason(%s) → %s', (plan, expected) => {
      expect(getMltWarningReason(plan)).toBe(expected)
    })
  })
})
