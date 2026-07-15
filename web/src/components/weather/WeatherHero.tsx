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
import type { WeatherResponse } from '../../types/weather';

interface WeatherHeroProps {
  weather: WeatherResponse;
  locationName: string;
  isLoading: boolean;
  isLocating: boolean;
  onRefresh: () => void;
  onUseCurrentLocation: () => void;
  onOpenLocationSearch: () => void;
}

export function WeatherHero({
  weather,
  locationName,
  isLoading,
  isLocating,
  onRefresh,
  onUseCurrentLocation,
  onOpenLocationSearch,
}: WeatherHeroProps) {
  const { current, daily } = weather;
  const condition = getWeatherCondition(current.weathercode);
  const ConditionIcon = condition.Icon;

  return (
    <section className="weather-hero">
      <div className="hero-topline">
        <div>
          <p className="eyebrow">Live conditions</p>
          <div className="location-label">
            <MapPin size={18} />
            {locationName}
          </div>
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
          <button className="button-secondary" type="button" onClick={onOpenLocationSearch}>
            <Search size={17} />
            Search location
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
