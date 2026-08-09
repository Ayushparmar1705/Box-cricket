import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminHeader, AdminSidebar } from '../../../components/layout/AdminSidebar';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

import { useTheme } from '../../../context/ThemeContext';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

const DashboardPage: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    if (window.confirm('Sign out of Super Admin Console?')) {
      localStorage.removeItem('bc_admin_session');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 font-sans flex transition-colors duration-300">
      {/* Floating Toast Notification Stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === 'success'
              ? 'text-emerald-700 dark:text-emerald-400 border-l-4 border-l-emerald-500'
              : toast.type === 'info'
                ? 'text-blue-700 dark:text-blue-400 border-l-4 border-l-blue-500'
                : 'text-red-700 dark:text-red-400 border-l-4 border-l-red-500'
              }`}
          >
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
            {toast.type === 'info' && <Info size={18} className="text-blue-500" />}
            {toast.type === 'error' && <AlertTriangle size={18} className="text-red-500" />}
            <span>{toast.text}</span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-3 cursor-pointer transition-colors"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            >
              <X size={16} />
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
