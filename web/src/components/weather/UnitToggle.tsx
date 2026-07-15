import type { TemperatureUnit } from '../../types/weather';

interface UnitToggleProps {
  units: TemperatureUnit;
  onChange: (units: TemperatureUnit) => void;
  className?: string;
}

export function UnitToggle({ units, onChange, className = '' }: UnitToggleProps) {
  return (
    <div className={`unit-toggle ${className}`.trim()} aria-label="Temperature and wind units">
      <button
        className={units === 'metric' ? 'is-selected' : ''}
        type="button"
        aria-pressed={units === 'metric'}
        onClick={() => onChange('metric')}
      >
        °C
      </button>
      <button
        className={units === 'imperial' ? 'is-selected' : ''}
        type="button"
        aria-pressed={units === 'imperial'}
        onClick={() => onChange('imperial')}
      >
        °F
      </button>
    </div>
  );
}
