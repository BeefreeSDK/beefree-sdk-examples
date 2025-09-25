import { useEffect, useRef, useState } from 'react';
import BeefreeSDK from '@beefree.io/sdk';
import { IBeeConfig, IToken } from '@beefree.io/sdk/dist/types/bee';
import { SaveTemplateModal } from './SaveTemplateModal';
import { api, ApiError } from '../services/api';

import { Template } from '../types';

interface BeefreeEditorProps {
  onClose: () => void;
  onError: (message: string) => void;
  templateToLoad?: string; // JSON string of template to load
  existingTemplate?: Template | null; // If editing an existing template
  onDirectSave: (
    json: unknown,
    existingTemplate?: Template | null
  ) => Promise<{
    needsModal?: boolean;
    templateData?: unknown;
    templateJsonString?: string;
  } | void>;
  onSaveTemplate: (
    templateName: string,
    templateJsonString: string,
    existingTemplate?: Template | null,
    saveAsCopy?: boolean
  ) => Promise<void>;
}

export const BeefreeEditor = ({
  onClose,
  onError,
  templateToLoad,
  existingTemplate = null,
  onDirectSave,
  onSaveTemplate,
}: BeefreeEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentTemplateData, setCurrentTemplateData] = useState<unknown>(null);
  const [currentTemplateJsonString, setCurrentTemplateJsonString] =
    useState<string>('');
  const beeInstanceRef = useRef<any>(null);
  const lastLoadedTemplateRef = useRef<string | undefined>(undefined);

  const initializeSDK = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Authenticate with Beefree via backend proxy
      const authResponse = await api.authenticateBeefree();

      if (!authResponse.success || !authResponse.token.access_token) {
        throw new Error(
          'Authentication failed: Invalid response from auth proxy'
        );
      }

      const token: IToken = authResponse.token as unknown as IToken;

      // Initialize Beefree SDK
      const beeInstance = new BeefreeSDK(token);
      beeInstanceRef.current = beeInstance;

      // Configuration
      const config: IBeeConfig = {
        container: 'bee-plugin-container',
        uid: 'demo-user',
        onSaveAsTemplate: (json: unknown) => {
          // Store both the original object and the JSON string to preserve exact formatting
          const jsonString = JSON.stringify(json);
          setCurrentTemplateData(json);
          setCurrentTemplateJsonString(jsonString);
          setShowSaveModal(true);
        },
        onSave: (json: unknown) => {
          // Direct save without modal - override existing template or create new one
          handleDirectSave(json);
        },
      };

      let initialTemplateData = {};
      if (templateToLoad) {
        try {
          initialTemplateData = JSON.parse(templateToLoad);
        } catch (err) {
          console.error('Error parsing initial template data:', err);
          const errorMessage =
            err instanceof Error
              ? `Invalid template data format: ${err.message}`
              : 'Invalid template data format: Unable to parse JSON';
          onError(errorMessage);
          return;
        }
      }

      // Start with template data (blank if none provided)
      (window as any).bee = beeInstance;
      beeInstance.start(config, initialTemplateData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to initialize Beefree SDK';
      setError(errorMessage);
      onError(errorMessage);
      console.error('❌ Beefree SDK initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeSDK, 100);
    return () => {
      clearTimeout(timer);
      // Cleanup Beefree SDK on unmount
      if (beeInstanceRef.current) {
        try {
          beeInstanceRef.current.destroy?.();
        } catch (err) {
          console.error('Error destroying Beefree SDK:', err);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (
      templateToLoad &&
      beeInstanceRef.current &&
      templateToLoad !== lastLoadedTemplateRef.current
    ) {
      try {
        const templateData = JSON.parse(templateToLoad);
        beeInstanceRef.current.load(templateData);
        lastLoadedTemplateRef.current = templateToLoad;
      } catch (err) {
        console.error('Error parsing template data:', err);
        const errorMessage =
          err instanceof Error
            ? `Invalid template data format: ${err.message}`
            : 'Invalid template data format: Unable to parse JSON';
        onError(errorMessage);
      }
    }
  }, [templateToLoad, onError]);

  // Handle direct save (from SAVE button in toolbar)
  const handleDirectSave = async (json: unknown) => {
    try {
      setSaving(true);
      const result = await onDirectSave(json, existingTemplate);

      // If it needs a modal (for new templates), show it
      if (
        result?.needsModal &&
        result.templateData &&
        result.templateJsonString
      ) {
        setCurrentTemplateData(result.templateData);
        setCurrentTemplateJsonString(result.templateJsonString);
        setShowSaveModal(true);
      }
    } catch (err) {
      console.error('Error in direct save:', err);
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error saving template. Please try again.';
      onError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle save template (from modal)
  const handleSaveTemplate = async (
    templateName: string,
    saveAsCopy: boolean
  ) => {
    if (!currentTemplateData || !currentTemplateJsonString) return;

    try {
      setSaving(true);
      await onSaveTemplate(
        templateName,
        currentTemplateJsonString,
        existingTemplate,
        saveAsCopy
      );

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

  // Handle modal close
  const handleCloseModal = () => {
    setShowSaveModal(false);
    setCurrentTemplateData(null);
    setCurrentTemplateJsonString('');
    setSaving(false);
  };

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
