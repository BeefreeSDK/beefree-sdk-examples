# Vue Email Builder + Fastify Secure Authentication Example

A full-stack example demonstrating secure [Beefree SDK](https://docs.beefree.io/beefree-sdk/) authentication using **Vue 3** on the frontend and **Fastify 5** on the backend.

![Vue](https://img.shields.io/badge/Vue-3.5-42d392?logo=vue.js)
![Fastify](https://img.shields.io/badge/Fastify-5-000000?logo=fastify)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

## Features

- **Secure server-side authentication** — API credentials never leave the backend
- **Fastify 5 idiomatic backend** — fp-wrapped plugins, env-schema + TypeBox configuration, JSON schema validation
- **Vue 3 Composition API** — `<script setup>`, composables, reactive refs
- **Draggable split panel** — Resizable left/right layout with keyboard accessibility
- **Real-time API monitor** — Fetch wrapper tracks all API calls with request/response details
- **Template loading** — Load sample or blank templates from the Fastify API
- **Comprehensive test suite** — 100% frontend coverage (Vitest), backend integration tests (node:test)

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Header (Beefree logo ← → Fastify + Vue logos)  │
├─────────────────────────────────────────────────┤
│  Auth Strip (User ID + Authenticate button)     │
├────────────────────┬──┬─────────────────────────┤
│  LEFT PANEL        │▐▐│  RIGHT PANEL            │
│                    │▐▐│                          │
│  Before auth:      │▐▐│  🔍 API Monitor         │
│   How-it-works     │▐▐│  ────────────────────── │
│   description      │▐▐│  Recent API Calls (n)   │
│                    │▐▐│  ────────────────────── │
│  After auth:       │▐▐│  POST /auth/token  200  │
│   Black menu bar   │▐▐│  GET /template/sample   │
│   + Beefree Editor │▐▐│  ...                    │
│                    │▐▐│                          │
└────────────────────┴──┴─────────────────────────┘
                      ▲
               Draggable divider
```

## Prerequisites

- **Node.js** >= 20
- **Yarn** >= 4.x
- Beefree SDK credentials from [developers.beefree.io](https://developers.beefree.io)

## Setup

### 1. Install dependencies

```bash
cd vue-fastify-auth-example
yarn install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your Beefree SDK credentials:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3033
```

### 3. Start development servers

```bash
yarn start
```

This starts both:
- **Fastify backend** on `http://localhost:3033`
- **Vue frontend** on `http://localhost:8033` (with proxy to backend)

### 4. Open the app

Navigate to [http://localhost:8033](http://localhost:8033)

## Backend API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/token` | Authenticate with Beefree (requires `{ uid: string }`) |
| `GET` | `/template/sample` | Get sample email template JSON |
| `GET` | `/template/blank` | Get blank email template JSON |
| `GET` | `/health` | Health check |

## Project Structure

```
vue-fastify-auth-example/
├── package.json              # Yarn workspace root
├── frontend/
│   ├── index.html
│   ├── vite.config.ts        # Vite + @vitejs/plugin-vue (port 8033)
│   ├── vitest.config.ts      # Vitest with 100% coverage thresholds
│   └── src/
│       ├── main.ts           # Vue app bootstrap
│       ├── styles.css        # Global styles + CSS variables
│       ├── App.vue
│       ├── components/
│       │   ├── AppHeader.vue
│       │   ├── AuthSection.vue
│       │   ├── SplitLayout.vue
│       │   ├── SplitDivider.vue
│       │   ├── LeftPanel.vue
│       │   ├── UnauthInfo.vue
│       │   ├── BuilderArea.vue
│       │   └── ApiMonitorPanel.vue
│       ├── composables/
│       │   ├── useAuth.ts
│       │   ├── useApiMonitor.ts
│       │   └── useSplitPanel.ts
│       ├── services/
│       │   └── authService.ts
│       ├── config/
│       │   └── constants.ts
│       └── types/
│           └── index.ts
└── backend/
    ├── .env.example
    └── src/
        ├── server.ts          # Entry point (node --experimental-strip-types)
        ├── app.ts             # Fastify app factory (buildApp)
        ├── plugins/
        │   ├── config.ts      # env-schema + TypeBox config
        │   ├── cors.ts        # @fastify/cors
        │   └── sensible.ts    # @fastify/sensible
        ├── routes/
        │   ├── auth.ts        # POST /auth/token
        │   ├── templates.ts   # GET /template/{sample,blank}
        │   └── health.ts      # GET /health
        ├── types/
        │   └── fastify.d.ts   # FastifyInstance.config declaration merge
        └── data/
            ├── sample.json
            └── blank.json
```

## Key Technologies

### Frontend
- **Vue 3.5** — Composition API with `<script setup lang="ts">`, reactive refs, composables
- **@beefree.io/vue-email-builder** — Vue wrapper component for Beefree SDK
- **Vite 6** + **@vitejs/plugin-vue** — Fast dev server and builds
- **Vitest** + **@vue/test-utils** — Unit testing with 100% coverage enforcement

### Backend
- **Fastify 5** — fp-wrapped plugins, JSON schema route validation
- **env-schema** + **@sinclair/typebox** — Type-safe environment configuration
- **@fastify/cors** + **@fastify/sensible** — CORS and HTTP error utilities
- **Node-adaptive TS runtime** — Uses `--experimental-strip-types` on Node 22+, falls back to `tsx` on Node 20/21
- **node:test** + **app.inject()** — Integration testing (per [mcollina/skills](https://github.com/mcollina/skills))

## Security

- API credentials (`BEEFREE_CLIENT_ID`, `BEEFREE_CLIENT_SECRET`) are stored only in the backend `.env` file
- Frontend never handles credentials — only receives temporary JWT tokens
- Fastify's JSON schema validation validates all incoming request bodies
- CORS is configured to allow only the frontend origin

## Shared Auth Server

This example can optionally use the `secure-auth-example` shared authentication server.

Set `VITE_BEEFREE_AUTH_PROXY_URL=http://localhost:3000/auth/token` in a `.env` file in the `frontend/` directory to route authentication through the shared server instead of this example's own backend.

## Troubleshooting

### "Missing Beefree credentials" error
Ensure `backend/.env` has valid `BEEFREE_CLIENT_ID` and `BEEFREE_CLIENT_SECRET`.

### Port already in use
Kill existing processes: `lsof -ti:3033 -ti:8033 | xargs kill -9`

### Node.js version
Node 22+ is recommended. Node 20/21 is also supported via `tsx` fallback.

## Testing

Run all tests:

```bash
yarn test
```

Run frontend tests with coverage:

```bash
yarn workspace frontend test:coverage
```

Run backend tests:

```bash
yarn workspace backend test
```

## npm Package Readiness

This example is implemented against the public package interface of `@beefree.io/vue-email-builder`.

- No source-code changes are required when the package is published.
- The only expected switch is dependency sourcing in [frontend/package.json](frontend/package.json):
    - Current local development source: `file:./lib/vue-email-builder`
    - Published source: standard npm semver (e.g., `^0.1.0` or newer)

## Related

- [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)
- [Fastify Documentation](https://fastify.dev/docs/latest/)
- [Vue.js Documentation](https://vuejs.org/)
