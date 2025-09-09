import {
  Template,
  TemplateListResponse,
  TemplateResponse,
  TemplateFormData,
} from '../types/template';

// In-memory storage for demo purposes
let templates: Template[] = [];

// Generate a simple ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Seed initial templates if none exist
function seedInitialTemplates(): void {
  if (templates.length > 0) return; // Already seeded

  const initialTemplates: Template[] = [
    {
      id: generateId(),
      name: 'Welcome Email',
      version: '1.0.0',
      content: JSON.stringify({
        subject: 'Welcome to our service!',
        body: "Thank you for signing up. We're excited to have you on board.",
        type: 'email',
      }),
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Newsletter Template',
      version: '1.0.0',
      content: JSON.stringify({
        subject: 'Monthly Newsletter',
        body: 'Check out our latest updates and news.',
        type: 'email',
      }),
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  templates = initialTemplates;
}

// Initialize templates on module load
seedInitialTemplates();

export const templateService = {
  // List all templates
  async listTemplates(): Promise<TemplateListResponse> {
    return {
      templates: templates.filter((t) => !t.archived),
      total: templates.filter((t) => !t.archived).length,
    };
  },

  // Get a single template by ID
  async getTemplate(id: string): Promise<TemplateResponse> {
    const template = templates.find((t) => t.id === id);
    if (!template) {
      throw new Error(`Template with id ${id} not found`);
    }
    return { template };
  },

  // Create a new template
  async createTemplate(data: TemplateFormData): Promise<TemplateResponse> {
    // Validate JSON content (but don't parse it - keep as string)
    try {
      JSON.parse(data.content);
    } catch (_error) {
      throw new Error('Invalid JSON content');
    }

    // Check for duplicate names (only among non-archived templates)
    const existingTemplate = templates.find(
      (t) => !t.archived && t.name.toLowerCase() === data.name.toLowerCase()
    );
    if (existingTemplate) {
      throw new Error(`Template with name "${data.name}" already exists`);
    }

    const newTemplate: Template = {
      id: generateId(),
      name: data.name,
      version: '1.0.0',
      content: data.content, // Store raw JSON string
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    templates.push(newTemplate);
    return { template: newTemplate };
  },

  // Update an existing template
  async updateTemplate(
    id: string,
    data: TemplateFormData
  ): Promise<TemplateResponse> {
    const templateIndex = templates.findIndex((t) => t.id === id);
    if (templateIndex === -1) {
      throw new Error(`Template with id ${id} not found`);
    }

    // Validate JSON content
    try {
      JSON.parse(data.content);
    } catch (_error) {
      throw new Error('Invalid JSON content');
    }

    // Check for duplicate names (excluding current template)
    const existingTemplate = templates.find(
      (t) =>
        t.id !== id &&
        !t.archived &&
        t.name.toLowerCase() === data.name.toLowerCase()
    );
    if (existingTemplate) {
      throw new Error(`Template with name "${data.name}" already exists`);
    }

    const updatedTemplate: Template = {
      ...templates[templateIndex],
      name: data.name,
      content: data.content,
      updatedAt: new Date().toISOString(),
    };

    templates[templateIndex] = updatedTemplate;
    return { template: updatedTemplate };
  },

  // Duplicate a template
  async duplicateTemplate(id: string): Promise<TemplateResponse> {
    const originalTemplate = templates.find((t) => t.id === id);
    if (!originalTemplate) {
      throw new Error(`Template with id ${id} not found`);
    }

    const duplicatedTemplate: Template = {
      ...originalTemplate,
      id: generateId(),
      name: `${originalTemplate.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    templates.push(duplicatedTemplate);
    return { template: duplicatedTemplate };
  },

  // Delete a template
  async deleteTemplate(id: string): Promise<void> {
    const templateIndex = templates.findIndex((t) => t.id === id);
    if (templateIndex === -1) {
      throw new Error(`Template with id ${id} not found`);
    }

    templates.splice(templateIndex, 1);
  },
};
