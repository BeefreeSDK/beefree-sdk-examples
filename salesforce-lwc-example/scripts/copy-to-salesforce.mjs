#!/usr/bin/env node
/**
 * Script to copy LWC components from src/modules to force-app for Salesforce deployment.
 * 
 * This allows maintaining a single source of truth in src/modules while
 * generating the proper Salesforce structure for deployment.
 * 
 * Usage: node scripts/copy-to-salesforce.mjs
 */

import { copyFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync, readFileSync } from 'fs'
import { join, dirname, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..')

// Read API version from sfdx-project.json
const sfdxProjectPath = join(ROOT_DIR, 'sfdx-project.json')
const sfdxProject = JSON.parse(readFileSync(sfdxProjectPath, 'utf-8'))
const API_VERSION = sfdxProject.sourceApiVersion || '64.0'

const SOURCE_DIR = join(ROOT_DIR, 'src/modules/c')
const TARGET_DIR = join(ROOT_DIR, 'force-app/main/default/lwc')

// Components to copy and their target names (optional rename) with metadata
const COMPONENT_MAP = {
  'app': {
    targetName: 'beefreeApp',
    description: 'Beefree SDK Editor Application',
    isExposed: true,
    targets: ['lightning__AppPage', 'lightning__RecordPage', 'lightning__HomePage']
  },
  'beefreeEditor': {
    targetName: 'beefreeEditor',
    description: 'Beefree SDK Editor Component',
    isExposed: false,
    targets: []
  }
}

/**
 * Generate the -meta.xml content for an LWC component
 */
function generateMetaXml(config) {
  const targets = config.targets.length > 0
    ? `\n    <targets>\n${config.targets.map(t => `        <target>${t}</target>`).join('\n')}\n    </targets>`
    : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>${API_VERSION}</apiVersion>
    <isExposed>${config.isExposed}</isExposed>
    <description>${config.description}</description>${targets}
</LightningComponentBundle>
`
}

function copyComponents() {
  console.log('Copying LWC components to force-app...\n')
  console.log(`API Version: ${API_VERSION}`)
  console.log(`Source: ${SOURCE_DIR}`)
  console.log(`Target: ${TARGET_DIR}\n`)

  // Ensure source exists
  if (!existsSync(SOURCE_DIR)) {
    console.error(`Error: Source directory not found: ${SOURCE_DIR}`)
    process.exit(1)
  }

  // Process each component
  for (const [srcName, config] of Object.entries(COMPONENT_MAP)) {
    const targetName = config.targetName
    const srcPath = join(SOURCE_DIR, srcName)
    const targetPath = join(TARGET_DIR, targetName)

    if (!existsSync(srcPath)) {
      console.warn(`Warning: Component not found: ${srcName}`)
      continue
    }

    // Remove existing target if it exists
    if (existsSync(targetPath)) {
      rmSync(targetPath, { recursive: true, force: true })
    }

    // Create target directory
    mkdirSync(targetPath, { recursive: true })

    // Copy files (excluding __tests__, test files, and images)
    const EXCLUDED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp']
    const files = readdirSync(srcPath)
    for (const file of files) {
      if (file === '__tests__' || file.endsWith('.test.js') || file.endsWith('.spec.js')) {
        continue
      }

      const ext = extname(file).toLowerCase()
      if (EXCLUDED_EXTENSIONS.includes(ext)) {
        continue
      }

      const srcFile = join(srcPath, file)
      const base = basename(file, ext)
      
      // Rename file if component is being renamed and file matches source name
      let targetFileName = file
      if (srcName !== targetName && base === srcName) {
        targetFileName = targetName + ext
      }
      
      const targetFile = join(targetPath, targetFileName)
      copyFileSync(srcFile, targetFile)
    }

    // Generate the -meta.xml file
    const metaXmlPath = join(targetPath, `${targetName}.js-meta.xml`)
    writeFileSync(metaXmlPath, generateMetaXml(config))

    console.log(`✓ Copied: ${srcName} → ${targetName}`)
  }

  console.log('\nDone! Components are ready for Salesforce deployment.')
  console.log('Run "yarn sf:deploy:lwc" to deploy to Salesforce.')
}

copyComponents()
