# CAPÍTULO 2: Arquitectura y Estructura Técnica

## 2.1 Arquitectura General

El sistema SecureNet sigue una arquitectura cliente-servidor con comunicación REST API y WebSocket para tiempo real.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  MongoDB   │
│   (React)   │◀────│  (Express)  │◀────│  (Mock)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │            ┌──────┴──────┐
       │            │  WebSocket   │
       │            │  (Tiempo Real)│
       │            └───────────────┘
       ▼
┌─────────────┐
│   Cliente   │
│  Navegador  │
└─────────────┘
```

## 2.2 Communication Flow

### Autenticación
1. El usuario envía credenciales (empresa, usuario, contraseña)
2. El backend valida y genera un JWT token
3. El frontend almacena el token en localStorage
4. Las peticiones subsiguientes incluyen el token en el header Authorization

### Peticiones API
- **Base URL**: `/api` (proxificado a `http://localhost:3000/api`)
- **API Key**: Requerida en header `X-Api-Key`
- **Content-Type**: `application/json`

### Estructura de Respuesta
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## 2.3 Configuración de Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend Dev | 8080 | Servidor Vite |
| Backend | 3000 | Servidor Express |
| WebSocket | 3000 | Mismo que backend |

### Proxy Vite (frontend/vite.config.ts)
```typescript
proxy: {
  '/api': { target: 'http://localhost:3000', changeOrigin: true },
  '/uploads': { target: 'http://localhost:3000', changeOrigin: true },
  '/ws': { target: 'ws://localhost:3000', ws: true }
}
```

## 2.4 Estructura de Componentes React

### Jerarquía de Componentes
```
App
├── LoginScreen
└── DashboardScreen
    ├── Header (logo, empresa, botones)
    ├── Sidebar
    │   ├── Tabs (Equipos/Chats/Mapa)
    │   ├── Search
    │   └── Lista de items
    ├── ChatArea
    │   ├── Header (info chat/grupo)
    │   ├── Messages (lista de mensajes)
    │   └── Input (campo + botones)
    ├── AdminPanel (sidebar derecho)
    └── Modales (perfil, crear grupo, etc.)
```

## 2.5 Gestión de Estado

### useState - Estados Locales
- `activeTab`: 'teams' | 'chats' | 'map'
- `selectedChat`: Conversation | null
- `selectedGroup`: Equipo | null
- `messages`: Message[]
- `groupMessages`: Message[]
- `isRecording`: boolean
- `showFileMenu`: boolean

### Context API - Estados Globales
- **AuthContext**: usuario, login, logout, token
- **useToast**: notificaciones toast

## 2.6 Tipos de Datos Principales

### User
```typescript
interface User {
  id: string;
  nombre: string;
  usuario: string;
  email?: string;
  identidad?: string;  // ID único del guardia
  telefono?: string;
  rol: 'owner' | 'admin' | 'supervisor' | 'recepcion' | 'guardia';
  estado: 'active' | 'busy' | 'offline' | 'inactive';
  empresaId: string;
}
```

### Equipo (Grupo)
```typescript
interface Equipo {
  id: string;
  nombre: string;
  descripcion?: string;
  zona?: Zona;
  miembros: Miembro[];
  fechaCreacion: string;
  empresaId: string;
}
```

### Message
```typescript
interface Message {
  id: string;
  contenido: string;
  timestamp: string;
  leido: boolean;
  esMio: boolean;
  tipo?: 'texto' | 'imagen' | 'audio' | 'archivo';
  emisorId?: string;
  receptorId?: string;
  grupoId?: string;
  emisorNombre?: string;
}
```

---

## 2.7 Servicios API

### dashboardService
- `getStats()` - Estadísticas del dashboard
- `getRecentActivity()` - Actividad reciente
- `getAwsMetrics()` - Métricas AWS
- `getCatalogs()` - Catálogos (zonas, roles)

### messageService
- `getConversations()` - Lista de conversaciones
- `getMessages(usuarioId)` - Mensajes de un chat
- `send(usuarioId, contenido)` - Enviar mensaje

### equipoService
- `getAll()` - Obtener todos los equipos
- `create(data)` - Crear equipo
- `update(id, data)` - Actualizar equipo
- `delete(id)` - Eliminar equipo