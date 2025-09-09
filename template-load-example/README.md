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
   # Start both API and frontend concurrently
   pnpm dev
   ```

   This will start both applications with color-coded output:
   - <span style="color: cyan; font-weight: bold;">**API**</span>: http://localhost:3008
   - <span style="color: magenta; font-weight: bold;">**WEB**</span>: http://localhost:3001 (or next available port)

   Or run them individually:

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

### Environment Configuration

Copy `.env.example` to `.env` in the `apps/api` directory:

```bash
PORT=3008
API_KEY=changeme
```

- **PORT**: Server port (default: 3008)
- **API_KEY**: Optional API key for authentication (leave empty for demo mode)

### API Key Authentication

- **Demo Mode**: When `API_KEY` is empty, all requests are allowed
- **Protected Mode**: When `API_KEY` is set, requests must include `x-api-key` header

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

Copy `env.example` to `.env` and configure your Beefree credentials:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# Beefree SDK Configuration
VITE_BEEFREE_CLIENT_ID=your_client_id_here
VITE_BEEFREE_CLIENT_SECRET=your_client_secret_here
VITE_BEEFREE_UID=demo-user
```

### Getting Started

1. Copy `env.example` to `.env`
2. Add your Beefree credentials to `.env`
3. Run `pnpm dev` to start the development server
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
