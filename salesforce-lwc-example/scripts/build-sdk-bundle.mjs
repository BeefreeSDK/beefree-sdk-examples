/**
 * Build script to download BeePlugin.js for Salesforce Static Resource
 * 
 * This script downloads the BeePlugin.js directly from Beefree CDN
 * to be used as a Static Resource in Salesforce LWC.
 * 
 * Usage: node scripts/build-sdk-bundle.mjs
 */

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

const BEE_PLUGIN_URL = 'https://app-rsrc.getbee.io/plugin/v2/BeePlugin.js'

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }
      let data = ''
      response.on('data', chunk => data += chunk)
      response.on('end', () => resolve(data))
      response.on('error', reject)
    }).on('error', reject)
  })
}

async function buildSdkBundle() {
  console.log('Downloading BeePlugin.js for Salesforce...')

  const outputDir = resolve(rootDir, 'force-app/main/default/staticresources')
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  try {
    // Download BeePlugin.js
    console.log(`Fetching from: ${BEE_PLUGIN_URL}`)
    const beePluginContent = await downloadFile(BEE_PLUGIN_URL)
    
    // Write the file
    const outputFile = resolve(outputDir, 'beefree_sdk.js')
    fs.writeFileSync(outputFile, beePluginContent)
    console.log(`✓ Downloaded BeePlugin.js (${Math.round(beePluginContent.length / 1024)} KB)`)

    // Create the .resource-meta.xml file required by Salesforce
    const metaXml = `<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Public</cacheControl>
    <contentType>application/javascript</contentType>
    <description>Beefree SDK - BeePlugin.js from CDN</description>
</StaticResource>
`
    fs.writeFileSync(resolve(outputDir, 'beefree_sdk.resource-meta.xml'), metaXml)

    console.log('\n✅ Build complete!')
    console.log(`   Output: ${outputDir}/beefree_sdk.js`)
    console.log(`   Meta:   ${outputDir}/beefree_sdk.resource-meta.xml`)
    console.log('\nTo deploy to Salesforce:')
    console.log('   sfdx project deploy start --source-dir force-app/main/default/staticresources')

  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildSdkBundle()
