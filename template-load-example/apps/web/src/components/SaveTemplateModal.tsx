import { useState, useEffect } from 'react';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateName: string) => void;
  loading?: boolean;
}

export const SaveTemplateModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
}: SaveTemplateModalProps) => {
  const [templateName, setTemplateName] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTemplateName('');
    }
  }, [isOpen]);

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
      onSave(templateName.trim());
    }
  };

  const handleCancel = () => {
    setTemplateName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={handleCancel} />
      <div className="modal-container">
        <div className="modal-header">
          <h2>Save as Template</h2>
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
          </div>

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
