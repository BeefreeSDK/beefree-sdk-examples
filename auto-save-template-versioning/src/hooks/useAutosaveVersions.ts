import { useCallback, useState } from 'react';
import type { AutosaveVersionsItem as AutosaveVersionsItem } from '../components/Sidebar';
import { AutosaveVersionsStore } from '../api/AutosaveVersionsStore';

export function useAutosaveVersions(autosaveVersionsStore: AutosaveVersionsStore) {
  const [autosaveVersions, setAutosaveVersions] = useState<AutosaveVersionsItem[]>(() =>
    getFirst10DescByDate(autosaveVersionsStore.get())
  );

  const addAutosaveVersionsItem = useCallback((content: string) => {
    const item: AutosaveVersionsItem = {
      date: new Date().toISOString(),
      content
    };

    autosaveVersionsStore.add(item);
    setAutosaveVersions(prev => getFirst10DescByDate([...prev, item]));
  }, [autosaveVersionsStore, setAutosaveVersions]);

  return { autosaveVersions, addAutosaveVersionsItem };
}

function getFirst10DescByDate(autosaveVersions: AutosaveVersionsItem[]) {
  return [...autosaveVersions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);
}
