import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const lightTheme = {
  dark: false,
  background: '#f9fafb',
  card: '#ffffff',
  text: '#111827',
  subtext: '#6b7280',
  border: '#e5e7eb',
  primary: '#4f46e5',
  danger: '#ef4444',
};

export const darkTheme = {
  dark: true,
  background: '#0f172a',
  card: '#1e293b',
  text: '#f1f5f9',
  subtext: '#94a3b8',
  border: '#334155',
  primary: '#818cf8',
  danger: '#f87171',
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
