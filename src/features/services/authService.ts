import Api from '../../api/Api';

export interface UserProfile {
  id?: string | number;
  username: string;
  email: string;
  phone: string;
  role?: string;
  roles?: string[];
  createdAt?: string;
}

const USER_STORAGE_KEY = 'boxcricket_user';
const TOKEN_STORAGE_KEY = 'token';
const ROLES_STORAGE_KEY = 'roles';

export const getStoredRoles = (): string[] => {
  try {
    const raw = localStorage.getItem(ROLES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const single = localStorage.getItem('role');
    if (single) return [single];
  } catch (e) {
    console.error('Error reading stored roles', e);
  }
  return [];
};

export const setStoredRoles = (roles: string[]) => {
  localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
  if (roles.length > 0) {
    localStorage.setItem('role', roles[0]);
  }
};

export const extractRoles = (data: any): string[] => {
  if (!data) return [];
  const raw =
    data.roles ||
    (data.role ? [data.role] : null) ||
    data.user?.roles ||
    (data.user?.role ? [data.user.role] : null) ||
    [];

  if (Array.isArray(raw)) {
    return raw.map((r: any) => {
      if (typeof r === 'string') return r.replace(/^ROLE_/i, '').toUpperCase();
      if (typeof r === 'object' && r?.name) return String(r.name).replace(/^ROLE_/i, '').toUpperCase();
      return String(r).toUpperCase();
    });
  }
  if (typeof raw === 'string') {
    return [raw.replace(/^ROLE_/i, '').toUpperCase()];
  }
  return [];
};

export const getRedirectPathByRole = (roles: string[]): string => {
  const normalized = roles.map((r) => r.toUpperCase());
  if (normalized.includes('SUPERADMIN') || normalized.includes('SUPER_ADMIN')) return '/admindashboard';
  if (normalized.includes('ADMIN')) return '/admindashboard';
  if (normalized.includes('TURF_OWNER') || normalized.includes('OWNER')) return '/admindashboard';
  if (normalized.includes('PLAYER')) return '/player-dashboard';
  return '/player-dashboard';
};

export const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored user', e);
  }
  return null;
};

export const setStoredUser = (user: UserProfile) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(ROLES_STORAGE_KEY);
  localStorage.removeItem('role');
  localStorage.clear();
  sessionStorage.clear();
};



export const loginAdmin = async (email: string, password: string) => {
  try {
    const res = await fetch(Api.auth + '/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  } catch (error) {
    console.error('Error during admin login', error);
    throw error;
  }
};

export const createProfile = async (body: any) => {
  try {
    const data = await fetch(Api.auth + "/api/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });
    return data.json()
  }
  catch (error) {
    console.error("Error while creating profile", error);
  }
}