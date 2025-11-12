import { useState, useEffect, useCallback } from 'react'
import { initializeBeefreeSDK } from '../services/beefree'
import { clientConfig } from '../config/clientConfig'
import { ThemeType } from '../types'

export const useThemeManager = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('')

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType || ''
    setCurrentTheme(savedTheme)
  }, [])

  const getThemeUrl = useCallback((theme: ThemeType = currentTheme): string => {
    if (!theme) return ''
    return `${location.origin}/themes/theme-${theme}.css`
  }, [currentTheme])

  const changeTheme = useCallback(async (theme: ThemeType) => {
    setCurrentTheme(theme)
    localStorage.setItem('theme', theme)
    
    console.log('🔐 Theme changed to', theme)
    
    if (window.bee && theme) {
      const themeUrl = getThemeUrl(theme)
      await initializeBeefreeSDK({ ...clientConfig, customCss: themeUrl })
    }
  }, [getThemeUrl])

  return {
    currentTheme,
    changeTheme,
    getThemeUrl
  }
}
