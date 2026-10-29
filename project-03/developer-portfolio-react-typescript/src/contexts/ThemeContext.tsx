import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './ThemeContextTypes';
import type { Theme } from './ThemeContextTypes';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  useReducedMotion();

  useEffect(() => {
    const stored = localStorage.getItem('portfolio_theme') as Theme | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      const effectiveTheme = isDark ? 'dark' : 'light';
      setResolvedTheme(effectiveTheme);

      const root = document.documentElement;
      if (effectiveTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
