/**
 * Reusable plan utilities for Beefree SDK examples.
 *
 * Centralises plan parsing, ordering, and comparison so every example
 * can check minimum-plan requirements the same way.
 *
 * Plan hierarchy (lowest → highest):
 *   Free < Essentials < Core < Superpowers < Enterprise
 *
 * Legacy / internal plan names (e.g. `beeplugin_gold`, `gold`, `startup`,
 * `silver`) are mapped to their canonical equivalents.
 * Unrecognised values fall back to `'Unknown'`.
 */

/** Canonical Beefree plan names, ordered from lowest to highest. */
export type Plan = 'Free' | 'Essentials' | 'Core' | 'Superpowers' | 'Enterprise' | 'Unknown'

/**
 * Ordered list of canonical plans from lowest to highest.
 * `Unknown` is intentionally excluded — it is never "above" any real plan.
 */
const PLAN_ORDER: readonly Plan[] = ['Free', 'Essentials', 'Core', 'Superpowers', 'Enterprise']

/**
 * Maps every known raw plan string (lowercased) to its canonical Plan.
 *
 * Sources for legacy names:
 * - Beefree auth tokens may use `beeplugin_*` prefixed names.
 * - The authinfo endpoint historically returned PascalCase names
 *   such as `Gold` (now `Superpowers`) or `Startup` (now `Essentials`).
 */
const RAW_PLAN_MAP: Record<string, Plan> = {
  // Canonical (case-insensitive match via lowercasing)
  free: 'Free',
  essentials: 'Essentials',
  core: 'Core',
  superpowers: 'Superpowers',
  enterprise: 'Enterprise',

  // Legacy / internal — Free
  beeplugin_free: 'Free',

  // Legacy / internal — Essentials (formerly "Startup" / "Silver")
  startup: 'Essentials',
  silver: 'Essentials',
  beeplugin_startup: 'Essentials',
  beeplugin_silver: 'Essentials',
  beeplugin_startup_annual: 'Essentials',
  beeplugin_silver_annual: 'Essentials',

  // Legacy / internal — Core
  beeplugin_core: 'Core',

  // Legacy / internal — Superpowers (formerly "Gold")
  gold: 'Superpowers',
  beeplugin_gold: 'Superpowers',
  beeplugin_gold_annual: 'Superpowers',

  // Legacy / internal — Enterprise
  beeplugin_enterprise: 'Enterprise',
  beeplugin_enterprise_annual: 'Enterprise',
}

/**
 * Parse a raw plan string (from JWT payload or authinfo) into a canonical Plan.
 *
 * The lookup is case-insensitive.  Unrecognised or missing values
 * return `'Unknown'`.
 */
export function parsePlanFromRaw(raw: string | undefined | null): Plan {
  if (!raw) return 'Unknown'
  const key = raw.trim().toLowerCase()
  return RAW_PLAN_MAP[key] ?? 'Unknown'
}

/**
 * Returns `true` when `plan` is at or above `minimumPlan` in the
 * Beefree plan hierarchy.
 *
 * `'Unknown'` is never considered equal to or above any plan
 * (including `'Unknown'` itself), ensuring that unparseable tokens
 * are conservatively treated as ineligible.
 */
export function isPlanEqualOrAbove(plan: Plan, minimumPlan: Plan): boolean {
  const planIdx = PLAN_ORDER.indexOf(plan)
  const minIdx = PLAN_ORDER.indexOf(minimumPlan)
  if (planIdx === -1 || minIdx === -1) return false
  return planIdx >= minIdx
}

/**
 * Decodes the payload section of a Beefree JWT access token.
 *
 * Returns `null` when the token is missing, malformed, or cannot be
 * parsed — callers should treat that as `Unknown` plan.
 */
export function decodeTokenPayload(accessToken: string | undefined | null): Record<string, unknown> | null {
  if (!accessToken) return null
  try {
    const parts = accessToken.split('.')
    if (parts.length < 2 || !parts[1]) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    const payload = JSON.parse(json)
    return payload && typeof payload === 'object' ? payload : null
  } catch {
    return null
  }
}

/**
 * Extracts the canonical Plan from a Beefree JWT access token.
 *
 * Decodes the token payload, reads the `plan` field, and maps it
 * through `parsePlanFromRaw`.  Returns `'Unknown'` for any failure.
 */
export function getPlanFromToken(accessToken: string | undefined | null): Plan {
  const payload = decodeTokenPayload(accessToken)
  if (!payload) return 'Unknown'
  const raw = typeof payload.plan === 'string' ? payload.plan : undefined
  return parsePlanFromRaw(raw)
}

/** Maximum number of template languages allowed per plan. */
export function getLanguageLimitForPlan(plan: Plan): number {
  if (plan === 'Enterprise') return 21
  // Superpowers and all other recognised plans default to 7.
  return 7
}

/**
 * Minimum plan required for Multi-language Template (MLT) features.
 * Visit https://developers.beefree.io/pricing-plans for more details.
 */
export const MLT_MINIMUM_PLAN: Plan = 'Superpowers'

/**
 * Why the MLT warning banner is shown:
 * - `'plan'`    — the detected plan is below the minimum required for MLT.
 * - `'unknown'` — the plan could not be determined.
 */
export type MltWarningReason = 'plan' | 'unknown'

/**
 * Determines whether an MLT warning should be shown.
 *
 * Returns `null` when the plan is eligible (Superpowers or above) and
 * a `MltWarningReason` string otherwise.
 */
export function getMltWarningReason(plan: Plan): MltWarningReason | null {
  if (plan === 'Unknown') return 'unknown'
  if (!isPlanEqualOrAbove(plan, MLT_MINIMUM_PLAN)) return 'plan'
  return null
}
