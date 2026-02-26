/**
 * Stub for @salesforce/apex/BeefreeAuthController.getTemplate
 * 
 * In Salesforce, this calls the Apex controller.
 * In local dev, we call the template API directly.
 */

const TEMPLATE_BASE_URL = 'https://rsrc.getbee.io/api/templates'
const DEFAULT_TEMPLATE_ID = 'm-bee'

export default async function getTemplate({ templateId } = {}) {
  const safeTemplateId = templateId || DEFAULT_TEMPLATE_ID
  const response = await fetch(`${TEMPLATE_BASE_URL}/${encodeURIComponent(safeTemplateId)}`)

  if (!response.ok) {
    const error = new Error(`Failed to load template (${response.status})`)
    error.body = { message: error.message }
    throw error
  }

  return response.json()
}
