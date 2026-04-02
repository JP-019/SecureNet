# CAPÍTULO 8: Datos Técnicos y Configuración

## 8.1 Configuración del Entorno

### Variables de Entorno

#### Frontend (.env)
```env
VITE_API_URL=/api
VITE_API_KEY=SecureNet-API-Key-2024
```

#### Backend (src/config/index.js)
```javascript
module.exports = {
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY || 'SecureNet-API-Key-2024',
  jwt: {
    secret: process.env.JWT_SECRET || 'securenet_jwt_secret_key_2024',
    expiresIn: '24h'
  }
};
```

## 8.2 Dependencias del Proyecto

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "uuid": "^9.x",
    "qrcode": "^1.5.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "typescript": "^5.x",
    "vite": "^5.x"
  }
}
```

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.x",
    "cors": "^2.8.x",
    "jsonwebtoken": "^9.x",
    "multer": "^1.4.x",
    "ws": "^8.x",
    "swagger-jsdoc": "^6.x",
    "swagger-ui-express": "^5.x"
  }
}
```

## 8.3 Configuración de TypeScript

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 8.4 Configuración de Vite

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'uuid'],
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
});
```

## 8.5 Constantes del Sistema

### COLORS (src/utils/constants.ts)
```typescript
export const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#4338CA',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',
  // Grises
  gray50: '#F1F5F9',
  gray100: '#E2E8F0',
  gray200: '#CBD5E1',
  gray300: '#94A3B8',
  gray400: '#64748B',
  gray500: '#475569',
  gray600: '#334155',
  gray700: '#1E293B',
  gray800: '#0F172A',
  gray900: '#020617',
  // Estados
  green: '#10B981',
  blue: '#3B82F6',
  red: '#EF4444',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  teal: '#14B8A6',
};

export const STORAGE_KEYS = {
  TOKEN: 'securenet_token',
  USER: 'securenet_user',
  EMPRESA: 'securenet_empresa',
  LAST_EMPRESA: 'securenet_last_empresa',
};

export const ROLE_COLORS: Record<string, string> = {
  admin: '#6366F1',
  supervisor: '#F59E0B',
  recepcion: '#10B981',
  guardia: '#3B82F6',
};

export const STATUS_COLORS: Record<string, string> = {
  active: '#10B981',
  busy: '#F59E0B',
  offline: '#64748B',
  inactive: '#64748B',
};
```

## 8.6 Tipos de Datos Completos

### UserRole
```typescript
export type UserRole = 'admin' | 'supervisor' | 'recepcion' | 'guardia' | 'owner';
```

### UserStatus
```typescript
export type UserStatus = 'active' | 'busy' | 'offline' | 'inactive';
```

### AlertaTipo
```typescript
export type AlertaTipo = 'emergency' | 'checkin' | 'patrulla' | 'incidente' | 'otro';
```

### AlertaSeveridad
```typescript
export type AlertaSeveridad = 'baja' | 'media' | 'alta' | 'critica';
```

## 8.7 Rutas de API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrar usuario |
| GET | /api/auth/me | Obtener usuario actual |

### Dashboard
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/dashboard/stats | Obtener estadísticas |
| GET | /api/dashboard/activity | Actividad reciente |
| GET | /api/dashboard/aws-metrics | Métricas AWS |
| GET | /api/dashboard/catalogs | Catálogos (zonas, roles) |

### Mensajes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/messages/conversations | Lista de conversaciones |
| GET | /api/messages/:usuarioId | Mensajes de usuario |
| POST | /api/messages/send | Enviar mensaje |

### Equipos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/equipos | Listar equipos |
| POST | /api/equipos | Crear equipo |
| PUT | /api/equipos/:id | Actualizar equipo |
| DELETE | /api/equipos/:id | Eliminar equipo |

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/users | Listar usuarios |
| POST | /api/users | Crear usuario |
| PUT | /api/users/:id | Actualizar usuario |
| DELETE | /api/users/:id | Eliminar usuario |

## 8.8 Configuración del Backend

### Server.js - Configuración Principal
```javascript
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// WebSocket
wss.on('connection', (ws) => {
  // Manejar conexiones en tiempo real
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 8.9 Scripts NPM

### Backend
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node src/server.js"
  }
}
```

### Frontend
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Desarrollo Combinado
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\""
  }
}
```

## 8.10 Puertos y URLs

| Servicio | URL | Puerto |
|----------|-----|--------|
| Frontend Dev | http://localhost:8080 | 8080 |
| Backend | http://localhost:3000 | 3000 |
| API Docs | http://localhost:3000/api-docs | 3000 |
| WebSocket | ws://localhost:3000 | 3000 |

## 8.11 Tecnologías y Versiones

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 18.x+ | Runtime |
| React | 18.2.x | UI Framework |
| TypeScript | 5.x | Tipado estático |
| Vite | 5.x | Build tool |
| Express | 4.x | Backend framework |
| MongoDB | (Mock) | Base de datos |
| JWT | 9.x | Autenticación |
| WebSocket | 8.x | Tiempo real |

## 8.12 Estructura de Build

### Frontend
```
frontend/dist/
├── index.html
└── assets/
    ├── index-XXXXX.js      # Bundle principal
    ├── index-XXXXX.css     # Estilos
    └── vendor-XXXXX.js     # Dependencias
```

### Backend
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── uploads/
│   └── perfiles/
├── package.json
└── node_modules/
```