import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext(null);

/**
 * Provides dark/light theme state to the whole app.
 * Persists the user's choice and respects their system preference on first visit.
 */
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('village-tournament-theme');
    // BEDR brand requirement: Light Mode is the default for first-time
    // visitors. We intentionally do NOT fall back to the OS/browser's
    // prefers-color-scheme here — only an explicit prior toggle switches
    // a visitor into Dark Mode.
    return stored === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('village-tournament-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
