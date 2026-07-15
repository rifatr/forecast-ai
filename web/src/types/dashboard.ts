import type { CurrentWeather, GeoLocation } from './weather';

export interface DashboardUsage {
  plan: string;
  used: number;
  limit: number;
  remaining: number;
  unlimited: boolean;
}

export interface DashboardTreesQuota extends DashboardUsage {
  resets_at: string;
}

export interface DashboardWeather {
  current: CurrentWeather;
}

export interface DashboardError {
  error: string;
}

export interface DashboardData {
  weather: DashboardWeather | DashboardError;
  geo: GeoLocation | DashboardError;
  usage: DashboardUsage | DashboardError;
  treesQuota: DashboardTreesQuota | DashboardError;
}
