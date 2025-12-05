import type { AutosaveVersionsItem } from "../components/Sidebar";


const autosaveVersionsKey = 'autosaveVersions'
export class AutosaveVersionsStore {
  // local storage is used as example, but you can use any storage mechanism you prefer.
  prepend(item: AutosaveVersionsItem, max: number) {
    const previous = JSON.parse(window.localStorage.getItem(autosaveVersionsKey) || '[]');
    const firstPrevious = [item, ...previous].slice(0, max);
    window.localStorage.setItem(autosaveVersionsKey, JSON.stringify(firstPrevious));
  }

  get() {
    return JSON.parse(window.localStorage.getItem(autosaveVersionsKey) || '[]');
  }
}

export const autosaveVersionsStore = new AutosaveVersionsStore();
