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

1. **Node.js 22+** installed on your machine
2. **Beefree SDK credentials** from the [Developer Console](https://developers.beefree.io)
   - Client ID
   - Client Secret
3. **Git** to clone the repository

## 🎯 Available Examples

| Example | Description | Features | Start Command |
|---------|-------------|----------|---------------|
| [🤖 AI Agent](#-ai-agent-example) | Natural language email design with AI | OpenAI Agents, MCP integration, 40+ tools, real-time streaming | `yarn start:ai-agent` |
| [💬 Commenting](#-commenting-example) | Real-time collaborative commenting | Comments, toast notifications, real-time updates | `yarn start:commenting` |
| [🎨 Custom CSS](#-custom-css-example) | Dynamic theming and styling | 5 themes, CSS variables, theme switching | `yarn start:custom-css` |
| [💾 Auto-Save](#-auto-save-template-versioning-example) | Template versioning with auto-save | Version control, auto-save, history | `yarn start:autosave` |
| [📄 PDF Export](#-template-export-pdf-example) | Export templates to PDF | PDF generation, multiple formats, progress tracking | `yarn start:template-pdf` |

---

## 🤖 AI Agent Example

**NEW BETA FEATURE** - Create professional email designs using natural language with OpenAI Agents and the Beefree MCP Server.

### Features

- 🎨 **Natural Language Design**: Create emails with simple text commands
- 🔧 **40+ MCP Tools**: Powered by Model Context Protocol for sections, columns, content blocks, styling, and templates
- 🎭 **1,500+ Templates**: AI-powered search and cloning from professional template library
- 📸 **Image Search**: Built-in Pexels API integration for stock images
- ✅ **Email Validation**: Automatic accessibility and best practices checks
- 💬 **Real-time Streaming**: WebSocket-based streaming responses with gpt-4o-mini
- 🎯 **Smart Context**: AI understands design intent and suggests improvements
- 🔐 **Secure Architecture**: Backend-only credentials with MCP session tracking

### Setup and launch instructions

**Before running**, this example requires special credentials:

1. **Standard Beefree SDK Credentials** from [Beefree Developer Console](https://developers.beefree.io):
   - `BEEFREE_CLIENT_ID`
   - `BEEFREE_CLIENT_SECRET`

2. **Beefree MCP API Key** (Beta - requires special access):
   - Request access: https://growens.typeform.com/to/gyH0gVgp#source=docs
   - **Important**: Standard CSAPI keys will NOT work - you need an MCP-compatible key
   - Documentation: https://docs.beefree.io/beefree-sdk/early-access/beefree-sdk-mcp-server-beta

3. **OpenAI API Key** from [OpenAI Platform](https://platform.openai.com/api-keys):
   - Used for the AI agent (gpt-4o-mini model)

4. Configure your credentials in `ai-agent-example/.env`:

```env
# Beefree SDK Credentials
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# Beefree MCP Server (Beta)
BEEFREE_MCP_API_KEY=your_mcp_api_key_here

# User ID for Beefree SDK
BEEFREE_UID=ai-agent-demo-user

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=8083
VITE_PORT=8082
```

To run the example, use the start command from the root of the repository:

```bash
yarn start:ai-agent
```

This command will automatically:
- Install all required dependencies
- Start the backend server with WebSocket (port 8083)
- Start the frontend with Vite (port 8081)

Then open http://localhost:8081 in your browser.

### How It Works

1. **Chat with AI**: Use the collapsible chat panel to describe what you want
2. **Real-time Updates**: Watch the AI build your email design step-by-step
3. **MCP Integration**: AI uses 40+ tools to manipulate the Beefree editor
4. **Streaming Responses**: See AI thinking and working in real-time

### Example Prompts

Try these to get started:
- "Create a welcome email with a hero section, company introduction, and sign-up CTA"
- "Build a newsletter layout with header, featured article, and 3-column content grid"
- "Design a promotional email with product showcase, discount code, and urgency messaging"

### Troubleshooting

If you encounter issues:
- **MCP API Key Error**: Make sure you have an MCP-compatible key (not a standard CSAPI key)
- **OpenAI Errors**: Verify your OpenAI API key is valid and has credits
- **Connection Issues**: Check that both frontend (8081) and backend (8083) are running
- **CORS Errors**: The backend handles authentication - ensure it started successfully

For detailed information, see `ai-agent-example/README.md`.

---

## 💬 Commenting Example

Real-time commenting system with toast notifications for collaborative editing.

### Features

- Real-time commenting on template elements
- Toast notifications for comment updates
- User mentions and replies
- Comment threading
- Collaborative editing experience

### Setup and launch instructions

**Before running**, make sure to:

1. Check your plan in the [Beefree Developer Console](https://developers.beefree.io):
The commenting feature is available on **Core**, **SuperPowers**, and **Enterprise** plans. 
It is **not available** on Free and Essentials plans.
2. Add your Beefree SDK credentials to the `secure-auth-example/.env` file:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
```
3. Enable commenting in your [Beefree SDK Console](https://developers.beefree.io/):
- Log in to your Beefree developer account
- Click on your application's Details button
- Go to Application > Configure Application
- Scroll down to the Services section and toggle **"Commenting"** to ON (under Editing & Collaboration)
- Save your changes

To run the example, use the start command from the root of the repository:

```bash
yarn start:commenting
```

This command will automatically install all required dependencies and start both the frontend (port 8081) and the authentication server (port 3000).

You can now open http://localhost:8081 in your browser.

### Troubleshooting

If you didn't get the example to run, take a look at the `commenting-example/README.md` for more detailed instructions 

---

## 🎨 Custom CSS Example

Dynamic theming system with real-time CSS customization and theme switching.

### Features

- 5 pre-built themes (Default, Dark, High Contrast, Coral, Custom)
- Real-time theme switching without page reload
- CSS variable architecture for easy customization
- Theme persistence using localStorage
- Responsive design

### How to Run

To run this example, use the start command from the root of the repository:

```bash
yarn start:custom-css
```

This command will automatically install all required dependencies and start both the frontend (port 8081) and the authentication server (port 3000).

**Before running**, make sure to configure your Beefree SDK credentials in `secure-auth-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

Then open http://localhost:8081 in your browser.

---

## 💾 Auto-Save Template Versioning Example

Automatic template versioning with save history and version management.

### Features

- Automatic template saving at configurable intervals
- Version history with timestamps
- Restore previous versions
- Visual diff between versions
- Save progress indicator

### How to Run

To run this example, use the start command from the root of the repository:

```bash
yarn start:autosave
```

This command will automatically install all required dependencies and start both the frontend (port 5173) and the authentication server (port 3000).

**Before running**, make sure to configure your Beefree SDK credentials in `secure-auth-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

You can also optionally configure auto-save settings in `auto-save-template-versioning/.env`:

```env
VITE_AUTH_PROXY_URL=http://localhost:3000/auth/token
```

Then open http://localhost:5173 in your browser.

---

## 📄 Template Export PDF Example

Export templates to PDF using the Beefree Content Services API.

### Features

- Export templates to PDF format
- Multiple export formats (HTML, JSON)
- Progress tracking during export
- Download generated PDFs
- Template preview before export

### How to Run

To run this example, use the start command from the root of the repository:

```bash
yarn start:template-pdf
```

This command will automatically install all required dependencies and start the frontend (port 5174).

**Before running**, make sure to configure your credentials in `template-export-pdf-example/.env`:

```env
# Beefree SDK Credentials
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# Beefree Content Services API
BEEFREE_CS_API_KEY=your_content_services_api_key_here
BEEFREE_CS_API_URL=https://api.getbee.io

# Server Configuration
PORT=3001
VITE_PORT=5174
```

**Note**: This example requires the **Beefree Content Services API key** in addition to the standard SDK credentials. Get this from your [Developer Console](https://developers.beefree.io).

Then open http://localhost:5174 in your browser.

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

The root-level start commands automatically start this server for you.

---

## 🏗️ Repository Structure

```
beefree-sdk-examples/
├── .eslintrc.cjs                     # Shared ESLint configuration
├── package.json                      # Root scripts for starting examples
├── shared/
│   └── auth.js                       # Shared authentication module
├── ai-agent-example/                 # AI-powered email design (NEW!)
├── commenting-example/               # Real-time commenting
├── custom-css-example/               # Dynamic theming
├── auto-save-template-versioning/    # Auto-save with versioning
├── template-export-pdf-example/      # PDF export functionality
└── secure-auth-example/              # Shared auth server
```

---

## 🔧 Development Tools

### ESLint

All examples share a single ESLint configuration for consistent code quality.

ESLint runs automatically in two ways:
- **During development**: The `start` commands include linting to catch issues early
- **Before commits**: Using Husky with a pre-commit hook and lint-staged, all staged code is automatically linted before being committed, ensuring only quality code enters the repository

### Technology Stack

- **Frontend**: React 19+ + TypeScript + Vite
- **Backend**: TypeScript + Express.js + tsx
- **Authentication**: JWT tokens with auto-refresh
- **Package Manager**: yarn or npm (yarn preferred)

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

The start commands automatically install dependencies, but if you encounter issues:

```bash
# Reinstall all dependencies
yarn install
cd secure-auth-example && yarn install && cd ..
cd [example-folder] && yarn install && cd ..
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
