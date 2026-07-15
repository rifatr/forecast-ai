import type { SubmitEvent } from 'react';
import {
  Droplets,
  LocateFixed,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  Wind,
} from 'lucide-react';
import { getWeatherCondition } from '../../lib/weather';
import type { Coordinates, WeatherResponse } from '../../types/weather';

interface WeatherHeroProps {
  weather: WeatherResponse;
  locationName: string;
  coordinates: Coordinates;
  isLoading: boolean;
  isLocating: boolean;
  isSearchOpen: boolean;
  onCoordinatesChange: (coordinates: Coordinates) => void;
  onRefresh: () => void;
  onUseCurrentLocation: () => void;
  onSearchOpenChange: () => void;
  onSearchSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

export function WeatherHero({
  weather,
  locationName,
  coordinates,
  isLoading,
  isLocating,
  isSearchOpen,
  onCoordinatesChange,
  onRefresh,
  onUseCurrentLocation,
  onSearchOpenChange,
  onSearchSubmit,
}: WeatherHeroProps) {
  const { current, daily } = weather;
  const condition = getWeatherCondition(current.weathercode);
  const ConditionIcon = condition.Icon;

  return (
    <section className="weather-hero">
      <div className="hero-topline">
        <div>
          <p className="eyebrow">Live conditions</p>
          <button
            className="location-label"
            type="button"
            onClick={onSearchOpenChange}
            aria-expanded={isSearchOpen}
          >
            <MapPin size={18} />
            {locationName}
            <Search size={15} />
          </button>
        </div>

        <div className="hero-actions">
          <button
            className="icon-button"
            type="button"
            title="Refresh forecast"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
          >
            <LocateFixed size={17} />
            {isLocating ? 'Locating…' : 'Use my location'}
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <form className="coordinate-form" onSubmit={onSearchSubmit}>
          <label>
            Latitude
            <input
              value={coordinates.lat}
              onChange={(event) => onCoordinatesChange({ ...coordinates, lat: event.target.value })}
              type="number"
              step="any"
              placeholder="e.g. 23.8103"
              required
            />
          </label>
          <label>
            Longitude
            <input
              value={coordinates.lon}
              onChange={(event) => onCoordinatesChange({ ...coordinates, lon: event.target.value })}
              type="number"
              step="any"
              placeholder="e.g. 90.4125"
              required
            />
          </label>
          <button className="button-primary" type="submit">
            <Search size={16} />
            View forecast
          </button>
        </form>
      )}

      <div className="hero-weather">
        <div className="temperature-block">
          <span>{Math.round(current.temperature)}</span>
          <sup>°</sup>
          <small>C</small>
        </div>
        <div className="condition-block">
          <ConditionIcon size={42} />
          <strong>{condition.label}</strong>
          {weather.ai_summary && <span className="ai-summary">{weather.ai_summary}</span>}
        </div>
      </div>

      <div className="weather-stats">
        <div>
          <Wind size={19} />
          <span>Wind</span>
          <strong>{Math.round(current.windspeed)} km/h</strong>
        </div>
        <div>
          <Droplets size={19} />
          <span>Precipitation</span>
          <strong>{daily[0]?.precipitation ?? 0}%</strong>
        </div>
        <div>
          <Navigation size={19} style={{ transform: `rotate(${current.winddirection}deg)` }} />
          <span>Direction</span>
          <strong>{current.winddirection}°</strong>
        </div>
      </div>
    </section>
  );
}
