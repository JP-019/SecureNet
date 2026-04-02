import React from 'react';
import { COLORS } from '../../utils/constants';
import type { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  isGroupChat?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isGroupChat = false
}) => {
  const formatTime = (timestamp: string) => 
    new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const renderMessageContent = (msg: Message) => {
    switch (msg.tipo) {
      case 'imagen':
        return (
          <div style={{ 
            width: 300, 
            height: 300, 
            borderRadius: 10, 
            overflow: 'hidden',
            background: COLORS.gray700 
          }}>
            <img 
              src={msg.contenido} 
              alt="imagen" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          </div>
        );
      case 'video':
        return (
          <div style={{ 
            width: 300, 
            borderRadius: 10, 
            overflow: 'hidden',
            background: COLORS.gray700 
          }}>
            <video 
              controls 
              src={msg.contenido} 
              style={{ 
                width: '100%', 
                display: 'block' 
              }} 
            />
          </div>
        );
      case 'audio':
        return (
          <audio 
            controls 
            src={msg.contenido} 
            style={{ height: 35 }} 
          />
        );
      case 'archivo':
        return (
          <div style={{ 
            padding: 12, 
            borderRadius: 10, 
            background: msg.esMio ? COLORS.primary : COLORS.gray700, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8 
          }}>
            <i className="fas fa-file" style={{ color: 'white' }} />
            <span style={{ color: 'white', fontSize: 13 }}>{msg.contenido}</span>
          </div>
        );
      default:
        return (
          <div style={{ 
            padding: '10px 15px', 
            borderRadius: 15, 
            background: msg.esMio ? COLORS.primary : COLORS.gray700, 
            color: 'white', 
            fontSize: 14 
          }}>
            {msg.contenido}
          </div>
        );
    }
  };

  return (
    <div style={{ 
      flex: 1, 
      overflowY: 'auto', 
      padding: 15, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 10 
    }}>
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          style={{ 
            alignSelf: msg.esMio ? 'flex-end' : 'flex-start', 
            maxWidth: '70%' 
          }}
        >
          {isGroupChat && !msg.esMio && (
            <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 4 }}>
              {msg.emisorNombre}
            </div>
          )}
          {renderMessageContent(msg)}
          <div style={{ 
            fontSize: 10, 
            color: COLORS.gray500, 
            marginTop: 4, 
            textAlign: msg.esMio ? 'right' : 'left' 
          }}>
            {formatTime(msg.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;