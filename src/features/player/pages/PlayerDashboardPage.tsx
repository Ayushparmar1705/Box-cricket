import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { User, LogOut, Home, CalendarCheck } from 'lucide-react';

export const PlayerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/user-auth');
  };

  const navItems = [
    { name: 'Discover', path: '/home/discover', icon: Home },
    { name: 'My Bookings', path: '/home/bookings', icon: CalendarCheck },
    { name: 'Profile', path: '/home/profile', icon: User },
  ];

  return (
    <div className="h-screen  bg-slate-50 font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-extrabold text-white shadow-sm">
            BC
          </div>
          <span className="font-extrabold text-slate-900 text-lg tracking-tight">BoxCricket</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isActive ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' : 'text-slate-500 hover:text-slate-900 pb-1 border-b-2 border-transparent'
                  }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex items-center justify-around h-16 z-30 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
