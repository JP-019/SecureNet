import { api } from '../api';
import type { Equipo } from '../../types';

export const equipoService = {
  getAll: async (): Promise<Equipo[]> => {
    const response = await api.get<Equipo[]>('/equipos');
    return response as unknown as Equipo[];
  },
  create: async (data: Partial<Equipo>): Promise<Equipo> => {
    const response = await api.post<Equipo, Partial<Equipo>>('/equipos', data);
    return response as unknown as Equipo;
  },
  update: async (id: string, data: Partial<Equipo>): Promise<Equipo> => {
    const response = await api.put<Equipo, Partial<Equipo>>(`/equipos/${id}`, data);
    return response as unknown as Equipo;
  },
  delete: async (id: string): Promise<void> => {
    const response = await api.delete<void>(`/equipos/${id}`);
    return response as unknown as void;
  },
};
