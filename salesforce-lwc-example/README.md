# ⚡ Salesforce LWC Example - Lightning Web Components

This example demonstrates how to integrate the **Beefree SDK** into **Salesforce Lightning Web Components (LWC)**. It includes:

- **Local Development Sandbox**: Run and test LWC components locally without a Salesforce org
- **Salesforce-Ready Components**: Deploy directly to your Salesforce org

## ✨ Key Features

### ⚡ **Lightning Web Components**
- **Standard LWC Architecture**: `c/app` and `c/beefreeEditor` following Salesforce naming conventions
- **Shadow DOM**: Components render inside Shadow DOM, matching Salesforce's encapsulation model
- **Reactive Properties**: `@api` public properties with automatic re-rendering
- **Lifecycle Hooks**: `connectedCallback`, `renderedCallback`, `disconnectedCallback`

### 🏗️ **Dual-Mode Development**
- **Local Mode**: Run locally with Vite + Express (no Salesforce required)
- **Salesforce Mode**: Deploy to Salesforce with `loadScript` and Apex controllers
- **SDK Loading**: Uses `BeePlugin.js` directly from CDN (local) or Static Resource (Salesforce)

### 🔐 **Secure Authentication**
- **Backend-Only Credentials**: Client ID/Secret never exposed to the browser
- **Local**: Express server proxies authentication to Beefree API
- **Salesforce**: Apex controller with Custom Metadata for secure credential storage

## 🏗️ Architecture Overview

### **Project Structure**
```
salesforce-lwc-example/
├── src/                               # Source of truth for LWC components
│   ├── modules/
│   │   └── c/                         # "c" namespace (Salesforce custom components)
│   │       ├── app/                   # Root application component
│   │       │   ├── app.js             # Uses @salesforce/apex imports
│   │       │   ├── app.html
│   │       │   ├── app.css
│   │       │   └── __tests__/         # Jest unit tests
│   │       └── beefreeEditor/         # Beefree SDK wrapper component
│   │           ├── beefreeEditor.js   # Uses loadScript + static resource
│   │           ├── beefreeEditor.html
│   │           ├── beefreeEditor.css
│   │           └── __tests__/         # Jest unit tests
│   └── main.js                        # Entry point — creates <c-app>
├── stubs/                             # Stubs for Salesforce imports (local dev)
│   ├── lightning/
│   │   └── platformResourceLoader.js  # No-op (BeePlugin loaded via CDN)
│   └── @salesforce/
│       ├── apex/                      # Stubs Apex calls → Express endpoints
│       └── resourceUrl/               # Returns placeholder URL
├── force-app/                         # Generated for Salesforce deployment
│   └── main/default/
│       ├── lwc/                       # Generated from src/ via yarn build:salesforce
│       │   ├── beefreeApp/            # Renamed from "app" for Salesforce
│       │   └── beefreeEditor/
│       ├── classes/                   # Apex controllers
│       │   └── BeefreeAuthController.cls
│       ├── staticresources/           # Beefree SDK bundle
│       │   └── beefree_sdk.js
│       └── objects/                   # Custom Metadata Type
│           └── Beefree_Settings__mdt/
├── __mocks__/                         # Jest mocks
│   ├── lightning/platformResourceLoader.js
│   └── @salesforce/apex/
├── scripts/
│   ├── build-sdk-bundle.mjs           # Downloads BeePlugin.js from CDN for Static Resource
│   └── copy-to-salesforce.mjs         # Copies src/ → force-app/
├── public/
│   └── styles/
│       └── style.css                  # Global page styles
├── index.html                         # HTML shell (local dev)
├── server.ts                          # Express auth server (local dev)
├── vite.config.ts                     # Vite build configuration + stubs
├── jest.config.cjs                    # Jest test configuration
├── lwc.config.json                    # LWC module resolution
└── package.json                       # Dependencies and scripts
```

### **Component Hierarchy**
```
index.html (local) / Lightning Page (Salesforce)
  └── <c-app> / <c-beefree-app>        # Handles auth + template fetching
        └── <c-beefree-editor>         # Wraps BeefreeSDK instance
              └── .beefree-container   # SDK renders here (inside Shadow DOM)
```

### **Data Flow**

**Local Development:**
```
index.html loads BeePlugin.js from CDN (app-rsrc.getbee.io)
                                           ↓
Browser → Stub → Express /auth/token → Beefree API (auth.getbee.io)
                                           ↓
                                     JWT token returned
                                           ↓
<c-app> receives token + template → passes via @api to <c-beefree-editor>
                                           ↓
                          BeePlugin.create(token, config, callback)
```

**Salesforce:**
```
LWC → loadScript(beefree_sdk) → BeePlugin available on window
                                           ↓
LWC → Apex Controller → Beefree API (auth.getbee.io)
                            ↓
                      JWT token returned
                            ↓
<c-beefree-app> → passes via @api to <c-beefree-editor>
                            ↓
                          BeePlugin.create(token, config, callback)
```

## 🔄 Development Workflow

### Single Source of Truth

Components in `src/modules/c/` are the **source of truth**. They use Salesforce-style imports (`@salesforce/apex/*`, `lightning/platformResourceLoader`) which are:

1. **Locally**: Resolved to stubs in `stubs/` via Vite aliases
2. **Salesforce**: Resolved by the Salesforce runtime to real modules

### Local → Salesforce

When ready to deploy, run:
```bash
yarn build:salesforce
```

This copies components from `src/modules/c/` to `force-app/main/default/lwc/`, renaming `app` to `beefreeApp` and generating the required `-meta.xml` files.

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** ≥ 18
- **Yarn** package manager
- **Beefree SDK credentials** from [developers.beefree.io](https://developers.beefree.io)

### Setup

1. **Install dependencies**
   ```bash
   cd salesforce-lwc-example
   yarn install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Beefree credentials:
   ```
   BEEFREE_CLIENT_ID=your_client_id
   BEEFREE_CLIENT_SECRET=your_client_secret
   ```

3. **Start the development server**
   ```bash
   yarn start
   ```
   This runs both:
   - Express auth server on port **3031**
   - Vite dev server on port **8031**

4. **Open the app**
   Navigate to [http://localhost:8031](http://localhost:8031)

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start both backend and frontend (dev mode) |
| `yarn build:sdk` | Download BeePlugin.js from CDN for Salesforce Static Resource |
| `yarn build:salesforce` | Copy LWC components from src/ to force-app/ |
| `yarn test` | Run Jest unit tests |
| `yarn server` | Express auth server with hot-reload |

## ☁️ Deploying to Salesforce

### Prerequisites
- Salesforce CLI (`sf` or `sfdx`)
- A Salesforce org (Developer, Sandbox, or Scratch)

### Step 1: Login to Salesforce
```bash
yarn sf:login
```

### Step 2: Generate force-app Components
```bash
yarn build:salesforce
```
This copies `src/modules/c/` to `force-app/main/default/lwc/`, renaming `app` → `beefreeApp`.

### Step 3: Build the SDK Bundle
```bash
yarn build:sdk
```
This downloads `BeePlugin.js` from the Beefree CDN and saves it to `force-app/main/default/staticresources/beefree_sdk.js`

### Step 4: Deploy to Salesforce
```bash
yarn sf:deploy
```

Or deploy components individually:
```bash
yarn sf:deploy:sdk      # Static Resource only
yarn sf:deploy:lwc      # LWC components only (auto-runs build:salesforce)
yarn sf:deploy:apex     # Apex classes only
```

### Step 5: Configure Remote Site Settings
In Salesforce Setup, add these URLs to **Remote Site Settings**:
- `https://auth.getbee.io` — For Apex HTTP callouts to Beefree auth API

### Step 6: Configure Trusted URLs (CSP)
In Salesforce Setup, add these URLs to **Trusted URLs** (or "CSP Trusted Sites"):

| Name | URL | Directives |
|------|-----|------------|
| `BeefreeAppRsrc` | `https://app-rsrc.getbee.io` | connect-src, script-src, frame-src |
| `BeefreeLoader` | `https://loader.getbee.io` | connect-src, script-src |
| `BeefreeRsrc` | `https://rsrc.getbee.io` | connect-src, img-src, style-src, font-src |
| `BeefreeAuth` | `https://auth.getbee.io` | connect-src |

### Step 7: Configure Beefree Credentials
1. Go to **Setup → Custom Metadata Types → Beefree Settings → Manage Records**
2. Click **New**
3. Fill in:
   - **Label**: Default
   - **Client ID**: Your Beefree Client ID
   - **Client Secret**: Your Beefree Client Secret
4. Save

### Step 8: Add Component to a Lightning Page
1. Go to **App Builder** or edit a Lightning Record Page
2. Drag **Beefree App** component onto the page
3. Configure properties (optional):
   - **Template ID**: Default template to load (e.g., `m-bee`)
   - **User ID**: Custom user identifier

### Salesforce Scripts

| Command | Description |
|---------|-------------|
| `yarn sf:login` | Login to Salesforce org |
| `yarn sf:org:list` | List connected orgs |
| `yarn sf:org:open` | Open the org in browser |
| `yarn sf:deploy` | Deploy all components |
| `yarn sf:deploy:sdk` | Deploy Static Resource |
| `yarn sf:deploy:lwc` | Deploy LWC components |
| `yarn sf:deploy:apex` | Deploy Apex classes |

## 🧩 LWC Components

### `c/app` — Root Component

Handles initialization: fetches the auth token and template JSON using Apex-style imports (stubbed locally), then passes them down to the editor component.

**Features:**
- **Toolbar with SDK actions**: Undo, Redo, Toggle Structure, Toggle Preview, Save JSON, Save HTML
- **Delegates to `c-beefree-editor`** via public `@api` methods

```js
import getAuthToken from '@salesforce/apex/BeefreeAuthController.getAuthToken'
import getTemplate from '@salesforce/apex/BeefreeAuthController.getTemplate'

// Reactive state — triggers re-render automatically
tokenData = null
templateJson = null
isLoading = true
error = null

async connectedCallback() {
  const [token, template] = await Promise.all([
    getAuthToken({ uid: 'salesforce-lwc-example' }),
    getTemplate(),
  ])
  this.tokenData = token
  this.templateJson = template
}

// Toolbar handlers delegate to editor component
handleSave() {
  this.template.querySelector('c-beefree-editor')?.save()
}
```

### `c/beefreeEditor` — SDK Wrapper

Loads `BeePlugin.js` via `loadScript` from a Static Resource (Salesforce) or directly from CDN (local dev). Uses `BeePlugin.create()` to initialize the editor.

**Public `@api` methods:**
- `saveAsTemplate()` — Save current design as JSON template
- `save()` — Save design (triggers `onSave` callback)
- `preview()` — Open preview modal
- `toggleStructure()` — Toggle structure outline view
- `togglePreview()` — Toggle preview mode
- `undo()` / `redo()` — Undo/redo last action

```js
import { loadScript } from 'lightning/platformResourceLoader'
import BEEFREE_SDK from '@salesforce/resourceUrl/beefree_sdk'

@api tokenData
@api templateJson
@api uid = 'salesforce-lwc-example'

// Public methods callable from parent
@api
save() {
  this._sdkInstance?.save()
}

async loadSdkAndInit() {
  // Skip if BeePlugin already loaded (local dev via CDN)
  if (!window.BeePlugin) {
    await loadScript(this, BEEFREE_SDK)
  }
  this.initEditor()
}

initEditor() {
  // BeePlugin.create() initializes the editor
  BeePlugin.create(token, beeConfig, (instance) => {
    this._sdkInstance = instance
    instance.start(template, { shared: false })
  })
}
```

## 🧪 Testing

Run unit tests with Jest and sfdx-lwc-jest:

```bash
yarn test
```

Tests are located in `__tests__` folders within each component directory.

## 🔧 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Components** | Lightning Web Components (LWC) v9 |
| **Build (Local)** | Vite + vite-plugin-lwc |
| **Build (SF)** | Salesforce CLI (sfdx) |
| **Server (Local)** | Express.js + TypeScript |
| **Auth (Local)** | Express endpoint → Beefree API |
| **Auth (SF)** | Apex Controller + Custom Metadata |
| **Testing** | Jest + @salesforce/sfdx-lwc-jest |
| **Runtime** | Node.js ≥ 22 |

## 🔍 Troubleshooting

### Editor doesn't render (Local)
- Check browser console for errors
- Verify `.env` has valid `BEEFREE_CLIENT_ID` and `BEEFREE_CLIENT_SECRET`
- Ensure you're accessing port **8031** (Vite), not 3031 (Express)

### Editor doesn't render (Salesforce)
- Check that Static Resource `beefree_sdk` is deployed
- Verify **Remote Site Settings** includes `https://auth.getbee.io`
- Verify **Trusted URLs** are configured for all Beefree domains (see Step 6)
- Check that Custom Metadata `Beefree_Settings__mdt` has valid credentials
- Open browser console for detailed error messages
- Open the Salesforce "Developer Console" to verify possible errors on that side

### Shadow DOM compatibility
The Beefree SDK renders inside the LWC Shadow DOM. If you encounter styling or DOM access issues, check that you're using an SDK version with Shadow DOM support.

### Build errors
- LWC components must follow naming conventions: folder name matches the JS class file name (camelCase)
- HTML templates must be valid LWC markup (e.g., `lwc:if` instead of standard `if`)

### Test errors
- Run `yarn test` to run unit tests
- Ensure Jest config is using `.cjs` extension for CommonJS compatibility
- Tests mock `window.BeePlugin` with `BeePlugin.create()` callback pattern

## 📚 Resources

### Beefree
- [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)
- [Beefree Developer Console](https://developers.beefree.io)

### LWC
- [LWC Developer Guide](https://developer.salesforce.com/docs/platform/lwc/guide)
- [LWC OSS (Open Source)](https://lwc.dev)
- [LWC NPM package](https://www.npmjs.com/package/lwc)
- [LWC Jest NPM package](https://www.npmjs.com/package/@salesforce/sfdx-lwc-jest)

### Salesforce
- [Salesforce CLI Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/)
- [Salesforce CLI NPM package](https://www.npmjs.com/package/@salesforce/cli)
- [Salesforce Apex Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_dev_guide.htm)