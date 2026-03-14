# Angular Email Builder + NestJS Secure Authentication Example

A full-stack example demonstrating secure [Beefree SDK](https://docs.beefree.io/beefree-sdk/) authentication using **Angular 20** on the frontend and **NestJS** on the backend.

![Angular](https://img.shields.io/badge/Angular-20-dd0031?logo=angular)
![NestJS](https://img.shields.io/badge/NestJS-11-e0234e?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## Features

- **Secure server-side authentication** — API credentials never leave the backend
- **NestJS idiomatic backend** — Modules, controllers, services, DTOs with validation
- **Angular 20 standalone components** — Signals, modern control flow (`@if`, `@for`)
- **Draggable split panel** — Resizable left/right layout with drag handle
- **Real-time API monitor** — HTTP interceptor tracks all API calls
- **Template loading** — Load sample or blank templates from the NestJS API
- **Comprehensive test suite** — 100% coverage on frontend and backend

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Header (Beefree logo ← → NestJS logo)         │
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

- **Node.js** >= 22
- **Yarn** >= 4.x
- Beefree SDK credentials from [developers.beefree.io](https://developers.beefree.io)

## Setup

### 1. Install dependencies

```bash
cd angular-nestjs-auth-example
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
PORT=3034
```

### 3. Start development servers

```bash
yarn start
```

This starts both:
- **NestJS backend** on `http://localhost:3034`
- **Angular frontend** on `http://localhost:8034` (with proxy to backend)

### 4. Open the app

Navigate to [http://localhost:8034](http://localhost:8034)

## Backend API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/token` | Authenticate with Beefree (requires `{ uid: string }`) |
| `GET` | `/template/sample` | Get sample email template JSON |
| `GET` | `/template/blank` | Get blank email template JSON |
| `GET` | `/health` | Health check |

## Project Structure

```
angular-nestjs-auth-example/
├── package.json              # Yarn workspace root
├── frontend/
│   ├── index.html
│   ├── vite.config.ts        # Vite + @analogjs/vite-plugin-angular
│   └── src/
│       ├── main.ts           # Angular bootstrap
│       ├── styles.css         # Global styles
│       └── app/
│           ├── app.component.ts
│           ├── app.config.ts
│           ├── components/
│           │   ├── app-header/
│           │   ├── auth-section/
│           │   ├── split-layout/
│           │   ├── left-panel/
│           │   ├── unauth-info/
│           │   ├── builder-area/
│           │   └── api-monitor-panel/
│           ├── services/
│           │   ├── auth.service.ts
│           │   └── api-monitor.service.ts
│           └── types/
│               └── index.ts
└── backend/
    ├── nest-cli.json
    ├── .env.example
    └── src/
        ├── main.ts
        ├── app.module.ts
        ├── auth/
        │   ├── auth.module.ts
        │   ├── auth.controller.ts
        │   ├── auth.service.ts
        │   └── dto/
        │       └── authenticate.dto.ts
        └── templates/
            ├── templates.module.ts
            ├── templates.controller.ts
            ├── templates.service.ts
            └── data/
                ├── sample.json
                └── blank.json
```

## Key Technologies

### Frontend
- **Angular 20** — Standalone components, signals, modern control flow
- **@beefree.io/angular-email-builder** — Angular wrapper component/service for Beefree SDK
- **Vite** + **@analogjs/vite-plugin-angular** — Fast dev server and builds
- **HTTP interceptors** — Functional interceptor for API monitoring

### Backend
- **NestJS 11** — Modular architecture with dependency injection
- **@nestjs/config** — Environment variable management
- **class-validator** — DTO validation with decorators
- **ValidationPipe** — Global request validation

## Security

- API credentials (`BEEFREE_CLIENT_ID`, `BEEFREE_CLIENT_SECRET`) are stored only in the backend `.env` file
- Frontend never handles credentials — only receives temporary JWT tokens
- The NestJS `ValidationPipe` validates all incoming requests
- CORS is configured to allow only the frontend origin

## Troubleshooting

### "Missing Beefree credentials" error
Ensure `backend/.env` has valid `BEEFREE_CLIENT_ID` and `BEEFREE_CLIENT_SECRET`.

### Port already in use
Kill existing processes: `lsof -ti:3034 -ti:8034 | xargs kill -9`

### Build errors with @analogjs
Ensure `@angular/build` is installed as a devDependency in the frontend package.

## Testing

Run all tests:

```bash
yarn test
```

Run full coverage checks (frontend + backend, both enforced at 100%):

```bash
yarn test:coverage
```

Run coverage per workspace:

```bash
yarn workspace frontend test:coverage
yarn workspace backend test:coverage
```

## npm Package Readiness

This example is already implemented against the public package interface of `@beefree.io/angular-email-builder`.

- No source-code changes are required when the package is published.
- The only expected switch is dependency sourcing in [frontend/package.json](frontend/package.json):
    - Current local development source: `file:./lib/angular-email-builder`
    - Published source: standard npm semver (for example `^1.1.1` or newer)

## Related

- [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Angular Documentation](https://angular.dev/)
