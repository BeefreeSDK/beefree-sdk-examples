# 🚀 Beefree SDK Examples

This repository contains **production-ready examples** demonstrating advanced features of the [Beefree SDK](https://docs.beefree.io/beefree-sdk/), an embeddable no-code builder for creating stunning emails, landing pages, and popups.

## 📖 About Beefree SDK

Beefree SDK is an embeddable no-code builder that gives your end users the freedom to design stunning emails, landing pages, and popups—without writing a single line of code. It's easy to configure, intuitive to personalize, and built to scale with your needs.

### 🌟 Key Features
- **📧 Email Builder**: No-code email creation environment
- **🌐 Page Builder**: Landing page creation tools
- **🎯 Popup Builder**: Compelling popup design tools
- **🤖 AI-Generated Templates**: Custom AI content creation
- **📁 File Manager**: Media asset management
- **📚 Template Catalog**: Industry best practice templates
- **🔧 Comprehensive APIs**: Extend functionality with robust API suite

## ✅ Available Examples

Each example demonstrates production-ready implementation of specific Beefree SDK features with modern development practices:

### 🔐 **Authentication & Security**
- [**🔐 secure-auth-example**](./secure-auth-example/) - **✅ COMPLETE** 🔑 **AUTH PROVIDER**
  - **Stack**: Frontend + Backend (React + TypeScript Express.js)
  - **Ports**: 8080 (frontend) + 3000 (backend)
  - **Uses**: `shared/auth.js` for authentication logic
  - **Purpose**: Central authentication server for `custom-css-example` and `multi-builder-switch-example`
  - **Enterprise-grade authentication** with automatic token refresh
  - **Backend security** with credential isolation
  - **🔍 API Monitor Panel** - Real-time API debugging
  - **⚠️ Must be running** for dependent examples

### 🎨 **Interface Customization**
- [**🎨 custom-css-example**](./custom-css-example/) - **✅ COMPLETE** ⚠️ **DEPENDS ON secure-auth**
  - **Stack**: Frontend only (React + TypeScript)
  - **Port**: 8081
  - **Requires**: `secure-auth-example:3000` must be running
  - **Dynamic theming system** with 5 pre-built themes
  - **Real-time theme switching** with localStorage persistence
  - **CSS variable architecture** for maintainable styling

### 📄 **Content Export & Integration**
- [**📄 template-export-pdf-example**](./template-export-pdf-example/) - **✅ COMPLETE** ⚠️ **DEPENDS ON secure-auth**
  - **Stack**: Frontend + Backend (React + Express.js)
  - **Ports**: 5174 (frontend) + 3001 (backend for PDF only)
  - **Requires**: `secure-auth-example:3000` must be running (auth)
  - **Backend purpose**: PDF export only (authentication handled externally)
  - **Advanced PDF export** via Beefree Content Services API
  - **Multiple export options** (page size, orientation, quality)
  - **Real-time progress tracking** with visual indicators

### 🏗️ **Multi-Builder & Advanced Features**
- [**🏗️ multi-builder-switch-example**](./multi-builder-switch-example/) - **✅ COMPLETE** ⚠️ **DEPENDS ON secure-auth**
  - **Stack**: Frontend only (React + TypeScript)
  - **Port**: 8083
  - **Requires**: `secure-auth-example:3000` must be running
  - **Dynamic builder switching** between Email, Page, and Popup builders
  - **Seamless transitions** without page reload
  - **Builder-specific configurations** and templates

### 🔧 **Shared Infrastructure**
- [**🔧 shared/auth.js**](./shared/) - **✅ COMPLETE** 🔑 **Core Module**
  - **Reusable authentication module** for consistency
  - **JWT token management** with security best practices
  - **Used by**: `secure-auth-example` (server) and `template-export-pdf-example` (server)
  - **Type**: Code module (imported by Node.js servers, not a runtime service)
  - **Provides**: Centralized authentication logic for all examples

### 🚧 Planned Examples (Future Development)

#### Advanced Content Features
- **liquid-personalization-example** - Advanced personalization with Liquid
- **reusable-rows-example** - Manage reusable rows across templates
- **conditional-rows-example** - Show/hide rows conditionally
- **locked-content-example** - Lock sections with advanced permissions

#### Collaboration & Workflow
- **multiuser-collaboration-example** - Real-time collaboration
- **commenting-example** - Comments with toast notifications
- **advanced-permissions-example** - Define roles with permissions

#### AI & Content Generation
- **content-ai-generate-example** - Generate text with AI
- **content-ai-style-example** - Transform text tone/style
- **multilanguage-template-example** - Full multilingual templates

#### Forms & Data
- **form-block-prepopulate-example** - Prepopulated forms
- **form-block-contentdialog-example** - Form block with content dialog

#### Import/Export & Conversion
- **schema-conversion-example** - Convert Simple ↔ Full JSON
- **html-importer-example** - Convert legacy HTML to Beefree JSON

#### Specialized Features
- **special-links-groups-example** - Special Links grouped by categories
- **video-block-example** - Different video block types
- **custom-add-ons-blocks-example** - Custom block types
- **multi-builder-switch-example** - Switch between builders
- **custom-file-system-example** - Go integration with external file systems

## 🚀 Quick Start

### 📋 Prerequisites
- **Node.js 16+** (for JavaScript examples)
- **Beefree SDK credentials** from [Developer Console](https://developers.beefree.io)

### ⚡ Fast Setup

#### **Option 1: Standalone Example** (No Dependencies)

**🔐 secure-auth-example** only:
```bash
# 1. Navigate to example
cd secure-auth-example

# 2. Install & configure
yarn install
cp .env.example .env
# Edit .env with your Beefree SDK credentials

# 3. Run
yarn dev

# 4. Open browser
# http://localhost:8080 (frontend) + port 3000 (backend)
```

#### **Option 2: Examples Requiring Authentication Server**

**🎨 custom-css-example**, **🏗️ multi-builder-switch-example**, or **📄 template-export-pdf-example**:

**Step 1: Start the authentication server** (in a separate terminal)
```bash
cd secure-auth-example
yarn install
cp .env.example .env
# Edit .env with your Beefree SDK credentials
yarn dev  # Runs on port 3000 - MUST stay running
```

**Step 2: Start your chosen example** (in a new terminal)
```bash
# Choose one:
cd custom-css-example               # http://localhost:8081
# OR
cd multi-builder-switch-example     # http://localhost:8083
# OR
cd template-export-pdf-example      # http://localhost:5174 + 3001

yarn install
cp .env.example .env
# Edit .env if needed (add Content Services API key for template-export-pdf)
yarn dev
```

### 🔗 Example Dependencies

| Example | Stack | Ports | External Runtime Deps | Backend Purpose | Status |
|---------|-------|-------|----------------------|-----------------|--------|
| 🔐 **secure-auth-example** | Frontend + Backend | 8080/3000 | ✅ None | Authentication | 🔑 Auth provider |
| 🎨 **custom-css-example** | Frontend only | 8081 | ⚠️ `secure-auth:3000` | N/A | Uses external auth |
| 🏗️ **multi-builder-switch-example** | Frontend only | 8083 | ⚠️ `secure-auth:3000` | N/A | Uses external auth |
| 📄 **template-export-pdf-example** | Frontend + Backend | 5174/3001 | ⚠️ `secure-auth:3000` | PDF export only | Uses external auth |
| 🔧 **shared/auth.js** | Node.js module | - | N/A | N/A | Core module |

**Legend:**
- **Stack**: Indica se il progetto include solo frontend o anche backend
- **External Runtime Deps**: Altri progetti che devono essere in esecuzione
- **Backend Purpose**: Cosa fa il backend (se presente)

**✅ Architettura Allineata:**
**TUTTI i frontend** (`custom-css`, `multi-builder`, `template-export-pdf`) **dipendono da `secure-auth-example:3000` per l'autenticazione**.

- `custom-css` e `multi-builder`: Solo frontend React
- `template-export-pdf`: Frontend React + Backend Express (ma **solo per PDF export, non per autenticazione**)

### 🔐 Environment Variables

Create a `.env` file in each example directory with the required variables:

#### 🔐 secure-auth-example (React + TypeScript)
```env
# Beefree SDK Credentials (Backend Only)
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend Configuration
VITE_PORT=8080
```

#### 🎨 custom-css-example (React + TypeScript)
```env
# Auth proxy URL (points to secure-auth-example)
VITE_BEEFREE_AUTH_PROXY_URL=http://localhost:3000/auth/token

# Template URL for default template
VITE_BEEFREE_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee
```

#### 📄 template-export-pdf-example (React + TypeScript)
```env
# Beefree SDK Credentials (Backend Only)
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# Beefree Content Services API
BEEFREE_CS_API_KEY=your_content_services_api_key_here
BEEFREE_CS_API_URL=https://api.getbee.io

# Server Configuration
PORT=3001
VITE_PORT=5174
```

**🚨 Security**: Never expose Client ID/Secret or API keys in frontend code. Always use server-side only.

## 🎯 Example Status

| Example | Status | Stack Type | Ports | Depends on secure-auth? | Key Features |
|---------|--------|------------|-------|------------------------|--------------|
| 🔐 **secure-auth-example** | ✅ **Ready** | Frontend + Backend (Auth) | 8080/3000 | N/A (is the auth server) | Auth provider, API monitor |
| 🎨 **custom-css-example** | ✅ **Ready** | Frontend only | 8081 | ⚠️ **YES** | Dynamic themes, CSS variables |
| 📄 **template-export-pdf-example** | ✅ **Ready** | Frontend + Backend (PDF) | 5174/3001 | ⚠️ **YES** | PDF export, progress tracking |
| 🏗️ **multi-builder-switch-example** | ✅ **Ready** | Frontend only | 8083 | ⚠️ **YES** | Multi-builder, transitions |
| 🔧 **shared/auth.js** | ✅ **Ready** | Node.js module | - | N/A | Core auth module |

**Nota Importante:** 
- **secure-auth-example** è il server di autenticazione centrale
- **Tutti gli altri esempi frontend** richiedono che `secure-auth-example:3000` sia in esecuzione
- **template-export-pdf** ha un backend, ma SOLO per export PDF - l'autenticazione viene da `secure-auth-example`

## 🏗️ Architecture

### 🔐 Authentication Architecture (Simplified)

**IMPORTANTE**: Tutti gli esempi funzionano **ESATTAMENTE ALLO STESSO MODO** dal punto di vista dell'autenticazione!

#### **Come Funziona l'Autenticazione (TUTTI gli esempi)**

**1. Frontend (identico per tutti):**
```typescript
// Tutti i frontend fanno la stessa chiamata:
const response = await fetch('/auth/token', {
  method: 'POST',
  body: JSON.stringify({ uid: 'user-123' })
})
const token = await response.json()
const beeSDK = new BeefreeSDK(token)
```

**2. Backend (usa shared/auth.js):**
```javascript
// secure-auth-example/server.ts E template-export-pdf-example/server.js:
const { setupAuthEndpoint } = require('../shared/auth.js')
setupAuthEndpoint(app, CLIENT_ID, CLIENT_SECRET)
// Questo crea l'endpoint POST /auth/token
```

#### **🔑 shared/auth.js - Il Modulo Magico**

Questo modulo Node.js contiene tutta la logica di autenticazione:
- Chiamata all'API Beefree (`https://auth.getbee.io/loginV2`)
- Gestione delle credenziali
- Validazione e error handling
- Ritorna un `IToken` valido per il SDK

**Usato da:**
- ✅ `secure-auth-example/server.ts` → espone `/auth/token` su porta **3000**
- ✅ `template-export-pdf-example/server.js` → espone `/auth/token` su porta **3001**

#### **🔄 Due Pattern di Deployment**

La **LOGICA è identica**, cambia solo **dove gira il server**:

**Pattern A - Server Centralizzato:**
```
custom-css-example (porta 8081)
  ↓ chiama /auth/token (proxy Vite)
  ↓
secure-auth-example (porta 3000) ← usa shared/auth.js
  ↓ ritorna IToken
  ↓
custom-css-example riceve token e avvia SDK
```

```
multi-builder-switch-example (porta 8083)
  ↓ chiama /auth/token (proxy Vite)
  ↓
secure-auth-example (porta 3000) ← usa shared/auth.js
  ↓ ritorna IToken
  ↓
multi-builder riceve token e avvia SDK
```

**Pattern B - Server Integrato:**
```
template-export-pdf-example (porta 5174 frontend)
  ↓ chiama /auth/token (stesso server)
  ↓
template-export-pdf-example/server.js (porta 3001) ← usa shared/auth.js
  ↓ ritorna IToken
  ↓
frontend riceve token e avvia SDK
```

#### **🎯 Cosa Significa "Standalone" vs "Dipendente"**

- **custom-css-example** e **multi-builder-switch-example**: 
  - Frontend standalone che si connette a un server di auth esterno
  - **Dipendenza runtime**: devono connettersi a `secure-auth-example:3000`
  
- **template-export-pdf-example**:
  - Ha sia frontend che backend nello stesso progetto
  - **Standalone**: non dipende da altri progetti in esecuzione
  - Ma usa la **stessa logica** di `shared/auth.js`

### Example Structure
```
beefree-sdk-examples/
├── shared/
│   └── auth.js                    # 🔧 LOGICA AUTENTICAZIONE CONDIVISA
│                                  # Funzione: setupAuthEndpoint()
│                                  # NON è un servizio, è solo codice
│
├── secure-auth-example/           # 🔐 FRONTEND + BACKEND (SERVER CENTRALE)
│   ├── server.ts                  # Importa shared/auth.js
│   │                              # Espone POST /auth/token su porta 3000
│   └── src/                       # Frontend React (porta 8080)
│
├── custom-css-example/            # 🎨 SOLO FRONTEND
│   └── src/                       # Chiama /auth/token → proxy → secure-auth:3000
│       └── services/beefree.ts    # fetch('/auth/token', ...)
│
├── multi-builder-switch-example/  # 🏗️ SOLO FRONTEND
│   └── src/                       # Chiama /auth/token → proxy → secure-auth:3000
│       └── services/beefreeMultiService.ts  # fetch('/auth/token', ...)
│
├── template-export-pdf-example/   # 📄 FRONTEND + BACKEND (INTEGRATO)
│   ├── server.js                  # Importa shared/auth.js
│   │                              # Espone POST /auth/token su porta 3001
│   └── src/                       # Frontend React (porta 5174)
│       └── services/beefree.ts    # Chiama /auth/token → stesso server 3001
│
└── README.md                      # 📖 This file
```

### 🔄 Flusso di Autenticazione (IDENTICO per tutti)

**Step 1 - Frontend chiama /auth/token:**
```typescript
// Stesso codice in custom-css, multi-builder, template-export-pdf:
const response = await fetch('/auth/token', {
  method: 'POST',
  body: JSON.stringify({ uid: 'user-123' })
})
```

**Step 2 - Server risponde usando shared/auth.js:**
```javascript
// Stesso codice in secure-auth-example e template-export-pdf:
const { setupAuthEndpoint } = require('../shared/auth.js')
setupAuthEndpoint(app, CLIENT_ID, CLIENT_SECRET)
// Questo gestisce POST /auth/token
```

**Step 3 - Frontend riceve token e avvia SDK:**
```typescript
// Stesso codice in tutti:
const token = await response.json()
const beeSDK = new BeefreeSDK(token)
```

### 📊 Architettura Visuale

```
┌─────────────────────────────────────────────────────┐
│                  shared/auth.js                     │
│         (Logica di autenticazione comune)           │
│                                                      │
│  setupAuthEndpoint(app, clientId, clientSecret)     │
│  ↓                                                   │
│  Crea endpoint: POST /auth/token                    │
│  ↓                                                   │
│  Chiama Beefree API e ritorna IToken                │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
               │ (import)             │ (import)
               │                      │
     ┌─────────▼─────────┐  ┌────────▼──────────────┐
     │  secure-auth      │  │  template-export-pdf  │
     │  server.ts        │  │  server.js            │
     │  PORTA 3000       │  │  PORTA 3001           │
     │  ┌──────────────┐ │  │  ┌─────────────────┐  │
     │  │POST /auth/   │ │  │  │POST /auth/      │  │
     │  │token         │ │  │  │token            │  │
     │  └──────────────┘ │  │  └─────────────────┘  │
     └─────────┬─────────┘  └────────┬──────────────┘
               │                     │
               │                     │
               │ (HTTP)              │ (HTTP stesso server)
               │                     │
     ┌─────────┴─────────┐           │
     │                   │           │
┌────▼─────┐   ┌─────────▼──┐   ┌───▼──────────┐
│ custom-  │   │ multi-     │   │ template-pdf │
│ css      │   │ builder    │   │ (frontend)   │
│ :8081    │   │ :8083      │   │ :5174        │
│          │   │            │   │              │
│ Frontend │   │ Frontend   │   │ Frontend     │
│ React    │   │ React      │   │ React        │
└──────────┘   └────────────┘   └──────────────┘
```

### 🎯 Chi Ha Bisogno di Chi

| Progetto | Stack Type | Deve Essere in Esecuzione? | Si Connette a |
|----------|------------|---------------------------|---------------|
| `shared/auth.js` | Node.js module | ❌ NO (è solo codice) | - |
| `secure-auth-example` | Frontend + Backend (Auth) | ✅ SI (porte 8080/3000) | Beefree API |
| `custom-css-example` | Frontend only | ✅ SI (porta 8081) | → `secure-auth:3000` |
| `multi-builder-switch` | Frontend only | ✅ SI (porta 8083) | → `secure-auth:3000` |
| `template-export-pdf` | Frontend + Backend (PDF) | ✅ SI (porte 5174/3001) | → `secure-auth:3000` + Beefree CS API |

**📌 Punto Chiave:** TUTTI i frontend ora dipendono da `secure-auth-example:3000` per l'autenticazione!

### ✅ Riassunto Semplice

**La logica di autenticazione è IDENTICA grazie a `shared/auth.js`.**

**La differenza è solo organizzativa:**
- **Architettura Microservizi**: `custom-css` e `multi-builder` sono frontend puri che si connettono a un server di auth condiviso (`secure-auth-example`)
- **Architettura Monolitica**: `template-export-pdf` include frontend + backend nello stesso progetto

### Architecture Approaches

#### 🟢 **Full-Stack TypeScript** (All Examples)
All examples now use a consistent, modern full-stack TypeScript architecture:

**Frontend Stack:**
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety with official Beefree SDK types
- **Vite**: Lightning-fast development server and optimized builds
- **Custom Hooks**: Reusable logic for auth, themes, and PDF export
- **Service Layer**: Clean separation of concerns and API management

**Backend Stack:**
- **TypeScript + Express.js**: Type-safe, lightweight API server
- **ES Modules**: Modern JavaScript module system
- **tsx Development**: Hot reloading for TypeScript backend development
- **Shared Auth Module**: Consistent authentication across examples
- **Environment Variables**: Secure credential management

**Benefits:**
- ✅ **Type Safety**: Prevents runtime errors with TypeScript
- ✅ **Component Architecture**: Reusable, maintainable UI components
- ✅ **Modern Tooling**: Hot reloading, optimized builds, great DX
- ✅ **Scalability**: Easy to extend and maintain
- ✅ **Consistency**: Same patterns across all examples
- ✅ **Production Ready**: Built for real-world applications

## 📚 Documentation & Resources

- **📖 [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)**
- **🔑 [Developer Portal](https://developers.beefree.io)** - Get your credentials here
- **🔧 [API Reference](https://docs.beefree.io/beefree-sdk/apis/)**
- **💬 [Community Support](https://beefree.io/support/)**

## 🎯 Key Features Demonstrated

### 🔐 **Enterprise Security & Authentication**
- **🛡️ Backend-Only Credentials**: Client ID/Secret never exposed to frontend
- **🔄 Automatic Token Refresh**: Tokens refresh every 5 minutes automatically
- **🔗 Shared Authentication Module**: Consistent auth logic across all examples
- **⚠️ Production Error Handling**: Comprehensive error states and recovery
- **🎯 Custom React Hooks**: `useAuth` and `useBeefreeSDK` for state management

### 🎨 **Advanced Interface Customization**
- **🌈 Dynamic Theme System**: 5 pre-built themes (Default, Dark, High Contrast, Coral)
- **⚡ Real-time Theme Switching**: Instant theme application without page reload
- **🎨 CSS Variable Architecture**: Maintainable theming with custom properties
- **💾 Theme Persistence**: Remembers selected theme using localStorage
- **🔧 Modern Development Stack**: React 18 + TypeScript + Vite

### 📄 **Advanced Content Export & Integration**
- **📄 PDF Export via Content Services API**: Official Beefree API integration
- **⚙️ Multiple Export Options**: Page size (A4, Letter, Legal), orientation, quality
- **📊 Real-time Progress Tracking**: Visual progress indicators during export
- **📋 Export History Management**: Track recent exports with success/failure status
- **🔗 Direct PDF Access**: Open exported PDFs in new browser tabs
- **🎯 Template Format Support**: Both HTML and JSON template export

## 🤝 Contributing

Each example follows these principles:
- ✅ **Production-Ready Code**: Comprehensive error handling and edge case management
- ✅ **Type Safety**: Full TypeScript implementation with official Beefree SDK types
- ✅ **Modern Architecture**: React 18 + TypeScript + Vite + Express.js stack
- ✅ **Security Best Practices**: Backend-only credentials, secure token management
- ✅ **Comprehensive Documentation**: Detailed setup and usage instructions
- ✅ **Shared Infrastructure**: Consistent authentication and patterns across examples
- ✅ **Accessibility**: WCAG-compliant UI components and keyboard navigation
- ✅ **Performance**: Optimized builds, lazy loading, and efficient state management

## 📄 License

These examples are provided for educational and development purposes. Please refer to the [Beefree SDK Terms of Service](https://beefree.io/terms-of-service/) for usage guidelines.

---

**🚀 Ready to start?** Choose an example above and follow its README for detailed setup instructions!
