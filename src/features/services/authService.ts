import Api from '../../api/Api';

// ============================================================================
// 1. DATA TYPES (Simple interfaces for students)
// ============================================================================

export interface User {
  id?: number | string;
  username: string;
  fullName?: string;
  email: string;
  phone?: string;
  roles?: string[];
}

export type UserProfile = User;

export interface RegisterData {
  username?: string;
  name?: string;
  fullName?: string;
  email: string;
  phone: string;
  password: string;
}

export type PlayerRegisterData = RegisterData;

// ============================================================================
// 2. AUTHENTICATION APIS (Login & Create Account)
// ============================================================================

/**
 * 1. Login Function
 * Sends email and password to the backend server.
 */
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${Api.auth}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

// Aliases for compatibility with other files
export const loginAdmin = loginUser;
export const loginPlayer = loginUser;

/**
 * 2. Create Account (Sign Up) Function
 * Sends user registration details to the backend server.
 */
export const createAccount = async (form: RegisterData) => {
  const userName = form.username || form.name || '';
  const response = await fetch(`${Api.auth}/api/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: userName,
      fullName: form.fullName || userName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      roles: ['PLAYER'],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

// Aliases for compatibility
export const registerPlayer = createAccount;
export const createProfile = createAccount;

// ============================================================================
// 3. ROLE REDIRECTION FUNCTION
// Only one single function for redirecting based on roles!
// ============================================================================

/**
 * Checks the roles array from DB/login response and returns the dashboard URL.
 * - If contains OWNER -> '/owner-dashboard'
 * - If contains ADMIN -> '/admindashboard'
 * - Default -> '/player-dashboard'
 */
export const redirectByRole = (roles: string[] | string): string => {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  const cleanRoles = roleArray.map((r) => {
    const roleStr = typeof r === 'string' ? r : (r as any)?.name || '';
    return roleStr.toUpperCase().replace(/^ROLE_/, '');
  });

  if (cleanRoles.includes('OWNER') || cleanRoles.includes('TURF_OWNER')) {
    return '/owner-dashboard';
  }

  if (cleanRoles.includes('ADMIN') || cleanRoles.includes('SUPERADMIN') || cleanRoles.includes('SUPER_ADMIN')) {
    return '/admindashboard';
  }

  return '/player-dashboard';
};

// ============================================================================
// 4. PROFILE & LOGOUT HELPERS
// ============================================================================

/**
 * Fetch profile of currently logged-in user using the token header.
 */
export const viewProfile = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Please login first');
  }

  const response = await fetch(`${Api.auth}/api/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not load profile');
  }

  return data;
};

/**
 * Logout: Simply clear all stored session data from localStorage.
 */
export const logoutUser = (): void => {
  localStorage.clear();
};

// ============================================================================
// 5. CURRENT USER & SESSION HELPERS
// ============================================================================

/**
 * Safely decodes JWT token payload from Base64
 */
export const decodeToken = (token?: string | null): any => {
  const t = token || localStorage.getItem('token');
  if (!t) return null;
  try {
    const parts = t.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    try {
      return JSON.parse(atob(t.split('.')[1]));
    } catch {
      return null;
    }
  }
};

/**
 * Returns current logged-in user ID as number, or null
 */
export const getCurrentUserId = (): number | null => {
  // 1. From JWT token claims (userid or userId or sub)
  const decoded = decodeToken();
  if (decoded) {
    const rawId = decoded.userid ?? decoded.userId ?? decoded.id;
    if (rawId !== undefined && rawId !== null && !isNaN(Number(rawId))) {
      return Number(rawId);
    }
  }

  // 2. From stored user JSON in localStorage
  const userStr =
    localStorage.getItem('boxcricket_user') ||
    localStorage.getItem('user_profile') ||
    localStorage.getItem('user');

  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      const rawId = u.id ?? u.userId ?? u.userid;
      if (rawId !== undefined && rawId !== null && !isNaN(Number(rawId))) {
        return Number(rawId);
      }
    } catch {
      // ignore
    }
  }

  return null;
};

/**
 * Returns array of normalized uppercase roles for current user
 */
export const getCurrentUserRoles = (): string[] => {
  const decoded = decodeToken();
  if (decoded) {
    const r = decoded.role || decoded.roles;
    if (r) {
      const rArr = Array.isArray(r) ? r : [r];
      return rArr.map((x: any) =>
        (typeof x === 'string' ? x : x?.name || '').toUpperCase().replace(/^ROLE_/, '')
      );
    }
  }

  const rolesStr = localStorage.getItem('roles');
  if (rolesStr) {
    try {
      const roles = JSON.parse(rolesStr);
      const rArr = Array.isArray(roles) ? roles : [roles];
      return rArr.map((x: any) =>
        (typeof x === 'string' ? x : x?.name || '').toUpperCase().replace(/^ROLE_/, '')
      );
    } catch {
      // ignore
    }
  }

  return [];
};

/**
 * Checks if current logged in user has OWNER role
 */
export const isOwner = (): boolean => {
  const roles = getCurrentUserRoles();
  return roles.some((r) => r.includes('OWNER'));
};

/**
 * Checks if current logged in user has ADMIN / SUPER_ADMIN role
 */
export const isAdmin = (): boolean => {
  const roles = getCurrentUserRoles();
  return roles.some((r) => r.includes('ADMIN'));
};

