# Template Load Example

A complete demo showcasing **Beefree SDK integration** with a full-stack template management system. This monorepo demonstrates how to build a production-ready email template editor with persistent storage, user authentication, and modern development practices.

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment (copy examples)
cp apps/api/.env.example apps/api/.env
cp apps/web/env.example apps/web/.env

# 3. Update Beefree credentials in apps/web/.env
# Get your Beefree credentials from your application in the SDK console (https://developers.beefree.io/accounts/login/)

# 4. Start the demo (database auto-initialized)
pnpm dev
```

**That's it!** The demo will be running at:

- 🌐 **Frontend**: http://localhost:3001
- 🔧 **API**: http://localhost:3008

> **Note**: You'll need to add your Beefree SDK credentials to `apps/web/.env` for the frontend to work. See the [Configuration](#-configuration) section below for details.

## 🎯 What This Demo Shows

- **Beefree SDK Integration**: Full-featured email template editor
- **Template Management**: Create, edit, duplicate, and delete templates
- **Database Persistence**: SQLite with Prisma ORM
- **Modern Stack**: React + TypeScript + Express + pnpm workspaces
- **Production Patterns**: Error handling, validation, responsive design

## 📁 Project Structure

```
template-load-example/
├── apps/
│   ├── web/          # React frontend with Beefree SDK
│   └── api/          # Express backend with Prisma
└── README.md
```

## 🎮 How to Use the Demo

1. **Create a Template**: Click "Create New Template" to open the Beefree editor
2. **Design Your Email**: Use the drag-and-drop interface to build your template
3. **Save Your Work**: Click "Save as template" in the builder toolbar, under "Actions"
4. **Manage Templates**: View, edit, duplicate, or delete templates from the list
5. **Edit Existing**: Click any template to open it in the editor

## 🔧 Configuration

### Environment Setup

**Backend API** (`apps/api/.env`):

```bash
PORT=3008
API_KEY=changeme                    # Optional - leave empty for demo mode
DATABASE_URL="file:../var/dev.db"   # SQLite database location
```

**Frontend Web** (`apps/web/.env`):

```bash
VITE_API_URL=http://localhost:3008
VITE_API_KEY=changeme               # Optional - matches backend API_KEY
VITE_BEEFREE_CLIENT_ID=your_client_id_here
VITE_BEEFREE_CLIENT_SECRET=your_client_secret_here
VITE_BEEFREE_UID=demo-user
```

## 🔌 API Reference

### Endpoints

| Method   | Endpoint         | Description                          |
| -------- | ---------------- | ------------------------------------ |
| `GET`    | `/health`        | Server health check                  |
| `GET`    | `/version`       | API version information              |
| `GET`    | `/templates`     | List all templates                   |
| `POST`   | `/templates`     | Create a new template                |
| `PUT`    | `/templates/:id` | Update an existing template          |
| `DELETE` | `/templates/:id` | Soft delete a template (archives it) |

### Example API Usage

```bash
# Health check
curl http://localhost:3008/health
# Response: {"status":"ok"}

# List templates
curl http://localhost:3008/templates
# Response: {"templates":[...],"total":2}

# Create a template
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"My Template","content":"{\"subject\":\"Hello\",\"body\":\"World\"}"}' \
  http://localhost:3008/templates

# With API key (when enabled)
curl -H "x-api-key: changeme" http://localhost:3008/health
```

## 🗄️ Database

- **Type**: SQLite with Prisma ORM
- **Location**: `apps/api/var/dev.db`
- **Schema**: `apps/api/prisma/schema.prisma`
- **Auto-initialized**: Database is created automatically on first run

**Manual Commands** (if needed):

```bash
pnpm db:ensure    # Generate client and push schema
pnpm -C apps/api db:studio  # Open database viewer
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev          # Start both API and frontend
pnpm dev:api      # API server only
pnpm dev:web      # Frontend only

# Production
pnpm build        # Build both apps
pnpm start        # Start production servers

# Database
pnpm db:ensure    # Generate Prisma client and push schema
pnpm -C apps/api db:studio  # Open database viewer

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm typecheck    # Run TypeScript checks
```

## 🚨 Troubleshooting

### Common Issues

**"Missing Beefree credentials" error**

- Ensure you've copied `apps/web/env.example` to `apps/web/.env`
- Add your Beefree SDK credentials to the `.env` file

**"Invalid or missing API key" error**

- Check that `VITE_API_KEY` in frontend matches `API_KEY` in backend
- Or set both to empty for demo mode

**Database connection issues**

- Run `pnpm db:ensure` to initialize the database
- Check that `apps/api/var/` directory exists and is writable

**Port already in use**

- API runs on port 3008, frontend on 3001
- Kill existing processes or change ports in `.env` files

**CORS errors in production**

- Ensure frontend URL is in the CORS origins list in `apps/api/src/index.ts`

### Getting Help

- Check the browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure both API and frontend are running on the correct ports

## 🔧 Advanced Configuration

### Git Hooks

This project uses project-specific git hooks for code quality:

```bash
# Setup hooks (run once)
pnpm setup-hooks

# Hooks run automatically on:
# - Pre-commit: Format and lint staged files
# - Pre-push: Type check before pushing
```

### Monorepo Structure

- **`/apps/web`** - React frontend with Beefree SDK
- **`/apps/api`** - Express backend with Prisma

### Code Quality

- **Prettier**: Consistent code formatting
- **ESLint**: TypeScript linting with React support
- **TypeScript**: Full type checking
- **Lint-staged**: Pre-commit formatting and linting

## 📚 What You'll Learn

This demo showcases:

- **Beefree SDK Integration**: How to embed a professional email editor
- **Full-Stack Architecture**: React + Express + Database
- **Modern Development**: TypeScript, pnpm workspaces, Prisma ORM
- **Production Patterns**: Error handling, validation, responsive design
- **Template Management**: CRUD operations with smart naming
- **Database Design**: SQLite with Prisma for rapid prototyping

## 🎉 Ready to Start?

1. **Clone and install**: `pnpm install`
2. **Setup environment**: Copy the `.env.example` files
3. **Add Beefree credentials**: Get them from [Beefree Developer Console](https://docs.beefree.io/beefree-sdk/getting-started/readme/create-an-application.md)
4. **Run the demo**: `pnpm dev`
5. **Start building**: Open http://localhost:3001 and create your first template!

---

**Need help?** Check the [Troubleshooting](#-troubleshooting) section or refer to the [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/getting-started).
