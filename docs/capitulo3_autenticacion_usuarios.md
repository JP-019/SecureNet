# CAPÍTULO 3: Sistema de Autenticación y Usuarios

## 3.1 Roles de Usuario

El sistema SecureNet define una jerarquía de roles con permisos específicos:

| Rol | Descripción | Permisos |
|-----|-------------|-----------|
| **Owner** | Dueño de la empresa | Acceso completo a todos los módulos |
| **Admin** | Administrador | Gestión de usuarios, equipos, empresas |
| **Supervisor** | Supervisor de guardias | Ver reportes, gestionar grupos |
| **Recepcion** | Recepcionista | Atender llamadas, crear usuarios básicos |
| **Guardia** | Guardia de seguridad | Ver sus equipos, chatear, recibir alertas |

## 3.2 Flujo de Autenticación

### Login
```
1. Usuario selecciona empresa (techcorp/mercurio)
2. Ingresa usuario y contraseña
3. Frontend envía credenciales al backend
4. Backend valida y retorna token JWT + datos usuario
5. Frontend guarda token en localStorage
6. Redirecciona al Dashboard
```

### Protección de Rutas
```typescript
// Middleware de autenticación en backend
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(UNAUTHORIZED_ERROR);
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch {
    next(UNAUTHORIZED_ERROR);
  }
};
```

### Validación de API Key
```typescript
// Middleware de API Key
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== config.apiKey) {
    return next(FORBIDDEN_ERROR);
  }
  next();
};
```

## 3.3 Datos del Usuario

### Campos Obligatorios
- `id`: Identificador único
- `nombre`: Nombre completo
- `usuario`: Nombre de usuario para login
- `rol`: Rol del usuario en el sistema
- `empresaId`: ID de la empresa de seguridad

### Campos Opcionales
- `identidad`: ID de identidad del guardia (único)
- `telefono`: Número de teléfono
- `email`: Correo electrónico
- `estado`: Estado de conexión (active/busy/offline/inactive)

## 3.4 Recordar Empresa

### Empresas Soportadas
- **TechCorp Industries** (ID: techcorp)
- **Grupo Mercurio** (ID: mercurio)

### Recordar Empresa
El sistema guarda en localStorage la última empresa seleccionada:
```typescript
// Clave en localStorage
const STORAGE_KEY = 'securenet_last_empresa';

// Guardar
localStorage.setItem('securenet_last_empresa', empresaId);

// Cargar al inicio
useEffect(() => {
  const savedEmpresa = localStorage.getItem(STORAGE_KEY);
  if (savedEmpresa) setEmpresaId(savedEmpresa);
}, []);
```

## 3.5 Gestión de Permisos

### Funciones de Verificación
```typescript
const canManageGroup = user?.rol === 'admin' || user?.rol === 'recepcion';
const canManageCompany = user?.rol === 'owner' || user?.rol === 'admin';
const canManageZones = user?.rol === 'owner';
```

### Renderizado Condicional por Rol
```typescript
// Solo admins/owners ven el Panel de Control
{user?.rol === 'admin' && <Button>Panel de Control</Button>}

// Solo admins pueden crear usuarios
{canManageGroup && <Button>Nuevo Guardia</Button>}
```

## 3.6 Estados de Usuario

| Estado | Color | Significado |
|--------|-------|--------------|
| active | Verde | Conectado y disponible |
| busy | Amarillo | En llamada o ocupado |
| offline | Gris | Desconectado |
| inactive | Gris oscuro | Cuenta desactivada |

---

## 3.7 Seguridad

### JWT Configuration
```javascript
// Configuración del token
{
  secret: process.env.JWT_SECRET || 'securenet_jwt_secret_key_2024',
  expiresIn: '24h'
}
```

### Headers Requeridos
Todas las peticiones deben incluir:
- `Content-Type: application/json`
- `X-Api-Key: SecureNet-API-Key-2024` (o configurable)
- `Authorization: Bearer <token>`

### Errores de Autenticación
- **401 Unauthorized**: Token faltante o inválido
- **403 Forbidden**: API Key inválida
- **Token Expirado**: El JWT ha vencido (24h)