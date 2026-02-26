/**
 * Stub for lightning/platformResourceLoader
 * 
 * In local development, BeePlugin.js is loaded from CDN via index.html.
 * In Salesforce, the real loadScript loads from Static Resources.
 * 
 * This stub is essentially a no-op since BeePlugin is already available.
 */

// Track loaded scripts to avoid duplicate loading
const loadedScripts = new Set()

/**
 * Mock loadScript - in local dev, BeePlugin is already loaded from CDN
 * @param {Object} component - The LWC component instance
 * @param {string} resourceUrl - The resource URL (ignored in local dev)
 */
export async function loadScript(component, resourceUrl) {
  // BeePlugin is loaded from CDN in index.html, so this is a no-op
  if (window.BeePlugin) {
    loadedScripts.add('beefree_sdk')
    return Promise.resolve()
  }

  // Fallback error if BeePlugin wasn't loaded
  console.error('[stub:loadScript] BeePlugin not found - ensure index.html loads BeePlugin.js')
  return Promise.reject(new Error('BeePlugin not loaded'))
}

/**
 * Mock loadStyle (not used in this example but common in LWC)
 */
export async function loadStyle(component, resourceUrl) {
  // No-op for local development
  return Promise.resolve()
}
