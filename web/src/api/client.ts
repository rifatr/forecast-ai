export const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3001' : ''
);

export async function requestApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const payload = await response.json().catch(() => null) as { message?: string } | null;
  throw new Error(payload?.message || 'The request could not be completed. Please try again.');
}
