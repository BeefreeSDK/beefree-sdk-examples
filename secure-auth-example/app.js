/**
 * Beefree SDK Secure Authentication Example
 * Demonstrates proper token management and authentication flow
 */

class BeefreeSecureAuth {
    constructor() {
        this.beeInstance = null;
        this.currentToken = null;
        this.tokenRefreshTimer = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const authenticateBtn = document.getElementById('authenticate-btn');
        const uidInput = document.getElementById('uid');
        
        authenticateBtn.addEventListener('click', () => this.authenticate());
        
        // Allow Enter key to trigger authentication
        uidInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.authenticate();
            }
        });
    }

    /**
     * Wait for BeePlugin to be available
     */
    async waitForBeePlugin(maxWait = 10000) {
        return new Promise((resolve, reject) => {
            if (typeof BeePlugin !== 'undefined') {
                resolve();
                return;
            }

            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                if (typeof BeePlugin !== 'undefined') {
                    clearInterval(checkInterval);
                    resolve();
                } else if (Date.now() - startTime > maxWait) {
                    clearInterval(checkInterval);
                    reject(new Error('Timeout waiting for BeePlugin to load'));
                }
            }, 100);
        });
    }

    /**
     * Authenticate with backend and initialize Beefree SDK
     */
    async authenticate() {
        const uid = document.getElementById('uid').value.trim();
        const authenticateBtn = document.getElementById('authenticate-btn');
        
        if (!uid) {
            this.showStatus('Please enter a User ID', 'error');
            return;
        }

        // Disable button during authentication
        authenticateBtn.disabled = true;
        authenticateBtn.textContent = '🔄 Authenticating...';
        
        try {
            this.showStatus('Waiting for Beefree SDK to load...', 'info');
            
            // Wait for BeePlugin to be available
            await this.waitForBeePlugin();
            
            this.showStatus('Requesting authentication token from backend...', 'info');
            
            // Request authentication from our backend
            const response = await fetch('/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            this.currentToken = data;
            this.showTokenInfo(data);
            this.showStatus('✅ Authentication successful! Initializing Beefree SDK...', 'success');
            
            // Initialize Beefree SDK with the token
            await this.initializeBeefreeSDK();
            
        } catch (error) {
            console.error('Authentication error:', error);
            this.showStatus(`❌ Authentication failed: ${error.message}`, 'error');
        } finally {
            // Re-enable button
            authenticateBtn.disabled = false;
            authenticateBtn.textContent = '🔐 Re-authenticate';
        }
    }

    /**
     * Initialize Beefree SDK with the authenticated token
     */
    async initializeBeefreeSDK() {
        try {
            // Beefree SDK configuration
            const beeConfig = {
                uid: document.getElementById('uid').value.trim(),
                container: 'bee-plugin-container',
                language: 'en-US',
                
                // Authentication token from backend
                authToken: this.currentToken,
                
                // Builder configuration
                builder: {
                    type: 'email', // email, page, or popup
                    features: {
                        preview: true,
                        export: true,
                        save: true
                    }
                },

                // Event callbacks
                onSave: (jsonFile, htmlFile) => {
                    console.log('📧 Template saved:', { jsonFile, htmlFile });
                    this.showStatus('✅ Template saved successfully!', 'success');
                },

                onSaveAsTemplate: (jsonFile) => {
                    console.log('💾 Saved as template:', jsonFile);
                    this.showStatus('✅ Template saved to catalog!', 'success');
                },

                onPreview: (htmlFile) => {
                    console.log('👀 Preview generated:', htmlFile);
                    this.showStatus('👀 Preview generated', 'info');
                },

                onError: (errorMessage) => {
                    console.error('❌ Beefree SDK Error:', errorMessage);
                    this.showStatus(`❌ SDK Error: ${errorMessage}`, 'error');
                    
                    // Handle token expiration
                    if (errorMessage.includes('401') || errorMessage.includes('token')) {
                        this.handleTokenExpiration();
                    }
                },

                onWarning: (warningMessage) => {
                    console.warn('⚠️ Beefree SDK Warning:', warningMessage);
                }
            };

            // BeePlugin should be available now due to waitForBeePlugin check

            // Add onLoad callback to beeConfig
            beeConfig.onLoad = () => {
                console.log('🎉 Beefree SDK onLoad triggered');
                this.onBuilderLoaded();
            };

            // Initialize the Beefree SDK using the correct syntax (like CodePen example)
            await new Promise((resolve, reject) => {
                BeePlugin.create(this.currentToken, beeConfig, (beePluginInstance) => {
                    this.beeInstance = beePluginInstance;
                    console.log('✅ BeePlugin instance created successfully');
                    
                    // Load default template from Beefree (like in CodePen)
                    console.log('🚀 Loading default template...');
                    fetch("https://rsrc.getbee.io/api/templates/m-bee")
                        .then(res => res.json())
                        .then(template => {
                            console.log('📧 Template loaded, starting editor...');
                            this.beeInstance.start(template);
                            resolve();
                        })
                        .catch(err => {
                            console.error('❌ Template load failed:', err);
                            // Fallback to start without template
                            this.beeInstance.start();
                            resolve();
                        });
                }, (error) => {
                    reject(new Error(`Beefree SDK initialization failed: ${error}`));
                });
            });
            
            this.showStatus('🎉 Beefree SDK loaded successfully! You can now design your email.', 'success');
            
            // Set up token refresh monitoring
            this.setupTokenRefreshMonitoring();
            
        } catch (error) {
            console.error('SDK initialization error:', error);
            this.showStatus(`❌ Failed to initialize Beefree SDK: ${error.message}`, 'error');
        }
    }

    /**
     * Handle token expiration and refresh
     */
    async handleTokenExpiration() {
        console.log('🔄 Token expired, attempting refresh...');
        this.showStatus('🔄 Token expired, refreshing...', 'info');
        
        try {
            // Re-authenticate to get a new token
            await this.authenticate();
            
            // Update the token in the current Beefree SDK instance
            if (this.beeInstance && this.currentToken) {
                this.beeInstance.updateToken(this.currentToken);
                this.showStatus('✅ Token refreshed successfully!', 'success');
            }
            
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.showStatus('❌ Token refresh failed. Please re-authenticate.', 'error');
        }
    }

    /**
     * Set up monitoring for token refresh (every 4 minutes, token expires in 5)
     */
    setupTokenRefreshMonitoring() {
        // Clear any existing timer
        if (this.tokenRefreshTimer) {
            clearInterval(this.tokenRefreshTimer);
        }

        // Set up automatic token refresh every 4 minutes
        // (Beefree tokens expire after 5 minutes)
        this.tokenRefreshTimer = setInterval(async () => {
            console.log('🔄 Proactive token refresh...');
            await this.refreshToken();
        }, 4 * 60 * 1000); // 4 minutes
    }

    /**
     * Proactively refresh the token
     */
    async refreshToken() {
        try {
            const uid = document.getElementById('uid').value.trim();
            
            const response = await fetch('/auth/beefree', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid })
            });

            const data = await response.json();

            if (response.ok) {
                this.currentToken = data.token;
                
                // Update token in Beefree SDK instance
                if (this.beeInstance) {
                    this.beeInstance.updateToken(this.currentToken);
                }
                
                console.log('✅ Token refreshed proactively');
                this.updateTokenInfo(data);
            }
            
        } catch (error) {
            console.error('Proactive token refresh failed:', error);
        }
    }

    /**
     * Display status messages to user
     */
    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('status');
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;
        statusEl.classList.remove('hidden');
        
        // Auto-hide info messages after 5 seconds
        if (type === 'info') {
            setTimeout(() => {
                statusEl.classList.add('hidden');
            }, 5000);
        }
    }

    /**
     * Display token information
     */
    showTokenInfo(data) {
        const tokenInfoEl = document.getElementById('token-info');
        const tokenDetailsEl = document.getElementById('token-details');
        
        const tokenDisplay = {
            'Token Type': 'Bearer',
            'Expires In': '5 minutes (auto-refresh for 12 hours)',
            'Auto Refresh': 'Enabled (12 hours)',
            'V2 Token': data.v2 ? 'Yes' : 'No',
            'Timestamp': new Date().toLocaleTimeString()
        };
        
        tokenDetailsEl.innerHTML = Object.entries(tokenDisplay)
            .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
            .join('');
            
        tokenInfoEl.classList.remove('hidden');
    }

    /**
     * Update token information display
     */
    updateTokenInfo(data) {
        const tokenDetailsEl = document.getElementById('token-details');
        if (tokenDetailsEl) {
            const lines = tokenDetailsEl.innerHTML.split('</div>');
            lines[lines.length - 2] = `<div><strong>Last Refresh:</strong> ${new Date().toLocaleTimeString()}`;
            tokenDetailsEl.innerHTML = lines.join('</div>');
        }
    }

    /**
     * Cleanup when page unloads
     */
    cleanup() {
        if (this.tokenRefreshTimer) {
            clearInterval(this.tokenRefreshTimer);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new BeefreeSecureAuth();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        app.cleanup();
    });
});

// Global error handler for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
