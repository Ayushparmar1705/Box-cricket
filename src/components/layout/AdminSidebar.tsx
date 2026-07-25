import React, { useState } from 'react';
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
  LogOut,
  Search,
  Menu,
  ChevronRight,
  Info,
  ChevronDown,
} from 'lucide-react';

/* ── AWS CONSOLE STYLE TOP NAVIGATION BAR ────────────────────── */
export const AdminHeader: React.FC<{
  activeTabLabel: string;
  onLogout: () => void;
  onToggleSidebar?: () => void;
}> = ({ activeTabLabel, onLogout, onToggleSidebar }) => (
  <header className="h-12 bg-white border-b border-slate-300 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs font-sans text-slate-800">
    {/* Left: Breadcrumbs & Hamburger */}
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
        title="Toggle Menu"
      >
        <Menu size={18} />
      </button>

      <nav className="flex items-center gap-1 text-xs font-medium text-slate-600">
        <span className="text-[#0066cc] hover:underline cursor-pointer font-bold">Console Home</span>
        <ChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-900 font-bold">{activeTabLabel}</span>
      </nav>
    </div>

    {/* Right Controls: Search, Region, Status, Account */}
    <div className="flex items-center gap-3">
      {/* Global Search Bar */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-md px-3 h-8 w-72 focus-within:border-[#0066cc] focus-within:bg-white transition-all">
        <Search size={14} className="text-slate-500 shrink-0" />
        <input
          type="text"
          placeholder="Find venue, booking, or request..."
          className="w-full bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400 font-sans"
        />
      </div>

      {/* Region Selector Badge */}
      <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-[11px] font-medium text-slate-700 font-mono">
        <span>ap-south-1 (Mumbai)</span>
        <ChevronDown size={12} className="text-slate-500" />
      </div>

      {/* Operational Status Pill */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-[11px] font-semibold text-emerald-800">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Operational</span>
      </div>

      {/* Account Info */}
      <div className="flex items-center gap-2 border-l border-slate-300 pl-3">
        <div className="w-6 h-6 rounded-full bg-[#0066cc] text-white font-bold flex items-center justify-center text-[10px]">
          RS
        </div>
        <span className="hidden sm:inline text-xs font-bold text-slate-800">Rajesh Sharma</span>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 cursor-pointer"
        title="Sign Out"
      >
        <LogOut size={16} />
      </button>
    </div>
  </header>
);

/* ── AWS CONSOLE STYLE LEFT SIDEBAR NAVIGATION ────────────────── */
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingOwnerCount: number;
}

export const AdminSidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingOwnerCount,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard },
    { id: 'owner_verification', label: 'Owner Approvals & KYC', icon: CheckSquare, badge: pendingOwnerCount },
    { id: 'venues', label: 'Venues & Photo Gallery', icon: Building2 },
    { id: 'courts', label: 'Courts & Pricing Rules', icon: Layers },
    { id: 'slots_bookings', label: 'Slots & Live Bookings', icon: Calendar },
    { id: 'payments', label: 'Payments & Coupons', icon: CreditCard },
    { id: 'master_data', label: 'Master Data (Cities/Sports)', icon: Globe },
    { id: 'users_staff', label: 'Users & Staff Roles', icon: Users },
    { id: 'audit_logs', label: 'Security & Audit Trail', icon: ShieldCheck },
  ];

  return (
    <aside
      className={`${collapsed ? 'w-14' : 'w-64'
        } bg-white border-r border-slate-300 text-slate-800 flex flex-col shrink-0 min-h-screen transition-all duration-200 font-sans`}
    >
      {/* Console Home Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
        {!collapsed && (
          <span className="font-extrabold text-slate-900 text-sm tracking-tight">
            Console Home
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer ml-auto"
          title={collapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          <ChevronRight size={16} className={collapsed ? '' : 'rotate-180 transition-transform'} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="py-2 flex-1 flex flex-col gap-0.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Database Modules (24 Tables)
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-2.5 text-xs transition-all cursor-pointer text-left border-none ${isActive
                  ? 'bg-[#f1f5f9] text-[#0066cc] font-bold border-l-4 border-[#0066cc]'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={16} className={isActive ? 'text-[#0066cc]' : 'text-slate-500'} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && Boolean(item.badge && item.badge > 0) && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ec7211] text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Schema badge */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="text-[11px] text-slate-500 flex flex-col gap-0.5 font-sans">
            <div className="font-bold text-slate-800">PostgreSQL Schema 2.0</div>
            <div>24 Tables · 3NF Normalized</div>
          </div>
        </div>
      )}
    </aside>
  );
};

/* ── AWS CONSOLE STYLE REUSABLE CALLOUT INFO BANNER ────────────── */
export const AwsInfoBanner: React.FC<{ title: string; message: string; linkText?: string }> = ({
  title,
  message,
  linkText,
}) => (
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
