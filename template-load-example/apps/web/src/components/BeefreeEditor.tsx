import { useEffect, useRef, useState } from 'react';
import BeefreeSDK from '@beefree.io/sdk';
import { IBeeConfig, IToken } from '@beefree.io/sdk/dist/types/bee';
import { SaveTemplateModal } from './SaveTemplateModal';
import { mockBackend } from '../mockBackend';

interface BeefreeEditorProps {
  onClose: () => void;
  onTemplateSaved?: () => void;
}

export const BeefreeEditor = ({
  onClose,
  onTemplateSaved,
}: BeefreeEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentTemplateData, setCurrentTemplateData] = useState<any>(null);
  const [currentTemplateJsonString, setCurrentTemplateJsonString] =
    useState<string>('');
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

        // Initialize Beefree SDK
        const beeInstance = new BeefreeSDK(token);
        beeInstanceRef.current = beeInstance;

        // Configuration
        const config: IBeeConfig = {
          container: 'bee-plugin-container',
          uid: uid,
          onSaveAsTemplate: (json: any) => {
            console.log('Save as template clicked, template data:', json);
            // Store both the original object and the JSON string to preserve exact formatting
            const jsonString = JSON.stringify(json);
            setCurrentTemplateData(json);
            setCurrentTemplateJsonString(jsonString);
            setShowSaveModal(true);
          },
        };

        // Start with blank template
        (window as any).bee = beeInstance;
        beeInstance.start(config, {});

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

  // Handle save template
  const handleSaveTemplate = async (templateName: string) => {
    if (!currentTemplateData || !currentTemplateJsonString) return;

    try {
      setSaving(true);

      // Use the original JSON string to preserve exact formatting
      const templateFormData = {
        name: templateName,
        content: currentTemplateJsonString,
      };

      // Save using the mock backend (this will handle name collision checking)
      await mockBackend.createTemplate(templateFormData);

      // Show success message
      alert('Template saved successfully!');
      console.log('Template Name:', templateName);
      console.log('Template JSON:', currentTemplateData);

      // Notify parent component to refresh template list
      if (onTemplateSaved) {
        onTemplateSaved();
      }

      // Close modal and reset state
      setShowSaveModal(false);
      setCurrentTemplateData(null);
      setCurrentTemplateJsonString('');
    } catch (err) {
      console.error('Error saving template:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error saving template. Please try again.';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowSaveModal(false);
    setCurrentTemplateData(null);
    setCurrentTemplateJsonString('');
    setSaving(false);
  };

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

      {/* Save Template Modal */}
      <SaveTemplateModal
        isOpen={showSaveModal}
        onClose={handleCloseModal}
        onSave={handleSaveTemplate}
        loading={saving}
      />
    </div>
  );
};
