import {
  Template,
  TemplateListResponse,
  TemplateResponse,
  TemplateFormData,
} from './types';

// Storage key for localStorage
const STORAGE_KEY = 'template-load-example-templates';

// Helper function to get all templates from localStorage
function getTemplatesFromStorage(): Template[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading templates from localStorage:', error);
    return [];
  }
}

// Helper function to save templates to localStorage
function saveTemplatesToStorage(templates: Template[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving templates to localStorage:', error);
  }
}

// Generate a simple ID (in real app, this would come from backend)
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Generate a unique copy name by checking existing templates
// Examples: "My Template" -> "My Template (Copy)" -> "My Template (Copy 2)" -> "My Template (Copy 3)"
function generateCopyName(originalName: string): string {
  const templates = getTemplatesFromStorage();
  // Remove any existing (Copy) or (Copy 2) suffix to get the base name
  const baseName = originalName.replace(/\s*\(Copy\)(\s*\d+)?$/, '');

  // Check if base name already exists
  const existingNames = templates.map((t) => t.name);

  // If no copy exists, just add (Copy)
  if (!existingNames.includes(`${baseName} (Copy)`)) {
    return `${baseName} (Copy)`;
  }

  // Find the highest copy number and increment it
  let copyNumber = 2;
  while (existingNames.includes(`${baseName} (Copy ${copyNumber})`)) {
    copyNumber++;
  }

  return `${baseName} (Copy ${copyNumber})`;
}

// Seed initial templates if none exist
function seedInitialTemplates(): void {
  const existing = getTemplatesFromStorage();
  if (existing.length > 0) return;

  const initialTemplates: Template[] = [
    {
      id: generateId(),
      name: 'Welcome Email',
      version: '1.0.0',
      content: {
        subject: 'Welcome to our service!',
        body: "Thank you for signing up. We're excited to have you on board.",
        type: 'email',
      },
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Newsletter Template',
      version: '1.2.0',
      content: {
        title: 'Monthly Newsletter',
        sections: [
          { type: 'header', text: "This Month's Highlights" },
          { type: 'content', text: 'Here are the latest updates...' },
        ],
        type: 'newsletter',
      },
      archived: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  saveTemplatesToStorage(initialTemplates);
}

// Initialize with seed data
seedInitialTemplates();

// Mock API functions that simulate backend calls
export const mockBackend = {
  // List all non-archived templates
  async listTemplates(): Promise<TemplateListResponse> {
    const templates = getTemplatesFromStorage().filter((t) => !t.archived);
    return {
      templates,
      total: templates.length,
    };
  },

  // Get a specific template by ID
  async getTemplate(id: string): Promise<TemplateResponse> {
    const templates = getTemplatesFromStorage();
    const template = templates.find((t) => t.id === id);

    if (!template) {
      throw new Error(`Template with id ${id} not found`);
    }

    return { template };
  },

  // Create a new template
  async createTemplate(data: TemplateFormData): Promise<TemplateResponse> {
    // Validate JSON content
    let parsedContent: Record<string, unknown>;
    try {
      parsedContent = JSON.parse(data.content);
    } catch (_error) {
      throw new Error('Invalid JSON content');
    }

    // Check for duplicate names (only among non-archived templates)
    // Case-insensitive comparison to prevent "My Template" and "my template" conflicts
    const templates = getTemplatesFromStorage();
    const existingNames = templates
      .filter((t) => !t.archived)
      .map((t) => t.name.toLowerCase());

    if (existingNames.includes(data.name.toLowerCase())) {
      throw new Error(`A template with the name "${data.name}" already exists`);
    }

    const newTemplate: Template = {
      id: generateId(),
      name: data.name,
      version: '1.0.0',
      content: parsedContent,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    templates.push(newTemplate);
    saveTemplatesToStorage(templates);

    return { template: newTemplate };
  },

  // Update an existing template
  async updateTemplate(
    id: string,
    data: TemplateFormData
  ): Promise<TemplateResponse> {
    const templates = getTemplatesFromStorage();
    const templateIndex = templates.findIndex((t) => t.id === id);

    if (templateIndex === -1) {
      throw new Error(`Template with id ${id} not found`);
    }

    // Validate JSON content
    let parsedContent: Record<string, unknown>;
    try {
      parsedContent = JSON.parse(data.content);
    } catch (_error) {
      throw new Error('Invalid JSON content');
    }

    // Check for duplicate names (only among non-archived templates, excluding current template)
    const existingNames = templates
      .filter((t) => !t.archived && t.id !== id)
      .map((t) => t.name.toLowerCase());

    if (existingNames.includes(data.name.toLowerCase())) {
      throw new Error(`A template with the name "${data.name}" already exists`);
    }

    const updatedTemplate: Template = {
      ...templates[templateIndex],
      name: data.name,
      content: parsedContent,
      updatedAt: new Date().toISOString(),
    };

    templates[templateIndex] = updatedTemplate;
    saveTemplatesToStorage(templates);

    return { template: updatedTemplate };
  },

  // Duplicate a template (create a copy)
  async duplicateTemplate(id: string): Promise<TemplateResponse> {
    const templates = getTemplatesFromStorage();
    const originalTemplate = templates.find((t) => t.id === id);

    if (!originalTemplate) {
      throw new Error(`Template with id ${id} not found`);
    }

    const duplicatedTemplate: Template = {
      ...originalTemplate,
      id: generateId(),
      name: generateCopyName(originalTemplate.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    templates.push(duplicatedTemplate);
    saveTemplatesToStorage(templates);

    return { template: duplicatedTemplate };
  },

  // Soft delete a template (mark as archived)
  async deleteTemplate(id: string): Promise<void> {
    const templates = getTemplatesFromStorage();
    const templateIndex = templates.findIndex((t) => t.id === id);

    if (templateIndex === -1) {
      throw new Error(`Template with id ${id} not found`);
    }

    // Soft delete by marking as archived
    templates[templateIndex] = {
      ...templates[templateIndex],
      archived: true,
      updatedAt: new Date().toISOString(),
    };

    saveTemplatesToStorage(templates);
  },

  // Save as copy with new content (used by "Save as Copy" button)
  async saveAsCopy(
    originalId: string,
    data: TemplateFormData
  ): Promise<TemplateResponse> {
    const templates = getTemplatesFromStorage();
    const originalTemplate = templates.find((t) => t.id === originalId);

    if (!originalTemplate) {
      throw new Error(`Template with id ${originalId} not found`);
    }

    // Validate JSON content
    let parsedContent: Record<string, unknown>;
    try {
      parsedContent = JSON.parse(data.content);
    } catch (_error) {
      throw new Error('Invalid JSON content');
    }

    // Generate unique copy name based on original template name
    const copyName = generateCopyName(originalTemplate.name);

    // Double-check that the generated copy name doesn't conflict
    const existingNames = templates
      .filter((t) => !t.archived)
      .map((t) => t.name.toLowerCase());

    if (existingNames.includes(copyName.toLowerCase())) {
      throw new Error(`A template with the name "${copyName}" already exists`);
    }

    const newTemplate: Template = {
      id: generateId(),
      name: copyName,
      version: '1.0.0',
      content: parsedContent,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    templates.push(newTemplate);
    saveTemplatesToStorage(templates);

    return { template: newTemplate };
  },
};
