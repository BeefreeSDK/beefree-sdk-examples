# GitHub Copilot Instructions for Beefree SDK Examples

## 🎯 Project Purpose

This repository provides **production-ready, working examples** of Beefree SDK integration for developers. Each example demonstrates specific features and use cases that developers can implement using the [Beefree SDK](https://docs.beefree.io/beefree-sdk/).

**Target Audience**: Developers who want to integrate Beefree SDK into their applications
**Goal**: Provide clear, functional examples that can be copied, modified, and used as reference implementations

## About Beefree SDK

Beefree SDK is an embeddable no-code builder that allows end users to design:
- **Emails**: Drag-and-drop email creation with industry best practices
- **Landing Pages**: Visually stunning page builder
- **Popups**: Attention-grabbing popup designer

### Key Capabilities
- No-code drag-and-drop interface
- AI-generated templates and AI Writing Assistant
- File Manager for media assets
- Template catalog with best practices
- Comprehensive API suite for customization
- White-label and highly customizable

**Documentation**: https://docs.beefree.io/beefree-sdk/

## Repository Structure

This is a **monorepo** where each folder represents an **independent, self-contained example**:

```
beefree-sdk-examples/
├── .eslintrc.cjs                  # Shared ESLint config (root-level)
├── package.json                   # Root scripts (start:commenting, start:custom-css)
├── shared/
│   └── auth.js                    # Shared authentication module (JWT tokens)
├── commenting-example/            # Real-time commenting system
├── custom-css-example/            # Dynamic theming and CSS customization
├── secure-auth-example/           # Authentication server (shared by multiple examples)
├── template-export-pdf-example/   # PDF export with Beefree Content Services API
└── [future examples...]
```

## Key Principles

### Independence & Portability
- Each example folder **must work independently** when copied to another location
- After copying: `yarn install && yarn start` should be sufficient to run
- No cross-folder dependencies except for explicitly documented shared services

### Shared Services Pattern
- Some examples share the `secure-auth-example` authentication server
- This is clearly documented and handled by root-level start commands
- Examples: `commenting-example` and `custom-css-example` use shared auth

### Technology Stack
All examples use a **consistent, modern full-stack TypeScript architecture**:

**Package Manager:**
- **Yarn** is the required package manager for this repository
- All commands and scripts must use `yarn` (e.g., `yarn install`, `yarn start`)
- Do NOT use `npm` or `pnpm`

**Frontend:**
- React 19 with hooks
- TypeScript for type safety
- Vite for fast development and optimized builds

**Backend:**
- TypeScript + Express.js
- ES Modules
- tsx for hot reloading during development
- Shared auth module for consistency
- Environment variables for secure credential management

## Security Requirements

### Critical: Backend-Only Credentials
- **NEVER** expose `BEEFREE_CLIENT_ID` or `BEEFREE_CLIENT_SECRET` in frontend code
- **NEVER** expose API keys in frontend code
- All authentication must happen server-side
- Use environment variables (`.env` files) for credentials
- Frontend only receives temporary JWT tokens from backend

### Authentication Pattern
```
Frontend → Backend Auth Server → Beefree SDK API
         (temp JWT)          (credentials)
```

## Code Quality Standards

### ESLint Configuration
- Single ESLint configuration at root (`.eslintrc.cjs`)
- Applies to all subfolders automatically

### TypeScript
- Full type safety throughout
- Use official Beefree SDK types when available
- Avoid `any` types (warnings are acceptable in examples)
- Proper error handling with typed exceptions

##  Development Commands

### Root-Level Commands
```bash
yarn start:commenting  # Start commenting example + auth server
yarn start:custom-css  # Start custom-css example + auth server
```

### Individual Example Commands
```bash
cd [example-folder]
yarn install               # Install dependencies
yarn start                 # Start the example
yarn dev               # Development mode (Vite)
yarn build             # Production build
yarn type-check        # TypeScript type checking
```

## Example Structure Pattern

Each example should follow this structure:

```
example-name/
├── .env.example          # Environment variable template
├── README.md             # Detailed setup and feature documentation
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration (for React examples)
├── index.html            # HTML entry point
├── server.ts             # Backend server (if needed)
├── src/
│   ├── index.tsx         # Frontend entry point
│   ├── styles.css        # Global styles
│   ├── components/       # React components
│   │   ├── App.tsx
│   │   ├── BeefreeEditor.tsx
│   │   └── [feature-specific components]
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── config/           # Configuration files
│   └── types/            # TypeScript type definitions
└── public/               # Static assets
```

## 🔍 When Working on Examples

### Adding New Features
1. Check Beefree SDK documentation for the feature: https://docs.beefree.io/beefree-sdk/
2. Implement in a type-safe manner with proper error handling
3. Add clear comments explaining SDK-specific configurations
4. Update example's README with feature documentation
5. Test independently by copying folder to another location

### Modifying Existing Examples
1. Maintain the existing architecture patterns
2. Preserve TypeScript type safety
3. Keep security best practices (backend-only credentials)
4. Update documentation if behavior changes

### Documentation Requirements
- Each example MUST have a comprehensive README
- Include setup instructions
- Document environment variables
- Explain key features and SDK configuration used
- Provide troubleshooting tips
- Link to relevant Beefree SDK documentation

## 📦 Dependencies Management

### Root-Level Dependencies
- ESLint and related plugins
- commitlint to check commit messages format
- Concurrently (for running multiple processes)

### Example-Level Dependencies
- `@beefree.io/sdk`: Official Beefree SDK package
- React & React DOM
- Vite (build tool)
- Express (backend server)
- dotenv (environment variables)

### Commit Messages
Follow conventional commits format:
- `feat: add commenting example`
- `fix: resolve token refresh issue in auth server`
- `docs: update README with new setup instructions`
- `chore: update dependencies`

## 🎓 Learning Resources

### Beefree SDK Documentation
- Main docs: https://docs.beefree.io/beefree-sdk/
- Developer Console: https://developers.beefree.io/
- GitHub repositories: https://github.com/BeefreeSDK
- API Reference: https://docs.beefree.io/beefree-sdk/apis/

## 💡 When Assisting Developers

### Understanding Intent
- Developers want working, copy-paste ready examples
- Prioritize clarity and documentation over complexity
- Each example should be self-contained and easy to understand
- Security best practices are non-negotiable

### Code Suggestions
- Follow established patterns in the repository
- Maintain consistency across examples
- Provide complete code snippets, not partial solutions
- Include TypeScript types in all suggestions
- Reference official Beefree SDK documentation

### Troubleshooting Approach
1. Check environment variables and credentials
2. Verify authentication flow (backend → Beefree API)
3. Review browser console and network tab
4. Check server logs for backend errors
5. Validate SDK configuration against documentation
6. Ensure all dependencies are installed

## 🎯 Success Criteria for Examples

Each example should:
- ✅ Work independently after copying to new location
- ✅ Have clear, comprehensive documentation
- ✅ Follow TypeScript best practices
- ✅ Implement security best practices (backend credentials)
- ✅ Include error handling and loading states
- ✅ Be production-ready quality
- ✅ Pass ESLint checks
- ✅ Include setup instructions and troubleshooting
- ✅ Demonstrate clear use case(s) of Beefree SDK features

---

**Remember**: These examples are reference implementations for developers integrating Beefree SDK. Code quality, security, and documentation are equally important as functionality.
