import { api } from './api';
import type { Conversation, Message } from '../types';

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get<Conversation[]>('/messages/conversations');
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener conversaciones');
    }
    return response.data;
  },

  async getMessages(destinatarioId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/messages/${destinatarioId}`);
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener mensajes');
    }
    return response.data;
  },

  async send(destinatarioId: string, contenido: string): Promise<Message> {
    const response = await api.post<Message, { destinatarioId: string; contenido: string }>(
      '/messages',
      { destinatarioId, contenido }
    );
    if (!response.success) {
      throw new Error(response.message || 'Error al enviar mensaje');
    }
    return response.data;
  },
};
