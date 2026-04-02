# CAPÍTULO 4: Sistema de Equipos y Grupos

## 4.1 Concepto de Equipos

Los equipos en SecureNet representan grupos de trabajo de guardias de seguridad. Cada equipo pertenece a una empresa específica y puede tener una zona asignada.

### Estructura de un Equipo
```typescript
interface Equipo {
  id: string;              // ID único (ej: "equipo-1234567890")
  nombre: string;           // Nombre del equipo
  descripcion?: string;    // Descripción opcional
  zona?: Zona;             // Zona geográfica asignada
  miembros: Miembro[];     // Lista de miembros
  fechaCreacion: string;   // Fecha de creación (ISO)
  empresaId: string;      // ID de la empresa
}

interface Miembro {
  id: string;      // ID del usuario
  nombre: string; // Nombre del miembro
  rol: string;    // Rol del usuario
  estado: string; // Estado de conexión
}
```

## 4.2 Características de los Equipos

### Atributos
- **Nombre**: Identificador del equipo (ej: "Equipo Nocturno A")
- **Zona**: Área geográfica de vigilancia asignada
- **Miembros**: Lista de guardias que pertenecen al equipo
- **Empresa**: Cada equipo pertenece a una empresa de seguridad

### Estados de Equipos
- **Activo**: Equipo en funcionamiento normal
- **Fijado (Pinned)**: Equipo mostrado siempre al inicio
- **Archivado**: Equipo oculto de la lista principal

### Permisos
| Acción | Admin/Owner | Recepcionista | Guardia |
|--------|-------------|---------------|---------|
| Crear equipo | ✅ | ✅ | ❌ |
| Editar equipo | ✅ | ✅ | ❌ |
| Eliminar equipo | ✅ | ❌ | ❌ |
| Agregar miembros | ✅ | ✅ | ❌ |
| Ver equipo | ✅ | ✅ | ✅ |

## 4.3 Gestión de Miembros

### Agregar Miembros
```typescript
const handleAddMember = (userToAdd: User) => {
  setEquipos(prev => prev.map(eq => 
    eq.id === selectedGroup.id 
      ? { ...eq, miembros: [...eq.miembros, { 
          id: userToAdd.id, 
          nombre: userToAdd.nombre, 
          rol: userToAdd.rol, 
          estado: userToAdd.estado 
        }] } 
      : eq
  ));
};
```

### Eliminar Miembros
```typescript
const handleRemoveMember = (memberId: string) => {
  setEquipos(prev => prev.map(eq => 
    eq.id === selectedGroup.id 
      ? { ...eq, miembros: eq.miembros.filter(m => m.id !== memberId) } 
      : eq
  ));
};
```

### Filtrar Usuarios Disponibles
Solo muestra guardias activos que no están ya en el equipo:
```typescript
const availableMembersToAdd = users.filter(
  u => u.rol === 'guardia' && 
       u.estado !== 'inactive' && 
       !selectedGroup?.miembros.some(m => m.id === u.id)
);
```

## 4.4 Zonas de Vigilancia

### Catálogo de Zonas
Las zonas se obtienen del backend y permiten organizar geográficamente los equipos.

```typescript
interface Zona {
  id: string;
  nombre: string;   // ej: "Zona Norte", "Zona Centro"
  empresaId: string;
}
```

### Relación Equipo-Zona
- Un equipo puede tener una zona asignada
- Una zona puede tener múltiples equipos
- Los filtros de zona permiten buscar equipos por ubicación

## 4.5 Creación de Equipos

### Modal de Creación
El formulario de creación incluye:
1. **Nombre del Grupo**: Campo de texto
2. **Zona**: Dropdown con zonas disponibles
3. **Miembros**: Selector multiple de guardias

### Proceso de Creación
```typescript
const handleCreateGroup = () => {
  // Validar campos
  if (!newGroupName.trim() || !newGroupZone) return;
  
  // Crear objeto equipo
  const newEquipo = {
    id: `equipo-${Date.now()}`,
    nombre: newGroupName,
    zona: catalogs?.zonas.find(z => z.id === newGroupZone),
    miembros: selectedUsers,
    fechaCreacion: new Date().toISOString(),
    empresaId: user?.empresaId
  };
  
  // Actualizar estado
  setEquipos(prev => [...prev, newEquipo]);
};
```

## 4.6 Configuración de Equipos

### Modal de Configuración
Desde el panel de equipo se puede:
- Editar nombre y descripción
- Ver fecha de creación
- Ver lista de miembros
- Eliminar el equipo

### Acciones del Equipo
| Acción | Icono | Descripción |
|--------|-------|--------------|
| Fijar | 📌 | Mostrar equipo al inicio |
| Archivar | 📦 | Ocultar equipo (accesible desde pestaña Archivados) |
| Configurar | ⚙️ | Editar detalles |
| Eliminar | 🗑️ | Eliminar equipo |

## 4.7 Sistema de Archivado

### Pestaña Archivados
Los equipos y chats archivados se pueden encontrar en una pestaña dedicada del Sidebar:

```
Sidebar:
├── Equipos     (equipos activos)
├── Chats       (conversaciones activas)
├── Archivados  (grupos y chats archivados)
└── Mapa        (ubicaciones)
```

### Comportamiento del Archivado
- Al archivar un equipo, se mueve automáticamente a la lista de archivados
- Desde "Archivados" se puede restaurar con el botón "Restaurar"
- Los equipos archivados tienen标识 visual (borde amarillo)
- La restauración mueve el equipo de vuelta a la lista activa

### Funciones de Archivo
```typescript
const handleToggleArchiveGroup = (grupoId: string) => {
  const equipo = equipos.find(eq => eq.id === grupoId);
  if (archivedGroups.includes(grupoId)) {
    // Restaurar
    setArchivedGroups(prev => prev.filter(id => id !== grupoId));
    setArchivedEquipos(prev => prev.filter(eq => eq.id !== grupoId));
  } else {
    // Archivar
    setArchivedGroups(prev => [...prev, grupoId]);
    setArchivedEquipos(prev => [...prev, equipo]);
    setEquipos(prev => prev.filter(eq => eq.id !== grupoId));
  }
};
```

## 4.8 Datos Mock de Equipos

### Equipos de Ejemplo TechCorp
```javascript
{ id: 'eq1', nombre: 'Equipo Nocturno A', empresaId: 'techcorp' }
{ id: 'eq2', nombre: 'Equipo Diurno A', empresaId: 'techcorp' }
```

### Equipos de Ejemplo Mercurio
```javascript
{ id: 'eq3', nombre: 'Equipo Nocturno B', empresaId: 'mercurio' }
{ id: 'eq4', nombre: 'Equipo Diurno B', empresaId: 'mercurio' }
```