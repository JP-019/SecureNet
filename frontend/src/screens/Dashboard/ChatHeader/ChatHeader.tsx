import React from 'react';
import { Avatar } from '../../../components';
import { COLORS } from '../../../utils/constants';

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
  showMenu?: boolean;
  onToggleMenu?: () => void;
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
  isGroup,
  showMenu,
  onToggleMenu
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
        {isGroup && (
          <>
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
            <div style={{ position: 'relative' }}>
              <button 
                onClick={onToggleMenu} 
                title="Más opciones" 
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
                <i className="fas fa-ellipsis-v" style={{ color: COLORS.gray400 }} />
              </button>
              {showMenu && (
                <div style={{ 
                  position: 'absolute', 
                  top: 40, 
                  right: 0, 
                  background: COLORS.gray700, 
                  borderRadius: 8, 
                  padding: 8, 
                  minWidth: 160,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 100 
                }}>
                  <div 
                    onClick={onPin} 
                    style={{ 
                      padding: '10px 12px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      borderRadius: 6,
                      color: 'white',
                      fontSize: 13
                    }}
                  >
                    <i className="fas fa-thumbtack" style={{ color: isPinned ? COLORS.purple : COLORS.gray400, width: 16 }} />
                    {isPinned ? 'Desfijar' : 'Fijar'}
                  </div>
                  <div 
                    onClick={onArchive} 
                    style={{ 
                      padding: '10px 12px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      borderRadius: 6,
                      color: 'white',
                      fontSize: 13
                    }}
                  >
                    <i className="fas fa-archive" style={{ color: isArchived ? COLORS.yellow : COLORS.gray400, width: 16 }} />
                    {isArchived ? 'Desarchivar' : 'Archivar'}
                  </div>
                  <div 
                    onClick={onConfig} 
                    style={{ 
                      padding: '10px 12px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      borderRadius: 6,
                      color: 'white',
                      fontSize: 13
                    }}
                  >
                    <i className="fas fa-cog" style={{ color: COLORS.gray400, width: 16 }} />
                    Configuración
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {!isGroup && onConfig && (
          <button 
            onClick={onConfig} 
            title="Info" 
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
            <i className="fas fa-info-circle" style={{ color: COLORS.gray400 }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;