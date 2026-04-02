import { api } from '../api';
import type { Conversation, Message } from '../../types';

export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/messages/conversations');
    return response as unknown as Conversation[];
  },
  getMessages: async (usuarioId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/messages/${usuarioId}`);
    return response as unknown as Message[];
  },
  send: async (usuarioId: string, contenido: string): Promise<Message> => {
    const response = await api.post<Message, { usuarioId: string; contenido: string }>('/messages/send', { usuarioId, contenido });
    return response as unknown as Message;
  },
};
