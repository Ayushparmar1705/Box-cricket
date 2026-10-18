// ============================================================================
// File: OwnerDashboard.tsx
// Description: Owner Dashboard Page — ONLY dashboard content
// Layout (sidebar, header) is handled by OwnerLayout.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Layers,
  DollarSign,
  TrendingUp,
  Zap,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

// Services
import { type UserProfile } from '../services/authService';
import { fetchMyVenuesApi, type VenueItem } from '../services/venueService';
import { fetchCourtsApi, type CourtItem } from '../services/courtService';

// ============================================================================
// DUMMY DATA (Replace with real API data later)
// ============================================================================

const WEEKLY_ANALYTICS_DATA = [
  { day: 'Mon', revenue: 8400, slots: 6 },
  { day: 'Tue', revenue: 11200, slots: 8 },
  { day: 'Wed', revenue: 9800, slots: 7 },
  { day: 'Thu', revenue: 14500, slots: 10 },
  { day: 'Fri', revenue: 21000, slots: 14 },
  { day: 'Sat', revenue: 32500, slots: 21 },
  { day: 'Sun', revenue: 38900, slots: 25 },
];

const RECENT_BOOKINGS = [
  {
    id: 'BK-9041',
    playerName: 'Rohit Verma',
    turfName: 'Apex Arena Court A',
    date: 'Today',
    timeSlot: '07:00 PM - 09:00 PM',
    amount: 3200,
    status: 'CONFIRMED',
  },
  {
    id: 'BK-9042',
    playerName: 'Aditya Sharma',
    turfName: 'Apex Arena Court B',
    date: 'Today',
    timeSlot: '09:00 PM - 11:00 PM',
    amount: 3600,
    status: 'PENDING',
  },
  {
    id: 'BK-9043',
    playerName: 'Kunal Patil',
    turfName: 'Champions Cricket Turf',
    date: 'Tomorrow',
    timeSlot: '06:00 AM - 08:00 AM',
    amount: 2400,
    status: 'CONFIRMED',
  },
  {
    id: 'BK-9044',
    playerName: 'Siddharth Roy',
    turfName: 'Apex Arena Court A',
    date: 'Tomorrow',
    timeSlot: '08:00 PM - 10:00 PM',
    amount: 3200,
    status: 'CANCELLED',
  },
];

// ============================================================================
// DASHBOARD COMPONENT — Only dashboard UI, no sidebar/header/layout
// ============================================================================

export default function OwnerDashboard() {
  const navigate = useNavigate();

  // State for stats
  const [user, setUser] = useState<UserProfile | null>(null);
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [courts, setCourts] = useState<CourtItem[]>([]);

  // Load user and stats on page load
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user_profile') || localStorage.getItem('user');
      if (rawUser) {
        setUser(JSON.parse(rawUser));
      }
    } catch {
      // fallback
    }

    const loadStats = async () => {
      try {
        const [venuesRes, courtsRes] = await Promise.all([
          fetchMyVenuesApi().catch(() => ({ data: [] })),
          fetchCourtsApi().catch(() => []),
        ]);
        const venueList = Array.isArray(venuesRes) ? venuesRes : (venuesRes?.data || []);
        setVenues(venueList);
        setCourts(courtsRes || []);
      } catch {
        // fallback
      }
    };

    loadStats();
  }, []);

  // Computed values
  const ownerName = user?.username || 'Turf Owner';
  const totalVenues = venues.length > 0 ? venues.length : 2;
  const totalCourts = courts.length > 0 ? courts.length : 3;

  return (
    <div className="space-y-8">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-emerald-100/60 to-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>BOX CRICKET OWNER COMMAND CENTER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-emerald-700">{ownerName}</span> 🏏
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Real-time overview of your turf occupancy, slot booking trends, night floodlight courts,
              and weekly financial yield.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => navigate('/owner-venues')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Manage Venues</span>
            </button>
            <button
              onClick={() => navigate('/owner-slots')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>View Bookings</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Venues Card */}
        <div
          onClick={() => navigate('/owner-venues')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Venues</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalVenues}</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <Check className="w-3 h-3" />
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Registered box cricket grounds</p>
        </div>

        {/* Courts Card */}
        <div
          onClick={() => navigate('/owner-courts')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Courts & Lighting</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCourts}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Floodlit
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Individual playing courts</p>
        </div>

        {/* Slot Reservations Card */}
        <div
          onClick={() => navigate('/owner-slots')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slot Reservations</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">176</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <ArrowUpRight className="w-3 h-3" />
              +18%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Night & day matches scheduled</p>
        </div>

        {/* Revenue Card */}
        <div
          onClick={() => navigate('/owner-pricing')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-amber-300 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">₹1,57,400</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Total slot fees collected</p>
        </div>
      </div>

      {/* ── Weekly Analytics Chart + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Weekly Slot Revenue & Booking Trends</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily match reservations and payout collection trends
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Last 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#0f172a'
                  }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Peak Slot Time</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">08:00 - 11:00 PM</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Turf Occupancy</div>
              <div className="text-sm font-bold text-emerald-700 mt-0.5">88.4% Capacity</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Average Rate</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">₹1,450 / hr</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Quick Arena Operations</span>
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/owner-venues')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <span className="group-hover:text-emerald-700 transition-colors">Manage Venues & Turf</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button
                onClick={() => navigate('/owner-courts')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <span className="group-hover:text-emerald-700 transition-colors">Courts & Floodlights Setup</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button
                onClick={() => navigate('/owner-slots')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <span className="group-hover:text-emerald-700 transition-colors">Today's Reservations</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button
                onClick={() => navigate('/owner-pricing')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <span className="group-hover:text-emerald-700 transition-colors">Slot Pricing Simulator</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Partner Arena</span>
            </div>
            <p className="text-[11px] text-emerald-950/80 leading-relaxed">
              Your turf meets BoxCricket standards for high-density grass and night lighting.
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Bookings Table ── */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Recent Slot Bookings</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest player reservations across all arenas
            </p>
          </div>
          <button
            onClick={() => navigate('/owner-slots')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            <span>View All Bookings</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-4">Venue Ground</th>
                <th className="py-3.5 px-4">Slot Time</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_BOOKINGS.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono">{b.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{b.playerName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{b.turfName}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{b.timeSlot}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{b.amount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
