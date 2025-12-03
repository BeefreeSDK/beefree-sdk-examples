# 🏗️ Multi-Builder Switch Example - Dynamic Builder Switching

This example demonstrates **seamless switching between different Beefree builder types** using a modern **React + TypeScript** architecture. It showcases how to dynamically switch between Email, Page, and Popup builders within a single application interface.

## ✨ Key Features

### 🔄 **Dynamic Builder Switching**
- **3 Builder Types**: Email Builder, Page Builder, and Popup Builder
- **Seamless Transitions**: Instant switching without page reload
- **State Management**: Proper cleanup and initialization for each builder type
- **Error Handling**: Graceful handling of switch failures with retry functionality

### 🏗️ **Modern Architecture**
- **React 18 + TypeScript**: Type-safe component architecture
- **Vite**: Lightning-fast development server and build system
- **Custom Hooks**: `useBuilderManager` for centralized state management
- **Service Layer**: Clean separation of Beefree SDK and authentication logic
- **Component Composition**: Modular, reusable UI components

### 🔐 **Secure Authentication**
- **Self-Contained Authentication**: Includes its own local Node.js/Express authentication server
- **Builder-specific Tokens**: Different client credentials for each builder type
- **Automatic Token Management**: Fresh tokens for each builder switch
- **Environment Variables**: Secure credential management

## 🏗️ Architecture Overview

### **Project Structure**
```
multi-builder-switch-example/
├── src/
│   ├── components/           # React components
│   │   ├── App.tsx          # Main application component
│   │   ├── Header.tsx       # Header with builder selector
│   │   ├── BuilderSelector.tsx # Builder type selector
│   │   └── BeefreeEditor.tsx   # Dynamic editor container
│   ├── hooks/
│   │   └── useBuilderManager.ts # Builder state management
│   ├── services/
│   │   ├── beefreeMultiService.ts # Multi-builder SDK service
│   │   └── authService.ts       # Authentication service
│   ├── config/
│   │   └── constants.ts         # Application constants and configs
│   ├── types/
│   │   └── index.d.ts          # TypeScript type definitions
│   └── styles.css              # Global application styles
├── server.ts                 # Local authentication server
├── vite.config.ts              # Vite configuration (port 8006)
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

### **Core Components**

#### **🎯 App.tsx** - Main Application
```typescript
export const App = () => {
  const {
    currentBuilder,
    isTransitioning,
    isInitialized,
    error,
    token,
    switchBuilder,
    retry
  } = useBuilderManager(DEFAULT_UID)

  return (
    <div className="app-container">
      <Header
        currentBuilder={currentBuilder}
        onBuilderChange={switchBuilder}
        isTransitioning={isTransitioning}
        uid={DEFAULT_UID}
      />
      <main className="app-main">
        {token && (
          <BeefreeEditor
            builderType={currentBuilder}
            token={token}
            uid={DEFAULT_UID}
          />
        )}
      </main>
    </div>
  )
}
```

#### **🔄 useBuilderManager Hook** - State Management
```typescript
export const useBuilderManager = (uid: string) => {
  const [builderState, setBuilderState] = useState<BuilderState>({
    currentBuilder: DEFAULT_BUILDER,
    isTransitioning: false,
    isInitialized: false
  })

  const switchBuilder = useCallback(async (newBuilderType: BuilderType) => {
    setBuilderState(prev => ({ ...prev, isTransitioning: true }))
    
    // Get fresh token for new builder type
    const authToken = await authService.authenticateUser(uid, newBuilderType)
    
    // Switch to new builder
    await beefreeService.switchBuilder(authToken, uid, newBuilderType)
    
    setBuilderState(prev => ({
      ...prev,
      currentBuilder: newBuilderType,
      isTransitioning: false,
      isInitialized: true
    }))
  }, [uid])

  return { ...builderState, switchBuilder, retry }
}
```

#### **🔧 BeefreeMultiService** - Multi-Builder Management
```typescript
export class BeefreeMultiService {
  async switchBuilder(
    token: IToken,
    uid: string,
    newBuilderType: BuilderType
  ): Promise<BeefreeInstance> {
    // Destroy current instance
    if (this.beeInstance) {
      await this.destroyBuilder()
    }

    // Load template for new builder type
    const templateData = await this.loadTemplate(newBuilderType)
    
    // Get builder-specific configuration
    const clientConfig = this.getBuilderConfig(newBuilderType, uid)
    
    // Initialize new builder
    this.beeInstance = new BeefreeSDK(token)
    window.bee = this.beeInstance
    await this.beeInstance.start(clientConfig, templateData)
    
    return this.beeInstance
  }
}
```

### **Builder Type Configuration**

Each builder type has its own configuration:

```typescript
export const BUILDER_CONFIGS: Record<BuilderType, BuilderConfig> = {
  email: {
    type: 'email',
    label: 'Email Builder',
    icon: '📧',
    templateUrl: 'https://rsrc.getbee.io/api/templates/m-bee',
    description: 'Create responsive email campaigns'
  },
  page: {
    type: 'page',
    label: 'Page Builder',
    icon: '📄',
    templateUrl: 'https://rsrc.getbee.io/api/templates/m-bee-page',
    description: 'Design stunning landing pages'
  },
  popup: {
    type: 'popup',
    label: 'Popup Builder',
    icon: '🎯',
    templateUrl: 'https://rsrc.getbee.io/api/templates/m-bee-popup',
    description: 'Build engaging popups'
  }
}
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+

### **Installation**

**Step 1: Install dependencies**
```bash
yarn install
```

**Step 2: Configure Environment**
```bash
cp .env.example .env
```

### **Environment Configuration**
Edit `.env` file with your Beefree SDK credentials:

```env
# Beefree SDK Credentials
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# Optional: Builder-specific Client IDs (if different per builder type)
VITE_EMAIL_CLIENT_ID=your_email_client_id_here
VITE_PAGE_CLIENT_ID=your_page_client_id_here  
VITE_POPUP_CLIENT_ID=your_popup_client_id_here

# Template URLs for different builders
VITE_EMAIL_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee
VITE_PAGE_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee-page
VITE_POPUP_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee-popup

# Default builder type on load
VITE_DEFAULT_BUILDER=email
```

**Configuration Options:**
- **Shared Credentials**: Omit builder-specific client IDs to use shared credentials
- **Individual Credentials**: Set specific client IDs for each builder type
- **Template URLs**: Customize template URLs for each builder type
- **Default Builder**: Set which builder loads first

### **Development**

```bash
# Start both server and client concurrently
yarn start

# Or run independently:
yarn server:dev
yarn dev
```

### **Open in browser**
- **Frontend**: http://localhost:8006

## 🎯 Usage Guide

### **Switching Between Builders**
1. **Start the application**: Open http://localhost:8006
2. **Choose builder type**: Click on Email 📧, Page 📄, or Popup 🎯 buttons
3. **Watch transition**: The interface smoothly transitions between builder types
4. **Observe changes**: Each builder loads its specific template and configuration

### **Builder Types**

| Builder | Icon | Description | Use Case |
|---------|------|-------------|----------|
| **Email** | 📧 | Responsive email campaigns | Newsletters, promotional emails, transactional emails |
| **Page** | 📄 | Landing pages and web content | Marketing pages, product launches, event pages |
| **Popup** | 🎯 | Overlay and popup content | Lead capture, announcements, special offers |

### **Features Demonstrated**
- **Instant Switching**: No page reload required
- **State Management**: Proper cleanup and initialization
- **Error Recovery**: Retry functionality for failed switches
- **Loading States**: Visual feedback during transitions
- **Type Safety**: Full TypeScript support for all builder types

## 🔧 Technical Implementation

### **React + TypeScript Architecture**

#### **Type Safety**
```typescript
export type BuilderType = 'email' | 'page' | 'popup'

export interface BuilderState {
  currentBuilder: BuilderType
  isTransitioning: boolean
  isInitialized: boolean
  error?: string
}

export interface BeefreeInstance {
  save(): Promise<any>
  load(template: any): Promise<any>
  start(config: any, template?: any): Promise<any>
  destroy(): Promise<any>
}
```

#### **Service Layer Architecture**
- **BeefreeMultiService**: Handles SDK lifecycle for multiple builders
- **AuthService**: Manages authentication for different builder types
- **Clean Separation**: Business logic separated from UI components

#### **Custom Hook Pattern**
- **useBuilderManager**: Centralized state management for all builder operations
- **Reactive Updates**: Automatic UI updates based on builder state changes
- **Error Boundaries**: Proper error handling and recovery mechanisms

### **Builder Switching Process**

1. **User Selection**: User clicks on a different builder type
2. **State Update**: `isTransitioning` set to `true`, UI shows loading state
3. **Authentication**: Fresh token requested for new builder type
4. **Cleanup**: Current builder instance destroyed properly
5. **Template Loading**: New template loaded for selected builder type
6. **Initialization**: New SDK instance created and started
7. **State Update**: `isTransitioning` set to `false`, UI shows new builder

### **Error Handling**
- **Network Errors**: Retry mechanism for failed authentication or template loading
- **SDK Errors**: Graceful handling of SDK initialization failures
- **State Recovery**: Ability to retry operations without full page reload
- **User Feedback**: Clear error messages and recovery options

## 🎨 Customization Guide

### **Adding New Builder Types**
1. **Update Types**: Add new builder type to `BuilderType` union
2. **Add Configuration**: Add new builder config to `BUILDER_CONFIGS`
3. **Template URL**: Add environment variable for new template URL
4. **Test Integration**: Ensure proper switching and initialization

### **UI Customization**
Modify components in `src/components/` to customize:
- Builder selector appearance and layout
- Header design and branding
- Editor container styling
- Loading and error states

### **Service Extension**
Extend services to add:
- Custom authentication flows
- Builder-specific configurations
- Advanced error handling
- Performance optimizations

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Email builder loads correctly on initial load
- [ ] Switching to Page builder works smoothly
- [ ] Switching to Popup builder works smoothly
- [ ] Error states display properly with retry functionality
- [ ] Loading states show during transitions
- [ ] All builder types can be accessed from any starting point
- [ ] Authentication works for each builder type
- [ ] Templates load correctly for each builder type

### **Browser Compatibility**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Production Deployment

### **Environment Variables**
```env
# Production environment
NODE_ENV=production

# Auth proxy URL
VITE_BEEFREE_AUTH_PROXY_URL=/auth/token

# Production template URLs
VITE_EMAIL_TEMPLATE_URL=https://your-templates.com/email
VITE_PAGE_TEMPLATE_URL=https://your-templates.com/page
VITE_POPUP_TEMPLATE_URL=https://your-templates.com/popup
```

### **Build Process**
```bash
# Build for production
yarn build

# Serve from dist/ directory
# Static files optimized and minified
```

### **Performance Considerations**
- **Lazy Loading**: Templates loaded only when builder is activated
- **Instance Cleanup**: Proper memory management during builder switches
- **Error Boundaries**: Prevent cascading failures
- **Optimized Builds**: Vite provides optimal bundling and tree-shaking

## 📚 Resources

- **[Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)**
- **[Multi-Builder Configuration Guide](https://docs.beefree.io/beefree-sdk/builders/)**
- **[React + TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)**
- **[Vite Documentation](https://vitejs.dev/)**

## 🤝 Contributing

When contributing to this example:
1. **Follow TypeScript best practices**
2. **Test all builder types thoroughly**
3. **Update documentation for new features**
4. **Ensure proper error handling**
5. **Maintain backward compatibility**

## 🔗 Integration with Other Examples

This example integrates with:
- **shared/auth.js**: Leverages shared authentication logic
- **Future examples**: Can be extended to support additional builder types

---

This example demonstrates advanced multi-builder management with modern development practices, comprehensive error handling, and production-ready architecture.
