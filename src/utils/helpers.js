/**
 * Debounce function to limit how often a function can be called
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to call the function immediately
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Format a date to a readable string
 * 
 * @param {Date|Object} timestamp - Date object or Firebase timestamp
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (timestamp, options = {}) => {
  if (!timestamp) return 'Unknown date';
  
  // Handle Firebase Timestamp or standard Date
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

/**
 * Generate a random color from a predefined palette
 * Used for user avatars and other visual elements
 * 
 * @returns {string} - HEX color code
 */
export const generateRandomColor = () => {
  const colors = [
    '#F87171', // Red
    '#FB923C', // Orange
    '#FBBF24', // Amber
    '#A3E635', // Lime
    '#34D399', // Emerald
    '#22D3EE', // Cyan
    '#60A5FA', // Blue
    '#A78BFA', // Violet
    '#F472B6', // Pink
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Create initials from a name string
 * 
 * @param {string} name - Full name
 * @returns {string} - Up to 2 initials
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Truncate text to a specific length and add ellipsis if needed
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  // If it's HTML content, strip tags first
  const plainText = text.replace(/<[^>]*>/g, '');
  
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.substring(0, maxLength)}...`;
};

/**
 * Safely parse JSON with error handling
 * 
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} - Parsed object or fallback
 */
export const safeJsonParse = (jsonString, fallback = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};
