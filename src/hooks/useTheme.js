import { useState, useEffect, useCallback } from 'react';
import { getTheme, applyTheme } from '../utils/theme';

/**
 * Custom hook to manage theme state and provide theme-related functions
 * @returns {Object} Theme state and functions
 */
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
    setIsDark(savedTheme === 'dark');
    setIsMounted(true);
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      setIsDark(newTheme === 'dark');
      return newTheme;
    });
  }, []);

  // Set a specific theme
  const setThemeMode = useCallback((mode) => {
    if (mode !== 'light' && mode !== 'dark' && mode !== 'system') {
      console.warn(`Invalid theme mode: ${mode}. Defaulting to 'light'.`);
      mode = 'light';
    }
    
    const newTheme = mode === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : mode;
      
    applyTheme(newTheme);
    setTheme(newTheme);
    setIsDark(newTheme === 'dark');
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
        setIsDark(newTheme === 'dark');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return {
    theme,
    isDark,
    isMounted,
    toggleTheme,
    setTheme: setThemeMode,
  };
};

export default useTheme;
