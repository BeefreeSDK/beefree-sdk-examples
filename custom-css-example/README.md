# 🎨 Custom CSS Example - Advanced Theming System

This example demonstrates **advanced interface theming** for the Beefree SDK using a modern **React + TypeScript** architecture. It showcases how to dynamically apply custom CSS themes to transform the entire editor interface.

## ✨ Key Features

### 🎨 **Dynamic Theme System**
- **5 Pre-built Themes**: Default, Dark, High Contrast, and Coral
- **Real-time Theme Switching**: Instant theme application without page reload
- **Theme Persistence**: Remembers selected theme using localStorage
- **CSS Variable Architecture**: Maintainable theme system using CSS custom properties

### 🏗️ **Modern Architecture**
- **React 18 + TypeScript**: Type-safe component architecture
- **Vite**: Lightning-fast development server and build system
- **Custom Hooks**: `useThemeManager` for theme state management
- **Service Layer**: Clean separation of Beefree SDK logic
- **Component Composition**: Modular, reusable components

### 🔐 **Secure Authentication**
- **Server-side Authentication**: Uses shared auth proxy (`secure-auth-example`)
- **Token Management**: Automatic token handling via auth service
- **Environment Variables**: Secure credential management

## 🏗️ Architecture Overview

### **Project Structure**
```
custom-css-example/
├── src/
│   ├── components/           # React components
│   │   ├── App.tsx          # Main application component
│   │   ├── Header.tsx       # Header with theme selector
│   │   ├── BeefreeEditor.tsx # SDK editor wrapper
│   │   ├── ThemeSelector.tsx # Theme dropdown component
│   │   └── Footer.tsx       # Footer component
│   ├── hooks/
│   │   └── useThemeManager.ts # Theme management hook
│   ├── services/
│   │   └── beefree.ts       # Beefree SDK service layer
│   ├── config/
│   │   ├── constants.ts     # Application constants
│   │   └── clientConfig.ts  # Beefree client configuration
│   ├── types/
│   │   └── index.d.ts       # TypeScript type definitions
│   └── styles.css           # Global application styles
├── public/
│   └── themes/              # Theme CSS files
│       ├── theme-default.css
│       ├── theme-dark.css
│       ├── theme-high-contrast.css
│       └── theme-coral.css
├── vite.config.ts           # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

### **Core Components**

#### **🎯 App.tsx** - Main Application
```typescript
export const App = () => {
  const { currentTheme, changeTheme, getThemeUrl } = useThemeManager()

  return (
    <div className="demo-container beefree-container">
      <Header currentTheme={currentTheme} changeTheme={changeTheme} />
      <BeefreeEditor customCss={currentTheme ? getThemeUrl() : undefined} />
      <Footer />
    </div>
  )
}
```

#### **🎨 useThemeManager Hook** - Theme State Management
```typescript
export const useThemeManager = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('')

  const changeTheme = useCallback(async (theme: ThemeType) => {
    setCurrentTheme(theme)
    localStorage.setItem('theme', theme)
    
    if (window.bee && theme) {
      const themeUrl = getThemeUrl(theme)
      await initializeBeefreeSDK({ ...clientConfig, customCss: themeUrl })
    }
  }, [getThemeUrl])

  return { currentTheme, changeTheme, getThemeUrl }
}
```

#### **🔧 Beefree Service** - SDK Integration
```typescript
export const initializeBeefreeSDK = async (clientConfig: IBeeConfig): Promise<void> => {
  const templateData = await loadTemplate()
  const tokenResponse = await authenticate(clientConfig.uid || DEFAULT_CLIENT_CONFIG.uid)
  const token: IToken = await tokenResponse.json()
  const BeePlugin = new BeefreeSDK(token)
  
  window.bee = BeePlugin
  BeePlugin.start(clientConfig, templateData)
}
```

### **Theme System Architecture**

#### **🎨 CSS Variable System**
Each theme uses CSS custom properties for consistent styling:

```css
/* theme-dark.css */
:root {
  --inputs-background-color: #1a1a1a !important;
  --inputs-border-color: #555 !important;
  --inputs-text-color: #ffffff !important;
  --widget-bar-and-active-tab-background-color: #222 !important;
  /* ... more theme variables */
}
```

#### **🔄 Dynamic Theme Loading**
Themes are loaded dynamically via the `customCss` parameter:

```typescript
const themeUrl = `${location.origin}/themes/theme-${theme}.css`
await initializeBeefreeSDK({ ...clientConfig, customCss: themeUrl })
```

#### **💾 Theme Persistence**
Selected themes persist across sessions using localStorage:

```typescript
// Save theme
localStorage.setItem('theme', theme)

// Load theme on app start
const savedTheme = localStorage.getItem('theme') as ThemeType || ''
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 22+ and Yarn
- Beefree SDK credentials
- The `secure-auth-example` server running for authentication

### Option 1: Run from Repository Root (Recommended)

The easiest way to run this example is using the start command from the repository root:

```bash
# From the beefree-sdk-examples root directory
yarn start:custom-css
```

This single command will:
- ✅ Automatically install all dependencies (root, custom-css-example, and secure-auth-example)
- ✅ Start the authentication server (port 3000)
- ✅ Start the custom CSS example (port 8081)

Then open your browser to `http://localhost:8081`

**Before running**, make sure to configure your Beefree SDK credentials in `secure-auth-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

### Option 2: Run Manually (Advanced)

If you prefer to run the example independently, you need to manually start both the authentication server and the custom CSS example:

#### 1. Install Dependencies

First, install dependencies for both the custom-css-example and the secure-auth-example:

```bash
# In the custom-css-example folder
yarn install

# In the secure-auth-example folder
cd ../secure-auth-example
yarn install
cd ../custom-css-example
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

Optionally, configure the custom-css-example:

```bash
cd ../custom-css-example
cp .env.example .env
```

Edit `custom-css-example/.env` if needed:
```env
# Auth proxy URL (points to secure-auth-example)
VITE_BEEFREE_AUTH_PROXY_URL=http://localhost:3000/auth/token

# Template URL for default template
VITE_BEEFREE_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee
```

**Configuration Options:**
- **Direct URL**: Set `VITE_BEEFREE_AUTH_PROXY_URL=http://localhost:3000/auth/token` for direct backend communication
- **Vite Proxy**: Comment out or omit `VITE_BEEFREE_AUTH_PROXY_URL` to use the configured Vite proxy (`/auth/token`)

#### 3. Start Authentication Server

In a separate terminal, start the secure-auth-example server:

```bash
cd ../secure-auth-example
yarn server:dev
```

The auth server should be running on `http://localhost:3000`

#### 4. Start Custom CSS Example

In another terminal, start the custom CSS example:

```bash
cd ../custom-css-example
yarn start
```

Open your browser to `http://localhost:5174`

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

### **Testing Themes**
1. **Start the application**: Open http://localhost:8081
2. **Select a theme**: Use the dropdown in the header
3. **Observe changes**: The editor interface updates immediately
4. **Persistence test**: Refresh the page - theme should be remembered

### **Available Themes**
| Theme | Description | Use Case |
|-------|-------------|----------|
| **Default** | Standard Beefree interface | General use, brand-neutral |
| **Dark** | Dark mode with reduced eye strain | Low-light environments |
| **High Contrast** | Enhanced accessibility | Users with visual impairments |
| **Coral** | Warm, coral-themed interface | Brand-specific styling |

### **Theme Development**
To create a new theme:

1. **Create theme file**: `public/themes/theme-newtheme.css`
2. **Define CSS variables**: Use existing themes as reference
3. **Update TypeScript types**: Add theme to `ThemeType` union
4. **Add to selector**: Update `ThemeSelector.tsx` options

Example new theme:
```css
/* theme-newtheme.css */
:root {
  --inputs-background-color: #f0f8ff !important;
  --inputs-border-color: #4682b4 !important;
  --inputs-text-color: #000080 !important;
  /* ... more variables */
}
```

## 🔧 Technical Implementation

### **React + TypeScript Architecture**

#### **Type Safety**
```typescript
export type ThemeType = 'default' | 'dark' | 'high-contrast' | 'coral' | ''

// Beefree SDK instance interface for proper typing
export interface BeefreeInstance {
  save(): Promise<any>
  load(template: any): Promise<any>
  start(config: any, template?: any): Promise<any>
  destroy(): Promise<any>
}

interface ThemeSelectorProps {
  currentTheme: ThemeType
  onThemeChange: (theme: ThemeType) => void
}

// Global window interface extension
declare global {
  interface Window {
    bee?: BeefreeInstance
  }
}
```

#### **Beefree SDK NPM Integration**
```typescript
import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IToken, IEntityContentJson } from '@beefree.io/sdk/dist/types/bee'
```

#### **Modern Development Stack**
- **Vite**: Fast HMR and optimized builds
- **TypeScript**: Full type safety and IntelliSense
- **React 18**: Modern React with hooks
- **CSS Modules**: Scoped styling

### **Key Technical Features**

#### **🔄 Hot Theme Reloading**
Themes apply instantly without page refresh using the Beefree SDK's `customCss` parameter.

#### **🎯 Type-Safe Configuration**
All Beefree SDK configurations are typed using official SDK types.

#### **🏗️ Service Layer Architecture**
Clean separation between React components and Beefree SDK logic.

#### **🔐 Secure Authentication**
Never exposes credentials in frontend - all auth handled via proxy.

## 🎨 Customization Guide

### **CSS Variable Reference**
Key variables for theming:

```css
/* Background Colors */
--inputs-background-color
--widget-bar-and-active-tab-background-color
--properties-section-title-background

/* Text Colors */
--inputs-text-color
--active-tab-text-and-icon-color
--properties-panel-text-icons-color

/* Border Colors */
--inputs-border-color
--widget-bar-border
--widget-border-bottom-color
```

### **Component Customization**
Modify components in `src/components/` to change:
- Header layout and styling
- Theme selector appearance
- Footer content
- Overall application structure

### **Advanced Theming**
For complex themes:
1. **CSS Preprocessing**: Add Sass/Less for advanced features
2. **Theme Variables**: Create theme configuration objects
3. **Dynamic Imports**: Load themes on-demand for performance
4. **Theme Builder**: Create UI for custom theme creation

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] All themes load correctly
- [ ] Theme changes apply immediately
- [ ] Theme persists after page refresh
- [ ] Editor functionality works with all themes
- [ ] Responsive design works on mobile
- [ ] Accessibility features function properly

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
- `VITE_BEEFREE_AUTH_PROXY_URL`: Production auth endpoint
- `VITE_BEEFREE_TEMPLATE_URL`: Production template URL

### **Performance Considerations**
- Themes are loaded on-demand
- CSS files are minified in production
- Vite provides optimal bundling
- Tree-shaking removes unused code

## 📚 Resources

- **[Beefree SDK Custom CSS Documentation](https://docs.beefree.io/beefree-sdk/)**
- **[CSS Variables Reference](https://docs.beefree.io/beefree-sdk/customization/)**
- **[React + TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)**
- **[Vite Documentation](https://vitejs.dev/)**

## 🤝 Contributing

When contributing to this example:
1. **Follow TypeScript best practices**
2. **Test all themes thoroughly**
3. **Update documentation for new features**
4. **Ensure accessibility compliance**
5. **Maintain backward compatibility**

---

This example demonstrates production-ready theming implementation with modern development practices and comprehensive type safety.