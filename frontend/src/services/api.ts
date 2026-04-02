import { API_BASE_URL, API_KEY } from '../utils/constants';
import { getToken } from '../utils/helpers';
import type { ApiResponse } from '../types';

class ApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private getHeaders(): HeadersInit {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Api-Key': this.apiKey,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    const json = await response.json();
    return json.data as T;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async post<T, D = unknown>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async put<T, D = unknown>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }
}

export const api = new ApiService(API_BASE_URL, API_KEY);
