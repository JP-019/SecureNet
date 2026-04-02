import React from 'react';
import { Avatar } from '../../components';
import { COLORS } from '../../utils/constants';

interface ChatHeaderProps {
  selectedChat: { usuarioId: string; nombre: string; rol: string } | null;
  selectedGroup: { id: string; nombre: string; miembros: { id: string }[] } | null;
  onCall?: () => void;
  onVideoCall?: () => void;
  onInfo?: () => void;
  onAlert?: () => void;
  onConfig?: () => void;
  isPinned?: boolean;
  isArchived?: boolean;
  onPin?: () => void;
  onArchive?: () => void;
  isGroup?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedChat,
  selectedGroup,
  onCall,
  onVideoCall,
  onInfo,
  onAlert,
  onConfig,
  isPinned,
  isArchived,
  onPin,
  onArchive,
  isGroup
}) => {
  const title = selectedChat?.nombre || selectedGroup?.nombre || '';
  const subtitle = selectedChat 
    ? 'En línea' 
    : selectedGroup 
      ? `${selectedGroup.miembros.length} miembros`
      : '';

  return (
    <div style={{ 
      padding: 15, 
      background: COLORS.gray800, 
      borderBottom: `1px solid ${COLORS.gray700}`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isGroup ? (
          <div style={{ 
            width: 45, 
            height: 45, 
            borderRadius: 12, 
            background: COLORS.green, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <i className="fas fa-users" style={{ color: 'white', fontSize: 20 }} />
          </div>
        ) : (
          <Avatar name={title} role={selectedChat?.rol} size="md" />
        )}
        <div>
          <div style={{ fontWeight: 600, color: COLORS.gray100 }}>{title}</div>
          <div style={{ fontSize: 12, color: COLORS.gray400 }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button 
          onClick={onCall} 
          title="Llamada" 
          style={{ 
            width: 35, 
            height: 35, 
            borderRadius: '50%', 
            background: COLORS.green + '40', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <i className="fas fa-phone" style={{ color: COLORS.green }} />
        </button>
        <button 
          onClick={onVideoCall} 
          title="Videollamada" 
          style={{ 
            width: 35, 
            height: 35, 
            borderRadius: '50%', 
            background: COLORS.blue + '40', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <i className="fas fa-video" style={{ color: COLORS.blue }} />
        </button>
        {isGroup && (
          <>
            <button 
              onClick={onPin} 
              title={isPinned ? "Desfijar" : "Fijar"} 
              style={{ 
                width: 35, 
                height: 35, 
                borderRadius: '50%', 
                background: isPinned ? COLORS.purple + '60' : COLORS.gray600 + '40', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <i className="fas fa-thumbtack" style={{ color: isPinned ? COLORS.purple : COLORS.gray400 }} />
            </button>
            <button 
              onClick={onArchive} 
              title={isArchived ? "Desarchivar" : "Archivar"} 
              style={{ 
                width: 35, 
                height: 35, 
                borderRadius: '50%', 
                background: isArchived ? COLORS.yellow + '60' : COLORS.gray600 + '40', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <i className="fas fa-archive" style={{ color: isArchived ? COLORS.yellow : COLORS.gray400 }} />
            </button>
            <button 
              onClick={onAlert} 
              title="Enviar Alerta" 
              style={{ 
                width: 35, 
                height: 35, 
                borderRadius: '50%', 
                background: COLORS.red + '40', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <i className="fas fa-exclamation-triangle" style={{ color: COLORS.red }} />
            </button>
          </>
        )}
        <button 
          onClick={onConfig} 
          title={isGroup ? 'Configurar Grupo' : 'Info'} 
          style={{ 
            width: 35, 
            height: 35, 
            borderRadius: '50%', 
            background: COLORS.gray600 + '40', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <i className={isGroup ? 'fas fa-cog' : 'fas fa-info-circle'} style={{ color: COLORS.gray400 }} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;