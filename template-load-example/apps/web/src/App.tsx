import { useState, useEffect } from 'react';
import { Template } from './types';
import { api, ApiError } from './services/api';
import { TemplateList } from './components/TemplateList';
import { BeefreeEditor } from './components/BeefreeEditor';
import { Toaster } from './components/Toaster';
import { useToast } from './hooks/useToast';
import { generateCopyName } from './utils/templateUtils';
import './App.css';

type View = 'list' | 'sdk';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<
    Template | undefined
  >();
  const [templateToLoad, setTemplateToLoad] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { toasts, removeToast, error: showError, success } = useToast();

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.listTemplates();
      setTemplates(response.templates);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Failed to load templates';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateToLoad(template.content);
    setCurrentView('sdk');
  };

  const handleCreateNew = () => {
    setSelectedTemplate(undefined);
    setTemplateToLoad(undefined);
    setCurrentView('sdk');
  };

  const handleCloseSDK = () => {
    setCurrentView('list');
    setTemplateToLoad(undefined);
    // Reload templates to get any updates from the SDK
    loadTemplates();
  };

  const handleTemplateSaved = () => {
    // Reload templates when a template is saved from the SDK
    loadTemplates();
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await api.deleteTemplate(templateId);
      await loadTemplates();
      success('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      const errorMessage =
        error instanceof ApiError ? error.message : 'Failed to delete template';
      showError(errorMessage);
    }
  };

  const handleDuplicateTemplate = async (template: Template) => {
    try {
      // Generate a unique copy name
      const copyName = generateCopyName(template.name);

      // Create the duplicate with the new name
      await api.createTemplate({
        name: copyName,
        content: template.content,
      });

      await loadTemplates();
      success(`Template duplicated as "${copyName}"`);
    } catch (error) {
      console.error('Error duplicating template:', error);
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : 'Failed to duplicate template';
      showError(errorMessage);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Template Load Example</h1>
            <p>
              {currentView === 'sdk' && selectedTemplate
                ? `Editing "${selectedTemplate.name}" in the Beefree SDK - Make your changes and save as a new template`
                : currentView === 'sdk'
                  ? 'Create a new email template using the Beefree SDK - Design your template and save it to your collection'
                  : 'Beefree SDK Template Management Demo - Click on any template to edit it or create a new one'}
            </p>
          </div>
          <div className="header-right">
            {currentView === 'sdk' ? (
              <button className="btn btn-secondary" onClick={handleCloseSDK}>
                Close Editor
              </button>
            ) : currentView === 'list' ? (
              <button className="btn btn-primary" onClick={handleCreateNew}>
                Create New Template
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className={`app-main ${currentView === 'sdk' ? 'sdk-mode' : ''}`}>
        {currentView === 'list' && (
          <TemplateList
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={handleCreateNew}
            onDeleteTemplate={handleDeleteTemplate}
            onDuplicateTemplate={handleDuplicateTemplate}
            loading={loading}
          />
        )}

        {currentView === 'sdk' && (
          <BeefreeEditor
            onClose={handleCloseSDK}
            onTemplateSaved={handleTemplateSaved}
            onSuccess={success}
            onError={showError}
            templateToLoad={templateToLoad}
            existingTemplate={selectedTemplate}
          />
        )}
      </main>

      {/* Toaster */}
      <Toaster toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
