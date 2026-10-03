import React, { useState } from 'react';
import {
  LayoutDashboard,
  Globe2,
  Building2,
  MapPin,
  CalendarDays,
  Users,
  IndianRupee,
  Bell,
  Search,
  Menu,
  Activity
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admindashboard' }
      ]
    },
    {
      title: 'Geo Management',
      items: [
        { name: 'Countries', icon: Globe2, path: '/countries' },
        { name: 'States', icon: Building2, path: '/states' },
        { name: 'Cities', icon: MapPin, path: '/cities' }
      ]
    },
    {
      title: 'Turf Operations',
      items: [
        { name: 'Venues', icon: MapPin, path: '#' },
        { name: 'Bookings', icon: CalendarDays, path: '#' },
        { name: 'Users', icon: Users, path: '#' },
        { name: 'Financials', icon: IndianRupee, path: '#' }
      ]
    }
  ];

  const getPageTitle = () => {
    if (location.pathname === '/admindashboard') return 'Dashboard';
    if (location.pathname === '/countries') return 'Countries';
    if (location.pathname === '/states') return 'States';
    if (location.pathname === '/cities') return 'Cities';
    return 'Box Cricket Operations';
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex font-sans text-slate-100 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none z-0" />

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } transition-all duration-300 ease-in-out bg-[#0d1322] border-r border-slate-800/80 flex flex-col hidden md:flex text-slate-400 relative z-20 shadow-2xl`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Activity size={18} className="text-slate-950 font-black" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight block leading-none">
                  BoxCricket
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Admin Platform
                </span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Activity size={18} className="text-slate-950 font-black" />
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3.5 py-6 space-y-6 overflow-y-auto">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              {sidebarOpen && (
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-3">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item, iIdx) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group relative ${isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                        : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                        }`}
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full shadow-[0_0_8px_#10b981]" />
                      )}

                      <item.icon
                        size={19}
                        className={
                          isActive
                            ? 'text-emerald-400'
                            : 'text-slate-500 group-hover:text-slate-300 transition-colors'
                        }
                      />
                      {sidebarOpen && (
                        <span className="flex-1 truncate">{item.name}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-slate-800/80 m-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://ui-avatars.com/api/?name=Super+Admin&background=10b981&color=090d16&bold=true"
                alt="Admin"
                className="w-9 h-9 rounded-xl"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Super Admin</p>
                <p className="text-[11px] text-slate-400 truncate">admin@boxcricket.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Topbar */}
        <header className="h-20 bg-[#0d1322]/90 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between px-6 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Platform /</span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {getPageTitle()}
              </h1>
            </div>

            {/* Global Search */}
            <div className="relative w-full max-w-xs ml-6 hidden lg:block group">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-9 pr-8 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:bg-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                /
              </kbd>
            </div>
          </div>

          {/* Right Topbar Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2.5 text-slate-400 hover:text-white transition-colors bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 cursor-pointer"
              title="Notifications"
            >
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
            </button>

            <div className="w-px h-6 bg-slate-800" />

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Super Admin
                </p>
                <p className="text-[11px] text-slate-500">Operations Lead</p>
              </div>
              <div className="p-0.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-md">
                <img
                  src="https://ui-avatars.com/api/?name=Super+Admin&background=090d16&color=10b981&bold=true"
                  className="w-8 h-8 rounded-[10px] border border-slate-900"
                  alt="Admin"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 relative bg-[#090d16]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
