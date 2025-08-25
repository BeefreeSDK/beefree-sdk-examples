/**
 * Beefree SDK Custom CSS Example
 * Main application logic for theme management and SDK integration
 */

class BeefreeCustomCSS {
    constructor() {
        this.beeInstance = null;
        this.themeManager = null;
        this.isBuilderLoaded = false;
        
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Initialize theme manager
            this.themeManager = new ThemeManager();
            console.log('✅ Theme manager initialized');
            
            // Wait a bit for DOM to be fully ready
            setTimeout(() => {
                this.setupEventListeners();
                console.log('✅ Event listeners setup complete');
            }, 100);
            
            // Check if BeePlugin is loaded
            if (typeof BeePlugin !== 'undefined') {
                console.log('✅ BeePlugin is available');
            } else {
                console.error('❌ BeePlugin is not loaded');
            }
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
        }
    }

    setupEventListeners() {
        // Load builder button
        const loadBtn = document.getElementById('load-builder-btn');
        console.log('🔍 Looking for load-builder-btn:', loadBtn);
        if (loadBtn) {
            // Remove any existing listeners
            loadBtn.onclick = null;
            
            loadBtn.addEventListener('click', (e) => {
                console.log('🎯 Load builder button clicked', e);
                e.preventDefault();
                e.stopPropagation();
                this.loadBuilder();
            });
            console.log('✅ Load builder button listener added');
        } else {
            console.error('❌ Load builder button not found');
            // List all buttons for debugging
            const allButtons = document.querySelectorAll('button');
            console.log('🔍 All buttons found:', Array.from(allButtons).map(b => b.id || b.textContent));
        }
        
        // Theme selector
        const themeSelect = document.getElementById('theme-selector');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                console.log('🎨 Theme changed to:', e.target.value);
                this.themeManager.applyTheme(e.target.value);
                
                // Reload editor with new theme if already loaded
                if (this.isBuilderLoaded) {
                    console.log('🔄 Reloading editor with new theme...');
                    this.reloadEditorWithTheme();
                }
            });
            console.log('✅ Theme selector listener added');
        } else {
            console.log('⚠️ Theme selector not found');
        }
        
        // Toggle preview button
        const previewBtn = document.getElementById('toggle-preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.togglePreview();
            });
        }
        
        // Export HTML button
        const exportBtn = document.getElementById('export-html-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportHTML();
            });
        }
    }

    async loadBuilder() {
        console.log('🚀 loadBuilder() called');
        
        if (this.isBuilderLoaded) {
            console.log('⚠️ Builder already loaded');
            return;
        }

        // Show loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
            console.log('✅ Loading overlay shown');
        } else {
            console.error('❌ Loading overlay not found');
        }
        
        this.updateStatus('🔄 Loading Beefree SDK...', 'info');
            
        // Inject theme-specific CSS
        this.themeManager.injectBeefreeCSS();
            
        try {
            // Get authentication token
            console.log('🔑 Requesting authentication token...');
            const tokenResponse = await fetch('/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid: 'custom-css-user' })
            });

            if (!tokenResponse.ok) {
                throw new Error(`Authentication failed: ${tokenResponse.statusText}`);
            }

            const tokenData = await tokenResponse.json();
            console.log('🔑 Authentication successful');

            // Configure Beefree SDK with custom CSS
            const beeConfig = {
                uid: 'demo-user-css',
                container: 'bee-plugin-container',
                language: 'en-US',
                
                // Custom CSS for theming - use data URI with inline CSS
                customCss: this.generateThemeDataURI(),
                
                // Event callbacks
                onSave: (jsonFile, htmlFile) => {
                    console.log('📧 Template saved:', { jsonFile, htmlFile });
                    this.updateStatus('✅ Template saved successfully!');
                },

                onSaveAsTemplate: (jsonFile) => {
                    console.log('💾 Saved as template:', jsonFile);
                    this.updateStatus('✅ Template saved to catalog!');
                },

                onPreview: (htmlFile) => {
                    console.log('👀 Preview generated:', htmlFile);
                    this.updateStatus('👀 Preview mode activated');
                },

                onLoad: () => {
                    console.log('🎉 Beefree SDK loaded successfully');
                    this.onBuilderLoaded();
                },

                onError: (errorMessage) => {
                    console.error('❌ Beefree SDK Error:', errorMessage);
                    this.updateStatus(`❌ Error: ${errorMessage}`, 'error');
                },

                onWarning: (warningMessage) => {
                    console.warn('⚠️ Beefree SDK Warning:', warningMessage);
                }
            };

            // Check if BeePlugin is available
            if (typeof BeePlugin === 'undefined') {
                throw new Error('BeePlugin is not loaded. Check CDN connection.');
            }

            console.log('🚀 Creating BeePlugin instance...');
            
            // Initialize Beefree SDK following CodePen example
            console.log('📞 Calling BeePlugin.create with token:', tokenData.access_token ? 'Token present' : 'No token');
            
            BeePlugin.create(tokenData, beeConfig, (bee) => {
                console.log('✅ BeePlugin callback executed');
                this.beeInstance = bee;
                
                // Load default template after initialization
                console.log('📥 Fetching default template...');
                fetch("https://rsrc.getbee.io/api/templates/m-bee")
                    .then(res => {
                        console.log('📡 Template response status:', res.status);
                        return res.json();
                    })
                    .then(template => {
                        console.log('📧 Template loaded, starting editor...');
                        bee.start(template);
                    })
                    .catch(err => {
                        console.error('❌ Template load failed:', err);
                        console.log('🔄 Starting without template...');
                        bee.start();
                    });
            });
            
        } catch (error) {
            console.error('Failed to load Beefree SDK:', error);
            this.updateStatus(`❌ Failed to load builder: ${error.message}`, 'error');
        } finally {
            // Hide loading overlay
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }
    }

    onBuilderLoaded() {
        this.isBuilderLoaded = true;
        this.updateStatus('🎉 Builder loaded successfully!', 'success');
        
        // Show builder controls
        const controls = document.getElementById('builder-controls');
        if (controls) {
            controls.classList.remove('hidden');
        }
        
        // Hide load button
        const loadBtn = document.getElementById('load-builder-btn');
        if (loadBtn) {
            loadBtn.style.display = 'none';
        }
    }

    togglePreview() {
        if (!this.beeInstance) {
            this.updateStatus('❌ Builder not loaded', 'error');
            return;
        }

        try {
            this.beeInstance.preview();
            this.updateStatus('👀 Preview mode activated');
        } catch (error) {
            console.error('Preview error:', error);
            this.updateStatus('❌ Preview failed', 'error');
        }
    }

    exportHTML() {
        if (!this.beeInstance) {
            this.updateStatus('❌ Builder not loaded', 'error');
            return;
        }

        try {
            this.beeInstance.save((jsonFile, htmlFile) => {
                // Create download link for HTML
                const blob = new Blob([htmlFile], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'email-template.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.updateStatus('📥 HTML exported successfully!', 'success');
            });
        } catch (error) {
            console.error('Export error:', error);
            this.updateStatus('❌ Export failed', 'error');
        }
    }

    generateThemeDataURI() {
        const currentTheme = this.themeManager.getCurrentTheme();
        const theme = this.themeManager.themes[currentTheme];
        
        if (!theme) return '';
        
        // Generate proper theme CSS for Beefree editor
        const css = `
            /* Beefree SDK Theme: ${theme.name} */
            
            /* Main workspace styling */
            body {
                background-color: ${theme.variables['--background-color']} !important;
                color: ${theme.variables['--text-color']} !important;
            }
            
            /* Toolbar and panels */
            [class*="bee"] {
                background-color: ${theme.variables['--surface-color']} !important;
                color: ${theme.variables['--text-color']} !important;
            }
            
            /* Buttons and interactive elements */
            [class*="button"] {
                background-color: ${theme.variables['--primary-color']} !important;
                color: ${theme.variables['--text-color']} !important;
                border-color: ${theme.variables['--border-color']} !important;
            }
            
            /* Input fields */
            [class*="input"], [class*="field"] {
                background-color: ${theme.variables['--background-color']} !important;
                color: ${theme.variables['--text-color']} !important;
                border-color: ${theme.variables['--border-color']} !important;
            }
            
            /* Panels and containers */
            [class*="panel"], [class*="sidebar"], [class*="toolbar"] {
                background-color: ${theme.variables['--surface-color']} !important;
                border-color: ${theme.variables['--border-color']} !important;
            }
        `;
        
        console.log(`🎨 Generated test CSS for theme: ${theme.name}`);
        console.log('CSS content:', css);
        
        const dataUri = `data:text/css;charset=utf-8,${encodeURIComponent(css)}`;
        console.log('Data URI:', dataUri);
        
        return dataUri;
    }

    async reloadEditorWithTheme() {
        if (!this.beeInstance) return;
        
        try {
            // Clear the current editor container
            const container = document.getElementById('bee-plugin-container');
            if (container) {
                container.innerHTML = '';
            }
            
            // Reset state
            this.isBuilderLoaded = false;
            this.beeInstance = null;
            
            // Show loading overlay
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.remove('hidden');
            }
            
            this.updateStatus('🔄 Reloading editor with new theme...', 'info');
            
            // Reload with current theme
            await this.loadBuilder();
            
        } catch (error) {
            console.error('❌ Failed to reload editor:', error);
            this.updateStatus('❌ Failed to reload editor', 'error');
        }
    }

    updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status ${type}`;
        }
        console.log(`[Status] ${message}`);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Beefree Custom CSS Example...');
    window.beefreeApp = new BeefreeCustomCSS();
});
