// Template data structure
export interface Template {
  id: string;
  name: string;
  version: string;
  content: Record<string, unknown>; // Opaque JSON content
  archived: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// API response types
export interface TemplateListResponse {
  templates: Template[];
  total: number;
}

export interface TemplateResponse {
  template: Template;
}

// Form data for creating/updating templates
export interface TemplateFormData {
  name: string;
  content: string; // JSON string for editing
}
