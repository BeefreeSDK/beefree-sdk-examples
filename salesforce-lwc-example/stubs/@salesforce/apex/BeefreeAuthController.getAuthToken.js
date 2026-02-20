/**
 * Stub for @salesforce/apex/BeefreeAuthController.getAuthToken
 * 
 * In Salesforce, this calls the Apex controller.
 * In local dev, we call the Express backend instead.
 */

const AUTH_URL = '/auth/token'
const DEFAULT_UID = 'salesforce-lwc-example'

export default async function getAuthToken({ uid }) {
  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: uid || DEFAULT_UID }),
  })

  if (!response.ok) {
    const error = new Error(`Authentication failed (${response.status})`)
    error.body = { message: error.message }
    throw error
  }

  return response.json()
}
