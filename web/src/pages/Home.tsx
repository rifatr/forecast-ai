import { useEffect, useState } from 'react';
import { CloudRain, RefreshCw } from 'lucide-react';
import { DEFAULT_FORECAST_OPTIONS, getWeather } from '../api/weather';
import { ForecastPanels } from '../components/weather/ForecastPanels';
import { LocationSearchModal } from '../components/weather/LocationSearchModal';
import { WeatherHero } from '../components/weather/WeatherHero';
import type { PlaceSelection } from '../lib/googlePlaces';
import { getLocationName, getNext24Hours } from '../lib/weather';
import { useTheme } from '../theme-context';
import type {
  Coordinates,
  ForecastOptions,
  TemperatureUnit,
  WeatherResponse,
} from '../types/weather';

const FORECAST_PREFERENCES_STORAGE_KEY = 'forecast-ai:forecast-preferences';

function loadSavedForecastOptions(): ForecastOptions {
  try {
    const savedValue = window.localStorage.getItem(FORECAST_PREFERENCES_STORAGE_KEY);

    if (!savedValue) {
      return DEFAULT_FORECAST_OPTIONS;
    }

    const savedOptions = JSON.parse(savedValue) as Partial<ForecastOptions>;
    const days = Number(savedOptions.days);
    const units = savedOptions.units === 'imperial' ? 'imperial' : 'metric';

    return {
      days: days >= 1 && days <= 7 ? days : DEFAULT_FORECAST_OPTIONS.days,
      ai: typeof savedOptions.ai === 'boolean' ? savedOptions.ai : DEFAULT_FORECAST_OPTIONS.ai,
      units,
      lang: typeof savedOptions.lang === 'string' ? savedOptions.lang : DEFAULT_FORECAST_OPTIONS.lang,
    };
  } catch {
    return DEFAULT_FORECAST_OPTIONS;
  }
}

export function Home() {
  const { setAutoThemeIsDay } = useTheme();
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSelection | null>(null);
  const [forecastOptions, setForecastOptions] = useState<ForecastOptions>(loadSavedForecastOptions);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);

  async function loadWeather(
    nextCoordinates?: Coordinates,
    nextOptions: ForecastOptions = forecastOptions,
  ) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getWeather(nextCoordinates, nextOptions);
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
    window.localStorage.setItem(FORECAST_PREFERENCES_STORAGE_KEY, JSON.stringify(forecastOptions));
  }, [forecastOptions]);

  useEffect(() => {
    if (weather) {
      setAutoThemeIsDay(weather.current.is_day === 1);
    }
  }, [setAutoThemeIsDay, weather]);

  function handleLocationSelected(place: PlaceSelection, options: ForecastOptions) {
    setSelectedPlace(place);
    setForecastOptions(options);
    setIsLocationSearchOpen(false);
    void loadWeather(place.coordinates, options);
  }

  function handleUnitsChange(units: TemperatureUnit) {
    if (units === forecastOptions.units) {
      return;
    }

    const nextOptions = { ...forecastOptions, units };
    setForecastOptions(nextOptions);
    void loadWeather(selectedPlace?.coordinates, nextOptions);
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Location is not supported in this browser. Search for a place instead.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsLocating(false);
        const coordinates = {
          lat: String(coords.latitude),
          lon: String(coords.longitude),
        };

        setSelectedPlace({
          label: 'Current location',
          coordinates,
        });
        void loadWeather(coordinates);
    },
    () => {
      setIsLocating(false);
      setError('We could not access your location. Check your browser permission or search for a place.');
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

  const locationName = selectedPlace?.label || getLocationName(weather.geo, weather.lat, weather.lon);
  const hourlyForecast = getNext24Hours(weather.hourly, weather.current.time);
  const dailyForecast = weather.daily.slice(0, forecastOptions.days);

  return (
    <div className="weather-page animate-fade-in">
      <WeatherHero
        weather={weather}
        locationName={locationName}
        units={forecastOptions.units}
        onUnitsChange={handleUnitsChange}
        isLoading={isLoading}
        isLocating={isLocating}
        onRefresh={() => void loadWeather(selectedPlace?.coordinates)}
        onUseCurrentLocation={handleUseCurrentLocation}
        onOpenLocationSearch={() => setIsLocationSearchOpen(true)}
      />

      {error && <div className="inline-alert">{error}</div>}

      <ForecastPanels
        currentTime={weather.current.time}
        hourly={hourlyForecast}
        daily={dailyForecast}
      />

      <LocationSearchModal
        isOpen={isLocationSearchOpen}
        onClose={() => setIsLocationSearchOpen(false)}
        onLocationSelected={handleLocationSelected}
        options={forecastOptions}
      />
    </div>
  );
}
