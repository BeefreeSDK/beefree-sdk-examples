import { useState, useEffect, FC } from 'react';
import { Template, TemplateFormData } from '../types';

interface TemplateEditorProps {
  template?: Template; // If undefined, we're creating a new template
  onSave: (data: TemplateFormData) => Promise<void>;
  onSaveAsCopy: (data: TemplateFormData) => Promise<void>;
  onDelete: () => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export const TemplateEditor: FC<TemplateEditorProps> = ({
  template,
  onSave,
  onSaveAsCopy,
  onDelete,
  onBack,
  loading = false,
}) => {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    content: '{\n  "example": "value"\n}',
  });
  const [isValidJson, setIsValidJson] = useState(true);
  const [jsonError, setJsonError] = useState<string>('');

  // Initialize form data when template changes
  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        content: JSON.stringify(template.content, null, 2),
      });
    } else {
      setFormData({
        name: '',
        content: '{\n  "example": "value"\n}',
      });
    }
  }, [template]);

  // Validate JSON content
  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      setJsonError('');
      return true;
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON');
      return false;
    }
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
    setIsValidJson(validateJson(value));
  };

  const handleSave = async () => {
    if (!isValidJson) {
      alert('Please fix JSON errors before saving');
      return;
    }
    await onSave(formData);
  };

  const handleSaveAsCopy = async () => {
    if (!isValidJson) {
      alert('Please fix JSON errors before saving');
      return;
    }
    await onSaveAsCopy(formData);
  };

  const handleDelete = async () => {
    if (
      template &&
      window.confirm(`Are you sure you want to delete "${template.name}"?`)
    ) {
      await onDelete();
    }
  };

  if (loading) {
    return (
      <div className="template-editor">
        <h2>Saving...</h2>
      </div>
    );
  }

  return (
    <div className="template-editor">
      <div className="editor-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Templates
        </button>
        <h2>{template ? `Edit: ${template.name}` : 'Create New Template'}</h2>
      </div>

      <div className="editor-form">
        <div className="form-group">
          <label htmlFor="template-name">Template Name:</label>
          <input
            id="template-name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter template name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="template-content">Template Content (JSON):</label>
          <textarea
            id="template-content"
            value={formData.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Enter JSON content"
            className={`form-textarea ${!isValidJson ? 'error' : ''}`}
            rows={15}
          />
          {!isValidJson && (
            <div className="error-message">JSON Error: {jsonError}</div>
          )}
        </div>

        <div className="editor-actions">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!formData.name.trim() || !isValidJson}
          >
            {template ? 'Save Changes' : 'Create Template'}
          </button>

          {template && (
            <button
              className="btn btn-secondary"
              onClick={handleSaveAsCopy}
              disabled={!formData.name.trim() || !isValidJson}
            >
              Save as Copy
            </button>
          )}

          {template && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Template
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
