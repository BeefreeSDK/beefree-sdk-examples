import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { authorizer } from './api/Authorizer.ts';
import { autosaveVersionsStore } from './api/AutosaveVersionsStore.ts';
import { BuilderProvider } from './hooks/useBuilder.tsx';
import type { IBeeConfig } from '@beefree.io/sdk/dist/types/bee';

const staticEditorConfig: IBeeConfig = {
  container: "builder",
  uid: 'user_id',
  autosave: 10, // seconds to wait before saving
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BuilderProvider staticConfig={staticEditorConfig} >
      <App authorizer={authorizer} autosaveVersionsStore={autosaveVersionsStore} />
    </BuilderProvider>
  </StrictMode>,
)
