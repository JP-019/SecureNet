import React, { useState } from 'react';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { MessageList } from '../MessageList/MessageList';
import { ChatInput } from '../ChatInput/ChatInput';
import { COLORS } from '../../../utils/constants';
import type { Message } from '../../../types';

interface ChatAreaProps {
  selectedChat: { usuarioId: string; nombre: string; rol: string } | null;
  selectedGroup: { id: string; nombre: string; miembros: { id: string }[] } | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setGroupMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messageText: string;
  groupMessageText: string;
  showFileMenu: boolean;
  isRecording: boolean;
  recordingDuration: number;
  onMessageTextChange: (value: string) => void;
  onGroupMessageTextChange: (value: string) => void;
  onSendMessage: () => void;
  onSendGroupMessage: () => void;
  onVoiceRecording: () => void;
  onStopRecording: () => void;
  onFileMenuToggle: () => void;
  onShowToast: (message: string, type: string) => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onInfo?: () => void;
  onAlert?: () => void;
  onConfig?: () => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef?: React.RefObject<HTMLInputElement>;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  canManageGroup?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  onPin?: () => void;
  onArchive?: () => void;
  showMenu?: boolean;
  onToggleMenu?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat,
  selectedGroup,
  messages,
  setMessages,
  setGroupMessages,
  messageText,
  groupMessageText,
  showFileMenu,
  isRecording,
  recordingDuration,
  onMessageTextChange,
  onGroupMessageTextChange,
  onSendMessage,
  onSendGroupMessage,
  onVoiceRecording,
  onStopRecording,
  onFileMenuToggle,
  onShowToast,
  onCall,
  onVideoCall,
  onInfo,
  onAlert,
  onConfig,
  imageInputRef,
  fileInputRef,
  videoInputRef,
  onImageSelect,
  onFileSelect,
  onVideoSelect,
  canManageGroup,
  isPinned,
  isArchived,
  onPin,
  onArchive,
  showMenu,
  onToggleMenu
}) => {
  const isGroup = !!selectedGroup;
  const activeMessages = selectedGroup 
    ? messages.filter(m => m.grupoId === selectedGroup.id)
    : selectedChat 
      ? messages.filter(m => 
          m.emisorId === selectedChat.usuarioId || 
          m.receptorId === selectedChat.usuarioId ||
          (m.emisorId === undefined && m.receptorId === undefined && !m.grupoId)
        )
      : messages;

  const addMessage = (msg: Message) => {
    if (selectedGroup) {
      setGroupMessages(prev => [...prev, msg]);
    } else {
      setMessages(prev => [...prev, msg]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      selectedGroup ? onSendGroupMessage() : onSendMessage();
    }
  };

  if (!selectedChat && !selectedGroup) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: COLORS.gray500 
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-comments" style={{ fontSize: 64, marginBottom: 20, color: COLORS.gray600 }} />
          <div style={{ fontSize: 18, fontWeight: 600 }}>Selecciona un chat o grupo</div>
          <div style={{ fontSize: 13, marginTop: 8 }}>Elige una conversación de la barra lateral</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: COLORS.gray900, overflow: 'hidden' }}>
      <ChatHeader
        selectedChat={selectedChat}
        selectedGroup={selectedGroup}
        onCall={onCall}
        onVideoCall={onVideoCall}
        onInfo={onInfo}
        onAlert={onAlert}
        onConfig={onConfig}
        isGroup={isGroup}
        isPinned={isPinned}
        isArchived={isArchived}
        onPin={onPin}
        onArchive={onArchive}
        showMenu={showMenu}
        onToggleMenu={onToggleMenu}
      />
      
      <MessageList 
        messages={activeMessages}
        isGroupChat={isGroup}
      />
      
      <ChatInput
        value={selectedGroup ? groupMessageText : messageText}
        onChange={selectedGroup ? onGroupMessageTextChange : onMessageTextChange}
        onSend={selectedGroup ? onSendGroupMessage : onSendMessage}
        onKeyPress={handleKeyPress}
        onVoiceRecording={onVoiceRecording}
        onFileMenuToggle={onFileMenuToggle}
        showFileMenu={showFileMenu}
        isRecording={isRecording}
        recordingDuration={recordingDuration}
        onStopRecording={onStopRecording}
        imageInputRef={imageInputRef}
        fileInputRef={fileInputRef}
        videoInputRef={videoInputRef}
        onImageSelect={onImageSelect}
        onFileSelect={onFileSelect}
        onVideoSelect={onVideoSelect}
        placeholder={selectedGroup ? 'Escribe al grupo...' : 'Escribe un mensaje...'}
      />
    </div>
  );
};

export default ChatArea;