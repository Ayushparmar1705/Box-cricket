import React from 'react';
import { Users, TrendingUp, IndianRupee, Calendar, Bell, ChevronDown, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { 
  useDashboardMetrics, 
  useRevenueOverview, 
  useBookingOverview, 
  useVenuePerformance, 
  useRecentBookings 
} from '../../../hooks/useDashboard';
import type { VenuePerformance } from '../../../types/dashboard';
import type { Booking } from '../../../types/booking';

export const OwnerOverview: React.FC = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueOverview();
  const { data: bookingData, isLoading: bookingLoading } = useBookingOverview();
  const { data: venuePerf, isLoading: venuePerfLoading } = useVenuePerformance();
  const { data: recentBookings, isLoading: bookingsLoading } = useRecentBookings();

  const isLoading = metricsLoading || revenueLoading || bookingLoading || venuePerfLoading || bookingsLoading;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  const kpis = [
    { title: "Total Revenue", value: `₹${metrics?.total_revenue.value.toLocaleString()}`, icon: IndianRupee, trend: `+${metrics?.total_revenue.trend}% vs previous month`, color: 'emerald', isUp: true },
    { title: 'Total Bookings', value: metrics?.total_bookings.total, icon: Calendar, trend: `${metrics?.total_bookings.completed} completed • ${metrics?.total_bookings.upcoming} upcoming`, color: 'blue', isUp: true },
    { title: 'Total Venues', value: metrics?.venues.total, icon: Users, trend: `${metrics?.venues.active} active • ${metrics?.venues.inactive} inactive`, color: 'indigo', isUp: true },
    { title: 'Occupancy Rate', value: `${metrics?.occupancy_rate.value}%`, icon: TrendingUp, trend: `+${metrics?.occupancy_rate.trend}% vs previous period`, color: 'purple', isUp: true },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Welcome back, Ayush! Here's your business overview.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-2">This Month</span>
            <ChevronDown size={14} className="text-slate-500" />
          </div>
          <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer relative">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">{stat.value}</p>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">{stat.title}</h3>
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1.5 rounded-lg inline-block w-fit">
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Revenue Overview</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Booking Overview</h2>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={12} />
                <Bar dataKey="Upcoming" stackId="a" fill="#6366f1" barSize={12} />
                <Bar dataKey="Cancelled" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Venue Performance Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Venue Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">Venue</th>
                  <th className="p-4">Bookings</th>
                  <th className="p-4">Revenue</th>
                  <th className="p-4">Occupancy</th>
                  <th className="p-4 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {venuePerf?.map((venue: VenuePerformance, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-900 dark:text-slate-100">{venue.venue_name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{venue.bookings}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">₹{venue.revenue.toLocaleString()}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{venue.occupancy}%</td>
                    <td className="p-4 pr-6">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        venue.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {venue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Bookings</h2>
            <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">Customer</th>
                  <th className="p-4">Venue & Time</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {recentBookings?.map((booking: Booking, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{booking.customer_name}</div>
                      <div className="text-xs text-slate-500">{booking.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{booking.venue_name} - {booking.court_name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{booking.booking_date} | {booking.start_time.slice(0,5)}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                      ₹{booking.amount}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          booking.booking_status === 'CONFIRMED' || booking.booking_status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : booking.booking_status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          {booking.booking_status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
