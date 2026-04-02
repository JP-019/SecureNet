import type { Equipo, User } from '../../../../types';

export interface GroupHandlersProps {
  selectedGroup: Equipo | null;
  equipos: Equipo[];
  setEquipos: React.Dispatch<React.SetStateAction<Equipo[]>>;
  setSelectedGroup: React.Dispatch<React.SetStateAction<Equipo | null>>;
  setGroupMessages: React.Dispatch<React.SetStateAction<any[]>>;
  users: User[];
  showToast: (msg: string, type: string) => void;
  setConfirmDialog: React.Dispatch<React.SetStateAction<any>>;
  pinnedGroups: string[];
  setPinnedGroups: React.Dispatch<React.SetStateAction<string[]>>;
  archivedGroups: string[];
  setArchivedGroups: React.Dispatch<React.SetStateAction<string[]>>;
}

export const createGroupHandlers = ({
  selectedGroup,
  equipos,
  setEquipos,
  setSelectedGroup,
  setGroupMessages,
  users,
  showToast,
  setConfirmDialog,
  pinnedGroups,
  setPinnedGroups,
  archivedGroups,
  setArchivedGroups
}: GroupHandlersProps) => {
  
  const handleTogglePinGroup = (grupoId: string) => {
    if (pinnedGroups.includes(grupoId)) {
      setPinnedGroups(prev => prev.filter(id => id !== grupoId));
    } else {
      if (pinnedGroups.length >= 4) {
        showToast('Máximo 4 grupos fijados', 'info');
        return;
      }
      setPinnedGroups(prev => [...prev, grupoId]);
    }
  };

  const handleToggleArchiveGroup = (grupoId: string) => {
    const equipo = equipos.find(eq => eq.id === grupoId);
    if (archivedGroups.includes(grupoId)) {
      setArchivedGroups(prev => prev.filter(id => id !== grupoId));
      showToast('Grupo restaurado', 'success');
    } else {
      setArchivedGroups(prev => [...prev, grupoId]);
      if (equipo) {
        setEquipos(prev => prev.filter(eq => eq.id !== grupoId));
      }
      setSelectedGroup(null);
      showToast('Grupo archivado', 'success');
    }
  };

  const handleRemoveMemberFromGroup = (memberId: string, memberName: string) => {
    if (!selectedGroup) return;
    setConfirmDialog({
      visible: true,
      title: 'Eliminar Miembro',
      message: `¿Eliminar a ${memberName} del grupo?`,
      type: 'danger',
      onConfirm: () => {
        setEquipos(prev => prev.map(eq => 
          eq.id === selectedGroup.id 
            ? { ...eq, miembros: eq.miembros.filter(m => m.id !== memberId) }
            : eq
        ));
        setSelectedGroup(prev => prev 
          ? { ...prev, miembros: prev.miembros.filter(m => m.id !== memberId) }
          : null
        );
        const systemMsg: any = {
          id: Date.now().toString(),
          contenido: `El usuario ${memberName} ha sido expulsado del grupo`,
          timestamp: new Date().toISOString(),
          leido: true,
          esMio: false,
          tipo: 'sistema',
          emisorNombre: 'Sistema'
        };
        setGroupMessages((prev: any[]) => [...prev, systemMsg]);
        setConfirmDialog((prev: any) => ({ ...prev, visible: false }));
        showToast(`${memberName} eliminado del grupo`, 'success');
      }
    });
  };

  const handleAddMemberToGroup = (userId: string) => {
    if (!selectedGroup) return;
    const userToAdd = users.find(u => u.id === userId);
    if (!userToAdd) return;
    
    setEquipos(prev => prev.map(eq => 
      eq.id === selectedGroup.id 
        ? { ...eq, miembros: [...eq.miembros, { id: userToAdd.id, nombre: userToAdd.nombre, rol: userToAdd.rol, estado: userToAdd.estado }] }
        : eq
    ));
    
    setSelectedGroup(prev => prev 
      ? { ...prev, miembros: [...prev.miembros, { id: userToAdd.id, nombre: userToAdd.nombre, rol: userToAdd.rol, estado: userToAdd.estado }] }
      : null
    );
    
    const systemMsg: any = {
      id: Date.now().toString(),
      contenido: `El usuario ${userToAdd.nombre} ha sido agregado al grupo`,
      timestamp: new Date().toISOString(),
      leido: true,
      esMio: false,
      tipo: 'sistema',
      emisorNombre: 'Sistema'
    };
    setGroupMessages((prev: any[]) => [...prev, systemMsg]);
    showToast(`${userToAdd.nombre} agregado al grupo`, 'success');
  };

  return {
    handleTogglePinGroup,
    handleToggleArchiveGroup,
    handleRemoveMemberFromGroup,
    handleAddMemberToGroup
  };
};
