import React, { useEffect, useState } from 'react';
import { Shield, Plus, Trash2, UserPlus, Users, Search, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchAllRolesApi,
  createRoleApi,
  deleteRoleApi,
  assignRoleToUserApi,
  removeRoleFromUserApi,
  fetchUserRolesApi,
  RoleModel,
  UserRoleMapping,
} from '../services/roleService';

const RoleManager: React.FC = () => {
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create Role State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);

  // Assign Role State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignUserId, setAssignUserId] = useState('');
  const [assignRoleId, setAssignRoleId] = useState('');
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);

  // User Roles Lookup
  const [searchUserId, setSearchUserId] = useState('');
  const [userRoles, setUserRoles] = useState<UserRoleMapping[]>([]);
  const [isSearchingUserRoles, setIsSearchingUserRoles] = useState(false);
  const [searchedUser, setSearchedUser] = useState<string | null>(null);

  // Fetch all roles on mount
  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllRolesApi();
      setRoles(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // Handle Create Role
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return toast.error('Role name is required');

    setIsSubmittingRole(true);
    try {
      await createRoleApi(newRoleName.trim().toUpperCase(), newRoleDesc.trim());
      toast.success(`Role '${newRoleName.toUpperCase()}' created successfully`);
      setNewRoleName('');
      setNewRoleDesc('');
      setIsCreateModalOpen(false);
      loadRoles();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create role');
    } finally {
      setIsSubmittingRole(false);
    }
  };

  // Handle Delete Role
  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!window.confirm(`Are you sure you want to delete role '${roleName}'?`)) return;
    try {
      await deleteRoleApi(roleId);
      toast.success(`Role '${roleName}' deleted`);
      loadRoles();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete role');
    }
  };

  // Handle Assign Role
  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUserId.trim()) return toast.error('User ID is required');
    if (!assignRoleId) return toast.error('Please select a role');

    setIsSubmittingAssign(true);
    try {
      await assignRoleToUserApi(Number(assignUserId.trim()), assignRoleId);
      toast.success('Role assigned to user successfully');
      setIsAssignModalOpen(false);
      setAssignUserId('');
      setAssignRoleId('');

      // Refresh user roles if currently viewing this user
      if (searchUserId === assignUserId) {
        handleSearchUserRoles();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign role');
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  // Search User Roles
  const handleSearchUserRoles = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchUserId.trim()) return toast.error('Enter a User ID to search');

    setIsSearchingUserRoles(true);
    try {
      const data = await fetchUserRolesApi(Number(searchUserId.trim()));
      setUserRoles(data || []);
      setSearchedUser(searchUserId);
    } catch (err: any) {
      toast.error(err.message || 'No roles found for this user');
      setUserRoles([]);
      setSearchedUser(null);
    } finally {
      setIsSearchingUserRoles(false);
    }
  };

  // Remove Role from User
  const handleRemoveRole = async (userId: number, roleId: string, roleName: string) => {
    if (!window.confirm(`Remove role '${roleName}' from User #${userId}?`)) return;
    try {
      await removeRoleFromUserApi(userId, roleId);
      toast.success(`Role '${roleName}' removed`);
      handleSearchUserRoles();
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove role');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-6 h-6 text-slate-950 font-black" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Role & Permission Management</h1>
            <p className="text-xs text-slate-400">Manage available system roles and user assignments</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadRoles}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title="Refresh Roles"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition-all shadow-sm"
          >
            <UserPlus size={16} />
            Assign Role
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} />
            New Role
          </button>
        </div>
      </div>

      {/* Main Grid: Roles Cards & User Role Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Roles List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Defined Roles ({roles.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-400" />
              <p className="text-xs">Loading roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
              <Shield className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold">No roles found</p>
              <p className="text-xs text-slate-500 mt-1">Create your first role using the 'New Role' button above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-emerald-500/40 transition-all group relative overflow-hidden shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {r.name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500">ID: {r.id.substring(0, 8)}...</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteRole(r.id, r.name)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Role"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-400 leading-relaxed min-h-[32px]">
                    {r.description || 'No description provided.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Assigned dynamically</span>
                    <span>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'System'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: User Roles Search & Management */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Inspect User Assignments
          </h2>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
            <form onSubmit={handleSearchUserRoles} className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users size={14} className="text-emerald-400" />
                Find Roles by User ID
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Enter User ID (e.g. 1)"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isSearchingUserRoles}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Search size={14} />
                  Find
                </button>
              </div>
            </form>

            {searchedUser && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Roles for User #{searchedUser}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {userRoles.length} Assigned
                  </span>
                </div>

                {userRoles.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center bg-slate-950/60 rounded-xl border border-slate-800/60">
                    No roles assigned to this user yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {userRoles.map((ur) => (
                      <div
                        key={ur.id.roleId}
                        className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800/70"
                      >
                        <div>
                          <p className="text-xs font-bold text-emerald-400">{ur.role?.name}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[170px]">
                            {ur.role?.description || 'Assigned role'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveRole(ur.id.userId, ur.id.roleId, ur.role?.name)}
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Revoke Role"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: Create Role */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Create New Role
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Role Name *</label>
                <input
                  type="text"
                  placeholder="e.g. SUPER_ADMIN, OWNER, STAFF, PLAYER"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe permissions or purpose of this role"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRole}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                >
                  {isSubmittingRole ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Role */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                Assign Role to User
              </h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignRole} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">User ID *</label>
                <input
                  type="number"
                  placeholder="Enter User ID (e.g. 1)"
                  value={assignUserId}
                  onChange={(e) => setAssignUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Role *</label>
                <select
                  value={assignRoleId}
                  onChange={(e) => setAssignRoleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Choose a Role --</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.description || 'No description'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAssign}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                >
                  {isSubmittingAssign ? 'Assigning...' : 'Assign Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManager;
