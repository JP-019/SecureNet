# CAPÍTULO 6: Panel de Administración y Métricas

## 6.1 Acceso al Panel de Control

El Panel de Control es una sección exclusiva para usuarios con rol de **Admin** u **Owner**. Se accede desde el header del Dashboard.

```typescript
// Condición de visualización
{user?.rol === 'admin' || user?.rol === 'owner') && (
  <Button onClick={() => setShowAdminPanel(!showAdminPanel)}>
    Panel de Control
  </Button>
)}
```

## 6.2 Estructura del Panel

El panel se despliega como un sidebar derecho con pestañas:

```
┌─────────────────────────────────────┐
│  Panel de Control                   │
├──────────┬──────────┬───────────────┤
│ Resumen   │ Usuarios │ Empresas │ AWS │
├──────────┴──────────┴───────────────┤
│                                     │
│  Contenido según pestaña activa     │
│                                     │
└─────────────────────────────────────┘
```

### Pestañas Disponibles
| Pestaña | Visible Para | Descripción |
|---------|--------------|-------------|
| Resumen | Todos los admins | Stats generales |
| Usuarios | Todos los admins | Gestión de usuarios |
| Empresas | Owner/Admin | CRUD de empresas |
| AWS | Todos los admins | Métricas cloud |

## 6.3 Pestaña: Resumen (Overview)

### Métricas Principales
```typescript
interface DashboardStats {
  guardiasTotales: number;
  guardiasActivos: number;
  checkinsHoy: number;
  alertasActivas: number;
  cobertura: number;  // Porcentaje
}
```

### Tarjetas de Métricas
- **Total Guardias**: Cantidad de guardias registrados
- **Check-ins Hoy**: Turnos realizados el día actual
- **Alertas Activas**: Número de alertas pendientes
- **Cobertura**: Porcentaje de zonas cubiertas

### Actividad Reciente
Lista de las últimas 5 actividades:
```typescript
interface ActivityItem {
  usuario: { id: string; nombre: string; rol: string };
  estado: string;
  ultimoCheckin?: string;
  ultimaAlerta?: { tipo: string; severidad: string; timestamp: string };
}
```

## 6.4 Pestaña: Usuarios

### Funcionalidades
- **Crear usuario**: Botón "Nuevo Guardia"
- **Buscar**: Input con filtro por nombre/usuario/ID
- **Filtrar por empresa**: Dropdown (solo admins de empresa)
- **Ver usuarios desactivados**: Sección colapsable

### Estados de Usuario en el Panel
| Estado | Color | Acción Disponible |
|--------|-------|-------------------|
| active | Verde | Desactivar |
| inactive | Gris | Activar |

### Gestión de Usuarios
```typescript
const handleToggleUserStatus = (u: User) => {
  const newState = u.estado === 'active' ? 'inactive' : 'active';
  setUsers(prev => prev.map(user => 
    user.id === u.id ? { ...user, estado: newState } : user
  ));
};
```

### Roles Mostrados
- **Administradores** (Admin): Gestión completa
- **Recepcionistas** (Recepcion): Atención de llamadas
- **Guardias** (Guardia): Personal de seguridad

## 6.5 Pestaña: Empresas

### CRUD de Empresas
Solo visible para usuarios con `canManageCompany = true`

```typescript
interface Empresa {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
}
```

### Modal de Creación
```typescript
// Campos del formulario
- Nombre de la Empresa
- Dirección
- Teléfono
```

### Acciones por Empresa
| Icono | Acción |
|-------|--------|
| 👥 | Ver usuarios de la empresa |
| ✏️ | Editar empresa |
| 👁️ | Ver configuración |
| 🗑️ | Eliminar empresa |

## 6.6 Pestaña: AWS (Métricas Cloud)

### Recursos AWS Mostrados
```typescript
interface AwsMetrics {
  recursos: {
    ec2: { actual: number; maximo: number; porcentaje: number };
    rds: { actual: number; maximo: number; unidad: string; porcentaje: number };
    s3: { actual: number; maximo: number; unidad: string; porcentaje: number };
    cloudwatch: number;
  };
  costos: { servicio: string; costo: number }[];
  costoTotal: number;
}
```

### Visualización de Recursos
Barras de progreso mostrando:
- Instancias EC2 usadas/totales
- Almacenamiento RDS usado/total
- Almacenamiento S3 usado/total

### Costos del Mes
Tabla con costos por servicio:
- EC2
- RDS
- S3
- CloudWatch
- **Total**

## 6.7 Funcionalidades Adicionales

### Búsqueda Global
Input en la barra lateral del Dashboard:
```typescript
<input type="text" placeholder="Buscar guardia, grupo..." />
```

### Vista Previa como Guardia
Botón para simular la vista de un guardia:
```typescript
const [previewAsRole, setPreviewAsRole] = useState<string | null>(null);
<button onClick={() => setPreviewAsRole('guardia')}>
  Vista Guardia
</button>
```

### Notificaciones Toast
Sistema de notificaciones emergentes:
```typescript
const { toast, showToast, hideToast } = useToast();

showToast('Mensaje', 'success');  // success, error, warning, info
```

### Diálogos de Confirmación
Modal de confirmación para acciones destructivas:
```typescript
setConfirmDialog({
  visible: true,
  title: 'Confirmar acción',
  message: '¿Estás seguro?',
  type: 'danger',  // danger, warning, success
  onConfirm: () => { /* acción */ }
});
```

---

## 6.8 Configuración de Botones del Header

El header del Dashboard incluye botones de acceso rápido:

| Botón | Icono | Funcionalidad |
|-------|-------|---------------|
| Panel de Control | 📊 | Abrir panel de admin |
| Configuración | ⚙️ | (Placeholder) |
| Llamada | 📞 | (Placeholder) |
| Perfil | 👤 | Abrir modal de perfil |

---

## 6.9 QR Codes

### Usos del QR
- **Unirse a grupo**: Código para que usuarios se unan
- **Identificación**: QR único por usuario

### Componentes
- **QRCodeGenerator**: Genera código QR desde string
- **SimpleQRScanner**: Escanea QR con cámara