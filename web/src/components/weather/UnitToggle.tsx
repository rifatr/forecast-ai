import type { TemperatureUnit } from '../../types/weather';

interface UnitToggleProps {
  units: TemperatureUnit;
  onChange: (units: TemperatureUnit) => void;
  className?: string;
  disabled?: boolean;
}

export function UnitToggle({ units, onChange, className = '', disabled = false }: UnitToggleProps) {
  return (
    <div className={`unit-toggle ${className}`.trim()} aria-label="Temperature and wind units">
      <button
        className={units === 'metric' ? 'is-selected' : ''}
        type="button"
        aria-pressed={units === 'metric'}
        onClick={() => onChange('metric')}
        disabled={disabled}
      >
        °C
      </button>
      <button
        className={units === 'imperial' ? 'is-selected' : ''}
        type="button"
        aria-pressed={units === 'imperial'}
        onClick={() => onChange('imperial')}
        disabled={disabled}
      >
        °F
      </button>
    </div>
  );
}
