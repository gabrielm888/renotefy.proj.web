import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Button from './ui/Button';

/**
 * Error boundary component to catch JavaScript errors in child components
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });
    
    // You can also log the error to an error reporting service here
    // logErrorToMyService(error, errorInfo);
  }

  handleReset = () => {
    // Reset the error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Call the onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { 
      children, 
      fallback: FallbackComponent, 
      showDetails = process.env.NODE_ENV === 'development',
      resetButtonText = 'Try again',
      className = '',
    } = this.props;

    // If there's an error and a custom fallback component is provided, render it
    if (hasError && FallbackComponent) {
      return (
        <FallbackComponent 
          error={error} 
          errorInfo={errorInfo} 
          onReset={this.handleReset} 
        />
      );
    }

    // If there's an error, render the error UI
    if (hasError) {
      return (
        <motion.div 
          className={`min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 mx-auto" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're sorry, but an unexpected error occurred. Our team has been notified.
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                  className="px-6 py-2"
                >
                  {resetButtonText}
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => window.location.reload()}
                  className="px-6 py-2"
                >
                  Reload Page
                </Button>
              </div>
              
              {showDetails && error && (
                <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left overflow-auto max-h-64">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Error Details:
                  </h3>
                  <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
                    {error.toString()}
                  </pre>
                  
                  {errorInfo && errorInfo.componentStack && (
                    <>
                      <h4 className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                        Component Stack:
                      </h4>
                      <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    // If there's no error, render children
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.elementType,
  onReset: PropTypes.func,
  showDetails: PropTypes.bool,
  resetButtonText: PropTypes.string,
  className: PropTypes.string,
};

export default ErrorBoundary;
