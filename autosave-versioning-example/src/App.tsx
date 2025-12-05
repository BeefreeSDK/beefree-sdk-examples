import './App.css'
import { SimpleBuilder } from './components/SimpleBuilder'
import { Authorizer } from './api/Authorizer';
import { Sidebar } from './components/Sidebar';
import { AutosaveVersionsStore } from './api/AutosaveVersionsStore.ts';
import { useAutosaveVersions } from './hooks/useAutosaveVersions.ts';
import { useEffect } from 'react';
import { useBuilder } from './hooks/useBuilder.tsx';


function App({ authorizer, autosaveVersionsStore }: { authorizer: Authorizer, autosaveVersionsStore: AutosaveVersionsStore }) {
  const { setConfig } = useBuilder()
  const { autosaveVersions, addAutosaveVersionsItem } = useAutosaveVersions(autosaveVersionsStore);

  useEffect(() => {
    const onAutoSave = (data: string) => {
      console.log('Auto-save triggered:', JSON.parse(data));
      addAutosaveVersionsItem(data);
    };
    setConfig((prev) => ({ ...prev, onAutoSave }))
  }, [addAutosaveVersionsItem, setConfig])

  return (
    <>
      <div className="page">
        <Sidebar autosaveVersions={autosaveVersions} />
        <SimpleBuilder authorizer={authorizer} className='builder' />
      </div>
    </>
  )
}

export default App
