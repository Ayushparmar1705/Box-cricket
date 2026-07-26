import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminHeader, AdminSidebar } from '../../../components/layout/AdminSidebar';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

const DashboardPage: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Sign out of Super Admin Console?')) {
      localStorage.removeItem('bc_admin_session');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex">
      {/* Floating Toast Notification Stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-3 bg-white border rounded-xl shadow-2xl text-xs font-semibold ${toast.type === 'success'
                ? 'border-emerald-500/60 text-emerald-700'
                : toast.type === 'info'
                  ? 'border-blue-500/60 text-blue-700'
                  : 'border-red-500/60 text-red-700'
              }`}
          >
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600" />}
            {toast.type === 'info' && <Info size={16} className="text-blue-600" />}
            {toast.type === 'error' && <AlertTriangle size={16} className="text-red-600" />}
            <span>{toast.text}</span>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Left Navigation Sidebar */}
      <AdminSidebar />

      {/* Right Main Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onLogout={handleLogout} />

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Each route renders its module here via Outlet */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
