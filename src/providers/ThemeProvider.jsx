import React, { createContext, useContext, useEffect, useState } from 'react';
import { initTheme, toggleTheme as toggleThemeUtil } from '../utils/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = initTheme();
    setTheme(initialTheme);
    setIsMounted(true);
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = toggleThemeUtil();
    setTheme(newTheme);
  };

  // Don't render theme-dependent content until we know the theme
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-dark-900">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
