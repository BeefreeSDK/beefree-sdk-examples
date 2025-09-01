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
- [**🔐 secure-auth-example**](./secure-auth-example/) - **✅ COMPLETE**
  - **Enterprise-grade authentication** with automatic token refresh
  - **Full-stack TypeScript** architecture with React + TypeScript Express.js server
  - **Backend security** with credential isolation
  - **Production-ready error handling** and state management
  - **🔍 API Monitor Panel** - Real-time API debugging with request/response inspection

### 🎨 **Interface Customization**
- [**🎨 custom-css-example**](./custom-css-example/) - **✅ COMPLETE**
  - **Dynamic theming system** with 5 pre-built themes
  - **Real-time theme switching** with localStorage persistence
  - **CSS variable architecture** for maintainable styling
  - **React + TypeScript** with modern development stack

### 📄 **Content Export & Integration**
- [**📄 template-export-pdf-example**](./template-export-pdf-example/) - **✅ COMPLETE**
  - **Advanced PDF export** via Beefree Content Services API
  - **Multiple export options** (page size, orientation, quality)
  - **Real-time progress tracking** with visual indicators
  - **Export history management** with direct PDF access

### 🔧 **Shared Infrastructure**
- [**🔧 shared/auth.js**](./shared/) - **✅ COMPLETE**
  - **Reusable authentication module** for consistency
  - **JWT token management** with security best practices
  - **Shared across all examples** for unified auth experience

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

1. **Clone repository**:
```bash
git clone <repository-url>
cd beefree-sdk-examples
```

2. **Choose an example**:
```bash
# Secure Authentication
cd secure-auth-example

# OR Custom CSS Theming
cd custom-css-example

# OR PDF Export
cd template-export-pdf-example
```

3. **Install & configure**:
```bash
npm install
cp .env.example .env
# Edit .env with your Beefree SDK credentials
```

4. **Run example**:
```bash
npm start
# OR for React examples
yarn dev
```

5. **Open in browser**:
- **secure-auth-example**: `http://localhost:8080` (frontend) + `http://localhost:3000` (backend)
- **custom-css-example**: `http://localhost:8081` (requires secure-auth-example running)
- **template-export-pdf-example**: `http://localhost:5174` (frontend) + `http://localhost:3001` (backend)

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

| Example | Status | Stack | Ports | Key Features |
|---------|--------|-------|-------|--------------|
| 🔐 **secure-auth-example** | ✅ **Ready** | React+TS+TS Server | 8080/3000 | Enterprise auth, API monitor, token refresh, full-stack TypeScript |
| 🎨 **custom-css-example** | ✅ **Ready** | React+TS | 8081 | Dynamic themes, CSS variables, real-time switching |
| 📄 **template-export-pdf-example** | ✅ **Ready** | React+TS | 5174/3001 | PDF export, progress tracking, export history |
| 🔧 **shared/auth.js** | ✅ **Ready** | Node.js | - | JWT tokens, security best practices, reusable |

## 🏗️ Architecture

### Shared Authentication
All examples use the **shared authentication module** (`shared/auth.js`) for:
- ✅ Consistent token management
- ✅ Automatic token refresh
- ✅ Error handling
- ✅ Security best practices

### Example Structure
```
beefree-sdk-examples/
├── shared/
│   └── auth.js                    # 🔧 Shared authentication module
├── secure-auth-example/           # 🔐 Vanilla JS - Production-ready secure auth
├── custom-css-example/            # 🎨 React+TS - Advanced theming system
├── template-export-pdf-example/   # 📄 React+TS - PDF export with progress tracking
└── README.md                     # 📖 This file
```

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
