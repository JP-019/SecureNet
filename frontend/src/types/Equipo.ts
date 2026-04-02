import type { UserRole, UserStatus } from './User';

export interface Equipo {
  id: string;
  nombre: string;
  descripcion?: string;
  zona: Zona | null;
  miembros: TeamMember[];
  fechaCreacion?: string;
  empresaId?: string;
}

export interface TeamMember {
  id: string;
  nombre: string;
  rol: UserRole;
  estado: UserStatus;
  telefono?: string;
}

export interface Zona {
  id: string;
  nombre: string;
  ubicacion: string;
  lat?: number;
  lng?: number;
  color?: string;
}