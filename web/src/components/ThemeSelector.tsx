import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTheme, type ThemePreference } from '../theme-context';

const themeOptions: { value: ThemePreference; label: string; Icon: typeof Monitor }[] = [
  { value: 'auto', label: 'Auto', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

export function ThemeSelector() {
  const { preference, setPreference } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const selectedOption = themeOptions.find((option) => option.value === preference) ?? themeOptions[0];
  const SelectedIcon = selectedOption.Icon;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!selectorRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function selectTheme(nextPreference: ThemePreference) {
    setPreference(nextPreference);
    setIsOpen(false);
  }

  return (
    <div ref={selectorRef} className="theme-selector">
      <button
        className="theme-selector-trigger"
        type="button"
        aria-label={`Color theme: ${selectedOption.label}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <SelectedIcon size={18} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="theme-menu" role="menu" aria-label="Color theme">
          {themeOptions.map(({ value, label, Icon }) => (
            <button
              key={value}
              className={value === preference ? 'is-selected' : ''}
              type="button"
              role="menuitemradio"
              aria-checked={value === preference}
              onClick={() => selectTheme(value)}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
              {value === preference && <Check size={15} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
