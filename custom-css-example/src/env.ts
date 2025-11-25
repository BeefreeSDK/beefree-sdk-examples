export const envs = {
  AUTH_PROXY_URL: import.meta.env.VITE_BEEFREE_AUTH_PROXY_URL || '/auth/token',
  TEMPLATE_URL: import.meta.env.VITE_BEEFREE_TEMPLATE_URL || 'https://rsrc.getbee.io/api/templates/m-bee',
};

