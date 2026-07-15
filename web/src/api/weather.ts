import type { Coordinates, ForecastOptions, WeatherResponse } from '../types/weather';
import { requestApi } from './client';

export const DEFAULT_FORECAST_OPTIONS: ForecastOptions = {
  days: 7,
  ai: false,
  units: 'metric',
  lang: 'en',
};

export async function getWeather(
  coordinates?: Coordinates,
  options: ForecastOptions = DEFAULT_FORECAST_OPTIONS,
): Promise<WeatherResponse> {
  const searchParams = new URLSearchParams({
    days: String(options.days),
    ai: String(options.ai),
    units: options.units,
  });

  if (coordinates) {
    searchParams.set('lat', coordinates.lat);
    searchParams.set('lon', coordinates.lon);
    searchParams.set('lang', options.lang);
  }

  const endpoint = coordinates ? '/v1/weather' : '/v1/weather/geo';
  const path = `${endpoint}?${searchParams.toString()}`;

  return requestApi<WeatherResponse>(path);
}
