export interface User {
  id: string;
  nombre: string;
  usuario: string;
  rol: UserRole;
  email?: string;
  telefono?: string;
  identidad?: string;
  estado: UserStatus;
  zona?: string;
  empresaId?: string;
}

export type UserRole = 'admin' | 'supervisor' | 'recepcion' | 'guardia' | 'owner';
export type UserStatus = 'active' | 'busy' | 'offline' | 'inactive';

export interface NewUserRequest {
  nombre: string;
  usuario: string;
  rol: UserRole;
  email?: string;
  telefono?: string;
  zona?: string;
  password?: string;
}