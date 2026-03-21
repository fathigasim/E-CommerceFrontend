import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectIsAuthenticated, selectAuthLoading } from '../authSlice';
import { tokenService } from '../../../services/tokenService';

const PrivateRoute = ({ 
  children, 
  allowedRoles = [], 
  fallbackUrl = '/',
  requireAllRoles = false, // If true, user must have ALL roles, not just one
  redirectTo = '/forbidden'
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  // Memoize role check to avoid recalculation on every render
  const { hasAccess, userRoles } = useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) {
      return { hasAccess: true, userRoles: [] };
    }

    const token = tokenService.getAccessToken();
    const roles = tokenService.getUserRoles(token) || [];
    
    if (requireAllRoles) {
      // User must have ALL specified roles
      return { 
        hasAccess: allowedRoles.every(role => roles.includes(role)),
        userRoles: roles 
      };
    } else {
      // User needs at least ONE of the specified roles (default behavior)
      return { 
        hasAccess: allowedRoles.some(role => roles.includes(role)),
        userRoles: roles 
      };
    }
  }, [allowedRoles, requireAllRoles, isAuthenticated]); // Re-check when auth changes

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not authenticated → Login with return URL
  if (!isAuthenticated) {
    return (
      <Navigate 
       to={redirectTo}
       
        state={{ 
          from: location.pathname + location.search,
          message: "Please log in to access this page" 
        }} 
        replace 
      />
    );
  }

  // Authenticated but wrong roles → Forbidden/Unauthorized
  if (allowedRoles.length > 0 && !hasAccess) {
    console.warn(`Access denied. Required roles: ${allowedRoles.join(', ')}, User has: ${userRoles.join(', ')}`);
    
    // Option 1: Redirect to home (default)
    if (fallbackUrl === '/') {
      return <Navigate to="/" replace />;
    }
    
    // Option 2: Redirect to specific forbidden/unauthorized page
    return (
      <Navigate 
        to={fallbackUrl} 
        state={{ 
          from: location.pathname,
          requiredRoles: allowedRoles,
          userRoles: userRoles,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        }} 
        replace 
      />
    );
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  fallbackUrl: PropTypes.string,
  requireAllRoles: PropTypes.bool
};

PrivateRoute.defaultProps = {
  allowedRoles: [],
  fallbackUrl: '/',
  requireAllRoles: false
};

export default PrivateRoute;