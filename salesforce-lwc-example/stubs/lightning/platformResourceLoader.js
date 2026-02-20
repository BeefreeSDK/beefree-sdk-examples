/**
 * Stub for lightning/platformResourceLoader
 * 
 * In local development, this loads the SDK from node_modules.
 * In Salesforce, the real loadScript loads from Static Resources.
 */

// Track loaded scripts to avoid duplicate loading
const loadedScripts = new Set()

/**
 * Mock loadScript that loads the Beefree SDK from node_modules
 * @param {Object} component - The LWC component instance
 * @param {string} resourceUrl - The resource URL (ignored in local dev)
 */
export async function loadScript(component, resourceUrl) {
  // In local dev, we load from node_modules instead of static resource
  if (loadedScripts.has('beefree_sdk')) {
    return Promise.resolve()
  }

  try {
    // Dynamically import the SDK and attach to window
    const sdk = await import('@beefree.io/sdk')
    window.BeefreeSDK = sdk.default || sdk
    loadedScripts.add('beefree_sdk')
    return Promise.resolve()
  } catch (error) {
    console.error('[stub:loadScript] Failed to load SDK:', error)
    return Promise.reject(error)
  }
}

/**
 * Mock loadStyle (not used in this example but common in LWC)
 */
export async function loadStyle(component, resourceUrl) {
  // No-op for local development
  return Promise.resolve()
}
