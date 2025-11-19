import { z } from 'zod';

// Response schemas for API validation
export const HealthResponse = z.object({
  status: z.literal('ok'),
});

export const VersionResponse = z.object({
  version: z.string(),
});

// Template schemas
export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  content: z.string(),
  archived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TemplateListResponse = z.object({
  templates: z.array(TemplateSchema),
  total: z.number(),
});

export const TemplateResponse = z.object({
  template: TemplateSchema,
});

export const TemplateFormData = z.object({
  name: z.string().min(1, 'Template name is required'),
  content: z.string().min(1, 'Template content is required'),
});

// Type exports for use in handlers
export type HealthResponseType = z.infer<typeof HealthResponse>;
export type VersionResponseType = z.infer<typeof VersionResponse>;
export type TemplateType = z.infer<typeof TemplateSchema>;
export type TemplateListResponseType = z.infer<typeof TemplateListResponse>;
export type TemplateResponseType = z.infer<typeof TemplateResponse>;
export type TemplateFormDataType = z.infer<typeof TemplateFormData>;
