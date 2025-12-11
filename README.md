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
| [💾 Autosave](#-autosave-versioning-example) | Template versioning with auto-save | Version control, auto-save, history | `yarn start:autosave` |
| [💬 Commenting](#-commenting-example) | Real-time collaborative commenting | Comments, toast notifications, real-time updates | `yarn start:commenting` |
| [🔀 Conditional Rows](#-conditional-rows-example) | Personalized content with display conditions | 14 pre-configured conditions, custom builder, no-code personalization | `yarn start:conditional-rows` |
| [🎨 Custom CSS](#-custom-css-example) | Dynamic theming and styling | 5 themes, CSS variables, theme switching | `yarn start:custom-css` |
| [🏗️ Multi-Builder](#-multi-builder-switch-example) | Dynamic switching between builders | Email/Page/Popup switching, state management | `yarn start:multi-builder` |
| [📄 PDF Export](#-template-export-pdf-example) | Export templates to PDF | PDF generation, multiple formats, progress tracking | `yarn start:pdf-export` |
| [🔐 Secure Auth](#-secure-auth-example) | Production-ready authentication | JWT tokens, refresh mechanism, secure credentials | `yarn start:secure-auth` |
| [📂 Template Load](#-template-load-example) | Load saved templates from DB | Template management, Prisma ORM, CRUD operations | `yarn start:template-load` |

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
PORT=3029
VITE_PORT=8029
```

To run the example, use the start command from the root of the repository:

```bash
yarn start:ai-agent
```

This command will automatically:
- Install all required dependencies
- Start the backend server with WebSocket (port 3029)
- Start the frontend with Vite (port 8029)

Then open http://localhost:8029 in your browser.

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
- **Connection Issues**: Check that both frontend (8029) and backend (3029) are running
- **CORS Errors**: The backend handles authentication - ensure it started successfully

For detailed information, see `ai-agent-example/README.md`.

---

## 💾 Autosave Template Versioning Example

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

This command will automatically install all required dependencies and start both the frontend (port 8008) and the authentication server (port 3008).

**Before running**, make sure to configure your Beefree SDK credentials in `autosave-versioning-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3008
```

Then open http://localhost:8008 in your browser.

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

This command will automatically install all required dependencies and start both the frontend (port 8018) and the authentication server (port 3018).

You can now open http://localhost:8018 in your browser.

### Troubleshooting

If you didn't get the example to run, take a look at the `commenting-example/README.md` for more detailed instructions 

---

## 🔀 Conditional Rows Example

Create personalized email content that adapts based on recipient attributes using Display Conditions—no code required.

### Features

- **14 Pre-configured Conditions** - Ready-to-use conditions across 5 categories (Customer Segment, Geography, Shopping Behavior, Product Catalog, Engagement)
- **Custom Condition Builder** - Visual interface to build complex conditions on-the-fly using Content Dialog
- **No-Code Personalization** - Users create conditional content without writing templating code
- **Language Agnostic** - Works with Liquid, Handlebars, or any proprietary templating syntax
- **Multi-Rule Logic** - Combine multiple rules with AND operators
- **Real-time Preview** - Test how content appears to different audience segments
- **Role-based Permissions** - Control who can view, select, edit, or add conditions

### Setup and launch instructions

**Before running**, make sure to:

1. Check your plan in the [Beefree Developer Console](https://developers.beefree.io/pricing-plans):
The display conditions feature is available on **Core**, **SuperPowers**, and **Enterprise** plans. 
It is **not available** on Free and Essentials plans.

2. Enable display conditions in your [Beefree SDK Console](https://developers.beefree.io/):
- Log in to your Beefree developer account
- Navigate to your application
- Go to **Server-side configurations**
- Find the **Display Conditions** option and toggle it to **ON**
- Save your changes

3. Add your Beefree SDK credentials to the `conditional-rows-example/.env` file:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3014
```

To run the example, use the start command from the root of the repository:

```bash
yarn start:conditional-rows
```

This command will automatically install all required dependencies and start both the frontend (port 8014) and the authentication server (port 3014).

**Before running**, make sure to configure your Beefree SDK credentials in `conditional-rows-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3014
```

You can now open http://localhost:8014 in your browser.

### How It Works

1. **Select a Row** - Click on any row in the email editor
2. **Open Display Conditions** - Click the row settings (gear icon) → "Display Conditions" tab
3. **Choose Your Method**:
   - **Browse & Select**: Choose from 14 pre-configured conditions organized by category
   - **Build Custom**: Click "Build Custom Condition" to open the visual condition builder
4. **Apply & Test** - Apply the condition and use Preview mode to test different segments

### Use Cases

- **VIP Customer Promotions**: Show exclusive offers only to premium customers
- **Regional Content**: Display location-specific content based on customer region
- **Cart Recovery**: Target customers with abandoned carts
- **Product Recommendations**: Feature products from recipient's browsing history
- **Re-engagement**: Show special content to inactive subscribers

### Troubleshooting

If you didn't get the example to run, take a look at the `conditional-rows-example/README.md` for more detailed instructions.

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

This command will automatically install all required dependencies and start both the frontend (port 8007) and the authentication server (port 3007).

**Before running**, make sure to configure your Beefree SDK credentials in `custom-css-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3007
```

Then open http://localhost:8007 in your browser.

---

## 🏗️ Multi-Builder Switch Example

Dynamic switching between different Beefree builder types (Email, Page, Popup) within a single application.

### Features

- **3 Builder Types**: Email, Page, and Popup
- **Seamless Switching**: Instant transitions without page reload
- **State Management**: Proper cleanup and initialization for each type
- **Self-Contained Auth**: Dedicated local authentication server

### How to Run

To run this example, use the start command from the root of the repository:

```bash
yarn start:multi-builder
```

This command will automatically install dependencies and start both the frontend (port 8006) and backend server (port 3006).

**Before running**, configure your credentials in `multi-builder-switch-example/.env`:

```env
# Default Beefree SDK Credentials (fallback)
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# IMPORTANT: Builder-specific credentials required for correct sidebar options
# Each builder type needs its own application in Developer Console
EMAIL_CLIENT_ID=your_email_client_id_here
EMAIL_CLIENT_SECRET=your_email_client_secret_here
PAGE_CLIENT_ID=your_page_client_id_here
PAGE_CLIENT_SECRET=your_page_client_secret_here
POPUP_CLIENT_ID=your_popup_client_id_here
POPUP_CLIENT_SECRET=your_popup_client_secret_here

# Server Configuration
PORT=3006
```

**Note**: To show builder-specific sidebar options (e.g., Form button for Page builder), each builder type requires its own application configured in the [Developer Console](https://developers.beefree.io) with the corresponding builder type selected.

Then open http://localhost:8006 in your browser.

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

This command will automatically install all required dependencies and start both the frontend (port 8003) and backend server (port 3003).

**Before running**, make sure to configure your credentials in `template-export-pdf-example/.env`:

```env
# Beefree SDK Credentials
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# Beefree Content Services API
BEEFREE_CS_API_URL=https://api.getbee.io

# Server Configuration
PORT=3003
VITE_PORT=8003
```

Then open http://localhost:8003 in your browser.

---

## 🔐 Secure Auth Example

This example demonstrates **secure, production-ready authentication** for the Beefree SDK using a modern **React + TypeScript** architecture. It showcases best practices for handling authentication tokens, automatic token refresh, and secure credential management.

### Features

- **Backend-Only Credentials**: Client ID/Secret never exposed to frontend
- **Secure Token Management**: JWT tokens with automatic refresh
- **Production-Ready Error Handling**: Comprehensive error states and recovery
- **API Monitor Panel**: Real-time inspection of API calls

### Setup and launch instructions

**Before running**, make sure to:

1. Get your Beefree SDK credentials from the [Developer Console](https://developers.beefree.io).
2. Configure your credentials in `secure-auth-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3000
VITE_PORT=8080
```

To run the example, use the start command from the root of the repository:

```bash
yarn start:secure-auth
```

This command will automatically:
- Install all required dependencies
- Start the backend server (port 3000)
- Start the frontend application (port 8080)

Then open http://localhost:8080 in your browser.

### Authentication Flow

1. **Frontend**: User enters a UID (User ID)
2. **Backend**: Receives request, authenticates with Beefree API using secure credentials
3. **Token**: Backend returns a JWT token to frontend
4. **SDK**: Frontend initializes Beefree SDK with the token
5. **Refresh**: System automatically refreshes tokens before they expire

### Troubleshooting

If you encounter authentication errors:
- Check that your Client ID and Secret are correct in the `.env` file
- Ensure the backend server is running on port 3000
- Verify that `VITE_PORT` matches the frontend port (default 8080)

---

The `secure-auth-example` folder contains an authentication server that can be used by most examples. It provides:

- Enterprise-grade JWT token management
- Automatic token refresh every 5 minutes
- Secure credential storage (backend-only)
- Production-ready error handling

**This server can be leveraged by the following examples:**:
- Autosave example
- Commenting example
- Custom CSS example
- Multi-Builder Switch example (NOTE: consult the multi-builder-switch-example/README.md to understand the limitations when using the shared auth server).

To use the `secure-auth-example` server for authentication in another example:

1. Start the `secure-auth-example` server:
   ```bash
   yarn start:secure-auth
   ```
2. In the target example folder (e.g., `commenting-example`), create or update the `.env` file to point to the shared auth server:
   ```env
   # Point to the secure-auth-example server
   VITE_BEEFREE_AUTH_PROXY_URL=http://localhost:3000/auth/token
   
   # You can omit BEEFREE_CLIENT_ID and BEEFREE_CLIENT_SECRET in this .env 
   # as authentication is handled by the shared server
   ```
3. Run the target example (only the frontend is needed if the example doesn't have other backend logic):
   ```bash
   cd commenting-example
   yarn dev
   ```

---

## 📂 Template Load Example

A full-stack example demonstrating how to load, edit, and save templates with persistent storage.

### Features

- **Full CRUD Operations**: Create, Read, Update, Delete templates
- **Database Persistence**: SQLite database with Prisma ORM
- **Template Management**: List view with filtering and management actions
- **Production-Ready**: Error handling, validation, and loading states
- **Shared Auth**: Uses the shared authentication module pattern

### Setup and launch instructions

**Before running**, make sure to:

1. Get your Beefree SDK credentials from the [Developer Console](https://developers.beefree.io).
2. Configure your credentials in `template-load-example/api/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3002
DATABASE_URL="file:./dev.db"
```

To run the example, use the start command from the root of the repository:

```bash
yarn start:template-load
```

This command will automatically:
- Install all required dependencies
- Initialize the SQLite database
- Start the backend server (port 3002)
- Start the frontend application (port 8002)

Then open http://localhost:8002 in your browser.

---

## 🏗️ Repository Structure
```
beefree-sdk-examples/
├── .eslintrc.cjs                     # Shared ESLint configuration
├── package.json                      # Root scripts for starting examples
├── shared/
│   └── auth.js                       # Shared authentication module
├── ai-agent-example/                 # AI-powered email design (NEW!)
├── autosave-versioning-example/      # Auto-save with versioning
├── commenting-example/               # Real-time commenting
├── conditional-rows-example/         # Display conditions & personalization
├── custom-css-example/               # Dynamic theming
├── multi-builder-switch-example/     # Multi-builder switching
├── secure-auth-example/              # Simple client with secure auth server
├── template-export-pdf-example/      # PDF export functionality
└── template-load-example/            # Load/Save templates with DB
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
- **📦 [Content Options Configuration](https://docs.beefree.io/beefree-sdk/server-side-configurations/server-side-options/content-options)** - Configure content blocks (HTML, Menu, Title, List, Paragraph, Video, Icons, Spacer, Table) and understand differences between Email and Page Builder. Form block is available for Page Builder applications.
- **📝 [Form Block Integration](https://docs.beefree.io/beefree-sdk/forms/integrating-and-using-the-form-block/passing-forms-to-the-builder)** - Guide on integrating and using the Form block in Page Builder applications, including how to pass forms to the builder and configure form fields.
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
