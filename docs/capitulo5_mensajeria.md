# CAPÍTULO 5: Sistema de Mensajería

## 5.1 Tipos de Mensajes

SecureNet soporta múltiples tipos de mensajes que se almacenan en la interfaz Message:

```typescript
interface Message {
  id: string;
  contenido: string;       // Texto o URL del contenido
  timestamp: string;        // Fecha/hora ISO
  leido: boolean;          // Si fue leído
  esMio: boolean;          // Si fue enviado por mí
  tipo?: 'texto' | 'imagen' | 'audio' | 'archivo';
  // Para chats individuales
  emisorId?: string;
  receptorId?: string;
  // Para chats grupales
  grupoId?: string;
  emisorNombre?: string;
}
```

### Tipos Soportados

| Tipo | Icono | Descripción |
|------|-------|--------------|
| texto | 💬 | Mensaje de texto plano |
| imagen | 🖼️ | Fotos (convertidas a base64, 300x300) |
| video | 🎥 | Videos (reproducidos en el chat) |
| audio | 🎤 | Grabaciones de voz (WebM) |
| archivo | 📎 | Archivos genéricos (solo nombre) |
| video | 🎥 | Videos (reproducidos en el chat) |

## 5.2 Comunicación Individual

### Estructura de Conversación
```typescript
interface Conversation {
  usuarioId: string;
  nombre: string;
  rol: string;
  estado: string;
  ultimoMensaje: string;
  timestamp: string;
  noLeidos: number;
}
```

### Carga de Mensajes
```typescript
const handleSelectChat = async (convo: Conversation) => {
  setSelectedChat(convo);
  const msgs = await messageService.getMessages(convo.usuarioId);
  setMessages(msgs);
};
```

### Filtrado de Mensajes
Solo muestra mensajes entre los dos usuarios:
```typescript
messages.filter(m => 
  m.emisorId === selectedChat.usuarioId || 
  m.receptorId === selectedChat.usuarioId
)
```

## 5.3 Comunicación Grupal

### Diferencias con Chat Individual
- El mensaje incluye `grupoId` para identificar el equipo
- El mensaje incluye `emisorNombre` para mostrar quién envió
- Todos los miembros del grupo ven los mismos mensajes

### Envío de Mensajes Grupales
```typescript
const handleSendGroupMessage = () => {
  if (!groupMessageText.trim() || !selectedGroup) return;
  
  const newMsg: Message = {
    id: Date.now().toString(),
    contenido: groupMessageText,
    timestamp: new Date().toISOString(),
    leido: true,
    esMio: true,
    grupoId: selectedGroup.id,
    emisorNombre: user?.nombre || 'Yo'
  };
  
  setGroupMessages(prev => [...prev, newMsg]);
  setGroupMessageText('');
};
```

## 5.4 Sistema de Archivos

### Envío de Imágenes
1. Seleccionar archivo mediante input type="file"
2. Convertir a base64 con FileReader
3. Crear mensaje con tipo 'imagen'

```typescript
const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const newMsg: Message = {
        id: Date.now().toString(),
        contenido: reader.result as string,
        tipo: 'imagen'
      };
      addMessage(newMsg);
    };
    reader.readAsDataURL(file);
  }
};
```

### Envío de Videos
Similar a imágenes pero con tipo 'video':
```typescript
const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const newMsg: Message = {
        id: Date.now().toString(),
        contenido: reader.result as string,
        tipo: 'video'
      };
      addMessage(newMsg);
    };
    reader.readAsDataURL(file);
  }
};
```

```typescript
const reader = new FileReader();
reader.onload = () => {
  const newMsg: Message = {
    id: Date.now().toString(),
    contenido: reader.result as string,  // base64
    timestamp: new Date().toISOString(),
    leido: true,
    esMio: true,
    tipo: 'imagen'
  };
  setMessages(prev => [...prev, newMsg]);
};
reader.readAsDataURL(file);
```

### Envío de Archivos
Similar a imágenes pero solo guarda el nombre del archivo:
```typescript
const newMsg: Message = {
  id: Date.now().toString(),
  contenido: file.name,  // Solo el nombre
  timestamp: new Date().toISOString(),
  leido: true,
  esMio: true,
  tipo: 'archivo'
};
```

## 5.5 Sistema de Grabación de Voz

### Tecnología Utilizada
- **API**: MediaRecorder
- **Formato**: WebM (con códec Opus si está disponible)
- **Fallback**: audio/webm

### Iniciar Grabación
```typescript
const startVoiceRecording = async () => {
  // Obtener acceso al micrófono
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  voiceStreamRef.current = stream;
  
  // Determinar formato soportado
  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : 'audio/webm';
  
  // Crear recorder
  const recorder = new MediaRecorder(stream, { mimeType });
  
  // Recolectar datos
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) voiceAudioChunksRef.current.push(e.data);
  };
  
  recorder.start(100);  // Capturar cada 100ms
  setIsRecording(true);
};
```

### Detener y Enviar
```typescript
const stopVoiceRecording = () => {
  recorder.stop();
  voiceStreamRef.current?.getTracks().forEach(t => t.stop());
  setIsRecording(false);
  
  // Crear blob y URL
  const blob = new Blob(voiceAudioChunksRef.current, { type: 'audio/webm' });
  const url = URL.createObjectURL(blob);
  
  // Crear mensaje de audio
  const msg: Message = {
    id: Date.now().toString(),
    contenido: url,
    timestamp: new Date().toISOString(),
    leido: true,
    esMio: true,
    tipo: 'audio'
  };
  
  // Agregar al chat correspondiente
  if (selectedChat) setMessages(prev => [...prev, msg]);
  else if (selectedGroup) setGroupMessages(prev => [...prev, msg]);
};
```

### UI de Grabación
Cuando está grabando, el input cambia a:
- Botón de detener (rojo)
- Temporizador mostrando duración
- Indicador visual de grabación

## 5.6 Interfaz de Chat

### Área de Mensajes
- Scroll automático al final
- Mensajes del usuario alineados a la derecha (color primario)
- Mensajes recibidos alineados a la izquierda (color gris)
- Timestamps debajo de cada mensaje

### Input de Mensajes
- Campo de texto con placeholder
- Botón de adjuntar archivos (📎)
- Botón de enviar (➡️)
- Botón de grabar audio (🎤)

### Menú de Archivos
Al hacer clic en 📎 se muestra un menú con:
- 🖼️ Imagen
- 📎 Archivo genérico
- 🎤 Audio (grabar)

---

## 5.7 Renderizado de Mensajes

### Por Tipo
```typescript
{msg.tipo === 'imagen' ? (
  <img src={msg.contenido} alt="imagen" style={{ maxWidth: 200, borderRadius: 10 }} />
) : msg.tipo === 'audio' ? (
  <audio controls src={msg.contenido} style={{ height: 35 }} />
) : msg.tipo === 'archivo' ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <i className="fas fa-file" />
    <span>{msg.contenido}</span>
  </div>
) : (
  <div>{msg.contenido}</div>
)}
```

## 5.8 Sound Effects

### Reproducción de Sonidos
- **Mensaje recibido**: Sonido de notificación
- **Alerta de emergencia**: Alarma louder

```typescript
import { playAlarm, playMessageSound } from '../hooks/useSound';

// Al recibir mensaje
playMessageSound();

// Al enviar alerta
playAlarm({ volume: 0.8 });
```