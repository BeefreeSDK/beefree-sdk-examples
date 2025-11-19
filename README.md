# 🚀 Beefree SDK Examples

This repository contains **production-ready examples** demonstrating how to integrate the [Beefree SDK](https://docs.beefree.io/beefree-sdk/) into your applications. Each example is a self-contained project showcasing specific features and use cases.

## 📖 About Beefree SDK

Beefree SDK is an embeddable no-code builder that gives your end users the freedom to design stunning emails, landing pages, and popups—without writing a single line of code. It's easy to configure, intuitive to personalize, and built to scale with your needs.



### 🌟 Key Capabilities

- **📧 Email Builder**: Drag-and-drop email creation with industry best practices
- **🌐 Page Builder**: Landing page creation tools
- **🎯 Popup Builder**: Attention-grabbing popup designer
- **🤖 AI Features**: AI-generated templates and AI Writing Assistant
- **📁 File Manager**: Media asset management
- **📚 Template Catalog**: Industry best practice templates
- **🔧 APIs**: Comprehensive API suite for customization

**Documentation**: https://docs.beefree.io/beefree-sdk/

## 📋 Prerequisites

Before running any example, you need:

1. **Node.js 16+** installed on your machine
2. **Beefree SDK credentials** from the [Developer Console](https://developers.beefree.io)
   - Client ID
   - Client Secret
3. **Git** to clone the repository

## 🎯 Available Examples

| Example | Description | Features | Start Command |
|---------|-------------|----------|---------------|
| [💬 Commenting](#-commenting-example) | Real-time collaborative commenting | Comments, toast notifications, real-time updates | `npm run start:commenting` |
| [🎨 Custom CSS](#-custom-css-example) | Dynamic theming and styling | 5 themes, CSS variables, theme switching | `npm run start:custom-css` |
| [💾 Auto-Save](#-auto-save-template-versioning-example) | Template versioning with auto-save | Version control, auto-save, history | `npm run start:autosave` |
| [📄 PDF Export](#-template-export-pdf-example) | Export templates to PDF | PDF generation, multiple formats, progress tracking | `npm run start:template-pdf` |

---

##  Commenting Example

**Demonstrates**: Real-time commenting system with toast notifications for collaborative editing.

### Features

- Real-time commenting on template elements
- Toast notifications for comment updates
- User mentions and replies
- Comment threading
- Collaborative editing experience

### How to Run

1. **Install dependencies**:
```bash
npm install
cd secure-auth-example && npm install && cd ..
cd commenting-example && npm install && cd ..
```

2. **Configure environment variables**:

Create `.env` file in `secure-auth-example/`:
```bash
cd secure-auth-example
cp .env.example .env
```

Edit `secure-auth-example/.env`:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

3. **Start the example**:
```bash
# From the repository root
npm run start:commenting
```

4. **Open in browser**: http://localhost:5173

### What Gets Started

- **Frontend** (port 5173): Commenting example React app
- **Auth Server** (port 3000): Shared authentication server

### Environment Variables Required

| File | Variables | Description |
|------|-----------|-------------|
| `secure-auth-example/.env` | `BEEFREE_CLIENT_ID`<br>`BEEFREE_CLIENT_SECRET`<br>`PORT=3000` | Authentication server credentials |

---

## 🎨 Custom CSS Example

**Demonstrates**: Dynamic theming system with real-time CSS customization and theme switching.

### Features

- 5 pre-built themes (Default, Dark, High Contrast, Coral, Custom)
- Real-time theme switching without page reload
- CSS variable architecture for easy customization
- Theme persistence using localStorage
- Responsive design

### How to Run

1. **Install dependencies**:
```bash
npm install
cd secure-auth-example && npm install && cd ..
cd custom-css-example && npm install && cd ..
```

2. **Configure environment variables**:

Create `.env` file in `secure-auth-example/`:
```bash
cd secure-auth-example
cp .env.example .env
```

Edit `secure-auth-example/.env`:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

3. **Start the example**:
```bash
# From the repository root
npm run start:custom-css
```

4. **Open in browser**: http://localhost:5174

### What Gets Started

- **Frontend** (port 5174): Custom CSS example React app
- **Auth Server** (port 3000): Shared authentication server

### Environment Variables Required

| File | Variables | Description |
|------|-----------|-------------|
| `secure-auth-example/.env` | `BEEFREE_CLIENT_ID`<br>`BEEFREE_CLIENT_SECRET`<br>`PORT=3000` | Authentication server credentials |

---

## 💾 Auto-Save Template Versioning Example

**Demonstrates**: Automatic template versioning with save history and version management.

If you prefer to run examples individually or work on a single project:

### Features

- Automatic template saving at configurable intervals1. **Clone repository**:

- Version history with timestamps```bash

- Restore previous versionsgit clone <repository-url>

- Visual diff between versionscd beefree-sdk-examples

- Save progress indicator```



### How to Run2. **Choose an example**:

```bash

1. **Install dependencies**:cd secure-auth-example

```bash# OR cd custom-css-example

npm install# OR cd commenting

cd secure-auth-example && npm install && cd ..# OR cd template-export-pdf-example

cd auto-save-template-versioning && npm install && cd ..```

```

3. **Install & configure**:

2. **Configure environment variables**:```bash

npm install

Create `.env` file in `secure-auth-example/`:cp .env.example .env

```bash# Edit .env with your Beefree SDK credentials

cd secure-auth-example```

cp .env.example .env

```4. **Run example**:

```bash

Edit `secure-auth-example/.env`:npm start

```env# OR

BEEFREE_CLIENT_ID=your_client_id_hereyarn dev

BEEFREE_CLIENT_SECRET=your_client_secret_here```

PORT=3000

```**Note**: `commenting` and `custom-css-example` require the `secure-auth-example` server to be running. Use the root-level start commands for convenience.



You can also configure auto-save settings in `auto-save-template-versioning/.env`:### 🔐 Environment Variables

```bash

cd auto-save-template-versioning#### 🔐 secure-auth-example (Required for commenting and custom-css)

cp .env.example .env```env

```# Beefree SDK Credentials (Backend Only)

BEEFREE_CLIENT_ID=your_client_id_here

Edit `auto-save-template-versioning/.env` (optional):BEEFREE_CLIENT_SECRET=your_client_secret_here

```env

VITE_AUTH_PROXY_URL=http://localhost:3000/auth/token# Server Configuration

```PORT=3000

NODE_ENV=development

3. **Start the example**:```

```bash

# From the repository root**Used by**: `commenting`, `custom-css-example` (via auth proxy)

npm run start:autosave

```#### 📄 template-export-pdf-example

```env

4. **Open in browser**: http://localhost:5173# Beefree SDK Credentials (Backend Only)

BEEFREE_CLIENT_ID=your_client_id_here

### What Gets StartedBEEFREE_CLIENT_SECRET=your_client_secret_here

- **Frontend** (port 5173): Auto-save example React app

- **Auth Server** (port 3000): Shared authentication server# Beefree Content Services API

BEEFREE_CS_API_KEY=your_content_services_api_key_here

### Environment Variables RequiredBEEFREE_CS_API_URL=https://api.getbee.io

| File | Variables | Description |

|------|-----------|-------------|# Server Configuration

| `secure-auth-example/.env` | `BEEFREE_CLIENT_ID`<br>`BEEFREE_CLIENT_SECRET`<br>`PORT=3000` | Authentication server credentials |PORT=3001

| `auto-save-template-versioning/.env` | `VITE_AUTH_PROXY_URL` (optional) | Auth proxy URL (defaults to localhost:3000) |VITE_PORT=5174

```

---

**Note**: This example requires the **Beefree Content Services API key** in addition to the standard SDK credentials. Get this from your [Developer Console](https://developers.beefree.io).

---

## 🔐 Shared Authentication Server

The `secure-auth-example` folder contains a shared authentication server used by most examples. It provides:

- Enterprise-grade JWT token management
- Automatic token refresh every 5 minutes
- Secure credential storage (backend-only)
- Production-ready error handling

**This server must be running** for the following examples:
- Commenting Example
- Custom CSS Example  
- Auto-Save Template Versioning Example
- Template Export PDF Example

The root-level start commands automatically start this server for you.

---

## 🏗️ Repository Structure

```
beefree-sdk-examples/
├── .eslintrc.cjs                     # Shared ESLint configuration
├── package.json                      # Root scripts for starting examples
├── shared/
│   └── auth.js                       # Shared authentication module
├── commenting-example/               # Real-time commenting
├── custom-css-example/               # Dynamic theming
├── auto-save-template-versioning/    # Auto-save with versioning
├── template-export-pdf-example/      # PDF export functionality
└── secure-auth-example/              # Shared auth server
```

---

## 🔧 Development Tools

### ESLint

All examples share a single ESLint configuration for consistent code quality:

```bash
npm run lint         # Check all projects
npm run lint:fix     # Auto-fix issues
```

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: TypeScript + Express.js + tsx
- **Authentication**: JWT tokens with auto-refresh
- **Package Manager**: npm or yarn

---

## 🆘 Troubleshooting

### Port Already in Use

If you see "port already in use" errors:
```bash
# Check what's using the port
lsof -i :3000  # or :5173, :5174, etc.

# Kill the process
kill -9 <PID>
```

### Authentication Errors

- Verify your `BEEFREE_CLIENT_ID` and `BEEFREE_CLIENT_SECRET` are correct
- Check the `.env` file is in the right folder (`secure-auth-example/`)
- Make sure the auth server (port 3000) is running

### Missing Dependencies

```bash
# Reinstall all dependencies
npm install
cd secure-auth-example && npm install && cd ..
cd [example-folder] && npm install && cd ..
```

### Can't Access Example in Browser

- Check the console output for the correct port
- Make sure no firewall is blocking the ports
- Try `http://localhost:[port]` instead of `127.0.0.1`

---

## 📚 Resources

- **📖 [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)**
- **🔑 [Developer Console](https://developers.beefree.io)** - Get your credentials
- **🔧 [API Reference](https://docs.beefree.io/beefree-sdk/apis/)**
- **💬 [Community Support](https://beefree.io/support/)**
- **� [Video Tutorials](https://docs.beefree.io/beefree-sdk/resources/videos)**

---

## 🤝 Contributing

We welcome contributions! Each example follows these principles:

- ✅ **Production-Ready**: Comprehensive error handling
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Security**: Backend-only credentials
- ✅ **Documentation**: Clear setup instructions
- ✅ **Code Quality**: ESLint compliant
- ✅ **Accessibility**: WCAG guidelines

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## � License

These examples are provided for educational and development purposes. Please refer to the [Beefree SDK Terms of Service](https://beefree.io/terms-of-service/) for usage guidelines.

---

**� Ready to start?** Pick an example above and follow the instructions to get up and running in minutes!

beefree-sdk-examples/## 🔧 Development Tools

├── .eslintrc.cjs                     # Shared ESLint configuration

├── package.json                      # Root scripts for starting examples### ESLint Configuration

├── shared/

│   └── auth.js                       # Shared authentication moduleAll examples share a single ESLint configuration located at the root of the monorepo (`.eslintrc.cjs`). This ensures consistent code quality across all projects.

├── commenting-example/               # Real-time commenting

├── custom-css-example/               # Dynamic theming#### Running ESLint

├── auto-save-template-versioning/    # Auto-save with versioning

├── template-export-pdf-example/      # PDF export functionality```bash

└── secure-auth-example/              # Shared auth server# From the root of the repository

```npm install          # Install ESLint dependencies once at root level

npm run lint         # Check all projects for linting issues

---npm run lint:fix     # Automatically fix linting issues

```

## 🔧 Development Tools

#### How It Works

### ESLint

All examples share a single ESLint configuration for consistent code quality:- **Single Configuration**: `.eslintrc.cjs` at the root applies to all subfolders

- **Centralized Dependencies**: ESLint and plugins installed only in root `package.json`

```bash- **No Duplication**: No need to copy configs or install dependencies in each project

npm run lint         # Check all projects- **Project Independence**: Individual projects can still be copied and will work with their own dependencies for building/running

npm run lint:fix     # Auto-fix issues

```**Note**: When copying an individual project folder to work independently, you may want to copy the root `.eslintrc.cjs` to that project and add ESLint dependencies to that project's `package.json` if you need linting outside of this monorepo.



### Technology Stack## 🤝 Contributing

- **Frontend**: React 19 + TypeScript + Vite

- **Backend**: TypeScript + Express.js + tsxEach example follows these principles:

- **Authentication**: JWT tokens with auto-refresh- ✅ **Production-Ready Code**: Comprehensive error handling and edge case management

- **Package Manager**: npm or yarn- ✅ **Type Safety**: Full TypeScript implementation with official Beefree SDK types

- ✅ **Modern Architecture**: React 18 + TypeScript + Vite + Express.js stack

---- ✅ **Security Best Practices**: Backend-only credentials, secure token management

- ✅ **Comprehensive Documentation**: Detailed setup and usage instructions

## 🆘 Troubleshooting- ✅ **Shared Infrastructure**: Consistent authentication and patterns across examples

- ✅ **Code Quality**: Shared ESLint configuration for consistent linting rules

### Port Already in Use- ✅ **Accessibility**: WCAG-compliant UI components and keyboard navigation

If you see "port already in use" errors:- ✅ **Performance**: Optimized builds, lazy loading, and efficient state management

```bash

# Check what's using the port## 📄 License

lsof -i :3000  # or :5173, :5174, etc.

These examples are provided for educational and development purposes. Please refer to the [Beefree SDK Terms of Service](https://beefree.io/terms-of-service/) for usage guidelines.

# Kill the process

kill -9 <PID>---

```

**🚀 Ready to start?** Choose an example above and follow its README for detailed setup instructions!

### Authentication Errors
- Verify your `BEEFREE_CLIENT_ID` and `BEEFREE_CLIENT_SECRET` are correct
- Check the `.env` file is in the right folder (`secure-auth-example/`)
- Make sure the auth server (port 3000) is running

### Missing Dependencies
```bash
# Reinstall all dependencies
npm install
cd secure-auth-example && npm install && cd ..
cd [example-folder] && npm install && cd ..
```

### Can't Access Example in Browser
- Check the console output for the correct port
- Make sure no firewall is blocking the ports
- Try `http://localhost:[port]` instead of `127.0.0.1`

---

## 📚 Resources

- **📖 [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)**
- **🔑 [Developer Console](https://developers.beefree.io)** - Get your credentials
- **🔧 [API Reference](https://docs.beefree.io/beefree-sdk/apis/)**
- **💬 [Community Support](https://beefree.io/support/)**
- **🎥 [Video Tutorials](https://docs.beefree.io/beefree-sdk/resources/videos)**

---

## 🤝 Contributing

We welcome contributions! Each example follows these principles:

- ✅ **Production-Ready**: Comprehensive error handling
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Security**: Backend-only credentials
- ✅ **Documentation**: Clear setup instructions
- ✅ **Code Quality**: ESLint compliant
- ✅ **Accessibility**: WCAG guidelines

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📄 License

These examples are provided for educational and development purposes. Please refer to the [Beefree SDK Terms of Service](https://beefree.io/terms-of-service/) for usage guidelines.

---

**🚀 Ready to start?** Pick an example above and follow the instructions to get up and running in minutes!
