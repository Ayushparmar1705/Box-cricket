import React, { useState } from 'react';
import type { User, Staff } from '../../../types/schema.types';
import { MOCK_USERS, MOCK_STAFF } from '../../../data/mockData';
import { Mail, Phone, Key } from 'lucide-react';

export const UsersStaffModule: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [staff] = useState<Staff[]>(MOCK_STAFF);
  const [tab, setTab] = useState<'USERS' | 'STAFF'>('USERS');

  const toggleUserActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Users & Staff</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review registered player accounts and configure staff permissions</p>
        </div>
        <div className="flex bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 p-1 rounded-lg w-fit shadow-sm">
          <button
            type="button"
            onClick={() => setTab('USERS')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              tab === 'USERS' 
                ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('STAFF')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              tab === 'STAFF' 
                ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
            }`}
          >
            Staff ({staff.length})
          </button>
        </div>
      </div>

      {tab === 'USERS' ? (
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Full Name & Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{u.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{u.fullName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                        <Mail size={12} /> {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                      <Phone size={12} className="inline mr-1" /> {u.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div className="flex items-center gap-1">{u.emailVerified ? <span className="text-emerald-500">✅ Verified</span> : <span className="text-amber-500">⏳ Pending</span>} (Email)</div>
                      <div className="flex items-center gap-1">{u.phoneVerified ? <span className="text-emerald-500">✅ Verified</span> : <span className="text-amber-500">⏳ Pending</span>} (Phone)</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleUserActive(u.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          u.isActive
                            ? 'bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                            : 'bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {u.isActive ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {staff.map((s) => (
            <div key={s.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="font-bold text-gray-900 dark:text-gray-100 text-base">{s.userName}</div>
                <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-500/30">
                  {s.designation}
                </span>
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50 dark:border-gray-700/50"><strong className="text-gray-500 dark:text-gray-400">Owner:</strong> <span>{s.ownerName}</span></div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50 dark:border-gray-700/50"><strong className="text-gray-500 dark:text-gray-400">Assigned Venue:</strong> <span className="font-medium">{s.venueName || 'All Venues'}</span></div>
                <div className="mt-1">
                  <div className="font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Granular Permissions:</div>
                  <div className="flex flex-wrap gap-2">
                    {s.permissions.map((perm) => (
                      <span key={perm} className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md font-mono text-[10px] flex items-center gap-1 border border-gray-200 dark:border-gray-700 shadow-xs">
                        <Key size={10} className="text-indigo-500" /> {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
