import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, Plus, MapPin, ArrowRight, Sparkles, Clock, Phone } from 'lucide-react';
import { useDashboard } from '../hook/useDashboard';

export const OwnerDashboard: React.FC = () => {
  const { owner, venues, recentVenues, totalVenues, activeVenues, loading } = useDashboard();

  const ownerName = owner?.name || owner?.fullName || 'Partner';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white p-6 sm:p-8 shadow-lg shadow-emerald-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
              <Sparkles size={14} className="text-amber-300" />
              Venue Management Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {ownerName}! 👋
            </h1>
            <p className="mt-2 text-emerald-100 text-sm leading-relaxed">
              Track your cricket grounds, maintain operating hours, and keep your venue listings up-to-date for players.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/owner/venues"
              className="bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-extrabold text-sm px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus size={18} className="text-emerald-600 font-bold" />
              Add New Venue
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Total Venues */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Venues
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              {loading ? '...' : totalVenues}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Listed under your profile</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>

        {/* Card 2: Active Venues */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Status
            </p>
            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
              {loading ? '...' : activeVenues}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Open for player reservations</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Card 3: Quick Action */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Manage Grounds
            </p>
            <h4 className="text-base font-bold text-white mt-1">
              Ready to expand?
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Configure slots, contact numbers, and amenities in one place.
            </p>
          </div>
          <Link
            to="/owner/venues"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-4"
          >
            View All Venues <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Venues Section */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              My Venues Snapshot
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recently created sports arenas and turfs
            </p>
          </div>
          <Link
            to="/owner/venues"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View All ({venues.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading your venues...</div>
        ) : recentVenues.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No venues added yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Add your first cricket box or turf to start receiving bookings.
            </p>
            <Link
              to="/owner/venues"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Plus size={16} /> Add Your First Venue
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentVenues.map((venue) => (
              <div
                key={venue.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {venue.venue_name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{venue.address || 'Address not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  {venue.contact_number && (
                    <div className="hidden md:flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Phone size={13} className="text-slate-400" />
                      <span>{venue.contact_number}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Clock size={13} className="text-slate-400" />
                    <span>
                      {(venue.opening_time || '06:00').slice(0, 5)} -{' '}
                      {(venue.closing_time || '23:00').slice(0, 5)}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {venue.status || 'ACTIVE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
