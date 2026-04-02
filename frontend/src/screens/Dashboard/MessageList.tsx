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
            background: COLORS.gray700,
            position: 'relative'
          }}>
            <img 
              src={msg.contenido} 
              alt={msg.archivoNombre || "imagen"} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
            {msg.archivoNombre && (
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                background: 'rgba(0,0,0,0.6)', 
                padding: '4px 8px',
                fontSize: 10,
                color: 'white'
              }}>
                {msg.archivoNombre}
              </div>
            )}
          </div>
        );
      case 'video':
        return (
          <div style={{ 
            width: 300, 
            borderRadius: 10, 
            overflow: 'hidden',
            background: COLORS.gray700,
            position: 'relative'
          }}>
            <video 
              controls 
              src={msg.contenido} 
              style={{ 
                width: '100%', 
                display: 'block' 
              }} 
            />
            {msg.archivoNombre && (
              <div style={{ 
                position: 'absolute', 
                bottom: 40, 
                left: 0, 
                right: 0, 
                background: 'rgba(0,0,0,0.6)', 
                padding: '4px 8px',
                fontSize: 10,
                color: 'white'
              }}>
                {msg.archivoNombre}
              </div>
            )}
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
            gap: 8,
            maxWidth: 300
          }}>
            <i className="fas fa-file" style={{ color: 'white', fontSize: 20 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {msg.contenido.split(',').pop()?.substring(0, 30) || 'Archivo'}
              </div>
            </div>
            <a 
              href={msg.contenido} 
              download="archivo"
              style={{ 
                padding: '6px 10px', 
                background: COLORS.green, 
                borderRadius: 6, 
                color: 'white', 
                fontSize: 11,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <i className="fas fa-download" /> Descargar
            </a>
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