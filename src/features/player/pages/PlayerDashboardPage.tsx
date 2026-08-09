import React from 'react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center font-extrabold text-white shadow-sm">
            BC
          </div>
          <span className="font-extrabold text-gray-900 dark:text-gray-100 text-lg tracking-tight">BoxCricket</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 pb-1 border-b-2 border-transparent'
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
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
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
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-gray-800 flex items-center justify-around h-16 z-30 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
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
