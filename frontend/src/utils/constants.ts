export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const API_KEY = import.meta.env.VITE_API_KEY || 'SecureNet-API-Key-2024';

export const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#4338CA',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',
  gray50: '#F1F5F9',
  gray100: '#E2E8F0',
  gray200: '#CBD5E1',
  gray300: '#94A3B8',
  gray400: '#64748B',
  gray500: '#475569',
  gray600: '#334155',
  gray700: '#1E293B',
  gray800: '#0F172A',
  gray900: '#020617',
  green: '#10B981',
  blue: '#3B82F6',
  red: '#EF4444',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  teal: '#14B8A6',
};

export const STORAGE_KEYS = {
  TOKEN: 'securenet_token',
  USER: 'securenet_user',
  EMPRESA: 'securenet_empresa',
};

export const ROLE_COLORS: Record<string, string> = {
  admin: '#6366F1',
  supervisor: '#F59E0B',
  recepcion: '#10B981',
  guardia: '#3B82F6',
};

export const STATUS_COLORS: Record<string, string> = {
  active: '#10B981',
  busy: '#F59E0B',
  offline: '#64748B',
  inactive: '#64748B',
};

export const SEVERITY_COLORS: Record<string, string> = {
  baja: '#10B981',
  media: '#F59E0B',
  alta: '#EF4444',
  critica: '#8B5CF6',
};
