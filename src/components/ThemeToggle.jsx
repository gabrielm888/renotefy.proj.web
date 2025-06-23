import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../providers/ThemeProvider';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-14 h-8 rounded-full p-1 transition-colors duration-200
        ${isDark ? 'bg-dark-700' : 'bg-gray-200'}
        focus:outline-none focus:ring-2 focus:ring-primary-500/50
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className={`
            w-6 h-6 rounded-full flex items-center justify-center
            ${isDark ? 'bg-primary-500' : 'bg-white'}
            shadow-lg
          `}
          layout
          initial={false}
          animate={{
            x: isDark ? 22 : 0,
            transition: { type: 'spring', stiffness: 500, damping: 30 }
          }}
        >
          {isDark ? (
            <motion.svg
              key="moon"
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ opacity: 0, rotate: -30 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 30 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              className="w-4 h-4 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ opacity: 0, rotate: 30 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -30 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </motion.svg>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        animate={{
          opacity: 0,
          scale: 2,
          backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.2)',
        }}
        transition={{ duration: 0.6 }}
        key={theme}
      />
    </button>
  );
};

export default ThemeToggle;
