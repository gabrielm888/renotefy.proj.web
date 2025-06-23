import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook for managing local storage with React state synchronization
 * @param {string} key - The key under which to store the value in local storage
 * @param {*} initialValue - The initial value to use if no value exists in local storage
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.syncTabs=true] - Whether to sync across browser tabs
 * @param {Function} [options.serialize=JSON.stringify] - Function to serialize the value for storage
 * @param {Function} [options.deserialize=JSON.parse] - Function to deserialize the stored value
 * @returns {Array} - Array containing the stored value and a function to update it
 */
const useLocalStorage = (
  key,
  initialValue,
  {
    syncTabs = true,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = {}
) => {
  // Get initial value from localStorage if it exists, otherwise use initialValue
  const getStoredValue = useCallback(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserialize]);

  // State to store our value
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Update the stored value in localStorage and state
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialize(valueToStore));
      }
      
      return valueToStore;
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, serialize, storedValue]);

  // Handle storage events to sync across tabs
  useEffect(() => {
    if (!syncTabs || typeof window === 'undefined') return;

    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = deserialize(event.newValue);
          if (newValue !== storedValue) {
            setStoredValue(newValue);
          }
        } catch (error) {
          console.warn(`Error handling storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, storedValue, deserialize, syncTabs]);

  // Handle the case where the key changes
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [key, getStoredValue]);

  return [storedValue, setValue];
};

useLocalStorage.propTypes = {
  key: PropTypes.string.isRequired,
  initialValue: PropTypes.any,
  options: PropTypes.shape({
    syncTabs: PropTypes.bool,
    serialize: PropTypes.func,
    deserialize: PropTypes.func,
  }),
};

export default useLocalStorage;
