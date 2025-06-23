import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * ProtectedRoute component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} [props.redirectTo] - Path to redirect to if not authenticated
 * @param {Array<string>} [props.allowedRoles] - Array of allowed roles
 * @param {string} [props.unauthorizedRedirect] - Path to redirect to if user doesn't have required role
 * @param {boolean} [props.requireEmailVerified] - Whether to require email verification
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login',
  allowedRoles = [],
  unauthorizedRedirect = '/unauthorized',
  requireEmailVerified = false,
  ...rest 
}) => {
  const { currentUser, loading, userData } = useAuth();
  const { pathname, search } = useLocation();
  const { error } = useToast();

  // Check if user has required role
  const hasRequiredRole = () => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!currentUser || !userData?.role) return false;
    return allowedRoles.includes(userData.role);
  };

  // Check if email is verified if required
  const isEmailVerified = () => {
    if (!requireEmailVerified) return true;
    return currentUser?.emailVerified || userData?.emailVerified;
  };

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    // Store the current location to redirect back after login
    const redirectUrl = `${pathname}${search || ''}`;
    return (
      <Navigate 
        to={{
          pathname: redirectTo,
          search: redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : '',
        }} 
        replace 
      />
    );
  }

  // Redirect to unauthorized page if user doesn't have required role
  if (!hasRequiredRole()) {
    error("You don't have permission to access this page");
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  // Redirect to email verification page if email is not verified
  if (!isEmailVerified()) {
    error('Please verify your email address to continue');
    return <Navigate to="/verify-email" state={{ from: pathname }} replace />;
  }

  // If all checks pass, render the children
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  unauthorizedRedirect: PropTypes.string,
  requireEmailVerified: PropTypes.bool,
};

export default ProtectedRoute;
