import React from 'react';
import { messageService } from '../../../../services';
import type { Message, Conversation, Equipo } from '../../../../types';

export interface MessageHandlersProps {
  messageText: string;
  groupMessageText: string;
  selectedChat: Conversation | null;
  selectedGroup: Equipo | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setGroupMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  setGroupMessageText: React.Dispatch<React.SetStateAction<string>>;
  showToast: (msg: string, type: string) => void;
  user: { nombre: string } | null;
}

export const createMessageHandlers = ({
  messageText,
  groupMessageText,
  selectedChat,
  selectedGroup,
  setMessages,
  setGroupMessages,
  setMessageText,
  setGroupMessageText,
  showToast,
  user
}: MessageHandlersProps) => {
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    if (selectedChat) {
      try {
        const newMsg = await messageService.send(selectedChat.usuarioId, messageText);
        setMessages(prev => [...prev, newMsg]);
        setMessageText('');
      } catch {
        showToast('Error al enviar mensaje', 'error');
      }
    }
  };

  const handleSendGroupMessage = () => {
    if (!groupMessageText.trim() || !selectedGroup) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      contenido: groupMessageText,
      timestamp: new Date().toISOString(),
      leido: true,
      esMio: true,
      grupoId: selectedGroup.id,
      emisorNombre: user?.nombre || 'Yo'
    };
    setGroupMessages(prev => [...prev, newMsg]);
    setGroupMessageText('');
  };

  const prepareFileMessage = (file: File, tipo: 'imagen' | 'video' | 'archivo' | 'audio'): Message => {
    return {
      id: Date.now().toString(),
      contenido: '',
      timestamp: new Date().toISOString(),
      leido: true,
      esMio: true,
      tipo,
      archivoNombre: file.name,
      grupoId: selectedGroup?.id
    };
  };

  const sendFileMessage = (file: File, tipo: 'imagen' | 'video' | 'archivo' | 'audio') => {
    const reader = new FileReader();
    reader.onload = () => {
      const newMsg: Message = {
        id: Date.now().toString(),
        contenido: reader.result as string,
        timestamp: new Date().toISOString(),
        leido: true,
        esMio: true,
        tipo,
        archivoNombre: file.name,
        grupoId: selectedGroup?.id
      };
      if (selectedGroup) {
        setGroupMessages(prev => [...prev, newMsg]);
      } else if (selectedChat) {
        setMessages(prev => [...prev, newMsg]);
      }
      showToast(`${tipo === 'imagen' ? 'Imagen' : tipo === 'video' ? 'Video' : tipo === 'audio' ? 'Audio' : 'Archivo'} enviado`, 'success');
    };
    reader.readAsDataURL(file);
  };

  return {
    handleSendMessage,
    handleSendGroupMessage,
    prepareFileMessage,
    sendFileMessage
  };
};