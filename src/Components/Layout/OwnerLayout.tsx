// ============================================================================
// File: OwnerLayout.tsx
// Description: Common layout wrapper for all Owner pages
// Contains: Sidebar navigation, Header, Background design
// Uses React Router's <Outlet /> to render child pages
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Layers,
  DollarSign,
  ChevronRight,
  Sparkles,
  Phone,
  LogOut,
  BadgeCheck,
  X,
  Menu
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logoutUser, type UserProfile } from '../../features/services/authService';

// ============================================================================
// SIDEBAR NAV ITEMS
// ============================================================================

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/owner-dashboard' },
  { label: 'Venues & Grounds', icon: Building2, path: '/owner-venues' },
  { label: 'Courts & Arena', icon: Layers, path: '/owner-courts' },
  { label: 'Slot Bookings', icon: Calendar, path: '/owner-slots' },
  { label: 'Pricing Rules', icon: DollarSign, path: '/owner-pricing' },
];

// ============================================================================
// HELPER: Get page title from URL path
// ============================================================================

const getPageTitle = (pathname: string): string => {
  const p = pathname.toLowerCase();
  if (p.includes('venue')) return 'Venues & Grounds';
  if (p.includes('court')) return 'Courts & Arena';
  if (p.includes('slot')) return 'Slot Bookings';
  if (p.includes('pricing')) return 'Pricing Rules';
  if (p.includes('profile')) return 'Profile';
  return 'Owner Dashboard';
};

// ============================================================================
// MAIN LAYOUT COMPONENT
// ============================================================================

export default function OwnerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load user info from localStorage
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user_profile') || localStorage.getItem('user');
      if (rawUser) {
        setUser(JSON.parse(rawUser));
      }
    } catch {
      // fallback
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/player-login');
  };

  const ownerName = user?.username || 'Turf Owner';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden antialiased">

      {/* ── Soft Ambient Background Glows ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[25%] w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-[140px]" />
      </div>

      {/* ── Mobile Sidebar Backdrop ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* SIDEBAR                                         */}
      {/* ═══════════════════════════════════════════════ */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 shadow-sm flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-7">
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <Link to="/owner-dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                  BoxCricket
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  OWNER SUITE
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Management
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </nav>

          {/* Partner Help Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-amber-50/60 border border-emerald-100 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Partner Desk</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Need assistance setting up courts or floodlights?
            </p>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>1800-420-TURF</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer - User Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
              {ownerName.charAt(0).toUpperCase()}
            </div>
            <div className="truncate flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">{ownerName}</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                Verified Partner
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA                               */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 z-10">

        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-slate-800">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            BoxCricket Owner Suite
          </div>
        </header>

        {/* Page Content - Rendered by React Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
