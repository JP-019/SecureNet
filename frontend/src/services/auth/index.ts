import { api } from '../api';

export const authService = {
  login: async (empresa: string, usuario: string, password: string) => {
    const response = await api.post('/auth/login', { empresa, usuario, password });
    return response.data;
  },
  register: async (data: { empresa: string; nombre: string; usuario: string; password: string; rol?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
