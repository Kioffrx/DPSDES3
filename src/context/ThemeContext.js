import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const lightTheme = {
  dark: false,
  background: '#f0f4ff',
  card: '#ffffff',
  cardAlt: '#e8eeff',
  text: '#1a1a2e',
  subtext: '#64748b',
  border: '#dde3f0',
  primary: '#6366f1',
  primaryLight: '#e0e7ff',
  secondary: '#8b5cf6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
};

export const darkTheme = {
  dark: true,
  background: '#0d0d1a',
  card: '#1a1a2e',
  cardAlt: '#16213e',
  text: '#e2e8f0',
  subtext: '#94a3b8',
  border: '#2d2d4e',
  primary: '#818cf8',
  primaryLight: '#1e1b4b',
  secondary: '#a78bfa',
  success: '#34d399',
  danger: '#f87171',
  warning: '#fbbf24',
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(prev => !prev);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}