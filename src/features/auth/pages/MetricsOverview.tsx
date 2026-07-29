import React from 'react';
import {
  MOCK_BOOKINGS,
  MOCK_VENUES,
  MOCK_USERS,
  MOCK_PAYMENTS,
  MOCK_OWNER_REQUESTS,
} from '../../../data/mockData';
import { AwsInfoBanner } from '../../../components/layout/AdminSidebar';
import { CreditCard, Calendar, Building2, Users, Clock, TrendingUp, Search, ChevronDown, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export const MetricsOverview: React.FC = () => {
  const totalRevenue = MOCK_PAYMENTS.reduce((sum: number, p) => sum + (p.paymentStatus === 'SUCCESS' ? p.amount : 0), 0);
  const totalBookings = MOCK_BOOKINGS.length;
  const activeVenues = MOCK_VENUES.filter((v) => v.status === 'ACTIVE').length;
  const totalPlayers = MOCK_USERS.filter((u) => u.role === 'PLAYER').length;
  const pendingOwners = MOCK_OWNER_REQUESTS.filter((r) => r.status === 'PENDING').length;

  const stats = [
    { label: 'Total Revenue Processed', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: CreditCard, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Total Platform Bookings', value: totalBookings.toString(), icon: Calendar, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Active Registered Venues', value: activeVenues.toString(), icon: Building2, color: 'text-indigo-700', bg: 'bg-indigo-50' },
    { label: 'Registered Players', value: totalPlayers.toString(), icon: Users, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Pending Owner Requests', value: pendingOwners.toString(), icon: Clock, color: 'text-rose-700', bg: 'bg-rose-50' },
    { label: 'Platform Growth Rate', value: '+28%', icon: TrendingUp, color: 'text-teal-700', bg: 'bg-teal-50' },
  ];

  return (
    <div className="flex flex-col font-sans">
      
      {/* AWS Light Blue Info Callout Banner */}
      <AwsInfoBanner
        title="PostgreSQL 16.2 Advisory Lock Engine Active"
        message="Anti-double booking locks are enforced across all 24 schema tables. Real-time slot availability is synced across active venues."
        linkText="Explore Schema Docs"
      />

      {/* Main AWS Console Card Container */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm flex flex-col gap-5">
        
        {/* Card Title & Top Right Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Console Overview Metrics <span className="text-slate-500 font-medium">({stats.length})</span>
            </h2>
            <a href="#" className="text-xs text-[#0066cc] hover:underline font-bold">Info</a>
          </div>

          <button
            type="button"
            className="bg-[#ec7211] hover:bg-[#d97706] text-white font-bold px-4 py-2 rounded-full text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Plus size={14} />
            <span>Create New Venue</span>
          </button>
        </div>

        {/* Control Filter Bar (Region Dropdown, Search Input, Pagination) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Region Selector */}
            <div className="relative">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Region</div>
              <div className="flex items-center justify-between gap-2 bg-white border border-slate-300 rounded px-3 h-8 text-slate-800 font-medium min-w-[200px]">
                <span>ap-south-1 (Mumbai Region)</span>
                <ChevronDown size={14} className="text-slate-500" />
              </div>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:w-72">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Filter</div>
              <div className="flex items-center gap-2 bg-white border border-slate-300 rounded px-3 h-8 text-slate-800">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Find metric by name, region or status..."
                  className="w-full bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs ml-auto">
            <button type="button" className="p-1 rounded border border-slate-300 hover:bg-white text-slate-600 disabled:opacity-50"><ChevronLeft size={14} /></button>
            <span className="font-bold text-slate-800">1</span>
            <button type="button" className="p-1 rounded border border-slate-300 hover:bg-white text-slate-600 disabled:opacity-50"><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-2">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-slate-50/60 border border-slate-200 rounded-xl p-5 flex items-start justify-between shadow-2xs hover:border-[#0066cc]/40 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-1">{s.value}</span>
                </div>
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
