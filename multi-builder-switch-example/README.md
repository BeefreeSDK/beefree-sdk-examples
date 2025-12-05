# 🏗️ Multi-Builder Switch Example - Dynamic Builder Switching

This example demonstrates **seamless switching between different Beefree builder types** using a modern **React + TypeScript** architecture. It showcases how to dynamically switch between Email, Page, and Popup builders within a single application interface.

## ✨ Key Features

### 🔄 **Dynamic Builder Switching**
- **3 Builder Types**: Email Builder, Page Builder, and Popup Builder
- **Seamless Transitions**: Instant switching without page reload
- **State Management**: Proper cleanup and initialization for each builder type
- **Error Handling**: Graceful handling of switch failures with retry functionality

### 🏗️ **Modern Architecture**
- **React 19 + TypeScript**: Type-safe component architecture
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

### **Form Configuration (Page Builder)**

The Page Builder includes a default form configuration that enables the Form block:

```typescript
export const DEFAULT_FORM_CONFIG = {
  structure: {
    title: 'Contact Form',
    description: 'Get in touch with us',
    fields: {
      name_field: {
        type: 'text',
        label: 'Name',
        canBeRemovedFromLayout: false,
        attributes: { required: true, placeholder: 'Enter your name' }
      },
      email_field: {
        type: 'email',
        label: 'Email',
        canBeRemovedFromLayout: false,
        attributes: { required: true, placeholder: 'Enter your email' }
      },
      message_field: {
        type: 'textarea',
        label: 'Message',
        canBeRemovedFromLayout: true,
        attributes: { placeholder: 'Enter your message', rows: '4' }
      },
      submit_button: {
        type: 'submit',
        label: '',
        canBeRemovedFromLayout: false,
        attributes: { value: 'Submit', name: 'submit_button' }
      }
    },
    layout: [
      ['name_field'],
      ['email_field'],
      ['message_field'],
      ['submit_button']
    ],
    attributes: {
      method: 'post',
      action: '#'
    }
  }
}
```

This form configuration is automatically added to the Page Builder's `IBeeConfig` when initialized, making the Form block available in the Content sidebar.

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
# IMPORTANT: 
# Either builder-specific or default Beefree SDK credentials are required

# Builder-specific Credentials (RECOMMENDED):
# Each builder type requires its own application in the Developer Console
# to show the correct sidebar options (e.g., Form button for Page builder)
# At minimum, provide credentials for the builders you plan to use
EMAIL_CLIENT_ID=your_email_client_id_here
EMAIL_CLIENT_SECRET=your_email_client_secret_here
PAGE_CLIENT_ID=your_page_client_id_here
PAGE_CLIENT_SECRET=your_page_client_secret_here
POPUP_CLIENT_ID=your_popup_client_id_here
POPUP_CLIENT_SECRET=your_popup_client_secret_here

# Default Beefree SDK Credentials (FALLBACK)
# If a single set of shared credentials for all builders is available
# BEEFREE_CLIENT_ID=your_client_id_here
# BEEFREE_CLIENT_SECRET=your_client_secret_here

# Template URLs for different builders
VITE_EMAIL_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee
VITE_PAGE_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee-page
VITE_POPUP_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee-popup

# Default builder type on load
VITE_DEFAULT_BUILDER=email

# Back-End Server Port
PORT=3006

# Front-end Server Port
VITE_PORT=8006
```

**Configuration Options:**
- **Builder-Specific Credentials** (Recommended): Each builder type (Email, Page, Popup) requires its own application in the [Developer Console](https://developers.beefree.io). The builder type is determined by the application configuration, which controls which sidebar options are available (e.g., Form button for Page builder). **You must provide credentials for at least one builder type.** Learn more about creating different application types in the [official documentation](https://docs.beefree.io/beefree-sdk/getting-started/readme/create-an-application).
- **Fallback Credentials** (Optional): If builder-specific credentials are not provided for a builder type, the system will fall back to `EMAIL_CLIENT_ID`/`EMAIL_CLIENT_SECRET` first, then to `BEEFREE_CLIENT_ID`/`BEEFREE_CLIENT_SECRET` if available. However, **builder-specific credentials are strongly recommended** to ensure the correct sidebar options appear for each builder type.
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
| **Page** | 📄 | Landing pages and web content with **Form block support** | Marketing pages, product launches, event pages, lead capture forms |
| **Popup** | 🎯 | Overlay and popup content | Lead capture, announcements, special offers |

### **Form Block Support (Page Builder)**

The Page Builder includes a **default form configuration** that enables the Form block in the Content sidebar. When you switch to Page Builder, you'll see a **Form** button in the sidebar that allows you to add forms with:

- **Name field** (required, text input)
- **Email field** (required, email input)
- **Message field** (optional, textarea)
- **Submit button** (customizable)

Users can toggle fields on/off and customize the form layout. The form configuration is defined in `src/config/constants.ts` and can be customized to match your application's needs.

**Learn more**: [Form Block Integration Documentation](https://docs.beefree.io/beefree-sdk/forms/integrating-and-using-the-form-block/passing-forms-to-the-builder)

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
- **[Content Options Configuration](https://docs.beefree.io/beefree-sdk/server-side-configurations/server-side-options/content-options)** - Learn how to configure content blocks (HTML, Menu, Title, List, Paragraph, Video, Icons, Spacer, Table) and understand the differences between Email and Page Builder content options. The Form block is available for Page Builder applications.
- **[Form Block Integration](https://docs.beefree.io/beefree-sdk/forms/integrating-and-using-the-form-block/passing-forms-to-the-builder)** - Comprehensive guide on integrating and using the Form block in your Page Builder application, including how to pass forms to the builder and configure form fields.
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
