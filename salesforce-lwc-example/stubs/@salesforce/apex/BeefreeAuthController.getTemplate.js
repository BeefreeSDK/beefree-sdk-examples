/**
 * Stub for @salesforce/apex/BeefreeAuthController.getTemplate
 * 
 * In Salesforce, this calls the Apex controller.
 * In local dev, we call the template API directly.
 */

const TEMPLATE_URL = 'https://rsrc.getbee.io/api/templates/m-bee'

export default async function getTemplate() {
  const response = await fetch(TEMPLATE_URL)

  if (!response.ok) {
    const error = new Error(`Failed to load template (${response.status})`)
    error.body = { message: error.message }
    throw error
  }

  return response.json()
}
