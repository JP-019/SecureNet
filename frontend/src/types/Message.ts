import type { UserRole, UserStatus } from './User';

export interface Conversation {
  usuarioId: string;
  nombre: string;
  rol: UserRole;
  estado: UserStatus;
  ultimoMensaje: string;
  timestamp: string;
  noLeidos: number;
}

export interface Message {
  id: string;
  contenido: string;
  timestamp: string;
  leido: boolean;
  esMio: boolean;
  tipo?: 'texto' | 'imagen' | 'audio' | 'archivo' | 'video' | 'sistema';
  remitente?: { id: string; nombre: string };
  emisorId?: string;
  receptorId?: string;
  grupoId?: string;
  emisorNombre?: string;
  archivoNombre?: string;
}