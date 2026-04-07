/**
 * Downloads content as a file in the browser.
 * Uses data URI approach that works with Salesforce Locker Service.
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/html') {
  // Encode content as base64 for data URI
  const base64Content = btoa(unescape(encodeURIComponent(content)))
  const dataUri = `data:${mimeType};base64,${base64Content}`
  
  // Create a temporary anchor and trigger download
  // Using a self-contained approach that works in Locker Service
  const link = document.createElement('a')
  link.href = dataUri
  link.download = filename
  link.style.display = 'none'
  link.target = '_blank'
  
  // For Salesforce compatibility, we need to handle this differently
  // Try the standard approach first, fall back to opening in new tab
  try {
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch {
    // Fallback: open data URI in new window
    // This will prompt user to save the page
    window.open(dataUri, '_blank')
  }
}