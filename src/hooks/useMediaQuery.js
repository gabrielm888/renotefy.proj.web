import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook to handle media queries in React
 * @param {string|Array<string>} query - The media query string or array of strings to match
 * @param {boolean} [defaultMatches] - Default matches value (useful for SSR)
 * @param {boolean} [matchOnMount=true] - Whether to check the media query on mount
 * @returns {boolean} - Whether the media query matches
 */
const useMediaQuery = (query, defaultMatches = false, matchOnMount = true) => {
  // Get the correct window object (for SSR)
  const getMatches = (query) => {
    if (typeof window === 'undefined') {
      return defaultMatches;
    }
    
    if (Array.isArray(query)) {
      return window.matchMedia(query.join(', ')).matches;
    }
    
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(
    matchOnMount ? getMatches(query) : defaultMatches
  );

  useEffect(() => {
    if (!matchOnMount) return;
    
    // Function to update matches state
    const handleChange = () => {
      setMatches(getMatches(query));
    };
    
    // Create media query list
    let mediaQueryList;
    
    if (Array.isArray(query)) {
      mediaQueryList = window.matchMedia(query.join(', '));
    } else {
      mediaQueryList = window.matchMedia(query);
    }
    
    // Initial check
    handleChange();
    
    // Add listener for changes
    if (mediaQueryList.addListener) {
      // Legacy browsers
      mediaQueryList.addListener(handleChange);
    } else {
      // Modern browsers
      mediaQueryList.addEventListener('change', handleChange);
    }
    
    // Clean up
    return () => {
      if (mediaQueryList.removeListener) {
        mediaQueryList.removeListener(handleChange);
      } else {
        mediaQueryList.removeEventListener('change', handleChange);
      }
    };
  }, [query, matchOnMount]);

  return matches;
};

// Common media queries as a utility
export const breakpoints = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  motionSafe: '(prefers-reduced-motion: no-preference)',
  motionReduce: '(prefers-reduced-motion: reduce)',
};

// Helper hooks for common breakpoints
export const useIsMobile = () => useMediaQuery(`(max-width: 767px)`);
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

useMediaQuery.propTypes = {
  query: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  defaultMatches: PropTypes.bool,
  matchOnMount: PropTypes.bool,
};

export default useMediaQuery;
