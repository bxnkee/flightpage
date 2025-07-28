import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

export async function apiRequest(
  method: string,
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (options.body && method !== 'GET') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`${response.status}: ${errorData.message || 'Unknown error'}`);
  }

  return response;
}