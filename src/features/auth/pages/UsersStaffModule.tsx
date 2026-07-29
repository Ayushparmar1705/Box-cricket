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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Users & Staff</h2>
          <p className="text-xs text-slate-500 mt-1">Review registered player accounts and configure staff permissions</p>
        </div>
        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setTab('USERS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'USERS' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Users ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('STAFF')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'STAFF' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Staff ({staff.length})
          </button>
        </div>
      </div>

      {tab === 'USERS' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">User ID</th>
                <th className="px-5 py-3.5">Full Name & Email</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Verification</th>
                <th className="px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-550">{u.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{u.fullName}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail size={12} /> {u.email}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-650">
                    <Phone size={12} className="inline mr-1" /> {u.phone}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-slate-100 border border-slate-250 text-slate-700 text-xs font-bold px-2 py-0.5 rounded">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-550">
                    <div>Email: {u.emailVerified ? '✅ Verified' : '❌ Pending'}</div>
                    <div>Phone: {u.phoneVerified ? '✅ Verified' : '❌ Pending'}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleUserActive(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${u.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-750'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-emerald-50 hover:text-emerald-750'
                        }`}
                    >
                      {u.isActive ? 'Active' : 'Blocked'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {staff.map((s) => (
            <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-sm">{s.userName}</div>
                <span className="bg-slate-150 text-slate-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-slate-250">
                  {s.designation}
                </span>
              </div>
              <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2">
                <div><strong>Owner:</strong> {s.ownerName}</div>
                <div><strong>Assigned Venue:</strong> {s.venueName || 'All'}</div>
                <div className="font-bold text-emerald-750 mt-1">Granular Permissions:</div>
                <div className="flex flex-wrap gap-1.5">
                  {s.permissions.map((perm) => (
                    <span key={perm} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono text-[10px] flex items-center gap-1 border border-slate-200">
                      <Key size={10} className="text-emerald-600" /> {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
