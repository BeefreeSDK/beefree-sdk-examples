# 🔧 Shared Authentication Module

Questo modulo fornisce **la logica di autenticazione riutilizzabile** per TUTTI gli esempi di Beefree SDK. Implementa la gestione sicura dei token, JWT handling e pattern di autenticazione consistenti in tutto il repository.

**⚠️ IMPORTANTE**: Questo è un **modulo di codice**, non un servizio da eseguire. È importato dai backend server usando `require()` o `import`. Non devi avviare questo modulo separatamente.

## 🎯 Il Segreto: Tutti Usano la Stessa Logica!

**Tutti gli esempi chiamano `/auth/token` e ricevono un token allo stesso modo.**

La magia è che `shared/auth.js` fornisce la funzione `setupAuthEndpoint()` che:
1. Crea l'endpoint `POST /auth/token`
2. Chiama l'API Beefree (`https://auth.getbee.io/loginV2`)
3. Ritorna un `IToken` valido per Beefree SDK

## 📁 Module Overview

**File**: `auth.js`  
**Type**: Node.js CommonJS module  
**Purpose**: Logica di autenticazione condivisa

**Usato da:**
- ✅ `secure-auth-example/server.ts` → Crea `/auth/token` su porta **3000**
- ✅ `template-export-pdf-example/server.js` → Crea `/auth/token` su porta **3001**

**Frontend che lo usano (indirettamente):**
- `custom-css-example` → chiama `/auth/token` → proxy → `secure-auth:3000`
- `multi-builder-switch-example` → chiama `/auth/token` → proxy → `secure-auth:3000`
- `template-export-pdf-example` → chiama `/auth/token` → stesso server 3001

**Come funziona:**
1. Questo modulo è **importato** dai backend server
2. **NON** è un servizio separato che deve essere in esecuzione
3. Fornisce funzioni che i server chiamano per gestire l'autenticazione
4. La logica è **identica** ovunque venga usato

## 🔑 Key Features

### **🔐 Beefree SDK Authentication**
- Direct authentication with Beefree API (`https://auth.getbee.io/loginV2`)
- Returns complete `IToken` structure compatible with Beefree SDK
- Client ID and Secret management

### **🛡️ Security Best Practices**
- Backend-only credential handling
- Secure token validation
- Error handling without exposing sensitive data
- JWT token support

### **⚙️ Express.js Integration**
- `setupAuthEndpoint()` - Creates `/auth/token` endpoint
- CORS-friendly implementation
- Builder-specific credential support
- Health check ready

### **🔄 Consistent Token Management**
- Standardized token structure
- Automatic token refresh support
- Validation and error handling

## 📋 API Reference

### `authenticateBeefree(clientId, clientSecret, uid)`

Authenticates with Beefree SDK and returns a complete IToken.

**Parameters:**
- `clientId` (string) - Beefree client ID
- `clientSecret` (string) - Beefree client secret
- `uid` (string) - User identifier

**Returns:** `Promise<IToken>` - Complete IToken object compatible with Beefree SDK

**Example:**
```javascript
const { authenticateBeefree } = require('./shared/auth.js')

const token = await authenticateBeefree(
  'your_client_id',
  'your_client_secret',
  'user-123'
)
// token: { access_token: '...', authUrl: '...', ... }
```

### `setupAuthEndpoint(app, clientId, clientSecret)`

Creates an Express.js authentication endpoint at `/auth/token`.

**Parameters:**
- `app` (Express) - Express app instance
- `clientId` (string) - Default Beefree client ID
- `clientSecret` (string) - Default Beefree client secret

**Endpoint Created:**
- **POST** `/auth/token`
  - **Request Body**: `{ uid: string, clientId?: string, clientSecret?: string }`
  - **Response**: `IToken` object
  - **Status Codes**: 
    - 200: Success
    - 400: Missing uid
    - 500: Authentication failed

**Example:**
```javascript
import express from 'express'
import { setupAuthEndpoint } from '../shared/auth.js'

const app = express()
app.use(express.json())

setupAuthEndpoint(app, process.env.BEEFREE_CLIENT_ID, process.env.BEEFREE_CLIENT_SECRET)

app.listen(3000)
```

### `initializeBeefreeSDK(token, config)`

**Deprecated** - Legacy function for backward compatibility. Use the modern Beefree SDK NPM package instead.

## 🔄 Usage Patterns

### **Pattern 1: Central Authentication Server** (secure-auth-example)

Used when you want a **single authentication server** for multiple frontend applications.

**Server (secure-auth-example/server.ts):**
```typescript
import express from 'express'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { setupAuthEndpoint } = require('../shared/auth.js')

const app = express()
app.use(express.json())

// Setup shared authentication endpoint
setupAuthEndpoint(app, process.env.BEEFREE_CLIENT_ID, process.env.BEEFREE_CLIENT_SECRET)

app.listen(3000)
```

**Client (custom-css-example, multi-builder-switch-example):**
```typescript
// Vite proxy configuration forwards /auth/* to http://localhost:3000
const response = await fetch('/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ uid: 'user-123' })
})

const token = await response.json()
const beeInstance = new BeefreeSDK(token)
```

**Benefits:**
- ✅ Single authentication server for multiple apps
- ✅ Centralized credential management
- ✅ CORS-enabled for multiple origins
- ✅ Easy to scale

### **Pattern 2: Standalone Server** (template-export-pdf-example)

Used when you want a **self-contained application** with integrated authentication.

**Server (template-export-pdf-example/server.js):**
```javascript
import express from 'express'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { setupAuthEndpoint, authenticateBeefree } = require('../shared/auth.js')

const app = express()
app.use(express.json())

// Setup authentication endpoint for frontend
setupAuthEndpoint(app, process.env.BEEFREE_CLIENT_ID, process.env.BEEFREE_CLIENT_SECRET)

// Use authenticateBeefree directly for server-side operations
app.post('/api/export/pdf', async (req, res) => {
  const token = await authenticateBeefree(
    process.env.BEEFREE_CLIENT_ID,
    process.env.BEEFREE_CLIENT_SECRET,
    'pdf-export-user'
  )
  // Use token for PDF export...
})

app.listen(3001)
```

**Benefits:**
- ✅ Self-contained, no external dependencies
- ✅ Simpler deployment
- ✅ Independent scaling
- ✅ Can use auth both for frontend and backend operations

## 🔒 Security Considerations

### **✅ DO:**
- Store credentials in environment variables only
- Use HTTPS in production
- Implement rate limiting on authentication endpoints
- Log authentication failures for monitoring
- Validate all user inputs

### **❌ DON'T:**
- Never expose client ID/secret in frontend code
- Don't commit credentials to version control
- Don't log sensitive token data
- Don't use default credentials in production

## 🧪 Testing the Module

### **Direct Function Testing**
```javascript
const { authenticateBeefree } = require('./shared/auth.js')

async function testAuth() {
  try {
    const token = await authenticateBeefree(
      'your_client_id',
      'your_client_secret',
      'test-user'
    )
    console.log('✅ Authentication successful:', token.access_token)
  } catch (error) {
    console.error('❌ Authentication failed:', error.message)
  }
}

testAuth()
```

### **Endpoint Testing**
```bash
# Test the authentication endpoint
curl -X POST http://localhost:3000/auth/token \
  -H "Content-Type: application/json" \
  -d '{"uid": "test-user"}'

# Expected response:
{
  "access_token": "jwt_token_here",
  "authUrl": "https://auth.beefree.io",
  "authToken": "auth_token_here",
  ...
}
```

## 📊 Token Structure (IToken)

The `IToken` returned by this module matches the Beefree SDK interface:

```typescript
interface IToken {
  access_token: string       // JWT access token
  authUrl?: string          // Authentication URL
  authToken?: string        // Auth token
  v2?: boolean             // API version flag
  expires_in?: number      // Token expiration time
  refresh_token?: string   // Refresh token (if available)
}
```

## 🚀 Production Deployment

### **Environment Variables**
```env
# Required
BEEFREE_CLIENT_ID=your_production_client_id
BEEFREE_CLIENT_SECRET=your_production_client_secret

# Optional
NODE_ENV=production
```

### **Server Configuration**
```javascript
// Enable CORS for production domains
app.use(cors({
  origin: [
    'https://your-app.com',
    'https://another-app.com'
  ],
  credentials: true
}))

// Setup authentication
setupAuthEndpoint(app, process.env.BEEFREE_CLIENT_ID, process.env.BEEFREE_CLIENT_SECRET)
```

## 🔗 Related Documentation

- **[secure-auth-example](../secure-auth-example/)** - Central authentication server implementation
- **[template-export-pdf-example](../template-export-pdf-example/)** - Standalone server implementation
- **[Beefree SDK Authentication Docs](https://docs.beefree.io/beefree-sdk/authentication/)**

## 🤝 Contributing

When modifying this shared module:
1. **Test all examples** - Changes affect multiple applications
2. **Maintain backward compatibility** - Don't break existing implementations
3. **Update documentation** - Keep this README in sync with changes
4. **Security first** - Never compromise security for convenience

## 📄 Module Location & Usage

```
beefree-sdk-examples/
└── shared/
    ├── auth.js        # 🔧 This module (imported by servers)
    └── README.md      # 📖 This documentation
```

### **Dependency Type**

This is a **CODE DEPENDENCY**, not a **RUNTIME DEPENDENCY**:

| Dependency Type | Description | Example |
|----------------|-------------|---------|
| **Code Dependency** ✅ | Module imported in code via `require()` or `import` | `shared/auth.js` |
| **Runtime Dependency** ⚠️ | Separate service that must be running | `secure-auth-example:3000` |

**What this means:**
- ✅ You don't need to "start" or "run" this module
- ✅ It just needs to exist at `../shared/auth.js` relative to the servers
- ✅ Servers import functions from it like any Node.js module
- ❌ It's NOT a web service with its own port
- ❌ You don't need to do `yarn dev` or `npm start` for this folder

---

**💡 Pro Tip**: This shared module ensures consistent authentication across all examples. When in doubt about authentication implementation, refer to how `secure-auth-example` or `template-export-pdf-example` use this module.

