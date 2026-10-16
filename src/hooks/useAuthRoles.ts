import { useState, useEffect, useCallback } from 'react';
import { logoutUser, type UserProfile } from '../features/services/authService';

export const useAuthRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  const refreshAuth = useCallback(() => {
    let currentRoles: string[] = [];
    let currentUser: UserProfile | null = null;

    try {
      const userStr = localStorage.getItem('boxcricket_user');
      if (userStr) {
        currentUser = JSON.parse(userStr);
        if (Array.isArray(currentUser?.roles)) {
          currentRoles = currentUser.roles.map((r: any) =>
            typeof r === 'string' ? r : r?.name || ''
          );
        }
      }

      if (currentRoles.length === 0) {
        const rolesStr = localStorage.getItem('roles');
        if (rolesStr) {
          const parsed = JSON.parse(rolesStr);
          if (Array.isArray(parsed)) currentRoles = parsed;
        }
      }
    } catch {
      // ignore JSON errors
    }

    setRoles(currentRoles);
    setUser(currentUser);
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
