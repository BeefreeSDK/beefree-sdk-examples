import '@testing-library/jest-dom/vitest'
import { beforeEach, vi } from 'vitest'

/**
 * Silence expected console.error / console.warn output during tests.
 * Components legitimately log errors (auth failures, fetch errors, etc.)
 * which produce noisy stderr that looks like test failures.
 *
 * Set to `false` when you need to debug a failing test and want to see
 * the full console output.
 */
const SILENCE_EXPECTED_CONSOLE_OUTPUT = true

if (SILENCE_EXPECTED_CONSOLE_OUTPUT) {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
}

// jsdom does not implement URL.createObjectURL / revokeObjectURL.
// Polyfill them once so vi.spyOn can target them in individual tests.
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = vi.fn().mockReturnValue('blob:mock')
}
if (typeof URL.revokeObjectURL !== 'function') {
  URL.revokeObjectURL = vi.fn()
}
