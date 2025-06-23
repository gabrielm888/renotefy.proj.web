import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Layout component that provides a consistent structure for all pages
 */
const Layout = ({ children, className = '', showHeader = true, showFooter = true }) => {
  const { theme } = useTheme();
  const { currentUser, logout } = useAuth();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      {showHeader && (
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Renotefy
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                
                {currentUser ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asLink
                      to="/login"
                      className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      asLink
                      to="/register"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
      
      {/* Main content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex-1 ${className}`}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      {showFooter && (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  About
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Privacy
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Terms
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Contact
                </a>
              </div>
              <p className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Renotefy. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool,
};

export default Layout;
