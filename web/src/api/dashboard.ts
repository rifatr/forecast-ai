import { requestApi } from './client';
import type { DashboardData } from '../types/dashboard';

export function getDashboard(): Promise<DashboardData> {
  return requestApi<DashboardData>('/v1/dashboard');
}
