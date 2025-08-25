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
- [**🎨 custom-css-example**](./custom-css-example/) - **✅ COMPLETE** - Advanced theming system with 5 themes and container customization

### 📄 Template Management
- [**📄 template-export-pdf-example**](./template-export-pdf-example/) - **✅ COMPLETE** - Export templates to PDF using Beefree Content Services API with auto-download

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
```

### 🔐 Environment Variables

Create a `.env` file in each example directory with the required variables:

#### 🔐 secure-auth-example & 🎨 custom-css-example
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000  # or 8081 for custom-css-example
```

#### 📄 template-export-pdf-example
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_CS_API_KEY=your_content_services_api_key_here
BEEFREE_CS_API_URL=https://api.getbee.io
PORT=3001
```

**🚨 Security**: Never expose Client ID/Secret or API keys in frontend code. Always use server-side only.

## 🎯 Example Status

| Example | Status | Port | Features |
|---------|--------|------|----------|
| 🔐 **secure-auth-example** | ✅ **Ready** | 3000 | Backend auth, shared module, modern UI |
| 🎨 **custom-css-example** | ✅ **Ready** | 8081 | 5 themes, persistence, responsive design |
| 📄 **template-export-pdf-example** | ✅ **Ready** | 3001 | PDF export via CSAPI |
| 🔧 **shared/auth.js** | ✅ **Ready** | - | Reusable authentication module |

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
│   └── auth.js              # 🔧 Shared authentication module
├── secure-auth-example/     # 🔐 Production-ready secure auth
├── custom-css-example/      # 🎨 Advanced theming system
├── template-export-pdf-example/  # 📄 PDF export functionality
└── README.md               # 📖 This file
```

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
- **CSS variable architecture**
- **Theme persistence** with localStorage
- **Container-level customization** (Beefree editor iframe isolation documented)

### 📄 Export & Integration
- **PDF export** via Beefree Content Services API
- **Template management** with onSave callback integration
- **Auto-download functionality** to browser Downloads folder
- **Export options** (page size, orientation, quality, scale)
- **Modern responsive UI**

## 🤝 Contributing

Each example follows these principles:
- ✅ **Production-ready code** with proper error handling
- ✅ **Comprehensive documentation** with setup instructions
- ✅ **Shared modules** for consistency across examples
- ✅ **Modern JavaScript** (ES6+) with clear comments
- ✅ **Security best practices** (server-side credentials only)

## 📄 License

These examples are provided for educational and development purposes. Please refer to the [Beefree SDK Terms of Service](https://beefree.io/terms-of-service/) for usage guidelines.

---

**🚀 Ready to start?** Choose an example above and follow its README for detailed setup instructions!
