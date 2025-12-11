import { useState, useEffect } from 'react';
import { Template } from '../types';
import { api, ApiError } from '../services/api';
import { BaseModal } from './BaseModal';

export interface LoadTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (template: Template) => void;
  onError: (message: string) => void;
}

export const LoadTemplateModal = ({
  isOpen,
  onClose,
  onLoadTemplate,
  onError,
}: LoadTemplateModalProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  // Load templates when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.listTemplates();
      setTemplates(response.templates);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Failed to load templates';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTemplate = (template: Template) => {
    onLoadTemplate(template);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Load Template"
      onClose={onClose}
      size="medium"
    >
      <div className="load-template-content">
        {loading ? (
          <div className="loading-state">
            <p>Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="empty-state">
            <p>No templates available to load.</p>
          </div>
        ) : (
          <div className="template-list">
            <p className="template-list-description">
              Click on any template to load it into the editor:
            </p>
            <div className="template-items">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="template-item"
                  onClick={() => handleLoadTemplate(template)}
                >
                  <div className="template-info">
                    <div className="template-name">{template.name}</div>
                    <div className="template-version">
                      Version {template.version}
                    </div>
                    <div className="template-date">
                      Updated:{' '}
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};
