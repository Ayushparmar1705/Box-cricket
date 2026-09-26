import React, { useState } from 'react';
import {
  LayoutDashboard, MapPin, CalendarDays, Users,
  IndianRupee, Settings, Bell, Search, Menu, Activity
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admindashboard" },
    { name: "Countries", icon: MapPin, path: "/countries" },
    { name: "States", icon: MapPin, path: "/states" },
    { name: "Cities", icon: MapPin, path: "/cities" },
    { name: "Venues", icon: MapPin, path: "#" },
    { name: "Bookings", icon: CalendarDays, path: "#" },
    { name: "Users", icon: Users, path: "#" },
    { name: "Financials", icon: IndianRupee, path: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900 relative overflow-hidden">

      {/* Background Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0"></div>

      {/* Sidebar - Premium Light Theme */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col hidden md:flex text-gray-500 relative z-20 shadow-sm`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Activity size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">BoxCricket</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors ml-auto">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2 ${!sidebarOpen && 'hidden'}`}>Overview</p>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={index} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-gray-50 hover:text-gray-900 text-gray-600'}`}>
                <item.icon size={20} className={isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}

          <div className="pt-8">
            <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2 ${!sidebarOpen && 'hidden'}`}>Configuration</p>
            <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:bg-gray-50 hover:text-gray-900 text-gray-600`}>
              <Settings size={20} className="text-gray-400 group-hover:text-gray-600" />
              {sidebarOpen && <span className="font-medium">Settings</span>}
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 m-4 rounded-xl bg-gray-50 group hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
          <div className="flex items-center gap-3">
            <img src="https://ui-avatars.com/api/?name=Super+Admin&background=10b981&color=fff" alt="Admin" className="w-9 h-9 rounded-full shadow-sm group-hover:scale-105 transition-transform" />
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">Super Admin</p>
                <p className="text-xs text-gray-500 truncate">admin@boxcricket.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">

        {/* Topbar - Light Theme */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight hidden sm:block">Dashboard</h1>
            <div className="relative w-full max-w-md ml-8 hidden lg:block group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-xl text-sm focus:bg-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-gray-900 placeholder-gray-500 shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Hey, Admin</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
              <div className="p-0.5 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-sm">
                <img src="https://ui-avatars.com/api/?name=Super+Admin&background=fff&color=10b981" className="w-9 h-9 rounded-full border-2 border-white" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content loaded via React Router Outlet */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;
