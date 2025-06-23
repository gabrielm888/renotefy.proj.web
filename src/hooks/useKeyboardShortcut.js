import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook to handle keyboard shortcuts
 * @param {string|Array<string>} targetKey - The key or keys to listen for (e.g., 'Escape', 'Ctrl+S', ['Control', 's'])
 * @param {Function} callback - The function to call when the key is pressed
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.ctrlKey=false] - Whether the Ctrl key needs to be pressed
 * @param {boolean} [options.shiftKey=false] - Whether the Shift key needs to be pressed
 * @param {boolean} [options.altKey=false] - Whether the Alt key needs to be pressed
 * @param {boolean} [options.metaKey=false] - Whether the Meta key (Command on Mac) needs to be pressed
 * @param {boolean} [options.enabled=true] - Whether the event listener is active
 * @param {HTMLElement|Window} [options.target=window] - The target element to attach the event listener to
 * @param {string} [options.eventType='keydown'] - The type of keyboard event to listen for ('keydown', 'keyup', 'keypress')
 */
const useKeyboardShortcut = (
  targetKey,
  callback,
  {
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    enabled = true,
    target = window,
    eventType = 'keydown',
  } = {}
) => {
  // Memoize the callback
  const memoizedCallback = useCallback(
    (event) => {
      // Normalize the target key(s) to an array
      const targetKeys = Array.isArray(targetKey) ? targetKey : [targetKey];
      
      // Check if any of the target keys match the pressed key
      const keyMatch = targetKeys.some(key => {
        // Handle special keys
        const keyMap = {
          'esc': 'Escape',
          'enter': 'Enter',
          'tab': 'Tab',
          'space': ' ',
          'up': 'ArrowUp',
          'down': 'ArrowDown',
          'left': 'ArrowLeft',
          'right': 'ArrowRight',
          'delete': 'Delete',
          'backspace': 'Backspace',
        };
        
        const normalizedKey = keyMap[key.toLowerCase()] || key;
        
        return event.key === normalizedKey || 
               event.code === `Key${normalizedKey}` ||
               event.code === normalizedKey;
      });
      
      // Check if the required modifier keys are pressed
      const modifiersMatch = (
        (ctrlKey === undefined || event.ctrlKey === ctrlKey) &&
        (shiftKey === undefined || event.shiftKey === shiftKey) &&
        (altKey === undefined || event.altKey === altKey) &&
        (metaKey === undefined || event.metaKey === metaKey)
      );
      
      // If the key and modifiers match, call the callback
      if (keyMatch && modifiersMatch) {
        // Prevent default browser behavior for this key combination
        event.preventDefault();
        event.stopPropagation();
        
        // Call the callback with the event
        callback(event);
      }
    },
    [targetKey, callback, ctrlKey, shiftKey, altKey, metaKey]
  );

  // Add event listener
  useEffect(() => {
    if (!enabled || !target) return;
    
    target.addEventListener(eventType, memoizedCallback);
    
    // Clean up
    return () => {
      target.removeEventListener(eventType, memoizedCallback);
    };
  }, [enabled, target, eventType, memoizedCallback]);
};

useKeyboardShortcut.propTypes = {
  targetKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  callback: PropTypes.func.isRequired,
  options: PropTypes.shape({
    ctrlKey: PropTypes.bool,
    shiftKey: PropTypes.bool,
    altKey: PropTypes.bool,
    metaKey: PropTypes.bool,
    enabled: PropTypes.bool,
    target: PropTypes.instanceOf(Element),
    eventType: PropTypes.oneOf(['keydown', 'keyup', 'keypress']),
  }),
};

export default useKeyboardShortcut;
