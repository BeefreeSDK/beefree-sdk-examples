# Auto Save Template Versioning Example



```
npm install
npm run dev
```

• **Purpose**: React application that provides auto-save versioning for email templates using the Beefree SDK

• **Core Features**:
  - Email template builder integration via Beefree SDK
  - Automatic saving every 10 seconds
  - Version history management (shows latest 10 autosaves)
  - Click-to-restore functionality from sidebar history
  - Real-time timer showing autosave countdown

• **Architecture**:
  - React with TypeScript and Vite build system
  - Context API for global builder state management
  - Custom hooks for business logic (`useBuilder`, `useToken`, `useAutosaveVersions`)
  - Local storage for persistence

• **Key Components**:
  - `App.tsx`: Main application orchestrator
  - `SimpleBuilder`: Beefree SDK wrapper component
  - `Sidebar`: History display and version selection
  - `BuilderProvider`: Context provider for shared builder state

• **Data Flow**:
  - Authenticates with Beefree service using client credentials
  - Initializes builder with configuration (10s autosave interval)
  - Captures autosave events and stores versions locally
  - Updates sidebar with chronological version history
  - Allows users to load any previous version into the builder

• **Storage**: Uses `AutosaveVersionsStore` class for localStorage management of version history
