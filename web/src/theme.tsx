import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ThemeContext, type ThemePreference } from './theme-context';

const THEME_STORAGE_KEY = 'forecast-ai:theme-preference';

function getInitialThemePreference(): ThemePreference {
  const savedPreference = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedPreference === 'auto' || savedPreference === 'light' || savedPreference === 'dark') {
    return savedPreference;
  }

  const legacyTheme = window.localStorage.getItem('theme');
  if (legacyTheme === 'day') return 'light';
  if (legacyTheme === 'night') return 'dark';

  return 'auto';
}

function getLocalTimeIsDay(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(getInitialThemePreference);
  const [autoThemeIsDay, setAutoThemeIsDay] = useState(getLocalTimeIsDay);

  const setAutoThemeIsDayFromWeather = useCallback((isDay: boolean) => {
    setAutoThemeIsDay(isDay);
  }, []);

  useEffect(() => {
    const isNight = preference === 'dark' || (preference === 'auto' && !autoThemeIsDay);
    document.documentElement.classList.toggle('theme-night', isNight);
  }, [autoThemeIsDay, preference]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  }, [preference]);

  const value = useMemo(
    () => ({
      preference,
      setPreference,
      setAutoThemeIsDay: setAutoThemeIsDayFromWeather,
    }),
    [preference, setAutoThemeIsDayFromWeather],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
