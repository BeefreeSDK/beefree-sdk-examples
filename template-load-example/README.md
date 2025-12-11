# Template Load Example

A complete demo showcasing **Beefree SDK integration** with a full-stack template management system. This monorepo demonstrates how to build a production-ready email template editor with persistent storage, user authentication, and modern development practices.

## 🚀 Quick Start

```bash
# 1. Install dependencies
yarn install

# 2. Setup environment (copy examples)
cp api/.env.example api/.env
cp web/.env.example web/.env

# 3. Update Beefree credentials in api/.env
# Get your Beefree credentials from your application in the SDK console (https://developers.beefree.io/accounts/login/)

# 4. Start the demo (database auto-initialized)
yarn dev
```

**That's it!** The demo will be running at:

- 🌐 **Frontend**: http://localhost:8002
- 🔧 **API**: http://localhost:3002

> **Note**: You'll need to add your Beefree SDK credentials to `apps/api/.env` for the backend to handle authentication. See the [Configuration](#-configuration) section below for details.

## 🎯 What This Demo Shows

- **Beefree SDK Integration**: Full-featured email template editor
- **Template Management**: Create, edit, duplicate, and delete templates
- **Database Persistence**: SQLite with Prisma ORM
- **Shared Authentication**: Uses the shared auth module for consistent authentication across examples
- **Modern Stack**: React + TypeScript + Express + yarn workspaces
- **Production Patterns**: Error handling, validation, responsive design

## 📁 Project Structure

```
template-load-example/
├── web/          # React frontend with Beefree SDK
├── api/          # Express backend with Prisma
└── README.md
```

## 🎮 How to Use the Demo

1. **Create a Template**: Click "Create New Template" to open the Beefree editor
2. **Design Your Email**: Use the drag-and-drop interface to build your template
3. **Save Your Work**:
   - **Quick Save**: Click "Save" in the builder toolbar
     - **New Template**: Prompts for a name, then saves
     - **Existing Template**: Saves instantly with incremented version
   - **Save As**: Click "Save as template" under "Actions" for advanced options (rename, save as copy)
4. **Manage Templates**: View, edit, duplicate, or delete templates from the list
5. **Edit Existing**: Click any template to open it in the editor

## 🔧 Configuration

### Environment Setup

**Backend API** (`api/.env`):

```bash
PORT=3002
API_KEY=changeme                    # Optional - leave empty for demo mode
DATABASE_URL="file:./var/dev.db"    # SQLite database location

# Beefree SDK Configuration (handles authentication)
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_UID=demo-user
```

**Frontend Web** (`web/.env`):

```bash
VITE_API_URL=http://localhost:3002
VITE_API_KEY=changeme               # Optional - matches backend API_KEY

# Auth Proxy Configuration
VITE_AUTH_PROXY_URL=http://localhost:3002/auth
```

## 🔌 API Reference

### Endpoints

| Method   | Endpoint         | Description                          |
| -------- | ---------------- | ------------------------------------ |
| `GET`    | `/health`        | Server health check                  |
| `GET`    | `/version`       | API version information              |
| `POST`   | `/auth`          | Authenticate with Beefree SDK        |
| `GET`    | `/templates`     | List all templates                   |
| `POST`   | `/templates`     | Create a new template                |
| `PUT`    | `/templates/:id` | Update an existing template          |
| `DELETE` | `/templates/:id` | Soft delete a template (archives it) |

### Example API Usage

```bash
# Health check
curl http://localhost:3002/health
# Response: {"status":"ok"}

# Authenticate with Beefree SDK
curl -X POST -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:3002/auth
# Response: {"access_token":"...","expires_in":3600,"token_type":"Bearer",...}

# List templates
curl http://localhost:3002/templates
# Response: {"templates":[...],"total":2}

# Create a template
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"My Template","content":"{\"subject\":\"Hello\",\"body\":\"World\"}"}' \
  http://localhost:3002/templates

# With API key (when enabled)
curl -H "x-api-key: changeme" http://localhost:3002/health
```

## 🗄️ Database

- **Type**: SQLite with Prisma ORM
- **Location**: `api/var/dev.db`
- **Schema**: `api/prisma/schema.prisma`
- **Auto-initialized**: Database is created automatically on first run

**Manual Commands** (if needed):

```bash
yarn db:ensure    # Generate client and push schema
yarn -C api db:studio  # Open database viewer
```

## 🛠️ Development

### Available Scripts

```bash
# Development
yarn dev          # Start both API and frontend
yarn dev:api      # API server only
yarn dev:web      # Frontend only

# Production
yarn build        # Build both apps
yarn start        # Start production servers

# Database
yarn db:ensure    # Generate Prisma client and push schema
yarn -C api db:studio  # Open database viewer

# Code Quality
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn typecheck    # Run TypeScript checks
```

## 🚨 Troubleshooting

### Common Issues

**"Missing Beefree credentials" error**

- Ensure you've copied `api/.env.example` to `api/.env`
- Add your Beefree SDK credentials to the backend `.env` file

**"Invalid or missing API key" error**

- Check that `VITE_API_KEY` in frontend matches `API_KEY` in backend
- Or set both to empty for demo mode

**Database connection issues**

- Run `yarn db:ensure` to initialize the database
- Check that `api/var/` directory exists and is writable

**Port already in use**

- API runs on port 3002, frontend on 8002
- Kill existing processes or change ports in `.env` files

**CORS errors in production**

- Ensure frontend URL is in the CORS origins list in `api/src/index.ts`

### Getting Help

- Check the browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure both API and frontend are running on the correct ports

## 🔧 Advanced Configuration

### Git Hooks

This project uses the root repository's husky configuration for git hooks. Linting and formatting run automatically on pre-commit.

### Monorepo Structure

- **`/web`** - React frontend with Beefree SDK
- **`/api`** - Express backend with Prisma

### Code Quality

- **Prettier**: Consistent code formatting
- **ESLint**: TypeScript linting with React support
- **TypeScript**: Full type checking
- **Lint-staged**: Pre-commit formatting and linting

## 📚 What You'll Learn

This demo showcases:

- **Beefree SDK Integration**: How to embed a professional email editor
- **Full-Stack Architecture**: React + Express + Database
- **Modern Development**: TypeScript, yarn workspaces, Prisma ORM
- **Production Patterns**: Error handling, validation, responsive design
- **Template Management**: CRUD operations with smart naming
- **Database Design**: SQLite with Prisma for rapid prototyping

## 🎉 Ready to Start?

1. **Clone and install**: `yarn install`
2. **Setup environment**: Copy the `.env.example` files
3. **Add Beefree credentials**: Get them from [Beefree Developer Console](https://docs.beefree.io/beefree-sdk/getting-started/readme/create-an-application.md)
4. **Run the demo**: `yarn dev`
5. **Start building**: Open http://localhost:8002 and create your first template!

---

**Need help?** Check the [Troubleshooting](#-troubleshooting) section or refer to the [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/getting-started).
