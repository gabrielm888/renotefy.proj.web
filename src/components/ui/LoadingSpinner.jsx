import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * LoadingSpinner component
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Size of the spinner (sm, md, lg, xl)
 * @param {string} [props.color='primary'] - Color of the spinner (primary, secondary, success, warning, error, info)
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.text=''] - Optional text to display below the spinner
 * @param {boolean} [props.fullScreen=false] - Whether to cover the full viewport
 * @param {string} [props.textClassName=''] - Additional CSS classes for the text
 * @returns {JSX.Element} LoadingSpinner component
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  text = '',
  fullScreen = false,
  textClassName = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-2',
    xl: 'h-16 w-16 border-4',
  };

  // Color classes
  const colorClasses = {
    primary: 'border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent',
    secondary: 'border-t-secondary-500 border-r-transparent border-b-transparent border-l-transparent',
    success: 'border-t-success-500 border-r-transparent border-b-transparent border-l-transparent',
    warning: 'border-t-warning-500 border-r-transparent border-b-transparent border-l-transparent',
    error: 'border-t-error-500 border-r-transparent border-b-transparent border-l-transparent',
    info: 'border-t-info-500 border-r-transparent border-b-transparent border-l-transparent',
    light: 'border-t-white border-r-transparent border-b-transparent border-l-transparent',
    dark: 'border-t-gray-800 border-r-transparent border-b-transparent border-l-transparent',
  };

  // Text size classes
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  // Animation variants
  const spinTransition = {
    repeat: Infinity,
    ease: 'linear',
    duration: 1,
  };

  // Render the spinner
  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-screen w-screen' : ''} ${className}`} {...props}>
      <div className="relative flex items-center justify-center">
        <motion.div
          className={`${sizeClasses[size]} rounded-full ${colorClasses[color]}`}
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
      </div>
      {text && (
        <p className={`mt-3 ${textSizeClasses[size]} text-gray-500 dark:text-gray-400 ${textClassName}`}>
          {text}
        </p>
      )}
    </div>
  );

  return spinner;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info', 'light', 'dark']),
  className: PropTypes.string,
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  textClassName: PropTypes.string,
};

export default LoadingSpinner;
