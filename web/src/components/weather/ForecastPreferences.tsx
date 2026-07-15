import type { ForecastOptions } from '../../types/weather';

interface ForecastPreferencesProps {
  options: ForecastOptions;
  onChange: (options: ForecastOptions) => void;
}

const insightLanguages = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'Bengali' },
  { code: 'sw', label: 'Swahili' },
];

export function ForecastPreferences({ options, onChange }: ForecastPreferencesProps) {
  function updateOptions(changes: Partial<ForecastOptions>) {
    onChange({ ...options, ...changes });
  }

  return (
    <fieldset className="forecast-preferences">
      <legend>Forecast preferences</legend>
      <p>Choose the forecast horizon and how the forecast is presented.</p>

      <label className="forecast-preferences-row forecast-duration">
        <span>Forecast length</span>
        <select
          value={options.days}
          onChange={(event) => updateOptions({ days: Number(event.target.value) })}
        >
          {Array.from({ length: 7 }, (_, index) => index + 1).map((days) => (
            <option key={days} value={days}>
              {days} {days === 1 ? 'day' : 'days'}
            </option>
          ))}
        </select>
      </label>

      <div className="forecast-preferences-row">
        <span>Units</span>
        <div className="unit-toggle" aria-label="Temperature and wind units">
          <button
            className={options.units === 'metric' ? 'is-selected' : ''}
            type="button"
            aria-pressed={options.units === 'metric'}
            onClick={() => updateOptions({ units: 'metric' })}
          >
            Metric
          </button>
          <button
            className={options.units === 'imperial' ? 'is-selected' : ''}
            type="button"
            aria-pressed={options.units === 'imperial'}
            onClick={() => updateOptions({ units: 'imperial' })}
          >
            Imperial
          </button>
        </div>
      </div>

      <label className="forecast-preferences-row insight-switch">
        <span>
          <strong>AI forecast insight</strong>
          <small>Include an API-generated summary for this location.</small>
        </span>
        <input
          checked={options.ai}
          type="checkbox"
          onChange={(event) => updateOptions({ ai: event.target.checked })}
        />
      </label>

      {options.ai && (
        <label className="forecast-preferences-row insight-language">
          <span>Insight language</span>
          <select
            value={options.lang}
            onChange={(event) => updateOptions({ lang: event.target.value })}
          >
            {insightLanguages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </fieldset>
  );
}
