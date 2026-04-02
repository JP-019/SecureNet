import { api } from './api';
import type { LoginRequest, LoginResponse, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse, LoginRequest>('/auth/login', credentials);
    if (!response.success) {
      throw new Error(response.message || 'Error en login');
    }
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener perfil');
    }
    return response.data;
  },
};
