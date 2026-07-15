export interface CurrentWeather {
  time: string;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  precipitation: number;
  weathercode: number;
}

export interface DailyWeather {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  weathercode: number;
}

export interface GeoLocation {
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
}

export interface WeatherResponse {
  lat: number;
  lon: number;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  ai_summary: string | null;
  geo?: GeoLocation;
}

export interface Coordinates {
  lat: string;
  lon: string;
}

export type TemperatureUnit = 'metric' | 'imperial';

export interface ForecastOptions {
  days: number;
  ai: boolean;
  units: TemperatureUnit;
  lang: string;
}
