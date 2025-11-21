# 💾 Beefree SDK Auto-Save Template Versioning Example

A practical, ready-to-run example demonstrating how to implement **automatic template versioning with auto-save** using the Beefree SDK. Built with **React 19 + TypeScript + Vite**, this example shows you how to automatically save template versions, maintain version history, and restore previous versions.

**Perfect for developers who are:**
- 🆕 New to Beefree SDK and want to see auto-save in action
- 📖 Learning how to implement version control for email templates
- 🔨 Building a template management system with history
- 🎯 Looking for production-ready auto-save patterns

---

## ✨ Features Demonstrated

### 💾 **Core Auto-Save Capabilities**
- **Automatic Saving** - Templates automatically save every 10 seconds
- **Version History** - Maintains a chronological list of saved versions
- **One-Click Restore** - Load any previous version from the sidebar
- **Real-time Timer** - Visual countdown showing time until next auto-save
- **Version Limit** - Displays the latest 10 auto-saved versions

### 🏗️ **Modern Architecture**
- **React 19** with functional components and hooks
- **TypeScript** for type safety and better developer experience
- **Vite** for fast development and optimized builds
- **Context API** for global builder state management
- **Custom Hooks** for business logic separation

### 💼 **Production-Ready Patterns**
- **Local Storage Persistence** - Version history survives page refreshes
- **Clean Architecture** - Separation of concerns with services, hooks, and components
- **Type-Safe Storage** - Custom `AutosaveVersionsStore` class for version management
- **Error Handling** - Robust error handling throughout the application

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and Yarn
- Beefree SDK credentials
- The `secure-auth-example` server running for authentication

### Option 1: Run from Repository Root (Recommended)

The easiest way to run this example is using the start command from the repository root:

```bash
# From the beefree-sdk-examples root directory
yarn start:autosave
```

This single command will:
- ✅ Automatically install all dependencies (root, auto-save-template-versioning, and secure-auth-example)
- ✅ Start the authentication server (port 3000)
- ✅ Start the auto-save example (port 5173)

Then open your browser to `http://localhost:5173`

**Before running**, make sure to configure your Beefree SDK credentials in `secure-auth-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

### Option 2: Run Manually (Advanced)

If you prefer to run the example independently, you need to manually start both the authentication server and the auto-save example:

#### 1. Install Dependencies

First, install dependencies for both the auto-save-template-versioning and the secure-auth-example:

```bash
# In the auto-save-template-versioning folder
yarn install

# In the secure-auth-example folder
cd ../secure-auth-example
yarn install
cd ../auto-save-template-versioning
```

#### 2. Configure Environment

Configure the secure-auth-example with your Beefree SDK credentials:

```bash
cd ../secure-auth-example
cp .env.example .env
```

Edit `secure-auth-example/.env`:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

Optionally, configure the auto-save example:

```bash
cd ../auto-save-template-versioning
cp .env.example .env
```

Edit `auto-save-template-versioning/.env` if needed:
```env
# Auth proxy URL (points to secure-auth-example)
VITE_AUTH_PROXY_URL=http://localhost:3000/auth/token
```

#### 3. Start Authentication Server

In a separate terminal, start the secure-auth-example server:

```bash
cd ../secure-auth-example
yarn server:dev
```

The auth server should be running on `http://localhost:3000`

#### 4. Start Auto-Save Example

In another terminal, start the auto-save example:

```bash
cd ../auto-save-template-versioning
yarn dev
```

Open your browser to `http://localhost:5173`

### **Additional Commands**
```bash
# Build for production
yarn build

# Preview production build
yarn preview

# Type checking
yarn type-check
```

---

## 🎮 Using the Demo

### Understanding the Interface

The demo interface consists of two main areas:

1. **Left Sidebar** - Version History Panel
   - Shows the latest 10 auto-saved versions
   - Displays timestamp for each version
   - Click any version to restore it
   - Most recent version appears at the top

2. **Main Editor** - Beefree SDK Builder
   - Full-featured email template editor
   - Auto-saves every 10 seconds
   - Real-time countdown timer showing next save
   - All standard Beefree SDK editing capabilities

### Testing Auto-Save

1. **Make Changes**: Edit the template (add content, change text, etc.)
2. **Watch Timer**: Observe the countdown timer (10 seconds)
3. **Auto-Save Triggers**: When timer reaches 0, version is automatically saved
4. **Check Sidebar**: New version appears in the history list
5. **Repeat**: Make more changes and watch versions accumulate

### Restoring Versions

1. **Click Version**: Click any version in the sidebar history
2. **Instant Restore**: The template immediately loads that version
3. **Continue Editing**: Make changes and auto-save continues normally

---

## 🔧 Understanding the Configuration

### Auto-Save Configuration

The auto-save interval is configured when initializing the Beefree SDK:

```typescript
const config = {
  uid: 'beefree-user-id',
  container: 'bee-plugin-container',
  autosave: 10  // Auto-save every 10 seconds
}
```

**Customization**: Change the `autosave` value to adjust the interval (in seconds).

### Version Storage

Versions are stored in localStorage using the `AutosaveVersionsStore` class:

```typescript
export class AutosaveVersionsStore {
  private readonly MAX_VERSIONS = 10
  
  add(version: AutosaveVersion): void {
    // Adds new version, removes oldest if exceeds MAX_VERSIONS
  }
  
  getAll(): AutosaveVersion[] {
    // Returns all stored versions
  }
}
```

### Authentication Flow

This example uses the `secure-auth-example` server to handle credentials securely:

1. **Client** requests a token from `/auth/token`
2. **Server** validates and creates a signed JWT token
3. **Client** uses token to initialize Beefree SDK
4. **Beefree SDK** validates token with Beefree servers

**Why?** Your API credentials (Client ID and Secret) should NEVER be exposed in client-side code.

---

## 🏗️ Architecture Overview

### **Project Structure**
```
auto-save-template-versioning/
├── src/
│   ├── components/
│   │   └── SimpleBuilder.tsx    # Beefree SDK wrapper component
│   │   └── Sidebar.tsx           # Version history display
│   ├── hooks/
│   │   └── useBuilder.tsx        # Builder initialization logic
│   │   └── useToken.ts           # Authentication token management
│   │   └── useAutosaveVersions.ts # Version history management
│   ├── api/
│   │   └── Authorizer.ts         # Authentication service
│   │   └── AutosaveVersionsStore.ts # LocalStorage version manager
│   ├── App.tsx                   # Main application component
│   ├── App.css                   # Application styles
│   └── main.tsx                  # Application entry point
├── vite.config.ts               # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

### **Core Components**

#### **🎯 App.tsx** - Main Application
```typescript
export default function App() {
  return (
    <BuilderProvider>
      <div className="app-container">
        <Sidebar />
        <SimpleBuilder />
      </div>
    </BuilderProvider>
  )
}
```

#### **💾 useAutosaveVersions Hook** - Version Management
```typescript
export const useAutosaveVersions = () => {
  const [versions, setVersions] = useState<AutosaveVersion[]>([])
  
  const addVersion = useCallback((template: any) => {
    const version = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      template
    }
    store.add(version)
    setVersions(store.getAll())
  }, [])
  
  return { versions, addVersion }
}
```

#### **🔧 SimpleBuilder Component** - SDK Integration
```typescript
export const SimpleBuilder = () => {
  const { bee, initialize } = useBuilder()
  const { addVersion } = useAutosaveVersions()
  
  useEffect(() => {
    const config = {
      uid: 'user-id',
      container: 'bee-plugin-container',
      autosave: 10,
      onAutoSave: (json: any) => {
        addVersion(json)
      }
    }
    
    initialize(config)
  }, [])
  
  return <div id="bee-plugin-container" />
}
```

---

## 🎨 Customization

### Adjusting Auto-Save Interval

Change the `autosave` value in the builder configuration:

```typescript
const config = {
  autosave: 30  // Save every 30 seconds instead of 10
}
```

### Changing Version Limit

Modify the `MAX_VERSIONS` constant in `AutosaveVersionsStore.ts`:

```typescript
export class AutosaveVersionsStore {
  private readonly MAX_VERSIONS = 20  // Store 20 versions instead of 10
}
```

### Styling

All styles are in `src/App.css`. Key sections:
- `.app-container` - Main layout (sidebar + editor)
- `.sidebar` - Version history panel
- `.version-item` - Individual version entries
- `.timer` - Auto-save countdown timer

### Version Display Format

Customize how versions appear in the sidebar by modifying `Sidebar.tsx`:

```typescript
const formatTimestamp = (timestamp: string) => {
  // Customize date/time formatting here
  return new Date(timestamp).toLocaleString()
}
```

---

## 🐛 Troubleshooting

### Authentication Fails
**Solution:** Ensure `secure-auth-example` is running on port 3000
```bash
cd ../secure-auth-example
yarn server:dev
```

### Auto-Save Not Triggering
**Solution:** 
1. Check that `autosave` is configured in the Beefree SDK config
2. Verify `onAutoSave` callback is properly connected
3. Check browser console for errors

### Versions Not Persisting
**Solution:** 
1. Check browser localStorage is enabled
2. Verify `AutosaveVersionsStore` is correctly saving data
3. Check for localStorage quota limits

### Cannot Restore Version
**Solution:** 
1. Ensure the version data is valid JSON
2. Check that the Beefree SDK instance is initialized
3. Verify the `load` method is called correctly

---

## 🌟 Production Considerations

### Security
- **Server-side tokens only** - Never expose API credentials in client code
- **User validation** - Verify user identity before generating tokens
- **CORS configuration** - Properly configure cross-origin requests

### Scalability
- **Backend Storage** - Replace localStorage with database for production
- **Version Limits** - Implement smart cleanup strategies for old versions
- **Conflict Resolution** - Handle concurrent editing scenarios

### Performance
- **Debouncing** - Consider debouncing auto-save to reduce server load
- **Delta Storage** - Store only changes between versions for efficiency
- **Lazy Loading** - Load version history on-demand

---

## 🔗 Related Resources

- **[Beefree SDK Auto-Save Documentation](https://docs.beefree.io/beefree-sdk/)** - Official documentation
- **[secure-auth-example](../secure-auth-example/)** - Authentication server used by this demo
- **[Beefree SDK Console](https://developers.beefree.io/)** - Get your credentials
- **[React Documentation](https://react.dev/)** - React best practices
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript guide
- **[Vite Documentation](https://vitejs.dev/)** - Vite configuration

---

## 🤝 Contributing

When contributing to this example:

1. **Maintain type safety** - Use TypeScript types throughout
2. **Test auto-save workflow** - Verify versions save and restore correctly
3. **Update documentation** - Keep this README in sync with changes
4. **Follow conventions** - Match existing code style
5. **Test across browsers** - Ensure localStorage compatibility

---

## 📄 License

This example is part of the Beefree SDK Examples repository.

---

## 💡 Tips & Best Practices

### Learning from This Example
- 📖 Read `src/hooks/useBuilder.tsx` to understand SDK initialization
- 🔍 Check `src/api/AutosaveVersionsStore.ts` for storage patterns
- 💾 Examine the `onAutoSave` callback implementation
- 🎨 Review how version history is rendered in `Sidebar.tsx`

### Next Steps for Your Integration
1. **Implement backend storage** - Replace localStorage with database
2. **Add user authentication** - Associate versions with specific users
3. **Build version comparison** - Show diffs between versions
4. **Add manual save** - Complement auto-save with manual save button
5. **Implement version naming** - Allow users to name important versions
6. **Add export/import** - Enable exporting version history

### For Production Applications
- ✅ Never expose API credentials in client code
- ✅ Store versions in a backend database, not localStorage
- ✅ Implement user-based version isolation
- ✅ Add version metadata (user, timestamp, description)
- ✅ Consider compression for version storage efficiency
- ✅ Implement cleanup policies for old versions

---

**Need help?** Check the [Beefree SDK documentation](https://docs.beefree.io/) or [submit a support request](https://devportal.beefree.io/hc/en-us/requests/new).

**Found a bug?** Please report it in the [GitHub repository](https://github.com/BeefreeSDK/beefree-sdk-examples/issues).
