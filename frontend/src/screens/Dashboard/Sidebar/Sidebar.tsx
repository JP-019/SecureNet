import React from 'react';
import { Avatar } from '../../../components';
import { COLORS } from '../../../utils/constants';
import type { Equipo, Conversation } from '../../../types';

interface SidebarProps {
  activeTab: 'teams' | 'chats' | 'map' | 'archived';
  onTabChange: (tab: 'teams' | 'chats' | 'map' | 'archived') => void;
  equipos: Equipo[];
  conversations: Conversation[];
  archivedEquipos?: Equipo[];
  archivedConversations?: Conversation[];
  selectedGroupId?: string;
  selectedChatId?: string;
  pinnedGroupIds?: string[];
  pinnedChatIds?: string[];
  onSelectGroup: (equipo: Equipo) => void;
  onSelectChat: (convo: Conversation) => void;
  onUnarchiveGroup?: (equipoId: string) => void;
  onUnarchiveChat?: (chatId: string) => void;
  canManageGroup?: boolean;
  onCreateGroup?: () => void;
  onAddMap?: () => void;
  mapPoints?: { id: string; nombre: string; lat: number; lng: number; tipo: string; }[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  equipos,
  conversations,
  archivedEquipos = [],
  archivedConversations = [],
  selectedGroupId,
  selectedChatId,
  pinnedGroupIds = [],
  pinnedChatIds = [],
  onSelectGroup,
  onSelectChat,
  onUnarchiveGroup,
  onUnarchiveChat,
  canManageGroup,
  onCreateGroup,
  onAddMap,
  mapPoints = [],
  searchTerm = '',
  onSearchChange
}) => {
  const tabs = [
    { key: 'teams' as const, icon: 'fa-users', label: 'Equipos' },
    { key: 'chats' as const, icon: 'fa-comments', label: 'Chats' },
    { key: 'archived' as const, icon: 'fa-archive', label: 'Archivados' },
    { key: 'map' as const, icon: 'fa-map-marker-alt', label: 'Mapa' }
  ];

  const renderTeamsList = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {canManageGroup && (
        <button 
          onClick={onCreateGroup}
          style={{ 
            padding: 12, 
            background: COLORS.green, 
            color: 'white', 
            border: 'none', 
            borderRadius: 8, 
            cursor: 'pointer', 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 8 
          }}
        >
          <i className="fas fa-plus" /> Nuevo Equipo
        </button>
      )}
      {equipos.map(eq => {
        const isPinned = pinnedGroupIds.includes(eq.id);
        const isSelected = selectedGroupId === eq.id;
        return (
        <div 
          key={eq.id}
          onClick={() => onSelectGroup(eq)}
          style={{ 
            padding: 15, 
            background: isSelected ? COLORS.gray700 : COLORS.gray800, 
            borderRadius: 10, 
            cursor: 'pointer', 
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: isPinned ? 4 : (isSelected ? 1 : 0),
            borderRightWidth: 1,
            borderTopStyle: isSelected ? 'solid' : 'solid',
            borderBottomStyle: isSelected ? 'solid' : 'solid',
            borderLeftStyle: 'solid',
            borderRightStyle: isSelected ? 'solid' : 'solid',
            borderTopColor: isSelected ? COLORS.primary : 'transparent',
            borderBottomColor: isSelected ? COLORS.primary : 'transparent',
            borderLeftColor: isPinned ? COLORS.purple : (isSelected ? COLORS.primary : 'transparent'),
            borderRightColor: isSelected ? COLORS.primary : 'transparent'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 10, 
              background: isPinned ? COLORS.purple : COLORS.primary, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="fas fa-users" style={{ color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.gray100, display: 'flex', alignItems: 'center', gap: 6 }}>
                {eq.nombre}
                {isPinned && <i className="fas fa-thumbtack" style={{ color: COLORS.purple, fontSize: 10 }} />}
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray400 }}>{eq.miembros.length} miembros</div>
            </div>
            <i className="fas fa-chevron-right" style={{ color: COLORS.gray500, fontSize: 12 }} />
          </div>
        </div>
        );
      })}
    </div>
  );

  const renderChatsList = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {conversations.map(convo => {
        const isPinned = pinnedChatIds.includes(convo.usuarioId);
        const isSelected = selectedChatId === convo.usuarioId;
        return (
        <div 
          key={convo.usuarioId}
          onClick={() => onSelectChat(convo)}
          style={{ 
            padding: 15, 
            background: isSelected ? COLORS.gray700 : COLORS.gray800, 
            borderRadius: 10, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: isPinned ? 4 : (isSelected ? 1 : 0),
            borderRightWidth: 1,
            borderTopStyle: 'solid',
            borderBottomStyle: 'solid',
            borderLeftStyle: 'solid',
            borderRightStyle: 'solid',
            borderTopColor: isSelected ? COLORS.primary : 'transparent',
            borderBottomColor: isSelected ? COLORS.primary : 'transparent',
            borderLeftColor: isPinned ? COLORS.purple : (isSelected ? COLORS.primary : 'transparent'),
            borderRightColor: isSelected ? COLORS.primary : 'transparent'
          }}
        >
          <Avatar name={convo.nombre} role={convo.rol} size="md" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.gray100, display: 'flex', alignItems: 'center', gap: 6 }}>
              {convo.nombre}
              {isPinned && <i className="fas fa-thumbtack" style={{ color: COLORS.purple, fontSize: 10 }} />}
            </div>
            <div style={{ fontSize: 12, color: COLORS.gray400 }}>{convo.ultimoMensaje || 'Sin mensajes'}</div>
          </div>
          {convo.noLeidos > 0 && (
            <span style={{ 
              background: COLORS.green, 
              color: 'white', 
              borderRadius: 10, 
              padding: '2px 8px', 
              fontSize: 11 
            }}>
              {convo.noLeidos}
            </span>
          )}
        </div>
        );
      })}
    </div>
  );

  const renderMapView = () => (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 20, 
      background: COLORS.gray900 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: 600, 
        background: COLORS.gray800, 
        borderRadius: 16, 
        overflow: 'hidden', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)' 
      }}>
        <div style={{ 
          padding: 15, 
          background: COLORS.blue, 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fas fa-map-marker-alt" />
            <span style={{ fontWeight: 600 }}>Mapa de Ubicaciones</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onAddMap?.()} style={{ 
              padding: '8px 12px', 
              background: COLORS.green, 
              color: 'white', 
              border: 'none', 
              borderRadius: 6, 
              cursor: 'pointer', 
              fontWeight: 600, 
              fontSize: 12 
            }}>
              <i className="fas fa-map-plus" /> Agregar Mapa
            </button>
            <button style={{ 
              width: 30, 
              height: 30, 
              borderRadius: 6, 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              cursor: 'pointer' 
            }}>
              <i className="fas fa-search" style={{ color: 'white' }} />
            </button>
            <button style={{ 
              width: 30, 
              height: 30, 
              borderRadius: 6, 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              cursor: 'pointer' 
            }}>
              <i className="fas fa-crosshairs" style={{ color: 'white' }} />
            </button>
          </div>
        </div>
        <div style={{ 
          height: 300, 
          background: `linear-gradient(135deg, ${COLORS.gray700}, ${COLORS.gray800})`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{ textAlign: 'center', color: COLORS.gray400 }}>
            <i className="fas fa-map" style={{ fontSize: 64, marginBottom: 15, color: COLORS.blue + '60' }} />
            <div style={{ fontWeight: 600, marginBottom: 5 }}>Vista de Mapa GPS</div>
            <div style={{ fontSize: 12 }}>Integración con Google Maps / Mapbox</div>
          </div>
        </div>
        <div style={{ padding: 12, background: COLORS.gray900, borderTop: `1px solid ${COLORS.gray700}` }}>
          <h5 style={{ margin: 0, marginBottom: 8, color: 'white', fontSize: 13 }}>Marcadores guardados</h5>
          {mapPoints && mapPoints.length > 0 ? (
            mapPoints.map(point => (
              <div key={point.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: COLORS.gray800, borderRadius: 8, marginBottom: 6, color: COLORS.gray100 }}>
                <div style={{ fontSize: 12 }}><strong>{point.nombre}</strong> ({point.tipo})</div>
                <div style={{ fontSize: 11, color: COLORS.gray400 }}>{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</div>
              </div>
            ))
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: COLORS.gray400 }}>No hay puntos guardados.</p>
          )}
        </div>
        <div style={{ 
          padding: 15, 
          display: 'flex', 
          gap: 10, 
          borderTop: `1px solid ${COLORS.gray700}` 
        }}>
          <button style={{ 
            flex: 1, 
            padding: 10, 
            background: COLORS.primary, 
            color: 'white', 
            border: 'none', 
            borderRadius: 8, 
            cursor: 'pointer', 
            fontSize: 13 
          }}>
            <i className="fas fa-users" /> Ver Guardias
          </button>
          <button style={{ 
            flex: 1, 
            padding: 10, 
            background: COLORS.green, 
            color: 'white', 
            border: 'none', 
            borderRadius: 8, 
            cursor: 'pointer', 
            fontSize: 13 
          }}>
            <i className="fas fa-route" /> Rutas
          </button>
        </div>
      </div>
    </div>
  );

  const renderArchivedList = () => {
    const hasArchivedGroups = archivedEquipos.length > 0;
    const hasArchivedChats = archivedConversations.length > 0;

    if (!hasArchivedGroups && !hasArchivedChats) {
      return (
        <div style={{ textAlign: 'center', padding: 40, color: COLORS.gray400 }}>
          <i className="fas fa-archive" style={{ fontSize: 48, marginBottom: 15 }} />
          <div style={{ fontSize: 14 }}>No hay elementos archivados</div>
          <div style={{ fontSize: 12, marginTop: 5 }}>Los grupos y chats archivados aparecerán aquí</div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {archivedEquipos.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 8, fontWeight: 600 }}>
              <i className="fas fa-users" style={{ marginRight: 6 }} /> GRUPOS ARCHIVADOS ({archivedEquipos.length})
            </div>
            {archivedEquipos.map(eq => (
              <div 
                key={eq.id}
                style={{ 
                  padding: 15, 
                  background: COLORS.gray700 + '60', 
                  borderRadius: 10, 
                  cursor: 'pointer',
                  borderLeft: `3px solid ${COLORS.yellow}`,
                  marginBottom: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 10, 
                    background: COLORS.yellow + '40', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <i className="fas fa-archive" style={{ color: COLORS.yellow }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.gray100 }}>{eq.nombre}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400 }}>{eq.miembros.length} miembros • Archivado</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onUnarchiveGroup?.(eq.id); }}
                    title="Desarchivar"
                    style={{ 
                      padding: '8px 12px', 
                      background: COLORS.green, 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: 6, 
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  >
                    <i className="fas fa-box-open" style={{ marginRight: 4 }} /> Restaurar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {archivedConversations.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 8, fontWeight: 600 }}>
              <i className="fas fa-comments" style={{ marginRight: 6 }} /> CHATS ARCHIVADOS ({archivedConversations.length})
            </div>
            {archivedConversations.map(convo => (
              <div 
                key={convo.usuarioId}
                style={{ 
                  padding: 15, 
                  background: COLORS.gray700 + '60', 
                  borderRadius: 10, 
                  cursor: 'pointer',
                  borderLeft: `3px solid ${COLORS.yellow}`,
                  marginBottom: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={convo.nombre} role={convo.rol} size="md" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.gray100 }}>{convo.nombre}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400 }}>Archivado</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onUnarchiveChat?.(convo.usuarioId); }}
                    title="Desarchivar"
                    style={{ 
                      padding: '8px 12px', 
                      background: COLORS.green, 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: 6, 
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  >
                    <i className="fas fa-box-open" style={{ marginRight: 4 }} /> Restaurar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      width: 350, 
      background: COLORS.gray800, 
      borderRight: `1px solid ${COLORS.gray600}`, 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${COLORS.gray600}` }}>
        {tabs.map(tab => (
          <div 
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{ 
              flex: 1, 
              padding: 15, 
              textAlign: 'center', 
              cursor: 'pointer', 
              fontWeight: 600, 
              fontSize: 13, 
              color: activeTab === tab.key ? COLORS.primaryLight : COLORS.gray400, 
              borderBottom: activeTab === tab.key ? `3px solid ${COLORS.primary}` : '3px solid transparent' 
            }}
          >
            <i className={`fas ${tab.icon}`} style={{ marginRight: 8 }} />{tab.label}
          </div>
        ))}
      </div>
      
      <div style={{ padding: 15, borderBottom: `1px solid ${COLORS.gray600}` }}>
        <input 
          type="text" 
          placeholder="Buscar guardia, grupo..."
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          style={{ 
            width: '100%', 
            padding: 12, 
            border: 'none', 
            borderRadius: 30, 
            background: COLORS.gray700, 
            fontSize: 13, 
            outline: 'none', 
            color: COLORS.gray100 
          }} 
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        {activeTab === 'teams' && renderTeamsList()}
        {activeTab === 'chats' && renderChatsList()}
        {activeTab === 'archived' && renderArchivedList()}
        {activeTab === 'map' && renderMapView()}
      </div>
    </div>
  );
};

export default Sidebar;