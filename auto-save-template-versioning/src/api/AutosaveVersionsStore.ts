import type { AutosaveVersionsItem } from "../components/Sidebar";


const autosaveVersionsKey = 'autosaveVersions'
export class AutosaveVersionsStore {
  // local storage is used as example, but you can use any storage mechanism you prefer.
  add(item: AutosaveVersionsItem) {
    const previous = JSON.parse(window.localStorage.getItem(autosaveVersionsKey) || '[]');
    window.localStorage.setItem(autosaveVersionsKey, JSON.stringify([...previous, item]));
  }

  get() {
    return JSON.parse(window.localStorage.getItem(autosaveVersionsKey) || '[]');
  }
}

export const autosaveVersionsStore = new AutosaveVersionsStore();
