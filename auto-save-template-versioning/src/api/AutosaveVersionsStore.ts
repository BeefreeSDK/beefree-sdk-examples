import type { AutosaveVersionsItem } from "../components/Sidebar";


const autosaveVersionsKey = 'autosaveVersions'
export class AutosaveVersionsStore {

  add(item: AutosaveVersionsItem) {
    const previous = JSON.parse(window.localStorage.getItem(autosaveVersionsKey) || '[]');
    window.localStorage.setItem(autosaveVersionsKey, JSON.stringify([...previous, item]));
  }

  get() {
    return JSON.parse(window.localStorage.getItem(autosaveVersionsKey) || '[]');
  }
}

export const autosaveVersionsStore = new AutosaveVersionsStore();
