import {
  Template,
  TemplateListResponse,
  TemplateResponse,
  TemplateFormData,
} from '../types/template';
import { prisma } from '../lib/prisma';

export const templateService = {
  // List all templates (non-archived only)
  async listTemplates(): Promise<TemplateListResponse> {
    const templates = await prisma.template.findMany({
      where: { archived: false },
      orderBy: { createdAt: 'desc' },
    });

    return {
      templates: templates.map((template) => ({
        id: template.id,
        name: template.name,
        version: template.version,
        content: template.content,
        archived: template.archived,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      })),
      total: templates.length,
    };
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
    const existingTemplate = await prisma.template.findFirst({
      where: {
        name: data.name,
        archived: false,
      },
    });

    if (existingTemplate) {
      throw new Error(`Template with name "${data.name}" already exists`);
    }

    const newTemplate = await prisma.template.create({
      data: {
        name: data.name,
        version: '1.0.0',
        content: data.content,
        archived: false,
      },
    });

    return {
      template: {
        id: newTemplate.id,
        name: newTemplate.name,
        version: newTemplate.version,
        content: newTemplate.content,
        archived: newTemplate.archived,
        createdAt: newTemplate.createdAt.toISOString(),
        updatedAt: newTemplate.updatedAt.toISOString(),
      },
    };
  },

  // Update an existing template
  async updateTemplate(
    id: string,
    data: TemplateFormData
  ): Promise<TemplateResponse> {
    // Check if template exists
    const existingTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      throw new Error(`Template with id ${id} not found`);
    }

    // Validate JSON content
    try {
      JSON.parse(data.content);
    } catch (_error) {
      throw new Error('Invalid JSON content');
    }

    // Check for duplicate names (excluding current template)
    const duplicateTemplate = await prisma.template.findFirst({
      where: {
        name: data.name,
        archived: false,
        id: { not: id },
      },
    });

    if (duplicateTemplate) {
      throw new Error(`Template with name "${data.name}" already exists`);
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        name: data.name,
        content: data.content,
      },
    });

    return {
      template: {
        id: updatedTemplate.id,
        name: updatedTemplate.name,
        version: updatedTemplate.version,
        content: updatedTemplate.content,
        archived: updatedTemplate.archived,
        createdAt: updatedTemplate.createdAt.toISOString(),
        updatedAt: updatedTemplate.updatedAt.toISOString(),
      },
    };
  },

  // Soft delete a template (archive it)
  async deleteTemplate(id: string): Promise<void> {
    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new Error(`Template with id ${id} not found`);
    }

    // Soft delete: set archived to true
    await prisma.template.update({
      where: { id },
      data: { archived: true },
    });
  },
};
