export const getPublicPlanName = (internalName: string): string => {
  const normalizedName = internalName.toLowerCase().trim()
  
  const mapping: Record<string, string> = {
    'beeplugin_free': 'Free',
    'beeplugin_startup_annual': 'Essentials (Annual)',
    'beeplugin_startup': 'Essentials',
    'beeplugin_silver_annual': 'Core (Annual)',
    'beeplugin_silver': 'Core',
    'beeplugin_gold_annual': 'Superpowers (Annual)',
    'beeplugin_gold': 'Superpowers',
    'beeplugin_enterprise': 'Enterprise',
  }

  if (mapping[normalizedName]) {
    return mapping[normalizedName]
  }

  // Fallback: Remove 'beeplugin_' prefix and capitalize
  const friendlyName = normalizedName.replace(/^beeplugin_/, '')
  return friendlyName.charAt(0).toUpperCase() + friendlyName.slice(1)
}

