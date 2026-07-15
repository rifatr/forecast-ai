import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { CloudRain, RefreshCw } from 'lucide-react';
import { getWeather } from '../api/weather';
import { ForecastPanels } from '../components/weather/ForecastPanels';
import { WeatherHero } from '../components/weather/WeatherHero';
import { getLocationName, getNext24Hours } from '../lib/weather';
import type { Coordinates, WeatherResponse } from '../types/weather';

const EMPTY_COORDINATES: Coordinates = { lat: '', lon: '' };

export function Home() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>(EMPTY_COORDINATES);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  async function loadWeather(nextCoordinates?: Coordinates) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getWeather(nextCoordinates);
      setWeather(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load the forecast.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadWeather();
  }, []);

  useEffect(() => {
    if (weather) {
      document.documentElement.classList.toggle('theme-night', weather.current.is_day === 0);
    }
  }, [weather]);

  function handleCoordinateSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSearchOpen(false);
    void loadWeather(coordinates);
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Location is not supported in this browser. Use coordinates instead.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsLocating(false);
        void loadWeather({ lat: String(coords.latitude), lon: String(coords.longitude) });
      },
      () => {
        setIsLocating(false);
        setError('We could not access your location. Check your browser permission or use coordinates.');
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  if (isLoading && !weather) {
    return (
      <div className="weather-state">
        <RefreshCw className="animate-spin" size={30} />
        <span>Building your local forecast…</span>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="weather-state error-state">
        <CloudRain size={30} />
        <strong>We couldn’t load the weather.</strong>
        <span>{error}</span>
        <button className="button-primary" type="button" onClick={() => void loadWeather()}>
          Try again
        </button>
      </div>
    );
  }

  if (!weather) return null;

  const locationName = getLocationName(weather.geo, weather.lat, weather.lon);
  const hourlyForecast = getNext24Hours(weather.hourly, weather.current.time);
  const dailyForecast = weather.daily.slice(0, 7);

  return (
    <div className="weather-page animate-fade-in">
      <WeatherHero
        weather={weather}
        locationName={locationName}
        coordinates={coordinates}
        isLoading={isLoading}
        isLocating={isLocating}
        isSearchOpen={isSearchOpen}
        onCoordinatesChange={setCoordinates}
        onRefresh={() => void loadWeather()}
        onUseCurrentLocation={handleUseCurrentLocation}
        onSearchOpenChange={() => setIsSearchOpen((isOpen) => !isOpen)}
        onSearchSubmit={handleCoordinateSearch}
      />

      {error && <div className="inline-alert">{error}</div>}

      <ForecastPanels
        currentTime={weather.current.time}
        hourly={hourlyForecast}
        daily={dailyForecast}
      />
    </div>
  );
}
