import {
  TemplateFormData,
  TemplateListResponse,
  TemplateResponse,
} from '../types';
import { mockBackend } from '../mockBackend';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3008';
const API_KEY = import.meta.env.VITE_API_KEY;

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(
      response.status,
      errorData.message || `HTTP ${response.status}`
    );
  }

  return response.json();
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add API key header if available
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  return headers;
}

export const api = {
  // Templates - Only listTemplates uses the backend API
  async listTemplates(): Promise<TemplateListResponse> {
    const response = await fetch(`${API_BASE_URL}/templates`, {
      headers: getHeaders(),
    });
    return handleResponse<TemplateListResponse>(response);
  },

  // All other template operations use the mock backend
  async getTemplate(id: string): Promise<TemplateResponse> {
    return mockBackend.getTemplate(id);
  },

  async createTemplate(data: TemplateFormData): Promise<TemplateResponse> {
    return mockBackend.createTemplate(data);
  },

  async updateTemplate(
    id: string,
    data: TemplateFormData
  ): Promise<TemplateResponse> {
    return mockBackend.updateTemplate(id, data);
  },

  async deleteTemplate(id: string): Promise<void> {
    return mockBackend.deleteTemplate(id);
  },

  async duplicateTemplate(id: string): Promise<TemplateResponse> {
    return mockBackend.duplicateTemplate(id);
  },
};

export { ApiError };
