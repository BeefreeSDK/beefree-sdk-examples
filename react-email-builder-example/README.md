# React Email Builder Example

A ready-to-run example demonstrating how to use the [`@beefree.io/react-email-builder`](https://www.npmjs.com/package/@beefree.io/react-email-builder) wrapper package to integrate Beefree SDK into a React application. This wrapper provides a declarative `<Builder>` component and a `useBuilder()` hook, removing the need to manually instantiate `new BeefreeSDK()`.

Built with **React 19 + TypeScript + Vite** and a dedicated Express backend for secure authentication.

---

## Features Demonstrated

### Builder Types
- **Email Builder** - Drag-and-drop email creation
- **Page Builder** - Landing page designer
- **Popup Builder** - Popup creator
- **File Manager** - Media asset management

### React Wrapper Capabilities
- **`<Builder>` Component** - Declarative SDK embedding via `token` prop
- **`useBuilder()` Hook** - Programmatic control (preview, save, load, export, etc.)
- **Co-editing** - Real-time collaboration with split-pane view and draggable divider
- **Multi-language UI** - 22 interface languages with live switching
- **Content Languages** - Multi-language template support
- **Credentials Error Handling** - Localized error messages when authentication fails

### Architecture
- **Secure Backend Auth** - Credentials never exposed to frontend
- **Per-builder Credentials** - Separate Client ID/Secret per builder type
- **Fallback Credentials** - Single default credential set as fallback
- **Shared Auth Server Support** - Optional use of `secure-auth-example` backend

---

## Quick Start

### Prerequisites
- Node.js 22+ and Yarn
- Beefree SDK credentials from the [Developer Console](https://developers.beefree.io)

### Option 1: Run from Repository Root (Recommended)

```bash
# From the beefree-sdk-examples root directory
yarn start:react-email-builder
```

This single command will:
- Install all dependencies
- Start the authentication server (port 3032)
- Start the frontend (port 8032)

**Before running**, configure your credentials in `react-email-builder-example/.env`:

```env
# At minimum, provide one set of credentials:
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3032
```

Then open http://localhost:8032 in your browser.

### Option 2: Run Manually

```bash
cd react-email-builder-example
yarn install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials, then:

```bash
yarn start
```

Or run backend and frontend separately:

```bash
# Terminal 1: Backend Server
yarn server:dev

# Terminal 2: Frontend Client
yarn dev
```

Open http://localhost:8032 in your browser.

---

## Authentication Flow

This example uses a dedicated backend server to keep credentials secure:

```
Frontend                     Backend (server.ts)              Beefree API
   |                              |                              |
   |-- POST /auth/token --------->|                              |
   |   { uid, builderType }       |-- POST /loginV2 ----------->|
   |                              |   { client_id, secret, uid } |
   |                              |<-- { access_token, ... } ----|
   |<-- IToken -------------------|                              |
   |                              |                              |
   |-- <Builder token={token} />  |                              |
```

The `<Builder>` component from `@beefree.io/react-email-builder` handles SDK initialization internally -- no `new BeefreeSDK()` needed.

### Builder-specific Credentials

Each builder type can have its own application in the Developer Console. This ensures the correct sidebar options appear (e.g., Form button for Page builder):

| Builder Type | Env Variables | Fallback |
|---|---|---|
| Email Builder | `EMAIL_CLIENT_ID` / `EMAIL_CLIENT_SECRET` | `BEEFREE_CLIENT_ID` / `BEEFREE_CLIENT_SECRET` |
| Page Builder | `PAGE_CLIENT_ID` / `PAGE_CLIENT_SECRET` | `BEEFREE_CLIENT_ID` / `BEEFREE_CLIENT_SECRET` |
| Popup Builder | `POPUP_CLIENT_ID` / `POPUP_CLIENT_SECRET` | `BEEFREE_CLIENT_ID` / `BEEFREE_CLIENT_SECRET` |
| File Manager | `FILE_MANAGER_CLIENT_ID` / `FILE_MANAGER_CLIENT_SECRET` | `BEEFREE_CLIENT_ID` / `BEEFREE_CLIENT_SECRET` |

### Using the Shared Auth Server

Instead of running the local backend, you can use the `secure-auth-example` auth server:

1. Start `secure-auth-example`:
   ```bash
   cd secure-auth-example && yarn install && yarn server:dev
   ```
2. In `react-email-builder-example/.env`, set:
   ```env
   VITE_BEEFREE_AUTH_PROXY_URL=http://localhost:3000/auth/token
   ```
3. Run only the frontend:
   ```bash
   cd react-email-builder-example && yarn dev
   ```

**Note**: The shared auth server uses a single credential set, so builder-specific sidebar options may differ.

---

## Key Integration Points

### 1. The `<Builder>` Component

```tsx
import { Builder, useBuilder } from '@beefree.io/react-email-builder'

const { id, preview, save, load } = useBuilder(config)

<Builder
  id={id}
  token={token}
  template={template}
  shared={isCoEditing}
  onSave={(json, html) => { /* handle save */ }}
  onError={(error) => { /* handle error */ }}
/>
```

### 2. The `useBuilder()` Hook

Provides programmatic control over the builder instance:

- `preview()` - Open template preview
- `save()` - Trigger save callback
- `saveAsTemplate()` - Save as reusable template
- `toggleStructure()` - Show/hide structure outline
- `load(json)` - Load a template JSON
- `getTemplateJson()` - Export current template
- `updateConfig(partial)` - Update configuration (e.g., language)
- `switchTemplateLanguage({ language })` - Switch content language

### 3. Co-editing

Enable real-time collaboration by passing `shared={true}`. When the primary builder starts a session, `onSessionStarted` fires with a `sessionId` that the second builder uses to join:

```tsx
<Builder shared={true} onSessionStarted={({ sessionId }) => { /* join */ }} />
<Builder shared={true} sessionId={sessionId} /> {/* second instance */}
```

> **Plan Requirements**: Co-editing requires a **Superpowers** or **Enterprise** plan.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `BEEFREE_CLIENT_ID` | Yes* | - | Default Beefree Client ID (fallback) |
| `BEEFREE_CLIENT_SECRET` | Yes* | - | Default Beefree Client Secret (fallback) |
| `EMAIL_CLIENT_ID` | No | - | Email builder-specific Client ID |
| `EMAIL_CLIENT_SECRET` | No | - | Email builder-specific Client Secret |
| `PAGE_CLIENT_ID` | No | - | Page builder-specific Client ID |
| `PAGE_CLIENT_SECRET` | No | - | Page builder-specific Client Secret |
| `POPUP_CLIENT_ID` | No | - | Popup builder-specific Client ID |
| `POPUP_CLIENT_SECRET` | No | - | Popup builder-specific Client Secret |
| `FILE_MANAGER_CLIENT_ID` | No | - | File Manager-specific Client ID |
| `FILE_MANAGER_CLIENT_SECRET` | No | - | File Manager-specific Client Secret |
| `PORT` | No | `3032` | Backend server port |
| `VITE_PORT` | No | `8032` | Frontend dev server port |
| `VITE_BEEFREE_AUTH_PROXY_URL` | No | `/auth/token` | Auth endpoint URL (for shared auth server) |
| `VITE_EMAIL_TEMPLATE_URL` | No | Beefree default | Email builder sample template URL |
| `VITE_PAGE_TEMPLATE_URL` | No | Blank template | Page builder sample template URL |
| `VITE_POPUP_TEMPLATE_URL` | No | Blank template | Popup builder sample template URL |

\* At minimum, provide `BEEFREE_CLIENT_ID`/`BEEFREE_CLIENT_SECRET` **or** builder-specific credentials.

---

## Available Scripts

```bash
yarn dev              # Start frontend dev server
yarn start            # Start both frontend and backend
yarn build            # Production build (client + server)
yarn preview          # Preview production build
yarn server:dev       # Start backend in dev mode
yarn type-check       # Check TypeScript types
yarn type-check:server # Check server TypeScript types
```

---

## Troubleshooting

### Authentication Fails
- Ensure the backend server is running on port 3032 (or your configured port)
- Verify credentials in `.env` match your Developer Console application
- Check server console for detailed error messages

### Builder Not Loading
- Check browser console for errors
- Verify the `@beefree.io/react-email-builder` package is installed
- Ensure the token is valid (not expired)

### Co-editing Not Working
- Co-editing requires a Superpowers or Enterprise plan
- Both builder instances need valid tokens from the same application
- Check for error messages in the browser console

### Wrong Sidebar Options
- Each builder type should have its own application in the Developer Console
- Use builder-specific credentials (`EMAIL_CLIENT_ID`, `PAGE_CLIENT_ID`, etc.)
- The fallback credentials use a single application which may not have all builder types configured

---

## Related Resources

- **[@beefree.io/react-email-builder](https://www.npmjs.com/package/@beefree.io/react-email-builder)** - NPM package
- **[Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)** - Official docs
- **[Developer Console](https://developers.beefree.io/)** - Manage applications and credentials
- **[React Documentation](https://react.dev/)** - React best practices
- **[Vite Documentation](https://vitejs.dev/)** - Vite configuration

---

## License

This example is part of the Beefree SDK Examples repository.
