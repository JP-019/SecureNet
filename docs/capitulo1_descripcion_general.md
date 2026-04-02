# CAPÍTULO 1: Descripción General del Proyecto

## 1.1 Nombre del Sistema

**SecureNet** - Sistema Integral de Control y Gestión de Guardias de Seguridad

## 1.2 Propósito

SecureNet es una plataforma web diseñada para la gestión de múltiples empresas de seguridad, permitiendo el control de guardias, comunicación en tiempo real, monitoreo de ubicación y administración de equipos de trabajo.

## 1.3 Alcance

- **Empresas de Seguridad**: Múltiples empresas pueden utilizar el sistema de forma independiente
- **Roles de Usuario**: Owner, Admin, Supervisor, Recepcionista, Guardia
- **Funcionalidades Principales**:
  - Gestión de usuarios y Authentication
  - Creación y administración de equipos/grupos
  - Chat individual y grupal
  - Grabación y envío de mensajes de voz
  - Envío de imágenes y archivos
  - Panel de administración
  - Dashboard con métricas

## 1.4 Tecnologías Utilizadas

### Frontend
- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **Estilos**: CSS-in-JS con constantes de colores
- **Comunicación**: Fetch API con Axios
- **Iconos**: FontAwesome

### Backend
- **Framework**: Express.js
- **Base de Datos**: MongoDB (simulada con datos mock)
- **Autenticación**: JWT (JSON Web Tokens)
- **WebSocket**: Para comunicación en tiempo real
- **Documentación API**: Swagger

### Infraestructura
- **Puerto Frontend**: 8080
- **Puerto Backend**: 3000
- **Proxy**: Configuración Vite para desarrollo

---

## 1.5 Estructura de Archivos

```
SecureNet/
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── context/        # Contextos React (Auth)
│   │   ├── hooks/          # Custom hooks
│   │   ├── screens/        # Pantallas principales
│   │   ├── services/       # Servicios API
│   │   ├── types/          # Definiciones TypeScript
│   │   └── utils/         # Utilidades y constantes
│   ├── dist/               # Build de producción
│   └── node_modules/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuración
│   │   ├── controllers/   # Controladores
│   │   ├── middleware/    # Middleware Express
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Rutas API
│   │   ├── services/      # Servicios
│   │   └── server.js      # Punto de entrada
│   └── node_modules/
└── docs/                  # Documentación
```