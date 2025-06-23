import React, { createContext, useContext, useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer } from '../components/ui/Toast';

// Create context
const ToastContext = createContext(null);

/**
 * Toast provider component
 */
export const ToastProvider = ({ children, position = 'top-right', autoDismiss = true, autoDismissTimeout = 5000 }) => {
  const [toasts, setToasts] = useState([]);
  const toastRefs = useRef({});

  /**
   * Add a new toast
   */
  const addToast = useCallback(({ 
    title, 
    message, 
    variant = 'info', 
    duration = autoDismissTimeout,
    autoDismiss: toastAutoDismiss = autoDismiss,
    ...props 
  }) => {
    const id = uuidv4();
    
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        title,
        message,
        variant,
        duration,
        autoDismiss: toastAutoDismiss,
        ...props,
      },
    ]);
    
    return id;
  }, [autoDismiss, autoDismissTimeout]);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Update an existing toast
   */
  const updateToast = useCallback((id, updates) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  /**
   * Create success toast
   */
  const success = useCallback((message, options = {}) => {
    return addToast({
      ...options,
      message,
      variant: 'success',
      title: options.title || 'Success',
    });
  }, [addToast]);

  /**
   * Create error toast
   */
  const error = useCallback((message, options = {}) => {
    return addToast({
      ...options,
      message,
      variant: 'error',
      title: options.title || 'Error',
    });
  }, [addToast]);

  /**
   * Create warning toast
   */
  const warning = useCallback((message, options = {}) => {
    return addToast({
      ...options,
      message,
      variant: 'warning',
      title: options.title || 'Warning',
    });
  }, [addToast]);

  /**
   * Create info toast
   */
  const info = useCallback((message, options = {}) => {
    return addToast({
      ...options,
      message,
      variant: 'info',
      title: options.title || 'Info',
    });
  }, [addToast]);

  /**
   * Dismiss a toast by ID
   */
  const dismiss = useCallback((id) => {
    removeToast(id);
  }, [removeToast]);

  /**
   * Dismiss all toasts
   */
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Context value
  const contextValue = {
    toasts,
    addToast,
    removeToast,
    updateToast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        onDismiss={removeToast} 
        position={position} 
      />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']),
  autoDismiss: PropTypes.bool,
  autoDismissTimeout: PropTypes.number,
};

/**
 * Custom hook to use the toast context
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastContext;
