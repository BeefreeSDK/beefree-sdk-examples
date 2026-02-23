/**
 * MLT-specific helpers that build on the reusable plan utilities.
 *
 * After authentication the component decodes the JWT access token
 * (via `getPlanFromToken` in `./plan`), then calls `getMltWarningReason`
 * to decide whether to show a warning banner.
 */

import { type Plan, isPlanEqualOrAbove } from './plan'

/**
 * Minimum plan required for Multi-language Template (MLT) features.
 * Visit https://developers.beefree.io/pricing-plans for more details.
 */
export const MLT_MINIMUM_PLAN: Plan = 'Superpowers'

/**
 * Why the MLT warning banner is shown:
 * - `'plan'`    — the detected plan is below the minimum required for MLT.
 * - `'unknown'` — the plan could not be determined (token decode failure,
 *                  missing `plan` field, or unrecognised plan name).
 *                  This should not normally happen; it indicates an
 *                  unexpected token structure and the developer should
 *                  inspect the token payload.
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
