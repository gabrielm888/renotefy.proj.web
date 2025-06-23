import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook that triggers a callback when a click occurs outside of the specified element
 * @param {Function} handler - Callback function to execute when a click outside occurs
 * @param {boolean} [active=true] - Whether the event listener should be active
 * @param {string} [eventType='mousedown'] - The event type to listen for
 * @returns {React.RefObject} A ref to attach to the element to detect outside clicks
 */
const useClickOutside = (handler, active = true, eventType = 'mousedown') => {
  const ref = useRef(null);
  const savedHandler = useRef(handler);

  // Update the handler if it changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!active) return;

    const handleClickOutside = (event) => {
      // Check if the click was outside the ref element
      if (ref.current && !ref.current.contains(event.target)) {
        savedHandler.current(event);
      }
    };

    // Add event listener
    document.addEventListener(eventType, handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener(eventType, handleClickOutside);
    };
  }, [active, eventType]);

  return ref;
};

useClickOutside.propTypes = {
  handler: PropTypes.func.isRequired,
  active: PropTypes.bool,
  eventType: PropTypes.oneOf(['mousedown', 'click', 'mouseup']),
};

export default useClickOutside;
