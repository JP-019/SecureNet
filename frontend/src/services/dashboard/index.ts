import { api } from '../api';
import type { DashboardStats, ActivityItem, AwsMetrics, Catalogs } from '../../types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response as unknown as DashboardStats;
  },
  getRecentActivity: async (): Promise<ActivityItem[]> => {
    const response = await api.get<ActivityItem[]>('/dashboard/activity');
    return response as unknown as ActivityItem[];
  },
  getAwsMetrics: async (): Promise<AwsMetrics> => {
    const response = await api.get<AwsMetrics>('/dashboard/aws-metrics');
    return response as unknown as AwsMetrics;
  },
  getCatalogs: async (): Promise<Catalogs> => {
    const response = await api.get<Catalogs>('/dashboard/catalogs');
    return response as unknown as Catalogs;
  },
};
