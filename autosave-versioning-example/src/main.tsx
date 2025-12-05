import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { authorizer } from './api/Authorizer.ts';
import { autosaveVersionsStore } from './api/AutosaveVersionsStore.ts';
import { BuilderProvider } from './hooks/useBuilder.tsx';
import type { IBeeConfig } from '@beefree.io/sdk/dist/types/bee';
import { AUTOSAVE_INTERVAL, DEFAULT_CONTAINER, DEFAULT_UID } from './config/constants.ts';

const staticEditorConfig: IBeeConfig = {
  container: DEFAULT_CONTAINER,
  uid: DEFAULT_UID,
  autosave: AUTOSAVE_INTERVAL, // seconds to wait before saving
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BuilderProvider staticConfig={staticEditorConfig} >
      <App authorizer={authorizer} autosaveVersionsStore={autosaveVersionsStore} />
    </BuilderProvider>
  </StrictMode>,
)
