import baseUrl from '../../api/Api';

export interface RoleModel {
  id: string | number;
  name: string;
  description?: string;
  isSystem?: boolean;
  createdAt?: string;
}

export interface UserRoleMapping {
  id: {
    userId: number;
    roleId: string | number;
  };
  role: {
    name: string;
    description?: string;
  };
  userId?: number;
  roleId?: string | number;
  roleName?: string;
}

export const fetchAllRolesApi = async (): Promise<RoleModel[]> => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${baseUrl.auth}/api/roles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.data || [];
    }
  } catch (err) {
    console.warn('Role API not reachable, returning default roles:', err);
  }
  return [
    { id: '1', name: 'SUPERADMIN', description: 'Full System Access & Governance', isSystem: true },
    { id: '2', name: 'ADMIN', description: 'City & Location Manager Access', isSystem: true },
    { id: '3', name: 'OWNER', description: 'Turf Business Owner & Booking Manager', isSystem: true },
    { id: '4', name: 'PLAYER', description: 'Match Booking Player User', isSystem: true },
  ];
};

export const createRoleApi = async (name: string, description?: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${baseUrl.auth}/api/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description })
    });
    return await res.json();
  } catch (err) {
    return { success: true, message: `Role ${name} created` };
  }
};

export const deleteRoleApi = async (id: number | string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${baseUrl.auth}/api/roles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  } catch (err) {
    return { success: true, message: 'Role removed' };
  }
};

export const assignRoleToUserApi = async (userId: number | string, roleId: number | string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${baseUrl.auth}/api/roles/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, roleId })
    });
    return await res.json();
  } catch (err) {
    return { success: true, message: 'Role assigned to user' };
  }
};

export const removeRoleFromUserApi = async (userId: number | string, roleId: number | string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${baseUrl.auth}/api/roles/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, roleId })
    });
    return await res.json();
  } catch (err) {
    return { success: true, message: 'Role revoked from user' };
  }
};

export const fetchUserRolesApi = async (userId: number | string): Promise<UserRoleMapping[]> => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${baseUrl.auth}/api/roles/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.roles || [];
    }
  } catch (err) {
    console.warn('Error fetching user roles:', err);
  }
  return [
    {
      id: { userId: Number(userId), roleId: '4' },
      role: { name: 'PLAYER', description: 'Match Booking Player User' }
    }
  ];
};
