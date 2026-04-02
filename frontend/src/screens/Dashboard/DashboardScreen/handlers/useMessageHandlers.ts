import React from 'react';
import { messageService } from '../../../../services';
import type { Message, Conversation, Equipo } from '../../../../types';

export interface MessageHandlers {
  messageText: string;
  groupMessageText: string;
  groupMessages: Message[];
  selectedChat: Conversation | null;
  selectedGroup: Equipo | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setGroupMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  setGroupMessageText: React.Dispatch<React.SetStateAction<string>>;
}

export interface useMessageHandlersProps extends MessageHandlers {
  showToast: (msg: string, type: string) => void;
  user: { nombre: string } | null;
}

export const createMessageHandlers = ({
  messageText,
  groupMessageText,
  groupMessages,
  selectedChat,
  selectedGroup,
  setMessages,
  setGroupMessages,
  setMessageText,
  setGroupMessageText,
  showToast,
  user
}: useMessageHandlersProps) => {
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newMsg: Message = {
          id: Date.now().toString(),
          contenido: reader.result as string,
          timestamp: new Date().toISOString(),
          leido: true,
          esMio: true,
          tipo: 'imagen',
          archivoNombre: file.name,
          grupoId: selectedGroup?.id
        };
        if (selectedGroup) {
          setGroupMessages(prev => [...prev, newMsg]);
        } else if (selectedChat) {
          setMessages(prev => [...prev, newMsg]);
        }
        showToast('Imagen enviada', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newMsg: Message = {
          id: Date.now().toString(),
          contenido: reader.result as string,
          timestamp: new Date().toISOString(),
          leido: true,
          esMio: true,
          tipo: 'archivo',
          archivoNombre: file.name,
          grupoId: selectedGroup?.id
        };
        if (selectedGroup) {
          setGroupMessages(prev => [...prev, newMsg]);
        } else if (selectedChat) {
          setMessages(prev => [...prev, newMsg]);
        }
        showToast(`Archivo: ${file.name}`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newMsg: Message = {
          id: Date.now().toString(),
          contenido: reader.result as string,
          timestamp: new Date().toISOString(),
          leido: true,
          esMio: true,
          tipo: 'video',
          archivoNombre: file.name,
          grupoId: selectedGroup?.id
        };
        if (selectedGroup) {
          setGroupMessages(prev => [...prev, newMsg]);
        } else if (selectedChat) {
          setMessages(prev => [...prev, newMsg]);
        }
        showToast('Video enviado', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    handleSendMessage,
    handleSendGroupMessage,
    handleImageSelect,
    handleFileSelect,
    handleVideoSelect
  };
};
