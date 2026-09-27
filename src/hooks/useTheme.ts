import { useCallback, useEffect, useState } from 'react';
import type { Theme } from '../types/imc';
import { loadTheme, saveTheme } from '../utils/storage';

const THEME_COLORS: Record<Theme, string> = { light: '#1F6F5F', dark: '#0D1715' };

function initialTheme(): Theme {
  const current = document.documentElement.dataset.theme;
  if (current === 'light' || current === 'dark') return current;
  return loadTheme() ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  }, [theme]);

  // Segue o sistema operacional enquanto o usuário não escolher um tema.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      if (!loadTheme()) setTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      saveTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
