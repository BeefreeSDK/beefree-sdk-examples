export interface Template {
  id: string;
  name: string;
  version: string;
  content: Record<string, unknown>; // Opaque JSON content
  archived: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TemplateFormData {
  name: string;
  content: string; // Stringified JSON for editor input
}

export interface TemplateResponse {
  template: Template;
}

export interface TemplateListResponse {
  templates: Template[];
  total: number;
}
