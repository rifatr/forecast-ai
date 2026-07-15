import type { Coordinates, WeatherResponse } from '../types/weather';
import { requestApi } from './client';

const FORECAST_OPTIONS = 'days=7&units=metric';

export async function getWeather(coordinates?: Coordinates): Promise<WeatherResponse> {
  const path = coordinates
    ? `/v1/weather?lat=${encodeURIComponent(coordinates.lat)}&lon=${encodeURIComponent(coordinates.lon)}&${FORECAST_OPTIONS}`
    : `/v1/weather/geo?${FORECAST_OPTIONS}`;

  return requestApi<WeatherResponse>(path);
}
