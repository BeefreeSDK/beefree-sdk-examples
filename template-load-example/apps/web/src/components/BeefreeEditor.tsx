import { useEffect, useRef, useState } from 'react';
import BeefreeSDK from '@beefree.io/sdk';
import { IBeeConfig, IToken } from '@beefree.io/sdk/dist/types/bee';
import { SaveTemplateModal } from './SaveTemplateModal';
import { api, ApiError } from '../services/api';

import { Template } from '../types';

interface BeefreeEditorProps {
  onClose: () => void;
  onTemplateSaved?: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  templateToLoad?: string; // JSON string of template to load
  existingTemplate?: Template | null; // If editing an existing template
}

export const BeefreeEditor = ({
  onClose,
  onTemplateSaved,
  onSuccess,
  onError,
  templateToLoad,
  existingTemplate = null,
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

        // Parse template data if provided
        let templateData = {};
        if (templateToLoad) {
          try {
            templateData = JSON.parse(templateToLoad);
            console.log('Loading template data:', templateData);
          } catch (err) {
            console.error('Error parsing template data:', err);
            onError('Invalid template data format');
            return;
          }
        }

        // Start with template data (blank if none provided)
        (window as any).bee = beeInstance;
        beeInstance.start(config, templateData);

        console.log('✅ Beefree SDK initialized successfully');
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize Beefree SDK';
        setError(errorMessage);
        onError(errorMessage);
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
  const handleSaveTemplate = async (
    templateName: string,
    saveAsCopy: boolean
  ) => {
    if (!currentTemplateData || !currentTemplateJsonString) return;

    try {
      setSaving(true);

      // Use the original JSON string to preserve exact formatting
      const templateFormData = {
        name: templateName,
        content: currentTemplateJsonString,
      };

      if (existingTemplate && !saveAsCopy) {
        // Update existing template - increment version
        const newVersion = incrementVersion(existingTemplate.version);
        const updateData = {
          ...templateFormData,
          version: newVersion,
        };

        await api.updateTemplate(existingTemplate.id, updateData);
        onSuccess(
          `Template "${templateName}" updated to version ${newVersion}!`
        );
      } else {
        // Create new template (either from scratch or as a copy)
        await api.createTemplate(templateFormData);
        onSuccess(
          saveAsCopy
            ? 'Template saved as copy!'
            : 'Template saved successfully!'
        );
      }

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
        err instanceof ApiError
          ? err.message
          : 'Error saving template. Please try again.';
      onError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Helper function to increment version number
  const incrementVersion = (version: string): string => {
    const parts = version.split('.');
    const major = parseInt(parts[0]) || 0;
    const minor = parseInt(parts[1]) || 0;
    const patch = parseInt(parts[2]) || 0;

    // Increment patch version
    return `${major}.${minor}.${patch + 1}`;
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
        existingTemplate={existingTemplate}
      />
    </div>
  );
};
