import { useEffect, useRef, useState } from 'react';
import BeefreeSDK from '@beefree.io/sdk';
import { IBeeConfig, IToken } from '@beefree.io/sdk/dist/types/bee';

interface BeefreeEditorProps {
  onClose: () => void;
}

export const BeefreeEditor = ({ onClose }: BeefreeEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const beeInstanceRef = useRef<any>(null);
  const initializationRef = useRef(false);

  useEffect(() => {
    const initializeSDK = async () => {
      if (initializationRef.current) return;
      initializationRef.current = true;

      try {
        setIsLoading(true);
        setError(null);

        // Get credentials from environment
        const clientId = import.meta.env.VITE_BEEFREE_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_BEEFREE_CLIENT_SECRET;
        const uid = import.meta.env.VITE_BEEFREE_UID || 'demo-user';

        if (!clientId || !clientSecret) {
          throw new Error(
            'Missing Beefree credentials. Please set VITE_BEEFREE_CLIENT_ID and VITE_BEEFREE_CLIENT_SECRET'
          );
        }

        // Authenticate with Beefree
        const authResponse = await fetch('https://auth.getbee.io/loginV2', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            uid: uid,
          }),
        });

        if (!authResponse.ok) {
          const errorText = await authResponse.text();
          throw new Error(
            `Authentication failed: ${authResponse.status} ${errorText}`
          );
        }

        const token: IToken = await authResponse.json();

        if (!token.access_token) {
          throw new Error('Invalid token response: missing access_token');
        }

        // Load default template
        const templateResponse = await fetch(
          'https://rsrc.getbee.io/api/templates/m-bee'
        );
        const templateData = await templateResponse.json();

        // Initialize Beefree SDK
        const beeInstance = new BeefreeSDK(token);
        beeInstanceRef.current = beeInstance;

        // Configuration
        const config: IBeeConfig = {
          container: 'bee-plugin-container',
          uid: uid,
        };

        // Store globally and start
        (window as any).bee = beeInstance;
        beeInstance.start(config, templateData);

        console.log('✅ Beefree SDK initialized successfully');
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize Beefree SDK';
        setError(errorMessage);
        console.error('❌ Beefree SDK initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeSDK, 100);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (beeInstanceRef.current) {
        try {
          beeInstanceRef.current.destroy?.();
        } catch (err) {
          console.error('Error destroying Beefree SDK:', err);
        }
      }
    };
  }, []);

  if (error) {
    return (
      <div className="editor-container">
        <div className="editor-header">
          <h2>Beefree Editor</h2>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="error-message">
          ❌ Failed to initialize Beefree SDK: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="builder-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="spinner"></div>
              <span>Loading Beefree SDK...</span>
            </div>
          </div>
        )}

        <div id="bee-plugin-container" />
      </div>
    </div>
  );
};
