import { Template } from '../types';
import { ConfirmationModal } from './ConfirmationModal';
import { useState } from 'react';

interface TemplateListProps {
  templates: Template[];
  onCreateNew: () => void;
  onSelectTemplate: (template: Template) => void;
  onDeleteTemplate: (templateId: string) => Promise<void>;
  onDuplicateTemplate: (template: Template) => Promise<void>;
  loading: boolean;
}

export const TemplateList = ({
  templates,
  onCreateNew,
  onSelectTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  loading,
}: TemplateListProps) => {
  const [deleteTemplate, setDeleteTemplate] = useState<Template | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, template: Template) => {
    e.stopPropagation(); // Prevent card click
    setDeleteTemplate(template);
  };

  const handleDuplicateClick = async (
    e: React.MouseEvent,
    template: Template
  ) => {
    e.stopPropagation(); // Prevent card click
    await onDuplicateTemplate(template);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTemplate) return;

    setIsDeleting(true);
    try {
      await onDeleteTemplate(deleteTemplate.id);
      setDeleteTemplate(null);
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTemplate(null);
  };
  if (loading) {
    return (
      <div className="template-list">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <span>Loading templates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="template-list">
      {templates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📧</div>
          <h2>No templates yet</h2>
          <p>
            Start building amazing email templates with the Beefree SDK. Create
            your first template to get started!
          </p>
          <div className="empty-state-actions">
            <button className="btn btn-primary btn-large" onClick={onCreateNew}>
              <span className="btn-icon">✨</span>
              Create Your First Template
            </button>
          </div>
        </div>
      ) : (
        <div className="template-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="template-card-header">
                <h3>{template.name}</h3>
                <div className="template-actions">
                  <button
                    className="btn-duplicate"
                    onClick={(e) => handleDuplicateClick(e, template)}
                    title="Duplicate template"
                  >
                    📋
                  </button>
                  <button
                    className="btn-delete"
                    onClick={(e) => handleDeleteClick(e, template)}
                    title="Delete template"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="template-meta">Version: {template.version}</div>
              <div className="template-preview">
                {JSON.stringify(template.content, null, 2).substring(0, 100)}
                {JSON.stringify(template.content, null, 2).length > 100
                  ? '...'
                  : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTemplate && (
        <ConfirmationModal
          isOpen={!!deleteTemplate}
          title="Delete Template"
          message={`Are you sure you want to delete "${deleteTemplate.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={isDeleting}
          variant="danger"
        />
      )}
    </div>
  );
};
