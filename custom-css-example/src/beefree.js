import BeefreeSDK from '@beefree.io/sdk'
// Beefree SDK initialization
const authProxyUrl = import.meta.env.VITE_BEEFREE_AUTH_PROXY_URL || '/auth/token';
const templateUrl = import.meta.env.VITE_BEEFREE_TEMPLATE_URL || 'https://rsrc.getbee.io/api/templates/m-bee';

console.log('🔐 Auth proxy URL:', authProxyUrl);

export const authenticate = async function (uid) {
  return await fetch(authProxyUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uid: uid
    })
  });
}

const loadTemplate = () => fetch(templateUrl).then(response => response.json());

const removeLoadingOverlay = () => {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.remove();
  }
}

export const initializeBeefreeSDK = async function (clientConfig) {
  // Initialize Beefree SDK when BeePlugin is available
  try {
    const templateData = await loadTemplate();
    const token = await authenticate(clientConfig.uid).then(response => response.json())
    const BeePlugin = new BeefreeSDK(token);
    const bee = BeePlugin;
    window.bee = bee;
    removeLoadingOverlay();
    bee.start(clientConfig, templateData)
    console.log('🔐 Beefree SDK initialized', bee)
  } catch (error) {
    console.error('🔴 Error:', error)
  }
}
