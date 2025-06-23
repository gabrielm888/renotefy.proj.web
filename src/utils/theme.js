// Theme utilities for managing light/dark mode and theme colors

// Theme configuration
export const themeConfig = {
  light: {
    background: 'bg-white',
    text: 'text-gray-800',
    card: 'bg-white/80',
    border: 'border-gray-200',
    input: 'bg-white/50 border-gray-200',
    button: {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white',
      secondary: 'bg-white/90 hover:bg-gray-50 text-gray-700 border-gray-200',
    },
  },
  dark: {
    background: 'bg-dark-900',
    text: 'text-gray-200',
    card: 'bg-dark-800/70',
    border: 'border-dark-700',
    input: 'bg-dark-700/50 border-dark-600',
    button: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary: 'bg-dark-700/50 hover:bg-dark-600/50 text-gray-200 border-dark-600',
    },
  },
};

// Apply theme to document
export const applyTheme = (theme) => {
  const root = window.document.documentElement;
  
  // Remove all theme classes first
  Object.values(themeConfig).forEach((themeVariant) => {
    Object.values(themeVariant).forEach((value) => {
      if (typeof value === 'string') {
        root.classList.remove(...value.split(' '));
      } else if (typeof value === 'object') {
        Object.values(value).forEach((subValue) => {
          root.classList.remove(...subValue.split(' '));
        });
      }
    });
  });

  // Add new theme classes
  const themeToApply = themeConfig[theme];
  if (themeToApply) {
    Object.values(themeToApply).forEach((value) => {
      if (typeof value === 'string') {
        root.classList.add(...value.split(' '));
      } else if (typeof value === 'object') {
        Object.values(value).forEach((subValue) => {
          root.classList.add(...subValue.split(' '));
        });
      }
    });
  }

  // Set data-theme attribute for CSS variables
  root.setAttribute('data-theme', theme);
  
  // Save to localStorage
  localStorage.setItem('theme', theme);
};

// Initialize theme from user preference or system preference
export const initTheme = () => {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    applyTheme('dark');
    return 'dark';
  } else {
    applyTheme('light');
    return 'light';
  }
};

// Toggle between light and dark theme
export const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  return newTheme;
};
