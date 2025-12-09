import {
  TemplateFormData,
  TemplateListResponse,
  TemplateResponse,
} from '../types';
import { IToken } from '@beefree.io/sdk/dist/types/bee';

// Auth types
interface AuthResponse {
  success: boolean;
  token: IToken;
  uid: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
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
  async authenticateBeefree(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({}),
    });

    // The shared auth module returns the token directly, not wrapped in success/error
    const token = await handleResponse<IToken>(response);

    return {
      success: true,
      token,
      uid: 'demo-user',
    };
  },

  async listTemplates(): Promise<TemplateListResponse> {
    const response = await fetch(`${API_BASE_URL}/templates`, {
      headers: getHeaders(),
    });
    return handleResponse<TemplateListResponse>(response);
  },

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}`
      );
    }
  },

  async createTemplate(data: TemplateFormData): Promise<TemplateResponse> {
    const response = await fetch(`${API_BASE_URL}/templates`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<TemplateResponse>(response);
  },

  async updateTemplate(
    id: string,
    data: TemplateFormData
  ): Promise<TemplateResponse> {
    const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<TemplateResponse>(response);
  },
};

export { ApiError };
