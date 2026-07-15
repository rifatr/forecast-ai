import { requestApi } from './client';
import type { FarmAnalysis, FarmAnalysisInput, FarmHistoryResponse, FarmQuota } from '../types/farm';

export async function analyzeFarmImage(file: File, details: FarmAnalysisInput): Promise<FarmAnalysis> {
  const body = new FormData();
  body.append('image', file);

  Object.entries(details).forEach(([key, value]) => {
    if (value.trim()) body.append(key, value.trim());
  });

  return requestApi<FarmAnalysis>('/v1/trees/analyze', { method: 'POST', body });
}

export function getFarmQuota(): Promise<FarmQuota> {
  return requestApi<FarmQuota>('/v1/trees/quota');
}

export function getFarmHistory(cursor?: string): Promise<FarmHistoryResponse> {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  return requestApi<FarmHistoryResponse>(`/v1/trees/history${query}`);
}
