import { useState, useEffect, useCallback } from 'react';
import { getStoredRoles, getStoredUser, logoutUser, type UserProfile } from '../features/services/authService';

export const useAuthRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  const refreshAuth = useCallback(() => {
    // Check both standard admin roles and player roles storage
    let currentRoles = getStoredRoles();
    if (currentRoles.length === 0) {
      try {
        const playerRoles = localStorage.getItem('player_roles');
        if (playerRoles) {
          currentRoles = JSON.parse(playerRoles);
        } else {
          const singlePlayerRole = localStorage.getItem('player_role');
          if (singlePlayerRole) currentRoles = [singlePlayerRole];
        }
      } catch {
        // ignore
      }
    }
    setRoles(currentRoles);
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    refreshAuth();
    window.addEventListener('storage', refreshAuth);
    return () => window.removeEventListener('storage', refreshAuth);
  }, [refreshAuth]);

  const hasRole = useCallback((role: string) => {
    return roles.map((r) => r.toUpperCase()).includes(role.toUpperCase());
  }, [roles]);

  const hasAnyRole = useCallback((requiredRoles: string[]) => {
    const uppercaseRoles = roles.map((r) => r.toUpperCase());
    return requiredRoles.some((r) => uppercaseRoles.includes(r.toUpperCase()));
  }, [roles]);

  const logout = useCallback(() => {
    logoutUser();
    setRoles([]);
    setUser(null);
  }, []);

  return {
    roles,
    primaryRole: roles[0] || 'GUEST',
    user,
    hasRole,
    hasAnyRole,
    refreshAuth,
    logout,
  };
};

export default useAuthRoles;
