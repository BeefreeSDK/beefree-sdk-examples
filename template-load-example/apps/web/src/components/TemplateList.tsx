import { FC } from 'react';
import { Template } from '../types';

interface TemplateListProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  onCreateNew: () => void;
  loading?: boolean;
}

export const TemplateList: FC<TemplateListProps> = ({
  templates,
  onSelectTemplate,
  onCreateNew,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="template-list">
        <h2>Loading templates...</h2>
      </div>
    );
  }

  return (
    <div className="template-list">
      <div className="template-list-header">
        <h2>Saved Templates</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          Create New Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="empty-state">
          <p>No templates found. Create your first template to get started!</p>
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
              <p className="template-meta">Version: {template.version}</p>
              <p className="template-meta">
                Updated: {new Date(template.updatedAt).toLocaleDateString()}
              </p>
              <div className="template-preview">
                <code>
                  {JSON.stringify(template.content, null, 2).substring(0, 100)}
                  {JSON.stringify(template.content, null, 2).length > 100
                    ? '...'
                    : ''}
                </code>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
