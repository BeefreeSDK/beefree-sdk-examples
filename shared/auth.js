/**
 * Shared Beefree SDK Authentication Module
 * Used by all examples for consistent authentication handling
 */

/**
 * Authenticate with Beefree SDK and get access token
 * @param {string} clientId - Beefree client ID
 * @param {string} clientSecret - Beefree client secret  
 * @param {string} uid - User identifier
 * @returns {Promise<Object>} Token data with access_token and v2 flag
 */
/**
 * Authenticates with Beefree SDK and returns a complete IToken
 * @param {string} clientId - Beefree client ID
 * @param {string} clientSecret - Beefree client secret  
 * @param {string} uid - User identifier
 * @returns {Promise<IToken>} Complete IToken object compatible with Beefree SDK
 */
async function authenticateBeefree(clientId, clientSecret, uid) {
    const authUrl = 'https://auth.getbee.io/loginV2';
    
    const authData = {
        client_id: clientId,
        client_secret: clientSecret,
        uid: uid
    };

    console.log('🔐 Authenticating with Beefree SDK...');
    
    const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status} ${errorText}`);
    }

    const tokenData = await response.json();
    
    // Validate IToken structure from remote auth server
    if (!tokenData.access_token) {
        throw new Error('Invalid IToken response: missing access_token');
    }

    // The remote auth server already returns a complete IToken structure
    // No transformation needed - return as-is for direct SDK usage
    console.log('✅ Authentication successful');
    return tokenData; // This is already a valid IToken
}

/**
 * Create Express.js authentication endpoint
 * @param {Object} app - Express app instance
 * @param {string} clientId - Beefree client ID
 * @param {string} clientSecret - Beefree client secret
 */
function setupAuthEndpoint(app, clientId, clientSecret) {
    app.post('/auth/token', async (req, res) => {
        try {
            const { uid } = req.body;
            
            if (!uid) {
                return res.status(400).json({ 
                    error: 'Missing uid parameter' 
                });
            }

            if (!clientId || !clientSecret) {
                return res.status(500).json({ 
                    error: 'Missing Beefree credentials in server configuration' 
                });
            }

            const tokenData = await authenticateBeefree(clientId, clientSecret, uid);
            
            res.json(tokenData);
            
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(500).json({ 
                error: 'Authentication failed',
                details: error.message 
            });
        }
    });
}

/**
 * Initialize Beefree SDK with proper template loading
 * @param {Object} token - Authentication token
 * @param {Object} config - Beefree configuration
 * @returns {Promise<Object>} Beefree instance
 */
function initializeBeefreeSDK(token, config) {
    return new Promise((resolve, reject) => {
        BeePlugin.create(token, config, (beePluginInstance) => {
            console.log('✅ BeePlugin instance created successfully');
            
            // Load default template from Beefree
            console.log('🚀 Loading default template...');
            fetch("https://rsrc.getbee.io/api/templates/m-bee")
                .then(res => res.json())
                .then(template => {
                    console.log('📧 Template loaded, starting editor...');
                    beePluginInstance.start(template);
                    resolve(beePluginInstance);
                })
                .catch(err => {
                    console.error('❌ Template load failed:', err);
                    // Fallback to start without template
                    beePluginInstance.start();
                    resolve(beePluginInstance);
                });
        }, (error) => {
            reject(new Error(`Beefree SDK initialization failed: ${error}`));
        });
    });
}

// Export for Node.js (server-side)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        authenticateBeefree,
        setupAuthEndpoint,
        initializeBeefreeSDK
    };
}

// Export for browser (client-side)
if (typeof window !== 'undefined') {
    window.BeefreeAuth = {
        initializeBeefreeSDK
    };
}
