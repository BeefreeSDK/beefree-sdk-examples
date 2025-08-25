import { initializeBeefreeSDK } from './beefree.js'
import { clientConfig } from './clientConfig.js'

const getTheme = () => {
  const currentTheme = localStorage.getItem('theme') || '-';
  return currentTheme;
}

export const getThemeUrl = () => {
  const theme = getTheme();
  const themeUrl = `${location.origin}/themes/theme-${theme}.css`;
  console.log('🔐 Theme', themeUrl)
  return themeUrl
}

export const themeManager = () => {
  const currentTheme = localStorage.getItem('theme') || '-';
  const themeSelector = document.getElementById('theme-selector');
  themeSelector.value = currentTheme;
  themeSelector.addEventListener('change', (event) => {
    const theme = event.target.value;
    localStorage.setItem('theme', theme);
    
    console.log('🔐 Theme changed to', theme)
    if (window.bee) {
      const themeUrl = `${location.origin}/themes/theme-${theme}.css`;
      initializeBeefreeSDK({...clientConfig, customCss: themeUrl})
    }
  });
}