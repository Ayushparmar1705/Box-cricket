import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, MapPin, Layers, LogOut, ShieldCheck, User } from 'lucide-react';
import { getStoredOwner } from '../services/ownerVenueService';

export const OwnerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const owner = getStoredOwner();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/user-auth');
  };

  const navItems = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { name: 'My Venues', path: '/owner/venues', icon: MapPin },
    { name: 'Courts & Pitches', path: '/owner/courts', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] font-sans flex flex-col text-slate-800 dark:text-slate-200">
      {/* Top Header Navigation */}
      <header className="h-16 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center font-black text-white shadow-sm shadow-emerald-500/20">
            BC
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-lg tracking-tight">
              BoxCricket
            </span>
            <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck size={12} /> Owner Panel
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-bold transition-all px-3 py-1.5 rounded-xl ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon size={17} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <User size={14} />
            </div>
            <span>{owner?.name || owner?.fullName || 'Owner'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 z-30 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-[11px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
