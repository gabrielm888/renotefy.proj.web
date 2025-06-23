import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

// Toast variant configurations
const toastVariants = {
  success: {
    icon: CheckCircleIcon,
    iconColor: 'text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-100 dark:border-green-800/50',
    textColor: 'text-green-800 dark:text-green-200',
    title: 'Success',
  },
  error: {
    icon: ExclamationCircleIcon,
    iconColor: 'text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-100 dark:border-red-800/50',
    textColor: 'text-red-800 dark:text-red-200',
    title: 'Error',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-100 dark:border-yellow-800/50',
    textColor: 'text-yellow-800 dark:text-yellow-200',
    title: 'Warning',
  },
  info: {
    icon: InformationCircleIcon,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-100 dark:border-blue-800/50',
    textColor: 'text-blue-800 dark:text-blue-200',
    title: 'Info',
  },
};

/**
 * Toast notification component
 * @param {Object} props - Component props
 * @param {string} [props.id] - Unique identifier for the toast
 * @param {string} [props.title] - Title of the toast
 * @param {string} [props.message] - Message content of the toast
 * @param {'success'|'error'|'warning'|'info'} [props.variant='info'] - Variant of the toast
 * @param {number} [props.duration=5000] - Duration in milliseconds before the toast auto-dismisses
 * @param {boolean} [props.autoDismiss=true] - Whether the toast should auto-dismiss
 * @param {Function} [props.onDismiss] - Callback when the toast is dismissed
 * @param {React.ReactNode} [props.icon] - Custom icon to override the default
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Inline styles
 */
const Toast = ({
  id,
  title,
  message,
  variant = 'info',
  duration = 5000,
  autoDismiss = true,
  onDismiss,
  icon: CustomIcon,
  className = '',
  style = {},
  ...props
}) => {
  const variantConfig = toastVariants[variant] || toastVariants.info;
  const Icon = CustomIcon || variantConfig.icon;

  // Auto-dismiss the toast after the specified duration
  useEffect(() => {
    if (!autoDismiss || !onDismiss) return;
    
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [autoDismiss, duration, id, onDismiss]);

  // Handle dismiss button click
  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss(id);
    }
  }, [id, onDismiss]);

  // Animation variants
  const toastVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  return (
    <motion.div
      className={`relative w-full max-w-sm p-4 mb-2 rounded-lg border ${variantConfig.bgColor} ${variantConfig.borderColor} ${variantConfig.textColor} shadow-lg ${className}`}
      style={style}
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      {...props}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 pt-0.5 ${variantConfig.iconColor}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        
        <div className="ml-3 w-0 flex-1 pt-0.5">
          {title && (
            <h3 className="text-sm font-medium">
              {title || variantConfig.title}
            </h3>
          )}
          
          {message && (
            <p className="mt-1 text-sm">
              {message}
            </p>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0 flex">
          <button
            type="button"
            className="inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
            onClick={handleDismiss}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  message: PropTypes.node,
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  autoDismiss: PropTypes.bool,
  onDismiss: PropTypes.func,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Toast container component to manage multiple toasts
 */
const ToastContainer = ({ toasts, onDismiss, position = 'top-right', className = '' }) => {
  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div 
      className={`fixed z-50 w-full max-w-xs space-y-2 ${positionClasses[position] || positionClasses['top-right']} ${className}`}
      style={{
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={onDismiss}
            style={{ pointerEvents: 'auto' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    message: PropTypes.node,
    variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    duration: PropTypes.number,
    autoDismiss: PropTypes.bool,
    icon: PropTypes.elementType,
  })),
  onDismiss: PropTypes.func.isRequired,
  position: PropTypes.oneOf(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']),
  className: PropTypes.string,
};

export { Toast, ToastContainer };
export default Toast;
