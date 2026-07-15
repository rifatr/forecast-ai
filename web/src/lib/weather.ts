import {
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Sun,
} from 'lucide-react';
import type { GeoLocation, HourlyWeather } from '../types/weather';

export function getWeatherCondition(code = 0) {
  if (code === 0) return { label: 'Clear skies', Icon: Sun };
  if (code <= 3) return { label: 'Partly cloudy', Icon: CloudSun };
  if (code <= 48) return { label: 'Misty', Icon: CloudFog };
  if (code <= 57) return { label: 'Drizzle', Icon: CloudDrizzle };
  if (code <= 67 || code >= 80) return { label: 'Rain showers', Icon: CloudRain };
  if (code >= 95) return { label: 'Thunderstorms', Icon: CloudLightning };

  return { label: 'Cloudy', Icon: CloudSun };
}

export function formatDate(value: string, options: Intl.DateTimeFormatOptions): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function getLocationName(geo: GeoLocation | undefined, lat: number, lon: number): string {
  const locationParts = [geo?.city, geo?.region, geo?.country].filter(Boolean);

  return locationParts.join(', ') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
}

export function getNext24Hours(hours: HourlyWeather[], currentTime: string): HourlyWeather[] {
  const now = new Date(currentTime);
  const currentHour = new Date(now);
  currentHour.setMinutes(0, 0, 0);

  if (Number.isNaN(currentHour.getTime())) {
    return hours.slice(0, 24);
  }

  return hours
    .filter((hour) => {
    const hourTime = new Date(hour.time);
      return !Number.isNaN(hourTime.getTime()) && hourTime >= currentHour;
    })
    .sort((firstHour, secondHour) => new Date(firstHour.time).getTime() - new Date(secondHour.time).getTime())
    .slice(0, 24);
}

export function isCurrentHour(hourTime: string, currentTime: string): boolean {
  const hour = new Date(hourTime);
  const current = new Date(currentTime);

  if (Number.isNaN(hour.getTime()) || Number.isNaN(current.getTime())) return false;

  return hour.getFullYear() === current.getFullYear()
    && hour.getMonth() === current.getMonth()
    && hour.getDate() === current.getDate()
    && hour.getHours() === current.getHours();
}
