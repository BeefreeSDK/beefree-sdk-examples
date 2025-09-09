import { useState, useEffect } from 'react';
import { Template } from '../types';
import { BaseModal } from './BaseModal';
import { ModalActions, ModalButton } from './ModalActions';

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

  return (
    <BaseModal
      isOpen={isOpen}
      title={isEditingExisting ? 'Save Template Changes' : 'Save as Template'}
      onClose={handleCancel}
      loading={loading}
      size="medium"
    >
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

        <ModalActions>
          <ModalButton
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </ModalButton>
          <ModalButton
            type="submit"
            variant="primary"
            disabled={loading || !templateName.trim()}
            loading={loading}
          >
            Save
          </ModalButton>
        </ModalActions>
      </form>
    </BaseModal>
  );
};
