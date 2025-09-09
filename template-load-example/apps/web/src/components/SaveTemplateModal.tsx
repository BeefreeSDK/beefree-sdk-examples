import { useState, useEffect } from 'react';
import { Template } from '../types';

// Helper function to increment version number
const incrementVersion = (version: string): string => {
  const parts = version.split('.');
  const major = parseInt(parts[0]) || 0;
  const minor = parseInt(parts[1]) || 0;
  const patch = parseInt(parts[2]) || 0;

  // Increment patch version
  return `${major}.${minor}.${patch + 1}`;
};

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateName: string, saveAsCopy: boolean) => void;
  loading?: boolean;
  existingTemplate?: Template | null; // If editing an existing template
}

export const SaveTemplateModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
  existingTemplate = null,
}: SaveTemplateModalProps) => {
  const [templateName, setTemplateName] = useState('');
  const [saveAsCopy, setSaveAsCopy] = useState(false);
  const isEditingExisting = !!existingTemplate;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (isEditingExisting) {
        setTemplateName(existingTemplate!.name);
        setSaveAsCopy(false);
      } else {
        setTemplateName('');
        setSaveAsCopy(false);
      }
    }
  }, [isOpen, isEditingExisting, existingTemplate]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (templateName.trim()) {
      onSave(templateName.trim(), saveAsCopy);
    }
  };

  const handleCancel = () => {
    setTemplateName('');
    setSaveAsCopy(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={handleCancel} />
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            {isEditingExisting ? 'Save Template Changes' : 'Save as Template'}
          </h2>
          <button
            className="modal-close"
            onClick={handleCancel}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="template-name">Template Name</label>
            <input
              id="template-name"
              type="text"
              className="form-input"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              autoFocus
              disabled={loading}
              required
            />
            {isEditingExisting && (
              <div className="form-help">
                Current version: {existingTemplate!.version}
              </div>
            )}
          </div>

          {isEditingExisting && (
            <div className="form-group">
              <div className="save-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="saveOption"
                    checked={!saveAsCopy}
                    onChange={() => setSaveAsCopy(false)}
                    disabled={loading}
                  />
                  <div className="radio-content">
                    <div className="radio-title">Update existing template</div>
                    <div className="radio-description">
                      Overwrite "{existingTemplate!.name}" and increment version
                      to {incrementVersion(existingTemplate!.version)}
                    </div>
                  </div>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="saveOption"
                    checked={saveAsCopy}
                    onChange={() => setSaveAsCopy(true)}
                    disabled={loading}
                  />
                  <div className="radio-content">
                    <div className="radio-title">Save as a copy</div>
                    <div className="radio-description">
                      Create a new template with a different name
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !templateName.trim()}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
