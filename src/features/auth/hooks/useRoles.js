// hooks/useRoles.js
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRoles } from '../authSlice';


export const useRoles = () => {
  // 1. Grab roles directly from your Redux auth state
  const roles = useSelector(selectUserRoles)|| []; // Default to empty array if undefined

  // 2. Memoize checks based on the roles from Redux
  const roleChecks = useMemo(() => {
    const rolesLower = roles.map(r => r.toLowerCase());
    
    return {
      isAdmin: rolesLower.includes('admin'),
      isManager: rolesLower.includes('manager'),
      rolesLower // helper for the hasRole function
    };
  }, [roles]); // Re-calculates whenever Redux roles change

  const hasRole = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some(role => 
      roleChecks.rolesLower.includes(role.toLowerCase())
    );
  };

  return { 
    roles, 
    hasRole, 
    isAdmin: roleChecks.isAdmin, 
    isManager: roleChecks.isManager 
  };
};