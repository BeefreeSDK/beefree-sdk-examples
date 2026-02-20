/**
 * Build script to create a UMD bundle of Beefree SDK for Salesforce Static Resource
 * 
 * This script creates a self-contained bundle that can be uploaded to Salesforce
 * as a Static Resource and loaded via loadScript.
 * 
 * Usage: node scripts/build-sdk-bundle.mjs
 */

import { build } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

async function buildSdkBundle() {
  console.log('Building Beefree SDK bundle for Salesforce...')

  const outputDir = resolve(rootDir, 'force-app/main/default/staticresources')
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  try {
    await build({
      configFile: false,
      build: {
        lib: {
          entry: resolve(rootDir, 'node_modules/@beefree.io/sdk/dist/index.js'),
          name: 'BeefreeSDK',
          formats: ['iife'],
          fileName: () => 'beefree_sdk.js',
        },
        outDir: outputDir,
        emptyOutDir: false,
        minify: true,
        sourcemap: false,
        rollupOptions: {
          output: {
            extend: true,
            globals: {},
          },
        },
      },
      logLevel: 'info',
    })

    // Create the .resource-meta.xml file required by Salesforce
    const metaXml = `<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Public</cacheControl>
    <contentType>application/javascript</contentType>
    <description>Beefree SDK - Embeddable email/page builder</description>
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
