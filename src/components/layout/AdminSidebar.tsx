import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Building2,
  Layers,
  Calendar,
  CreditCard,
  Globe,
  Users,
  ShieldCheck,
  Tag,
  LogOut,
  Search,
  Menu,
  ChevronRight,
  ChevronDown,
  Info,
  MapPin,
  Moon,
  Sun,
  Bell,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/* ── PATH → BREADCRUMB LABEL MAP ────────────────────────────── */
const PATH_LABELS: Record<string, string> = {
  '/dashboard/overview': 'Overview & Analytics',
  '/dashboard/owner-approvals': 'Owner Approvals & KYC',
  '/dashboard/venues': 'Venues & Photo Gallery',
  '/dashboard/courts': 'Courts & Dynamic Rates',
  '/dashboard/bookings': 'Slots & Live Bookings',
  '/dashboard/payments': 'Payments & Coupons',
  '/dashboard/master-data': 'Master Reference Data',
  '/dashboard/users-staff': 'Users & Staff Roles',
  '/dashboard/categories': 'Categories Management',
  '/dashboard/cities': 'Operational Cities',
  '/dashboard/audit-logs': 'Security Audit Trail',
};

/* ── TOP NAVIGATION BAR ─────────────────────────────────────── */
export const AdminHeader: React.FC<{
  activeTabLabel?: string;
  onToggleSidebar?: () => void;
}> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const label = PATH_LABELS[location.pathname] ?? 'Overview & Analytics';

  return (
    <header className="h-16 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <span className="text-gray-500 dark:text-gray-400">Admin</span>
          <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">{label}</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100/50 dark:bg-gray-900/50 border border-transparent dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 rounded-lg px-3 h-10 w-64 focus-within:bg-white dark:focus-within:bg-[#111827] focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
          <Search size={16} className="text-gray-500 dark:text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-800 pr-4">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#111827]"></span>
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-1 cursor-pointer group">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Rajesh S.</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Admin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-transparent group-hover:ring-indigo-200 dark:group-hover:ring-indigo-900 transition-all">
            RS
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

/* ── LEFT SIDEBAR NAVIGATION ─────────────────────────────────── */
export const AdminSidebar: React.FC<{ pendingOwnerCount?: number }> = ({ pendingOwnerCount = 0 }) => {
  const collapsed = false;
  const location = useLocation();
  const navigate = useNavigate();

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard/overview', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/dashboard/owner-approvals', label: 'Approvals', icon: CheckSquare, badge: pendingOwnerCount },
      ]
    },
    {
      title: 'Management',
      items: [
        { path: '/dashboard/venues', label: 'Venues', icon: Building2 },
        { path: '/dashboard/courts', label: 'Courts', icon: Layers },
        { path: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
        { path: '/dashboard/payments', label: 'Payments', icon: CreditCard },
      ]
    },
    {
      title: 'Settings & Data',
      items: [
        { path: '/dashboard/master-data', label: 'Master Data', icon: Globe },
        { path: '/dashboard/categories', label: 'Categories', icon: Tag },
        { path: '/dashboard/cities', label: 'Cities', icon: MapPin },
        { path: '/dashboard/users-staff', label: 'Users', icon: Users },
        { path: '/dashboard/audit-logs', label: 'Audit Logs', icon: ShieldCheck },
      ]
    }
  ];
  const { theme } = useTheme();

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-slate-800 flex flex-col shrink-0 min-h-screen transition-all duration-300 ease-in-out relative z-40`}>
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="font-black text-white text-sm">BC</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">Admin Console</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="font-black text-white text-sm">BC</span>
            </div>
          </div>
        )}
      </div>

      <nav className="py-6 flex-1 flex flex-col gap-6 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {!collapsed && (
              <span className="px-3 pb-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                {group.title}
              </span>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.includes(item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer text-left border-none group ${isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-400 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors'} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && Boolean(item.badge && item.badge > 0) && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-5 border-t border-gray-200 dark:border-slate-800">
          <div className="flex flex-col gap-4">
            <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors w-full">
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex justify-center">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
};

/* ── REUSABLE INFO BANNER ────────────────────────────────────── */
export const AwsInfoBanner: React.FC<{ title: string; message: string; linkText?: string }> = ({ title, message, linkText }) => (
  <div className="bg-[#ebf8ff] border border-[#bee3f8] text-[#2b6cb0] p-4 rounded-lg flex items-start gap-3 text-xs mb-6 shadow-2xs font-sans">
    <Info size={18} className="text-[#3182ce] shrink-0 mt-0.5" />
    <div className="flex-1">
      <strong className="font-bold text-[#2c5282]">{title}</strong> — {message}{' '}
      {linkText && (
        <a href="#" className="font-bold underline text-[#2b6cb0] hover:text-[#1a365d] inline-flex items-center gap-0.5">
          {linkText} ↗
        </a>
      )}
    </div>
  </div>
);
