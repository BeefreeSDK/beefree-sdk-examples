# Template Load Example

This is a demo monorepo scaffold using pnpm workspaces.

## Structure

- **`/apps/web`** - React + TypeScript frontend application
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

3. Run the frontend application:

   ```bash
   pnpm dev
   ```

   The app will open at http://localhost:3001

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

- `pnpm dev` - Start the frontend development server
- `pnpm build` - Build the frontend for production
- `pnpm preview` - Preview the production build
- `pnpm setup-hooks` - Install project-specific git hooks
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint on all files
- `pnpm lint:fix` - Run ESLint and fix auto-fixable issues
- `pnpm format` - Format all files with Prettier
- `pnpm format:check` - Check if files are formatted correctly
- `pnpm lint-staged` - Run lint-staged on staged files

## Code Quality Tools

- **Prettier**: Code formatting with consistent style rules
- **ESLint**: JavaScript/TypeScript linting with TypeScript support
- **Lint-staged**: Runs formatters only on staged files during commits
- **Git hooks**: Project-specific pre-commit and pre-push hooks

## Notes

- **No `prepare` script needed**: Since we're using a custom setup approach for project-specific hooks, the standard Husky `prepare` script is not used.
- **Manual hook setup**: Run `pnpm setup-hooks` after installing dependencies to set up the git hooks.
