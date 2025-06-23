import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:pointer-events-none';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700 active:scale-[0.98]',
    secondary: 'bg-white/90 dark:bg-dark-700/50 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-dark-600 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-dark-600/50 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-dark-700/50 text-gray-600 dark:text-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Loading spinner
  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <motion.button
      ref={ref}
      className={buttonClasses}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {startIcon && !isLoading && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
