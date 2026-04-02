# SecureNet - Sistema de Control de Guardias

Sistema integral de gestión de guardias de seguridad con backend Node.js y frontend React Native (TypeScript).

## Estructura del Proyecto

```
SecureNet/
├── backend/              # Backend Node.js + Express
│   ├── src/
│   │   ├── config/     # Configuración
│   │   ├── controllers/ # Controladores
│   │   ├── data/       # Datos simulados (JSON)
│   │   ├── middleware/  # Auth, Error handling
│   │   ├── models/     # Tipos y errores
│   │   ├── routes/     # Rutas API
│   │   ├── services/   # Lógica de negocio
│   │   └── server.js   # Entry point
│   └── package.json
│
├── frontend/            # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── screens/    # Pantallas principales
│   │   ├── services/   # Llamadas API
│   │   ├── hooks/      # Hooks personalizados
│   │   ├── context/    # Contextos React
│   │   ├── types/      # Tipos TypeScript
│   │   └── utils/      # Utilidades
│   ├── package.json
│   └── vite.config.ts
│
├── start.bat           # Iniciar ambos servidores (Windows)
└── start.sh           # Iniciar ambos servidores (Linux/Mac)
```

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Ejecución

### Opción 1: Script automatizado (Windows)
```bash
start.bat
```

### Opción 2: Script automatizado (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

### Opción 3: Manual
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Credenciales de Prueba

| Empresa | Usuario | Contraseña | Rol |
|---------|--------|------------|-----|
| TechCorp | admin | Admin123* | Administrador |
| TechCorp | jperez | Guardia123* | Guardia |
| TechCorp | lgarcia | Recep123* | Recepcionista |

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Equipos
- `GET /api/equipos` - Listar equipos
- `GET /api/equipos/:id` - Obtener equipo
- `POST /api/equipos/:id/members` - Agregar miembro
- `DELETE /api/equipos/:id/members/:memberId` - Remover miembro

### Mensajes
- `GET /api/messages/conversations` - Listar conversaciones
- `GET /api/messages/:destinatarioId` - Obtener mensajes
- `POST /api/messages` - Enviar mensaje

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas
- `GET /api/dashboard/activity` - Actividad reciente
- `GET /api/dashboard/aws-metrics` - Métricas AWS
- `GET /api/dashboard/catalogs` - Catálogos (zonas, roles)

## Roles y Permisos

| Rol | Permisos |
|-----|----------|
| Admin | Acceso total |
| Recepcionista | Gestionar citas y solicitudes |
| Guardia | Ver agenda, reportar incidencias |

## Preparado para Cloud/AWS

El backend está diseñado para:
- Fácil migración a Cloudflare Workers
- Compatible con AWS Lambda
- Soporte para base de datos en la nube
- Environment variables para configuración

## Tecnologías

### Backend
- Node.js
- Express
- JWT (autenticación)
- CORS
- uuid (IDs únicos)

### Frontend
- React 18
- TypeScript
- Vite
- Font Awesome Icons
- Google Fonts (Inter)

## Licencia

MIT
