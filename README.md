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

### � **Collaboration & Commenting**
- [**� commenting**](./commenting/) - **✅ COMPLETE**
  - **Real-time commenting system** with toast notifications
  - **Collaborative editing** with Beefree SDK commenting features
  - **React + TypeScript** with modern development stack
  - **Shared authentication** via secure-auth-example server
  - **Start command**: `npm run start:commenting` (from root)

### 🎨 **Interface Customization**
- [**🎨 custom-css-example**](./custom-css-example/) - **✅ COMPLETE**
  - **Dynamic theming system** with 5 pre-built themes
  - **Real-time theme switching** with localStorage persistence
  - **CSS variable architecture** for maintainable styling
  - **React + TypeScript** with modern development stack
  - **Shared authentication** via secure-auth-example server
  - **Start command**: `npm run start:custom-css` (from root)

### 📄 **Content Export & Integration**
- [**📄 template-export-pdf-example**](./template-export-pdf-example/) - **✅ COMPLETE**
  - **Advanced PDF export** via Beefree Content Services API
  - **Multiple export options** (page size, orientation, quality)
  - **Real-time progress tracking** with visual indicators
  - **Export history management** with direct PDF access
  - **Standalone server** with its own authentication

### 🔐 **Authentication & Security**
- [**� secure-auth-example**](./secure-auth-example/) - **✅ COMPLETE**
  - **Enterprise-grade authentication server** with automatic token refresh
  - **TypeScript Express.js server** for backend security
  - **Shared by**: commenting and custom-css-example
  - **JWT token management** with security best practices
  - **Production-ready error handling** and state management

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

### ⚡ Fast Setup (All-in-One Commands)

The easiest way to run the examples is using the root-level start commands that handle all dependencies automatically:

#### 💬 Commenting Example
```bash
# From the root of the repository
npm install                  # Install root dependencies
cd secure-auth-example && npm install && cd ..  # Install auth server dependencies
cd commenting && npm install && cd ..            # Install commenting dependencies

# Configure authentication (one-time setup)
cd secure-auth-example
cp .env.example .env
# Edit .env with your Beefree SDK credentials
cd ..

# Start both commenting app and auth server together
npm run start:commenting
```

Opens at: `http://localhost:5173` (commenting) + `http://localhost:3000` (auth server)

#### 🎨 Custom CSS Example
```bash
# From the root of the repository
npm install                  # Install root dependencies
cd secure-auth-example && npm install && cd ..  # Install auth server dependencies
cd custom-css-example && npm install && cd ..    # Install custom-css dependencies

# Configure authentication (one-time setup)
cd secure-auth-example
cp .env.example .env
# Edit .env with your Beefree SDK credentials
cd ..

# Start both custom-css app and auth server together
npm run start:custom-css
```

Opens at: `http://localhost:5174` (custom-css) + `http://localhost:3000` (auth server)

#### 📄 PDF Export Example
```bash
# From the root of the repository
cd template-export-pdf-example
npm install
cp .env.example .env
# Edit .env with your Beefree SDK credentials

# Start both frontend and backend
npm run dev        # Frontend on http://localhost:5174
npm run server:dev # Backend on http://localhost:3001 (in separate terminal)
```

### 🔧 Manual Setup (Individual Examples)

If you prefer to run examples individually or work on a single project:

1. **Clone repository**:
```bash
git clone <repository-url>
cd beefree-sdk-examples
```

2. **Choose an example**:
```bash
cd secure-auth-example
# OR cd custom-css-example
# OR cd commenting
# OR cd template-export-pdf-example
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
# OR
yarn dev
```

**Note**: `commenting` and `custom-css-example` require the `secure-auth-example` server to be running. Use the root-level start commands for convenience.

### 🔐 Environment Variables

#### 🔐 secure-auth-example (Required for commenting and custom-css)
```env
# Beefree SDK Credentials (Backend Only)
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Used by**: `commenting`, `custom-css-example` (via auth proxy)

#### 📄 template-export-pdf-example
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

**Note**: `commenting` and `custom-css-example` don't need their own `.env` files - they automatically connect to the `secure-auth-example` auth server.

## 🎯 Example Status

| Example | Status | Stack | Ports | Start Command | Key Features |
|---------|--------|-------|-------|---------------|--------------|
| � **commenting** | ✅ **Ready** | React+TS | 5173 | `npm run start:commenting` | Real-time comments, toast notifications |
| 🎨 **custom-css-example** | ✅ **Ready** | React+TS | 5174 | `npm run start:custom-css` | Dynamic themes, CSS variables, real-time switching |
| 🔐 **secure-auth-example** | ✅ **Ready** | TS Server | 3000 | Used by above examples | Enterprise auth, token refresh, JWT management |
| 📄 **template-export-pdf-example** | ✅ **Ready** | React+TS | 5174/3001 | Individual setup | PDF export, progress tracking, export history |
| 🔧 **shared/auth.js** | ✅ **Ready** | Node.js | - | - | JWT tokens, security best practices, reusable |

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
├── .eslintrc.cjs                  # 🔧 Shared ESLint configuration
├── package.json                   # 🚀 Root scripts (start:commenting, start:custom-css)
├── shared/
│   └── auth.js                    # 🔧 Shared authentication module
├── commenting/                    # � React+TS - Real-time commenting
├── custom-css-example/            # 🎨 React+TS - Advanced theming system
├── secure-auth-example/           # 🔐 TS Server - Auth server for commenting & custom-css
├── template-export-pdf-example/   # 📄 React+TS - PDF export with progress tracking
└── README.md                      # 📖 This file
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

## 🔧 Development Tools

### ESLint Configuration

All examples share a single ESLint configuration located at the root of the monorepo (`.eslintrc.cjs`). This ensures consistent code quality across all projects.

#### Running ESLint

```bash
# From the root of the repository
npm install          # Install ESLint dependencies once at root level
npm run lint         # Check all projects for linting issues
npm run lint:fix     # Automatically fix linting issues
```

#### How It Works

- **Single Configuration**: `.eslintrc.cjs` at the root applies to all subfolders
- **Centralized Dependencies**: ESLint and plugins installed only in root `package.json`
- **No Duplication**: No need to copy configs or install dependencies in each project
- **Project Independence**: Individual projects can still be copied and will work with their own dependencies for building/running

**Note**: When copying an individual project folder to work independently, you may want to copy the root `.eslintrc.cjs` to that project and add ESLint dependencies to that project's `package.json` if you need linting outside of this monorepo.

## 🤝 Contributing

Each example follows these principles:
- ✅ **Production-Ready Code**: Comprehensive error handling and edge case management
- ✅ **Type Safety**: Full TypeScript implementation with official Beefree SDK types
- ✅ **Modern Architecture**: React 18 + TypeScript + Vite + Express.js stack
- ✅ **Security Best Practices**: Backend-only credentials, secure token management
- ✅ **Comprehensive Documentation**: Detailed setup and usage instructions
- ✅ **Shared Infrastructure**: Consistent authentication and patterns across examples
- ✅ **Code Quality**: Shared ESLint configuration for consistent linting rules
- ✅ **Accessibility**: WCAG-compliant UI components and keyboard navigation
- ✅ **Performance**: Optimized builds, lazy loading, and efficient state management

## 📄 License

These examples are provided for educational and development purposes. Please refer to the [Beefree SDK Terms of Service](https://beefree.io/terms-of-service/) for usage guidelines.

---

**🚀 Ready to start?** Choose an example above and follow its README for detailed setup instructions!
