import type { Coordinates, WeatherResponse } from '../types/weather';

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3001' : ''
);

const FORECAST_OPTIONS = 'days=7&units=metric';

export async function getWeather(coordinates?: Coordinates): Promise<WeatherResponse> {
  const path = coordinates
    ? `/v1/weather?lat=${encodeURIComponent(coordinates.lat)}&lon=${encodeURIComponent(coordinates.lon)}&${FORECAST_OPTIONS}`
    : `/v1/weather/geo?${FORECAST_OPTIONS}`;

  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error('Weather is temporarily unavailable. Please try again.');
  }

  return response.json() as Promise<WeatherResponse>;
}
