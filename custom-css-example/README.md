# 🎨 Custom CSS Example (React + TypeScript)

Demonstrates **advanced interface theming** for Beefree SDK with multiple theme systems, modern React architecture, and container-level customization.

## 📖 Documentation Reference
- [Configuration Parameters](https://docs.beefree.io/configuration-parameters/)
- [Customization Guide](https://docs.beefree.io/beefree-sdk/visual-builders/email-builder)

## 🎯 What This Example Shows
- ✅ **Container interface theming** (host application styling)
- ✅ **Multiple theme system** with instant switching
- ✅ **React + TypeScript architecture** with hooks and components
- ✅ **Theme persistence** with localStorage
- ✅ **Modern responsive design** with Vite development
- ⚠️ **Beefree SDK limitation documentation** (editor iframe isolation)

## 🚀 Key Features
- **🎨 Theme System**: Multiple pre-built themes with instant switching
- **🖌️ Custom Colors**: CSS custom properties for easy color customization
- **📱 Responsive Design**: Mobile-friendly interface with breakpoints
- **♿ Accessibility**: High contrast mode and keyboard navigation
- **🔧 Deep Customization**: Advanced CSS selectors for granular control
- **⚛️ React + TypeScript**: Modern architecture with type safety
- **⚡ Vite Powered**: Lightning-fast development with HMR

## 📁 Project Structure
```
custom-css-example/
├── src/
│   ├── components/
│   │   ├── App.tsx           # Main React app component
│   │   ├── ThemeSelector.tsx # Theme selection dropdown
│   │   ├── BeefreeEditor.tsx # Beefree SDK integration
│   │   └── FeatureShowcase.tsx # Feature cards display
│   ├── hooks/
│   │   └── useThemeManager.ts # Custom hook for theme logic
│   ├── services/
│   │   └── beefree.ts        # Beefree SDK service layer
│   ├── config/
│   │   └── clientConfig.ts   # Configuration constants
│   ├── types/
│   │   └── beefree.d.ts      # TypeScript definitions
│   ├── styles.css            # Base styles and theme variables
│   └── main.tsx              # React entry point
├── public/
│   ├── themes/               # Theme CSS files
│   │   ├── theme-default.css
│   │   ├── theme-dark.css
│   │   ├── theme-coral.css
│   │   └── theme-high-contrast.css
│   └── images/               # Static assets
├── index.html                # HTML entry point
├── vite.config.ts            # Vite + React configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🛠️ Quick Start

1. **Install dependencies**:
```bash
yarn install
```

2. **Configure credentials**:
Create a `.env` file with your Beefree SDK credentials:
```bash
# Required: Get your credentials from https://developers.beefree.io
VITE_BEEFREE_AUTH_PROXY_URL=your_auth_server_url
VITE_BEEFREE_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee
```

3. **Start the development server**:
```bash
yarn dev
```

4. **Open in browser**:
```
http://localhost:8081
```

## 🚀 Available Scripts

```bash
yarn dev        # Start development server with HMR
yarn build      # Build for production
yarn preview    # Preview production build
yarn type-check # Check TypeScript without emitting
```

## 🎨 Theme System

### Available Themes
| Theme | Colors | Description |
|-------|--------|-------------|
| **Default** | Blue/White | Clean, minimal design |
| **Dark** | Dark/Purple | Modern dark mode |
| **Coral** | Coral/Orange | Warm coral theme |
| **High Contrast** | Black/White/Yellow | Maximum accessibility contrast |

### Theme Features
- **🔄 Instant Switching**: Change themes without page reload via React hooks
- **💾 Persistence**: Theme choice saved to localStorage
- **🎯 CSS Variables**: Clean, maintainable theming system
- **⚛️ React Integration**: Theme state managed with custom hooks

## ⚛️ React + TypeScript Architecture

### Modern Stack
- **React 18**: Latest React with hooks and functional components
- **TypeScript**: Full type safety with strict configuration  
- **Vite**: Lightning-fast development and optimized builds
- **Custom Hooks**: `useThemeManager` for theme state management
- **Component Architecture**: Modular, reusable UI components

### Benefits
- **Type Safety**: Compile-time error checking prevents runtime issues
- **Developer Experience**: IntelliSense, auto-completion, and refactoring
- **Performance**: React's virtual DOM + Vite's HMR for fast development
- **Maintainability**: Clear component boundaries and typed interfaces
- **Scalability**: Easy to extend with new themes and components

## ⚠️ Important Limitation

**Beefree SDK Editor Isolation**: The internal email editor runs in an isolated iframe and **cannot be styled** with external CSS. This is a Beefree SDK architectural limitation.

### What CAN Be Themed
- ✅ **Host container** (outer interface)
- ✅ **Control panels** (theme selector, buttons)
- ✅ **Status bars** and loading states
- ✅ **Feature showcase** section

### What CANNOT Be Themed
- ❌ **Editor iframe** (email builder interface)
- ❌ **Toolbar inside editor**
- ❌ **Property panels inside editor**
- ❌ **Editor workspace**

## 🧪 Testing

1. **Theme Switching**: Use dropdown to test all 4 themes
2. **React Components**: Verify hot module replacement works
3. **TypeScript**: Check type safety and IntelliSense
4. **Persistence**: Reload page to verify theme persistence
5. **Responsive**: Test on different screen sizes
6. **Editor Loading**: Verify Beefree SDK loads in themed container

## 🔧 Customization Guide

### Adding New Themes
1. **Create CSS file**: Add new theme in `public/themes/theme-{name}.css`
2. **Define CSS Variables**: Set colors and styling for your theme
3. **Update ThemeSelector**: Add theme option to `src/components/ThemeSelector.tsx`
4. **Update Hook**: Add theme type to `src/hooks/useThemeManager.ts`

### CSS Architecture
```css
/* CSS Variables for easy theming */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --background-color: #ffffff;
  --surface-color: #f8f9fa;
  --text-color: #333333;
  --border-color: #dee2e6;
}
```

## 🌟 Production Notes

- **React Architecture**: Component-based structure for maintainability
- **TypeScript Safety**: Compile-time error checking and IntelliSense
- **Theme System**: Easily extensible for brand customization
- **Performance**: CSS variables + React hooks for efficient updates
- **Accessibility**: High contrast themes with WCAG compliance
- **Build Optimization**: Vite provides optimized production builds
- **Developer Experience**: Hot module replacement and fast development
