import { api } from './api';
import type { Equipo } from '../types';

export const equipoService = {
  async getAll(): Promise<Equipo[]> {
    const response = await api.get<Equipo[]>('/equipos');
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener equipos');
    }
    return response.data;
  },

  async getById(id: string): Promise<Equipo> {
    const response = await api.get<Equipo>(`/equipos/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener equipo');
    }
    return response.data;
  },

  async addMember(equipoId: string, usuarioId: string): Promise<void> {
    const response = await api.post<void, { usuarioId: string }>(
      `/equipos/${equipoId}/members`,
      { usuarioId }
    );
    if (!response.success) {
      throw new Error(response.message || 'Error al agregar miembro');
    }
  },

  async removeMember(equipoId: string, memberId: string): Promise<void> {
    const response = await api.delete<void>(`/equipos/${equipoId}/members/${memberId}`);
    if (!response.success) {
      throw new Error(response.message || 'Error al remover miembro');
    }
  },
};
