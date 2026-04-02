# CAPÍTULO 7: Estándares y Normas de Desarrollo

## 7.1 Convenciones de Nombres

### Archivos y Componentes
- **Componentes React**: PascalCase
  - `DashboardScreen.tsx`
  - `LoginScreen.tsx`
  - `Avatar.tsx`

- **Funciones y Variables**: camelCase
  - `handleSendMessage()`
  - `const isRecording`
  - `setSelectedChat()`

- **Constantes**: UPPER_SNAKE_CASE
  - `API_BASE_URL`
  - `STORAGE_KEYS.TOKEN`

- **Interfaces/Types**: PascalCase con prefijo descriptivo
  - `interface User`
  - `interface Message`
  - `type UserRole`

### naming de Componentes
```typescript
// ✅ Correcto
const DashboardScreen: React.FC = () => { }

// ❌ Evitar
const dashboard_screen = () => { }
const Dashboard = () => { }  // Too generic
```

## 7.2 Estructura de Archivos TypeScript

### Orden de Importaciones
```typescript
// 1. React y librerías externas
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// 2. Componentes internos
import { Avatar, Button, Modal } from '../components';

// 3. Contextos y hooks
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks';

// 4. Servicios
import { apiService } from '../services';

// 5. Utilidades y tipos
import { COLORS } from '../utils';
import type { User, Message } from '../types';

// 6. Estilos (si aplica)
// import './styles.css';
```

### Estructura de Componente
```typescript
// 1. Imports

// 2. Interfaces locales (si aplican)

// 3. Componentes hijos (si aplican)

// 4. Componente principal
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // a. Hooks
  const [state, setState] = useState<Type>(initialValue);
  
  // b. Refs
  const ref = useRef<Type>(null);
  
  // c. Funciones handler
  const handleClick = () => { };
  
  // d. Effects
  useEffect(() => { }, []);
  
  // e. Render
  return (
    <div>...</div>
  );
};

export default ComponentName;
```

## 7.3 Reglas de Estilo de Código

### TSConfig Estricta
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Preferencias
- **Interfaces** sobre types para objetos
- **Type aliases** para tipos simples
- **Optional chaining** (`?.`) obligatorio
- **Nullish coalescing** (`??`) para valores por defecto
- **Template literals** para strings dinámicos

```typescript
// ✅ Correcto
const nombre = user?.nombre ?? 'Usuario';
const url = `${API_BASE_URL}/endpoint`;

// ❌ Evitar
const nombre = user && user.nombre ? user.nombre : 'Usuario';
const url = API_BASE_URL + '/endpoint';
```

## 7.4 JSX y Estilos

### Estilos en Línea
```typescript
// ✅ Preferido: objeto de estilo
const styles = {
  container: {
    display: 'flex',
    padding: 20,
    background: COLORS.primary
  },
  button: {
    background: COLORS.green,
    color: 'white'
  }
};

return <div style={styles.container}><button style={styles.button}>Click</button></div>;

// ❌ Evitar: estilos complejos inline
return <div style={{ display: 'flex', padding: ((20 + 5) * 2), background: COLORS.primary }}>
```

### Clases CSS (alternative)
```typescript
// Si se usa CSS modules o externo
import styles from './Component.module.css';

return <div className={styles.container}>;
```

### Colores del Sistema
```typescript
// Usar constantes de COLORS
COLORS.primary       // #4F46E5
COLORS.primaryLight  // #6366F1
COLORS.green         // #10B981
COLORS.gray800       // #0F172A
COLORS.red           // #EF4444
```

## 7.5 Manejo de Estados

### useState
```typescript
// ✅ Con tipos explícitos
const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [selectedId, setSelectedId] = useState<string | null>(null);

// ❌ Evitar
const [data, setData] = useState();  // Sin tipo
```

### useEffect
```typescript
// ✅ Cleanup function
useEffect(() => {
  const subscription = subscribe(id, callback);
  return () => subscription.unsubscribe();
}, [id]);

// ✅ Dependencias correctas
useEffect(() => {
  fetchData();
}, [userId, token]);
```

## 7.6 Manejo de Errores

### Try-Catch
```typescript
// ✅ Con feedback al usuario
try {
  const result = await service.call();
  setData(result);
} catch (error) {
  showToast('Error al cargar datos', 'error');
  console.error(error);
}

// ❌ Catch vacío
try {
  await service.call();
} catch {}
```

### Validación de Datos
```typescript
// ✅ Validar antes de enviar
if (!empresaId || !usuario || !password) {
  showToast('Complete todos los campos', 'error');
  return;
}

// ✅ Verificar arrays antes de map
{users?.filter(u => u.rol === 'admin').map(u => (...))}
```

## 7.7 Componentes Reutilizables

### Props con Tipado
```typescript
interface AvatarProps {
  name: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ name, role, size = 'md' }) => { ... };
```

### Componentes de UI
El proyecto incluye componentes base:
- **Button**: Botón con variantes (primary, secondary, success, danger)
- **Input**: Campo de texto con label e icono
- **Select**: Dropdown con opciones
- **Modal**: Ventana modal con header y footer
- **Card**: Tarjeta con padding y shadow
- **Toast**: Notificaciones emergentes

## 7.8 API y Servicios

### Estructura de Servicio
```typescript
class ApiService {
  private baseUrl: string;
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse<T>(response);
  }
  
  private getHeaders(): HeadersInit {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY,
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }
}
```

### Manejo de Respuestas
```typescript
private async handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}
```

## 7.9 Git y Control de Versiones

### Mensajes de Commit
```
feat: agregar sistema de grabación de voz
fix: corregir error de autenticación en login
docs: actualizar documentación de API
refactor: simplificar estructura de componentes
```

### Ramas Sugeridas
- `main` - Código estable
- `develop` - Desarrollo activo
- `feature/nombre` - Nueva funcionalidad
- `fix/nombre` - Corrección de bug

## 7.10 Build y Deployment

### Build Frontend
```bash
cd frontend
npm run build  # Genera /dist
```

### Desarrollo
```bash
# Backend
cd backend
npm run dev

# Frontend  
cd frontend
npm run dev
```

### Script Combinado (concurrently)
```bash
cd backend
npm run dev  # Ejecuta ambos servicios
```

---

## 7.11 Patterns Recomendados

### Container/Presentational
Separar lógica y renderizado:
```typescript
// Container: lógica y estado
const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const handleSend = (text: string) => { /* lógica */ };
  return <ChatView messages={messages} onSend={handleSend} />;
};

// Presentational: solo renderizado
const ChatView: React.FC<{ messages: Message[]; onSend: Fn }> = ({ messages, onSend }) => {
  return <div>{messages.map(m => <div>{m.contenido}</div>)}</div>;
};
```

### Custom Hooks
```typescript
// useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const login = async (creds) => { /* ... */ };
  const logout = () => { /* ... */ };
  return { user, login, logout };
};
```

### Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) return <Fallback />;
    return this.props.children;
  }
}
```

---

## 7.12 Checklist de Código

Antes de hacer commit, verificar:
- [ ] No hay console.log() en código de producción
- [ ] Todas las funciones tienen tipos en parámetros y retorno
- [ ] Las dependencias de useEffect están completas
- [ ] Los errores tienen try-catch con feedback al usuario
- [ ] Los componentes tienen props tipadas
- [ ] Las constantes de colores se usan en lugar de hardcoded
- [ ] El códigocompila sin errores (`npm run build`)
- [ ] Los archivos siguen las convenciones de nomenclatura