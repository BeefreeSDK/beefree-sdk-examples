import { useState, useEffect } from 'react';
import { Template, TemplateFormData } from './types';
import { mockBackend } from './mockBackend';
import { TemplateList } from './components/TemplateList';
import { TemplateEditor } from './components/TemplateEditor';
import { BeefreeEditor } from './components/BeefreeEditor';
import './App.css';

type View = 'list' | 'editor' | 'sdk';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<
    Template | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await mockBackend.listTemplates();
      setTemplates(response.templates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentView('editor');
  };

  const handleCreateNew = () => {
    setSelectedTemplate(undefined);
    setCurrentView('editor');
  };

  const handleOpenSDK = () => {
    setCurrentView('sdk');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTemplate(undefined);
    // Reload templates to get any updates
    loadTemplates();
  };

  const handleCloseSDK = () => {
    setCurrentView('list');
    // Reload templates to get any updates from the SDK
    loadTemplates();
  };

  const handleTemplateSaved = () => {
    // Reload templates when a template is saved from the SDK
    loadTemplates();
  };

  const handleSaveTemplate = async (data: TemplateFormData) => {
    try {
      setLoading(true);
      setError('');

      if (selectedTemplate) {
        // Update existing template
        await mockBackend.updateTemplate(selectedTemplate.id, data);
      } else {
        // Create new template
        await mockBackend.createTemplate(data);
      }

      // Go back to list and reload
      handleBackToList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsCopy = async (data: TemplateFormData) => {
    try {
      setLoading(true);
      setError('');

      if (selectedTemplate) {
        // Use the new saveAsCopy function that handles naming properly
        await mockBackend.saveAsCopy(selectedTemplate.id, data);
      }

      // Go back to list and reload
      handleBackToList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save as copy');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      setError('');
      await mockBackend.deleteTemplate(selectedTemplate.id);
      handleBackToList();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete template'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Template Load Example</h1>
            <p>Beefree SDK Template Management Demo</p>
          </div>
          <div className="header-right">
            {currentView === 'sdk' ? (
              <button className="btn btn-secondary" onClick={handleCloseSDK}>
                Close Editor
              </button>
            ) : currentView === 'list' ? (
              <div className="header-actions">
                <button className="btn btn-primary" onClick={handleCreateNew}>
                  Create New Template
                </button>
                <button className="btn btn-secondary" onClick={handleOpenSDK}>
                  Open Beefree SDK
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className={`app-main ${currentView === 'sdk' ? 'sdk-mode' : ''}`}>
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {currentView === 'list' && (
          <TemplateList
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={handleCreateNew}
            loading={loading}
          />
        )}

        {currentView === 'editor' && (
          <TemplateEditor
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onSaveAsCopy={handleSaveAsCopy}
            onDelete={handleDeleteTemplate}
            onBack={handleBackToList}
            loading={loading}
          />
        )}

        {currentView === 'sdk' && (
          <BeefreeEditor
            onClose={handleCloseSDK}
            onTemplateSaved={handleTemplateSaved}
          />
        )}
      </main>
    </div>
  );
}

export default App;
