/**
 * Theme Manager for Beefree SDK Custom CSS Example
 * Handles theme switching and CSS variable management
 */

class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                name: 'Light',
                icon: '☀️',
                variables: {
                    '--primary-color': '#007bff',
                    '--secondary-color': '#6c757d',
                    '--background-color': '#ffffff',
                    '--surface-color': '#f8f9fa',
                    '--text-color': '#212529',
                    '--text-secondary': '#6c757d',
                    '--border-color': '#dee2e6',
                    '--shadow': '0 2px 4px rgba(0,0,0,0.1)',
                    '--accent-color': '#17a2b8'
                }
            },
            dark: {
                name: 'Dark',
                icon: '🌙',
                variables: {
                    '--primary-color': '#0d6efd',
                    '--secondary-color': '#adb5bd',
                    '--background-color': '#212529',
                    '--surface-color': '#343a40',
                    '--text-color': '#ffffff',
                    '--text-secondary': '#adb5bd',
                    '--border-color': '#495057',
                    '--shadow': '0 2px 4px rgba(0,0,0,0.3)',
                    '--accent-color': '#20c997'
                }
            },
            ocean: {
                name: 'Ocean',
                icon: '🌊',
                variables: {
                    '--primary-color': '#0077be',
                    '--secondary-color': '#4a90a4',
                    '--background-color': '#f0f8ff',
                    '--surface-color': '#e6f3ff',
                    '--text-color': '#003d5c',
                    '--text-secondary': '#4a90a4',
                    '--border-color': '#b3d9ff',
                    '--shadow': '0 2px 4px rgba(0,119,190,0.2)',
                    '--accent-color': '#00a8cc'
                }
            },
            sunset: {
                name: 'Sunset',
                icon: '🌅',
                variables: {
                    '--primary-color': '#ff6b35',
                    '--secondary-color': '#d4a574',
                    '--background-color': '#fff8f0',
                    '--surface-color': '#ffe6d6',
                    '--text-color': '#8b4513',
                    '--text-secondary': '#d4a574',
                    '--border-color': '#ffcc99',
                    '--shadow': '0 2px 4px rgba(255,107,53,0.2)',
                    '--accent-color': '#ff8c42'
                }
            },
            forest: {
                name: 'Forest',
                icon: '🌲',
                variables: {
                    '--primary-color': '#228b22',
                    '--secondary-color': '#8fbc8f',
                    '--background-color': '#f0fff0',
                    '--surface-color': '#e6ffe6',
                    '--text-color': '#006400',
                    '--text-secondary': '#8fbc8f',
                    '--border-color': '#98fb98',
                    '--shadow': '0 2px 4px rgba(34,139,34,0.2)',
                    '--accent-color': '#32cd32'
                }
            }
        };

        this.currentTheme = this.loadSavedTheme() || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeSelector();
    }

    setupThemeSelector() {
        const selector = document.getElementById('theme-selector');
        if (!selector) return;

        // Populate theme options
        selector.innerHTML = '';
        Object.entries(this.themes).forEach(([key, theme]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${theme.icon} ${theme.name}`;
            if (key === this.currentTheme) {
                option.selected = true;
            }
            selector.appendChild(option);
        });

        // Handle theme changes
        selector.addEventListener('change', (e) => {
            this.switchTheme(e.target.value);
        });
    }

    switchTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme "${themeName}" not found`);
            return;
        }

        this.currentTheme = themeName;
        this.applyTheme(themeName);
        this.saveTheme(themeName);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, variables: this.themes[themeName].variables }
        }));
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        this.currentTheme = themeName;
        const root = document.documentElement;
        
        // Apply CSS variables
        Object.entries(theme.variables).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Update body class for additional styling
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        console.log(`🎨 Applied theme: ${theme.name}`);
    }

    injectBeefreeCSS() {
        const currentTheme = this.themes[this.currentTheme];
        
        // Create or update Beefree CSS style element
        let beefreCSSElement = document.getElementById('beefree-theme-css');
        if (!beefreCSSElement) {
            beefreCSSElement = document.createElement('style');
            beefreCSSElement.id = 'beefree-theme-css';
            document.head.appendChild(beefreCSSElement);
        }

        // Generate Beefree-specific CSS based on current theme
        const beefreeCSS = `
            /* Beefree SDK Theme Customization */
            #bee-plugin-container {
                --bee-primary-color: ${currentTheme.variables['--primary-color']};
                --bee-secondary-color: ${currentTheme.variables['--secondary-color']};
                --bee-background-color: ${currentTheme.variables['--background-color']};
                --bee-text-color: ${currentTheme.variables['--text-color']};
                --bee-border-color: ${currentTheme.variables['--border-color']};
                background-color: ${currentTheme.variables['--background-color']} !important;
                border: 2px solid ${currentTheme.variables['--border-color']} !important;
            }
            
            /* Apply theme colors to Beefree interface elements */
            #bee-plugin-container * {
                --primary-color: ${currentTheme.variables['--primary-color']} !important;
                --secondary-color: ${currentTheme.variables['--secondary-color']} !important;
            }
            
            /* Toolbar styling */
            #bee-plugin-container [class*="toolbar"],
            #bee-plugin-container [class*="header"],
            #bee-plugin-container [class*="top-bar"] {
                background-color: ${currentTheme.variables['--background-color']} !important;
                border-color: ${currentTheme.variables['--border-color']} !important;
                color: ${currentTheme.variables['--text-color']} !important;
            }
            
            /* Sidebar styling */
            #bee-plugin-container [class*="sidebar"],
            #bee-plugin-container [class*="panel"] {
                background-color: ${currentTheme.variables['--background-color']} !important;
                color: ${currentTheme.variables['--text-color']} !important;
                border-color: ${currentTheme.variables['--border-color']} !important;
            }
            
            /* Button styling */
            #bee-plugin-container button,
            #bee-plugin-container [class*="button"] {
                background-color: ${currentTheme.variables['--primary-color']} !important;
                color: white !important;
                border-color: ${currentTheme.variables['--primary-color']} !important;
            }
            
            /* Input styling */
            #bee-plugin-container input,
            #bee-plugin-container select,
            #bee-plugin-container textarea {
                background-color: ${currentTheme.variables['--background-color']} !important;
                color: ${currentTheme.variables['--text-color']} !important;
                border-color: ${currentTheme.variables['--border-color']} !important;
            }
        `;

        beefreCSSElement.textContent = beefreeCSS;
        console.log(`🎨 Injected Beefree CSS for theme: ${currentTheme.name}`);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeVariables(themeName = this.currentTheme) {
        return this.themes[themeName]?.variables || {};
    }

    saveTheme(themeName) {
        try {
            localStorage.setItem('beefree-custom-css-theme', themeName);
        } catch (error) {
            console.warn('Failed to save theme preference:', error);
        }
    }

    loadSavedTheme() {
        try {
            return localStorage.getItem('beefree-custom-css-theme');
        } catch (error) {
            console.warn('Failed to load saved theme:', error);
            return null;
        }
    }

    // Method to get theme-aware styles for Beefree SDK
    getBeefreeThemeConfig() {
        const variables = this.getThemeVariables();
        
        return {
            customCSS: `
                /* Apply current theme variables to Beefree SDK */
                .bee-editor {
                    --bee-primary-color: ${variables['--primary-color']};
                    --bee-background-color: ${variables['--surface-color']};
                    --bee-text-color: ${variables['--text-color']};
                    --bee-border-color: ${variables['--border-color']};
                }
                
                /* Toolbar styling */
                .bee-toolbar {
                    background-color: ${variables['--surface-color']} !important;
                    border-bottom: 1px solid ${variables['--border-color']} !important;
                }
                
                /* Button styling */
                .bee-button {
                    background-color: ${variables['--primary-color']} !important;
                    border-color: ${variables['--primary-color']} !important;
                }
                
                /* Panel styling */
                .bee-panel {
                    background-color: ${variables['--background-color']} !important;
                    color: ${variables['--text-color']} !important;
                }
            `
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
}
