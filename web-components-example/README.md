# 🧩 Web Components Example - Shadow DOM Integration

This example demonstrates how to integrate the **Beefree SDK** into a **custom HTML element** (`<beefree-component>`) using the **Web Components** standard and **Shadow DOM** for style isolation. No framework required — just vanilla TypeScript.

## ✨ Key Features

### 🧩 **Custom Element (`<beefree-component>`)**
- **Declarative Usage**: Drop `<beefree-component>` into any HTML page
- **Property-Driven API**: Set `config`, `token`, and `template` via JavaScript properties or HTML attributes
- **Auto-Initialization**: The SDK starts automatically once all required properties are set (in any order)
- **Shadow DOM Isolation**: Editor styles are encapsulated and won't leak into the host page

### 🏗️ **Modern Architecture**
- **TypeScript**: Fully typed custom element with official Beefree SDK types
- **Vite**: Lightning-fast development server and build system
- **No Framework**: Pure Web Components — can be embedded in React, Vue, Angular, or plain HTML
- **Co-Editing Ready**: Built-in `sessionId` property for collaborative editing via `join()`

### 🔐 **Secure Authentication**
- **Autonomous Authentication**: Includes its own local Node.js/Express authentication server
- **Token Management**: Automatic token handling via auth service
- **Environment Variables**: Secure credential management

## 🏗️ Architecture Overview

### **Project Structure**
```
web-components-example/
├── src/
│   ├── web-components/
│   │   └── Beefree.ts          # Custom element definition
│   ├── utils.ts                # Auth, template fetching, component helpers
│   └── index.ts                # Entry point — initializes the SDK
├── public/
│   ├── styles/
│   │   └── style.css           # Global page styles
│   └── images/                 # Favicon and icons
├── index.html                  # HTML page with <beefree-component>
├── server.ts                   # Local authentication server
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

### **Core Components**

#### **🧩 Beefree.ts** - Custom Element
The `<beefree-component>` custom element encapsulates the entire Beefree SDK lifecycle:

```typescript
class Beefree extends HTMLElement {
  static get observedAttributes() {
    return ['config', 'token', 'template']
  }

  // Properties can be set in any order — SDK initializes
  // automatically once config, token, and template (or sessionId) are all present.
  private tryInit(): void {
    const { config, token, template, sessionId } = this.state
    if (!config || !token || (!template && !sessionId)) return

    const beeConfig = { ...config.beeConfig, container: this.container } as IBeeConfig
    this.sdkInstance = new BeefreeSDK(token as IToken)

    if (sessionId) {
      this.sdkInstance.join(beeConfig, sessionId)
    } else {
      this.sdkInstance.start(beeConfig, template as IEntityContentJson, undefined, startOptions)
    }
  }
}

customElements.define('beefree-component', Beefree)
```

#### **🔧 utils.ts** - Helper Functions
```typescript
// Set properties on the custom element (with queuing if element isn't ready yet)
export const updateBeefreeComponent = (prop: string, value: unknown): void => { ... }

// Fetch a default template
export const getTemplate = async (): Promise<IEntityContentJson> => { ... }

// Authenticate with the backend server
export const loginV2 = async (): Promise<IToken> => { ... }
```

#### **🚀 index.ts** - Entry Point
```typescript
const initSDK = async (): Promise<void> => {
  const token = await loginV2()
  const template = await getTemplate()

  updateBeefreeComponent('token', token)
  updateBeefreeComponent('config', { beeConfig: { uid: 'web-components-example' }, startOptions: { shared: false } })
  updateBeefreeComponent('template', template)
}

initSDK()
```

### **How It Works**

```
index.html
  └── <beefree-component>            ← Custom element in the DOM
        └── Shadow DOM
              ├── <style>             ← Scoped styles (won't leak)
              └── <div#container>     ← SDK renders here

index.ts
  ├── loginV2()                       ← Fetches JWT from backend
  ├── getTemplate()                   ← Fetches default template JSON
  └── updateBeefreeComponent()        ← Sets properties on the element
        └── Beefree.ts setters        ← Each setter calls tryInit()
              └── tryInit()           ← Starts SDK when all props are ready
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 22+
- Yarn via Corepack (pinned to `yarn@4.13.0` via `packageManager`; run `corepack enable`)
- Beefree SDK credentials

### Option 1: Run from Repository Root (Recommended)

The easiest way to run this example is using the start command from the repository root:

```bash
# From the beefree-sdk-examples root directory
yarn start:web-components
```

This single command will:
- ✅ Automatically install all dependencies
- ✅ Start the local authentication server (port 3030)
- ✅ Start the web components example frontend (port 8030)

Then open your browser to `http://localhost:8030`

**Before running**, make sure to configure your Beefree SDK credentials in `web-components-example/.env`:

```bash
cd web-components-example
cp .env.example .env
```

Edit `.env`:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3030
```

### Option 2: Run Manually (Advanced)

If you prefer to run the example independently:

#### 1. Install Dependencies

```bash
# In the web-components-example folder
yarn install
```

#### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials.

#### 3. Start the Application

```bash
yarn start
```

This will concurrently run the backend server (3030) and frontend (8030).

Open your browser to `http://localhost:8030`

### **Additional Commands**
```bash
# Build for production
yarn build

# Preview production build
yarn preview

# Type checking
yarn type-check
```

## 🎯 Usage Guide

### **Basic Usage — HTML**
Drop the custom element into any HTML page:

```html
<script type="module" src="/src/index.ts"></script>
<beefree-component id="beefree-component" />
```

### **Programmatic Property Setting**
Properties can be set in any order. The SDK auto-initializes when all required data is present:

```typescript
const el = document.querySelector('beefree-component')

el.token = tokenFromAuthServer      // IToken object
el.config = { beeConfig: { uid: 'my-app' }, startOptions: { shared: false } }
el.template = templateJson           // IEntityContentJson object
```

### **Co-Editing (Join a Session)**
To join a collaborative session instead of starting from a template:

```typescript
el.token = token
el.config = { beeConfig: { uid: 'my-app' } }
el.sessionId = 'existing-session-id'  // Uses join() instead of start()
```

### **HTML Attribute Support**
The component also accepts JSON strings as HTML attributes (useful for server-rendered pages):

```html
<beefree-component
  token='{"access_token":"...","v2":true}'
  config='{"beeConfig":{"uid":"my-app"}}'
  template='...'
/>
```

## 🔧 Technical Implementation

### **Web Component Lifecycle**

| Lifecycle Method | Purpose |
|---|---|
| `constructor()` | Creates Shadow DOM, container, scoped styles, initializes property upgrade |
| `connectedCallback()` | Syncs any HTML attributes already present, attempts SDK init |
| `attributeChangedCallback()` | Reacts to attribute changes on `config`, `token`, `template` |

### **Property Upgrade Pattern**
The `initializeProperty()` method handles the case where properties are set on the element *before* the custom element class is registered:

```typescript
private initializeProperty(propertyName: BeefreePropertyKey): void {
  if (Object.prototype.hasOwnProperty.call(this, propertyName)) {
    const value = this[propertyName]
    delete this[propertyName]       // Remove the plain property
    this[propertyName] = value      // Re-set via the class setter
  }
}
```

### **Type-Safe SDK Integration**
All Beefree SDK interactions are typed using official SDK types:

```typescript
import BeefreeSDK from '@beefree.io/sdk'
import type { IBeeConfig, IBeeOptions, IEntityContentJson, IToken } from '@beefree.io/sdk/dist/types/bee'
```

### **Shadow DOM Benefits**
- **Style encapsulation**: Editor CSS doesn't affect the host page and vice versa
- **DOM isolation**: The editor's internal DOM tree is hidden from external queries
- **Portability**: The component works identically regardless of the host page's styles or framework

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Editor loads and renders the default template
- [ ] Editor is fully interactive (drag & drop, editing, etc.)
- [ ] Shadow DOM isolates editor styles from the host page
- [ ] Properties can be set in any order without breaking initialization
- [ ] Page refresh + re-authentication works correctly
- [ ] Build (`yarn build`) completes without errors

### **Browser Compatibility**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Production Deployment

### **Build Configuration**
```bash
# Production build
yarn build

# Output in dist/ directory
# Serve static files from dist/
```

### **Environment Variables**
Ensure production environment has:
- `BEEFREE_CLIENT_ID`: Your Beefree SDK client ID
- `BEEFREE_CLIENT_SECRET`: Your Beefree SDK client secret
- `PORT`: Backend server port (default 3030)

## 📚 Resources

- **[Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)**
- **[Web Components MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)**
- **[Shadow DOM MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)**
- **[Custom Elements Specification](https://html.spec.whatwg.org/multipage/custom-elements.html)**
- **[Vite Documentation](https://vitejs.dev/)**

## 🤝 Contributing

When contributing to this example:
1. **Follow TypeScript best practices**
2. **Keep the component framework-agnostic** — no React, Vue, or Angular dependencies
3. **Update documentation for new features**
4. **Ensure Shadow DOM isolation is maintained**
5. **Test in multiple host page environments**

---

This example demonstrates a production-ready, framework-agnostic Beefree SDK integration using Web Components and Shadow DOM with full TypeScript type safety.
