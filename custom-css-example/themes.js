/**
 * Theme Management for Beefree SDK Custom CSS Example
 * Handles theme switching and dynamic CSS injection
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themes = {
            light: {
                name: 'Light Theme',
                colors: {
                    '--primary-color': '#667eea',
                    '--primary-dark': '#764ba2',
                    '--primary-light': '#a8b5ff',
                    '--background-main': '#ffffff',
                    '--background-secondary': '#f8f9fa',
                    '--text-primary': '#2c3e50',
                    '--text-secondary': '#6c757d',
                    '--border-color': '#e9ecef'
                }
            },
            dark: {
                name: 'Dark Theme',
                colors: {
                    '--primary-color': '#a8b5ff',
                    '--primary-dark': '#667eea',
                    '--primary-light': '#c4d0ff',
                    '--background-main': '#1a1a1a',
                    '--background-secondary': '#2d2d2d',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#b0b0b0',
                    '--border-color': '#404040'
                }
            },
            ocean: {
                name: 'Ocean Theme',
                colors: {
                    '--primary-color': '#4facfe',
                    '--primary-dark': '#00f2fe',
                    '--primary-light': '#7dd3fc',
                    '--background-main': '#ffffff',
                    '--background-secondary': '#f0f9ff',
                    '--text-primary': '#0c4a6e',
                    '--text-secondary': '#0369a1',
                    '--border-color': '#bae6fd'
                }
            },
            sunset: {
                name: 'Sunset Theme',
                colors: {
                    '--primary-color': '#f093fb',
                    '--primary-dark': '#f5576c',
                    '--primary-light': '#fbb6ce',
                    '--background-main': '#ffffff',
                    '--background-secondary': '#fef7ff',
                    '--text-primary': '#831843',
                    '--text-secondary': '#be185d',
                    '--border-color': '#f9a8d4'
                }
            },
            forest: {
                name: 'Forest Theme',
                colors: {
                    '--primary-color': '#10b981',
                    '--primary-dark': '#047857',
                    '--primary-light': '#6ee7b7',
                    '--background-main': '#ffffff',
                    '--background-secondary': '#f0fdf4',
                    '--text-primary': '#064e3b',
                    '--text-secondary': '#059669',
                    '--border-color': '#bbf7d0'
                }
            }
        };
        
        this.initializeThemeSelector();
        this.loadSavedTheme();
    }

    /**
     * Initialize theme selector UI
     */
    initializeThemeSelector() {
        const themeSelector = document.getElementById('theme-selector');
        if (!themeSelector) return;

        // Populate theme options
        Object.entries(this.themes).forEach(([key, theme]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = theme.name;
            themeSelector.appendChild(option);
        });

        // Add change event listener
        themeSelector.addEventListener('change', (e) => {
            this.switchTheme(e.target.value);
        });
    }

    /**
     * Switch to a different theme
     */
    switchTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme "${themeName}" not found`);
            return;
        }

        this.currentTheme = themeName;
        this.applyTheme(this.themes[themeName]);
        this.saveTheme(themeName);
        
        // Update theme selector
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = themeName;
        }

        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, colors: this.themes[themeName].colors }
        }));

        console.log(`🎨 Switched to ${this.themes[themeName].name}`);
    }

    /**
     * Apply theme colors to CSS custom properties
     */
    applyTheme(theme) {
        const root = document.documentElement;
        
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Set data attribute for theme-specific styling
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    /**
     * Save theme preference to localStorage
     */
    saveTheme(themeName) {
        try {
            localStorage.setItem('beefree-theme', themeName);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    }

    /**
     * Load saved theme from localStorage
     */
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('beefree-theme');
            if (savedTheme && this.themes[savedTheme]) {
                this.switchTheme(savedTheme);
            }
        } catch (error) {
            console.warn('Could not load saved theme:', error);
        }
    }

    /**
     * Get current theme information
     */
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            theme: this.themes[this.currentTheme]
        };
    }

    /**
     * Create a custom theme
     */
    createCustomTheme(name, colors) {
        this.themes[name] = {
            name: name,
            colors: colors
        };
        
        // Update theme selector if it exists
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            themeSelector.appendChild(option);
        }
        
        console.log(`✨ Created custom theme: ${name}`);
    }

    /**
     * Inject additional CSS for Beefree SDK customization
     */
    injectBeefreeCSS() {
        const cssId = 'beefree-custom-styles';
        
        // Remove existing custom styles
        const existingStyles = document.getElementById(cssId);
        if (existingStyles) {
            existingStyles.remove();
        }

        // Create new style element
        const style = document.createElement('style');
        style.id = cssId;
        style.textContent = this.generateBeefreeCSS();
        
        document.head.appendChild(style);
    }

    /**
     * Generate dynamic CSS for Beefree SDK based on current theme
     */
    generateBeefreeCSS() {
        const theme = this.themes[this.currentTheme];
        
        return `
            /* Dynamic Beefree SDK Styling */
            #bee-plugin-container .bee-toolbar {
                background: linear-gradient(135deg, ${theme.colors['--primary-color']} 0%, ${theme.colors['--primary-dark']} 100%) !important;
            }
            
            #bee-plugin-container .bee-sidebar .bee-panel-header {
                background: ${theme.colors['--primary-color']} !important;
            }
            
            #bee-plugin-container .bee-content-block:hover {
                border-color: ${theme.colors['--primary-light']} !important;
            }
            
            #bee-plugin-container .bee-content-block.selected {
                border-color: ${theme.colors['--primary-color']} !important;
                box-shadow: 0 0 0 3px ${this.hexToRgba(theme.colors['--primary-color'], 0.2)} !important;
            }
            
            #bee-plugin-container .bee-tab.active {
                color: ${theme.colors['--primary-color']} !important;
                border-bottom-color: ${theme.colors['--primary-color']} !important;
                background: ${this.hexToRgba(theme.colors['--primary-color'], 0.1)} !important;
            }
        `;
    }

    /**
     * Convert hex color to rgba with alpha
     */
    hexToRgba(hex, alpha) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return hex;
        
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /**
     * Auto-detect user's preferred color scheme
     */
    detectPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Listen for system theme changes
     */
    listenForSystemThemeChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                const preferredTheme = e.matches ? 'dark' : 'light';
                this.switchTheme(preferredTheme);
            });
        }
    }
}

// Export for use in other modules
window.ThemeManager = ThemeManager;
