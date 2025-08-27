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

Each example demonstrates production-ready implementation of specific Beefree SDK features:

### 🔐 Authentication & Security
- [**🔐 secure-auth-example**](./secure-auth-example/) - **✅ COMPLETE** - Secure backend authentication with shared auth module

### 🎨 Customization & Styling  
- [**🎨 custom-css-example**](./custom-css-example/) - **✅ COMPLETE** - Advanced theming system with React+TypeScript, 5 themes, and modern architecture

### 📄 Template Management
- [**📄 template-export-pdf-example**](./template-export-pdf-example/) - **✅ COMPLETE** - PDF export with React+TypeScript, advanced options, and progress tracking

### 🔧 Shared Infrastructure
- [**🔧 shared/auth.js**](./shared/) - **✅ COMPLETE** - Reusable authentication module for all examples

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
- **secure-auth-example**: `http://localhost:3000`
- **custom-css-example**: `http://localhost:8081`
- **template-export-pdf-example**: `http://localhost:5174`

### 🔐 Environment Variables

Create a `.env` file in each example directory with the required variables:

#### 🔐 secure-auth-example (Vanilla JS)
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

#### 🎨 custom-css-example (React + TypeScript)
```env
VITE_BEEFREE_AUTH_PROXY_URL=http://localhost:3000/auth/token
VITE_BEEFREE_TEMPLATE_URL=https://rsrc.getbee.io/api/templates/m-bee
```

#### 📄 template-export-pdf-example (React + TypeScript)
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_CS_API_KEY=your_content_services_api_key_here
BEEFREE_CS_API_URL=https://api.getbee.io
PORT=3001
VITE_PORT=5174
```

**🚨 Security**: Never expose Client ID/Secret or API keys in frontend code. Always use server-side only.

## 🎯 Example Status

| Example | Status | Stack | Port | Features |
|---------|--------|-------|------|----------|
| 🔐 **secure-auth-example** | ✅ **Ready** | Vanilla JS | 3000 | Backend auth, shared module, modern UI |
| 🎨 **custom-css-example** | ✅ **Ready** | React+TS | 8081 | 5 themes, modern architecture, type safety |
| 📄 **template-export-pdf-example** | ✅ **Ready** | React+TS | 5174/3001 | PDF export, progress tracking, export history |
| 🔧 **shared/auth.js** | ✅ **Ready** | Node.js | - | Reusable authentication module |

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

#### 🟡 **Vanilla JavaScript** (secure-auth-example)
- **Best for**: Simple integrations, learning, prototyping
- **Stack**: Plain HTML/CSS/JS + Express.js backend
- **Pros**: Easy to understand, minimal setup, direct SDK usage
- **Cons**: No type safety, manual DOM manipulation

#### 🟢 **React + TypeScript** (custom-css-example, template-export-pdf-example)
- **Best for**: Production applications, complex UIs, team development
- **Stack**: React 18 + TypeScript + Vite + Express.js backend
- **Pros**: Type safety, component architecture, modern tooling, scalability
- **Cons**: More complex setup, build step required

## 📚 Documentation & Resources

- **📖 [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)**
- **🔑 [Developer Portal](https://developers.beefree.io)** - Get your credentials here
- **🔧 [API Reference](https://docs.beefree.io/beefree-sdk/apis/)**
- **💬 [Community Support](https://beefree.io/support/)**

## 🎯 Key Features Demonstrated

### 🔐 Security & Authentication
- **Backend-only credential handling**
- **Shared authentication module**
- **Automatic token refresh**
- **Production-ready error handling**

### 🎨 Customization & Theming
- **Multiple theme system** (5 pre-built themes)
- **React + TypeScript architecture** with modern development stack
- **CSS variable architecture** for maintainable theming
- **Theme persistence** with localStorage
- **Container-level customization** (Beefree editor iframe isolation documented)

### 📄 Export & Integration
- **PDF export** via Beefree Content Services API
- **React + TypeScript architecture** with type-safe development
- **Advanced export options** (page size, orientation, quality, scale)
- **Real-time progress tracking** with visual indicators
- **Export history management** with success/failure tracking
- **Template management** with onSave callback integration
- **Auto-download functionality** to browser Downloads folder
- **Modern responsive UI** with accessibility support

## 🤝 Contributing

Each example follows these principles:
- ✅ **Production-ready code** with proper error handling
- ✅ **Comprehensive documentation** with setup instructions
- ✅ **Shared modules** for consistency across examples
- ✅ **Modern development** with clear architecture choices
- ✅ **Security best practices** (server-side credentials only)
- ✅ **Type safety** (React+TypeScript examples with full typing)
- ✅ **Accessibility** (WCAG-compliant UI components)

## 📄 License

These examples are provided for educational and development purposes. Please refer to the [Beefree SDK Terms of Service](https://beefree.io/terms-of-service/) for usage guidelines.

---

**🚀 Ready to start?** Choose an example above and follow its README for detailed setup instructions!
