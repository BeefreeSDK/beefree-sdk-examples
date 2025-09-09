# Template Load Example

This is a demo monorepo scaffold using pnpm workspaces.

## Structure

- **`/apps/web`** - React + TypeScript frontend application
- **`/apps/api`** - Express + TypeScript API server
- **`/packages`** - Shared code and libraries can go here

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Setup git hooks (project-specific):

   ```bash
   pnpm setup-hooks
   ```

3. Run the applications:

   ```bash
   # Start both API and frontend concurrently (database auto-initialized)
   pnpm dev
   ```

   This will automatically:
   - Initialize the SQLite database with Prisma
   - Start both applications with color-coded output:
     - <span style="color: cyan; font-weight: bold;">**API**</span>: http://localhost:3008
     - <span style="color: magenta; font-weight: bold;">**WEB**</span>: http://localhost:3001 (or next available port)

   To run them individually, use the following commands:

   ```bash
   pnpm dev:api    # API server only
   pnpm dev:web    # Frontend only
   ```

## API Server

The `/apps/api` directory contains a minimal Express + TypeScript API server.

### Features

- **Express + TypeScript**: Modern Node.js server with full TypeScript support
- **Zod Validation**: Response validation using Zod schemas
- **CORS Support**: Configured for frontend integration
- **API Key Middleware**: Optional authentication (demo mode when disabled)
- **JSON Body Parser**: 5MB limit for request bodies
- **Error Handling**: Comprehensive error handling and 404 responses

### Available Endpoints

- `GET /health` - Server health check
- `GET /version` - API version information
- `GET /templates` - List all templates
- `POST /templates` - Create a new template
- `PUT /templates/:id` - Update an existing template
- `DELETE /templates/:id` - Soft delete a template (archives it)

### Environment Configuration

#### Backend API (.env file in `/apps/api/`)

Copy `.env.example` to `.env` in the `apps/api` directory:

```bash
PORT=3008
API_KEY=changeme
```

- **PORT**: Server port (default: 3008)
- **API_KEY**: Optional API key for authentication (leave empty for demo mode)
- **DATABASE_URL**: SQLite database file location (default: `file:./var/dev.db`)

### Database Setup

The API uses SQLite with Prisma ORM for data persistence.

#### Database Setup

The database is automatically initialized when you run the development or production scripts. No manual setup is required.

**Manual Database Commands** (if needed):

```bash
# Generate Prisma client and create/update database schema
pnpm db:ensure

# Open database viewer (optional)
pnpm -C apps/api db:studio
```

#### Database Location

- **SQLite file**: `apps/api/var/dev.db`
- **Schema**: `apps/api/prisma/schema.prisma`

### API Key Authentication

**Note**: This authentication only affects the backend API server, not the frontend application.

- **Demo Mode**: When `API_KEY` is empty or missing, all API requests are allowed without authentication
- **Protected Mode**: When `API_KEY` is set, API requests must include `x-api-key` header with the matching value

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with hot reload
pnpm build        # Build TypeScript to JavaScript
pnpm start        # Start production server
```

### Example Usage

```bash
# Health check
curl http://localhost:3008/health
# Response: {"status":"ok"}

# Version info
curl http://localhost:3008/version
# Response: {"version":"1.0.0"}

# List templates
curl http://localhost:3008/templates
# Response: {"templates":[...],"total":2}

# Create a new template
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"My Template","content":"{\"subject\":\"Hello\",\"body\":\"World\"}"}' \
  http://localhost:3008/templates

# Update a template
curl -X PUT -H "Content-Type: application/json" \
  -d '{"name":"Updated Template","content":"{\"subject\":\"Updated\",\"body\":\"Content\"}"}' \
  http://localhost:3008/templates/TEMPLATE_ID

# Delete a template (soft delete)
curl -X DELETE http://localhost:3008/templates/TEMPLATE_ID

# With API key (when enabled)
curl -H "x-api-key: changeme" http://localhost:3008/health
```

## Frontend Application

The `/apps/web` directory contains a React + TypeScript application that demonstrates:

### Features

- **Beefree SDK Integration**: Real email template editor using Beefree SDK
- **Authentication**: Secure authentication with Beefree API
- **Template Creation**: Create new email templates with the full Beefree editor
- **Responsive Design**: Works on desktop and mobile devices

### Beefree SDK Integration

The application integrates the official Beefree SDK to provide:

- Full-featured email template editor
- Drag-and-drop interface
- Real-time preview
- Template saving and loading
- Professional email design tools
- **Save as Template functionality**: Click "Save as template" in the builder toolbar to save your design with a custom name

### Available Scripts

```bash
# Development (run from template-load-example/ root)
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
```

### Environment Variables

#### Frontend Web App (.env file in `/apps/web/`)

Copy `env.example` to `.env` in the `apps/web` directory and configure your credentials:

```bash
# API Configuration
VITE_API_URL=http://localhost:3008
VITE_API_KEY=changeme

# Beefree SDK Configuration
VITE_BEEFREE_CLIENT_ID=your_client_id_here
VITE_BEEFREE_CLIENT_SECRET=your_client_secret_here
VITE_BEEFREE_UID=demo-user
```

**Variable Descriptions:**

- **VITE_API_URL**: Backend API base URL (default: http://localhost:3008)
- **VITE_API_KEY**: API key for backend authentication (optional, leave empty for demo mode)
- **VITE_BEEFREE_CLIENT_ID**: Your Beefree SDK client ID
- **VITE_BEEFREE_CLIENT_SECRET**: Your Beefree SDK client secret
- **VITE_BEEFREE_UID**: User identifier for Beefree SDK

**Important Notes:**

- The `VITE_API_KEY` variable only affects communication with the backend API
- When `VITE_API_KEY` is empty or missing, the frontend will make API calls without authentication headers
- The Beefree SDK credentials are used for the email template editor functionality

### Getting Started

1. **Setup Backend API**: Copy `apps/api/.env.example` to `apps/api/.env` and configure if needed
2. **Setup Frontend**: Copy `apps/web/env.example` to `apps/web/.env` and add your Beefree credentials
3. Run `pnpm dev` to start both development servers
4. Click "Open Beefree SDK" to start the Beefree editor with a blank template
5. Design your template using the full Beefree editor
6. Click "Save as template" in the builder toolbar to save your design
7. Enter a template name and click "Save" - the template will appear in your template list

## Adding Apps

When you're ready to add applications, create them in the `apps/` directory. Each app should have its own `package.json` file.

## Adding Shared Packages

Shared code and utilities can be added to the `packages/` directory. These can be consumed by apps in the monorepo.

## Git Hooks

This monorepo uses project-specific git hooks to ensure code quality. The hooks only run when you're working within the `template-load-example/` directory.

### Pre-commit Hook

- **Runs:** `pnpm lint-staged`
- **Purpose:** Automatically formats and lints staged files before committing
- **Files:** `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`, `*.md`
- **Actions:**
  - `prettier --write` - Format code with consistent styling
  - `eslint --fix` - Fix linting issues automatically
- **Scope:** Only runs when `template-load-example/` files are staged

### Pre-push Hook

- **Runs:** `pnpm typecheck`
- **Purpose:** Ensures type checking passes before pushing to remote
- **Scope:** Only runs when in `template-load-example/` directory
- **Note:** Currently shows placeholder message until TypeScript is configured

### Setup

Run `pnpm setup-hooks` to install the hooks in the parent git repository.

## Development Scripts

### Root Level (Concurrent)

- `pnpm dev` - Start both API and frontend concurrently with color-coded output
- `pnpm build` - Build both API and frontend for production
- `pnpm start` - Start both API and frontend in production mode
- `pnpm typecheck` - Run TypeScript type checking on both apps

### Individual Apps

- `pnpm dev:api` - Start API server only
- `pnpm dev:web` - Start frontend only
- `pnpm build:api` - Build API server only
- `pnpm build:web` - Build frontend only
- `pnpm start:api` - Start API server in production
- `pnpm start:web` - Start frontend in production
- `pnpm typecheck:api` - Type check API server only
- `pnpm typecheck:web` - Type check frontend only

### Code Quality

- `pnpm setup-hooks` - Install project-specific git hooks
- `pnpm lint` - Run ESLint on all files
- `pnpm lint:fix` - Run ESLint and fix auto-fixable issues
- `pnpm format` - Format all files with Prettier
- `pnpm format:check` - Check if files are formatted correctly
- `pnpm lint-staged` - Run lint-staged on staged files

### Terminal Output Styling

The concurrent scripts use color-coded prefixes to make it easy to identify which app is logging:

- <span style="color: cyan; font-weight: bold;">**API**</span>: API server logs
- <span style="color: magenta; font-weight: bold;">**WEB**</span>: Frontend logs

## Code Quality Tools

- **Prettier**: Code formatting with consistent style rules
- **ESLint**: JavaScript/TypeScript linting with TypeScript support
- **Lint-staged**: Runs formatters only on staged files during commits
- **Git hooks**: Project-specific pre-commit and pre-push hooks

## Notes

- **No `prepare` script needed**: Since we're using a custom setup approach for project-specific hooks, the standard Husky `prepare` script is not used.
- **Manual hook setup**: Run `pnpm setup-hooks` after installing dependencies to set up the git hooks.
