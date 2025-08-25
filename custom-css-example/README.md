# 🎨 Custom CSS Example

Demonstrates **advanced interface theming** for Beefree SDK with multiple theme systems, shared authentication, and container-level customization.

## 📖 Documentation Reference
- [Configuration Parameters](https://docs.beefree.io/configuration-parameters/)
- [Customization Guide](https://docs.beefree.io/beefree-sdk/visual-builders/email-builder)

## 🎯 What This Example Shows
- ✅ **Container interface theming** (host application styling)
- ✅ **Multiple theme system** with instant switching
- ✅ **Shared authentication module** (`../shared/auth.js`)
- ✅ **Theme persistence** with localStorage
- ✅ **Modern responsive design**
- ⚠️ **Beefree SDK limitation documentation** (editor iframe isolation)

## 🚀 Key Features
- **🌈 5 Pre-built Themes**: Light, Dark, Ocean, Sunset, Forest
- **🎨 Dynamic Theme Switching**: Instant theme changes with persistence
- **🔒 Secure Authentication**: Backend token management via shared module
- **📱 Responsive Design**: Mobile-friendly interface with breakpoints
- **💾 Theme Persistence**: User preferences saved to localStorage
- **🎯 Educational Footer**: Feature showcase with documentation

## 📁 Project Structure
```
custom-css-example/
├── server.js           # Express.js backend with /auth endpoint
├── index.html          # Themed frontend with feature showcase
├── app.js             # Beefree SDK integration + theme management
├── theme-manager.js   # Advanced theme system with 5 themes
├── styles.css         # Base styles and theme variables
├── .env               # Your Beefree SDK credentials
├── .env.example       # Environment variables template
├── package.json       # Dependencies and scripts
└── README.md          # This file

../shared/
└── auth.js            # Shared authentication module
```

## 🛠️ Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Configure credentials**:
```bash
cp .env.example .env
# Edit .env with your Beefree SDK credentials from https://developers.beefree.io
```

3. **Start the server**:
```bash
npm start
```

4. **Open in browser**:
```
http://localhost:8081
```

## 🎨 Theme System

### Available Themes
| Theme | Colors | Description |
|-------|--------|-------------|
| **Light** | Blue/White | Clean, minimal design |
| **Dark** | Dark/Purple | Modern dark mode |
| **Ocean** | Blue/Teal | Ocean-inspired palette |
| **Sunset** | Orange/Pink | Warm sunset colors |
| **Forest** | Green/Brown | Nature-inspired theme |

### Theme Features
- **🔄 Instant Switching**: Change themes without page reload
- **💾 Persistence**: Theme choice saved to localStorage
- **🎯 CSS Variables**: Clean, maintainable theming system
- **📱 Responsive**: All themes work across device sizes

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

1. **Theme Switching**: Use dropdown to test all 5 themes
2. **Authentication**: Click "Load Email Builder" for secure auth
3. **Persistence**: Reload page to verify theme persistence
4. **Responsive**: Test on different screen sizes
5. **Editor Loading**: Verify Beefree SDK loads in themed container

## 🔧 Customization Guide

### Adding New Themes
1. **Edit `theme-manager.js`**: Add theme to `this.themes` object
2. **Define CSS Variables**: Set colors for your theme
3. **Update Dropdown**: Theme automatically appears in selector

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

- **Theme System**: Easily extensible for brand customization
- **Performance**: CSS variables enable efficient theme switching
- **Accessibility**: High contrast themes support accessibility needs
- **Scalability**: Shared auth module enables consistent authentication
- **Documentation**: Feature showcase educates users on capabilities
