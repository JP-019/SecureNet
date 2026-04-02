import type { UserRole, UserStatus } from './User';
import type { AlertaTipo, AlertaSeveridad } from './Alerta';
import type { Zona } from './Equipo';

export interface DashboardStats {
  guardiasTotales: number;
  guardiasActivos: number;
  checkinsHoy: number;
  alertasActivas: number;
  cobertura: number;
}

export interface ActivityItem {
  usuario: { id: string; nombre: string; rol: UserRole };
  estado: UserStatus;
  ultimoCheckin: string | null;
  ultimaAlerta: { tipo: AlertaTipo; severidad: AlertaSeveridad; timestamp: string } | null;
}

export interface AwsMetrics {
  recursos: {
    ec2: MetricItem;
    rds: MetricItem & { unidad: string };
    s3: MetricItem & { unidad: string };
    cloudwatch: number;
  };
  costos: { servicio: string; costo: number }[];
  costoTotal: number;
}

export interface MetricItem {
  actual: number;
  maximo: number;
  porcentaje: number;
}

export interface Catalogs {
  zonas: Zona[];
  roles: { id: string; nombre: string; color: string }[];
  empresas: Empresa[];
}

export interface Empresa {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  fechaCreacion?: string;
}