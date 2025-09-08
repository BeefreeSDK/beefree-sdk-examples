import { Template } from '../types';

interface TemplateListProps {
  templates: Template[];
  onCreateNew: () => void;
  onSelectTemplate: (template: Template) => void;
  loading: boolean;
}

export const TemplateList = ({
  templates,
  onCreateNew,
  onSelectTemplate,
  loading,
}: TemplateListProps) => {
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
          <h3>No templates yet</h3>
          <p>Create your first email template to get started.</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            Create New Template
          </button>
        </div>
      ) : (
        <div className="template-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => onSelectTemplate(template)}
            >
              <h3>{template.name}</h3>
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
    </div>
  );
};
