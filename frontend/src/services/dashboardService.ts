import { api } from './api';
import type { DashboardStats, ActivityItem, AwsMetrics, Catalogs } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener estadísticas');
    }
    return response.data;
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    const response = await api.get<ActivityItem[]>('/dashboard/activity');
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener actividad');
    }
    return response.data;
  },

  async getAwsMetrics(): Promise<AwsMetrics> {
    const response = await api.get<AwsMetrics>('/dashboard/aws-metrics');
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener métricas AWS');
    }
    return response.data;
  },

  async getCatalogs(): Promise<Catalogs> {
    const response = await api.get<Catalogs>('/dashboard/catalogs');
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener catálogos');
    }
    return response.data;
  },
};
