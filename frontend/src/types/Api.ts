export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface LoginRequest {
  empresaId: string;
  usuario: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  empresa: { id: string; nombre: string };
}

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