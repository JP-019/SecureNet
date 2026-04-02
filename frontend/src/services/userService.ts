import { api } from './api';
import type { User, NewUserRequest } from '../types';

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener usuarios');
    }
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener usuario');
    }
    return response.data;
  },

  async create(userData: NewUserRequest): Promise<User> {
    const response = await api.post<User, NewUserRequest>('/users', userData);
    if (!response.success) {
      throw new Error(response.message || 'Error al crear usuario');
    }
    return response.data;
  },

  async update(id: string, userData: Partial<NewUserRequest>): Promise<User> {
    const response = await api.put<User, Partial<NewUserRequest>>(`/users/${id}`, userData);
    if (!response.success) {
      throw new Error(response.message || 'Error al actualizar usuario');
    }
    return response.data;
  },

  async delete(id: string): Promise<void> {
    const response = await api.delete<void>(`/users/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Error al eliminar usuario');
    }
  },
};
