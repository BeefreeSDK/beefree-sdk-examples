import { useState, useEffect } from 'react';
import { Template, TemplateFormData } from '../types';
import { ConfirmationModal } from './ConfirmationModal';
import { useToast } from '../hooks/useToast';

interface TemplateEditorProps {
  template?: Template;
  onSave: (data: TemplateFormData) => void;
  onSaveAsCopy: (data: TemplateFormData) => void;
  onDelete: () => void;
  onBack: () => void;
  loading: boolean;
}

export const TemplateEditor = ({
  template,
  onSave,
  onSaveAsCopy,
  onDelete,
  onBack,
  loading,
}: TemplateEditorProps) => {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    content: '',
  });
  const [jsonError, setJsonError] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { error: showError } = useToast();

  // Initialize form data when template changes
  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        content: template.content, // Use raw JSON string directly
      });
    } else {
      setFormData({
        name: '',
        content:
          '{\n  "subject": "Your email subject",\n  "body": "Your email content here"\n}',
      });
    }
    setJsonError('');
  }, [template]);

  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      setJsonError('');
      return true;
    } catch (error) {
      setJsonError(`JSON Error: ${error}`);
      return false;
    }
  };

  const handleSave = () => {
    if (validateJson(formData.content)) {
      onSave(formData);
    } else {
      showError('Please fix the JSON errors before saving');
    }
  };

  const handleSaveAsCopy = () => {
    if (validateJson(formData.content)) {
      onSaveAsCopy(formData);
    } else {
      showError('Please fix the JSON errors before saving');
    }
  };

  const handleDelete = () => {
    if (template) {
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="template-editor">
      <div className="editor-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to List
        </button>
        <h2>{template ? `Edit: ${template.name}` : 'Create New Template'}</h2>
        <div className="editor-actions">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading || !!jsonError}
          >
            {template ? 'Update' : 'Save'}
          </button>
          {template && (
            <button
              className="btn btn-secondary"
              onClick={handleSaveAsCopy}
              disabled={loading || !!jsonError}
            >
              Save as Copy
            </button>
          )}
          {template && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="editor-form">
        <div className="form-group">
          <label htmlFor="template-name">Template Name</label>
          <input
            id="template-name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter template name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="template-content">Template Content (JSON)</label>
          <textarea
            id="template-content"
            className={`form-textarea ${jsonError ? 'error' : ''}`}
            value={formData.content}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, content: e.target.value }));
              validateJson(e.target.value);
            }}
            rows={15}
            placeholder="Enter template content as JSON"
          />
          {jsonError && <div className="error-message">{jsonError}</div>}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Template"
        message={`Are you sure you want to delete "${template?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={loading}
        variant="danger"
      />
    </div>
  );
};
