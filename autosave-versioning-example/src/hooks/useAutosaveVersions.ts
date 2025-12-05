import { useCallback, useState } from 'react';
import type { AutosaveVersionsItem as AutosaveVersionsItem } from '../components/Sidebar';
import { AutosaveVersionsStore } from '../api/AutosaveVersionsStore';

export function useAutosaveVersions(autosaveVersionsStore: AutosaveVersionsStore) {
  const [autosaveVersions, setAutosaveVersions] = useState<AutosaveVersionsItem[]>(() =>
    autosaveVersionsStore.get()
  );

  const prependAutosaveVersionsItem = useCallback((content: string) => {
    const item: AutosaveVersionsItem = {
      date: new Date().toISOString(),
      content
    };

    autosaveVersionsStore.prepend(item, 10);
    setAutosaveVersions(prev => getFirst([item, ...prev], 10));
  }, [autosaveVersionsStore, setAutosaveVersions]);

  return { autosaveVersions, addAutosaveVersionsItem: prependAutosaveVersionsItem };
}

function getFirst(autosaveVersions: AutosaveVersionsItem[], max: number) {
  return [...autosaveVersions].slice(0, max);
}
