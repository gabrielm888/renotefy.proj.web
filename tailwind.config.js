/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  fontFamily: {
    sans: ['Inter var', 'SF Pro Display', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['SF Mono', 'monospace'],
  },
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo-500
        'primary-hover': '#4f46e5', // Indigo-600
        'primary-dark': '#4338ca', // Indigo-700
        secondary: '#10b981', // Emerald-500
        'secondary-hover': '#059669', // Emerald-600
        dark: '#111111', // Darker background for Apple-like dark mode
        'dark-light': '#1F1F1F', // Lighter dark mode elements
        'dark-lighter': '#2A2A2A', // Even lighter dark mode elements
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        glow: '0 0 10px rgba(99, 102, 241, 0.5)',
        'apple': '0 1px 3px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.1)', // Apple-like shadow
      },
      backgroundImage: {
        'gradient-frosted': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
