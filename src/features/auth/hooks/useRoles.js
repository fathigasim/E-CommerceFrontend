// hooks/useRoles.js
import { useMemo } from 'react';
import { tokenService } from '../../../services/tokenService';

export const useRoles = () => {
  const roles = useMemo(() => {
    const token = tokenService.getAccessToken();
    return tokenService.getUserRoles(token) || [];
  }, []);

  const hasRole = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const rolesLower = roles.map(r => r.toLowerCase());
    return requiredRoles.some(role => rolesLower.includes(role.toLowerCase()));
  };

  const isAdmin = roles.map(r => r.toLowerCase()).includes('admin');
  const isManager = roles.map(r => r.toLowerCase()).includes('manager');

  return { roles, hasRole, isAdmin, isManager };
};