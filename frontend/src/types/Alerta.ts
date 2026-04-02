import type { Zona } from './Equipo';

export interface Alerta {
  id: string;
  tipo: AlertaTipo;
  ubicacion: Zona | null;
  descripcion: string;
  severidad: AlertaSeveridad;
  usuario?: { id: string; nombre: string };
  timestamp: string;
  estado: AlertaEstado;
}

export type AlertaTipo = 'movimiento' | 'acceso' | 'falla' | 'medica';
export type AlertaSeveridad = 'baja' | 'media' | 'alta' | 'critica';
export type AlertaEstado = 'active' | 'resolved' | 'dismissed';