import React, { useState } from 'react';
import {
  MapPin,
  CalendarDays,
  IndianRupee,
  ArrowUpRight,
  Clock,
  Activity,
  CheckCircle2,
  Users,
  TrendingUp,
  Flame,
  Globe2,
  Building2,
  Sparkles,
  ChevronRight,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Link } from 'react-router-dom';

const REVENUE_DATA_WEEKLY = [
  { name: 'Mon', revenue: 38000, bookings: 78 },
  { name: 'Tue', revenue: 42000, bookings: 86 },
  { name: 'Wed', revenue: 49000, bookings: 102 },
  { name: 'Thu', revenue: 54000, bookings: 115 },
  { name: 'Fri', revenue: 78000, bookings: 168 },
  { name: 'Sat', revenue: 95000, bookings: 210 },
  { name: 'Sun', revenue: 88000, bookings: 195 }
];

const REVENUE_DATA_MONTHLY = [
  { name: 'Week 1', revenue: 260000, bookings: 580 },
  { name: 'Week 2', revenue: 310000, bookings: 690 },
  { name: 'Week 3', revenue: 395000, bookings: 880 },
  { name: 'Week 4', revenue: 420000, bookings: 940 }
];

const HOURLY_PEAK_DATA = [
  { time: '06:00', slots: 18, peak: false },
  { time: '08:00', slots: 26, peak: false },
  { time: '10:00', slots: 14, peak: false },
  { time: '14:00', slots: 12, peak: false },
  { time: '16:00', slots: 32, peak: false },
  { time: '18:00', slots: 68, peak: true },
  { time: '20:00', slots: 84, peak: true },
  { time: '22:00', slots: 76, peak: true },
  { time: '00:00', slots: 42, peak: false }
];

const VENUE_SHARE_DATA = [
  { name: 'Drive-In Box Cricket', value: 38, color: '#10b981' },
  { name: 'City Center Turf', value: 26, color: '#06b6d4' },
  { name: 'Neon Sports Arena', value: 20, color: '#8b5cf6' },
  { name: 'Skyline Turf', value: 16, color: '#f59e0b' }
];

const SuperAdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹4.24 Lakh',
      increase: '+18.4%',
      trend: 'up',
      subtitle: 'vs. last month',
      icon: IndianRupee,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border border-emerald-500/20'
    },
    {
      title: 'Active Venues',
      value: '42 Courts',
      increase: '+4 New',
      trend: 'up',
      subtitle: 'Across 8 Cities',
      icon: MapPin,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border border-cyan-500/20'
    },
    {
      title: 'Bookings Today',
      value: '1,248 Slots',
      increase: '+14.2%',
      trend: 'up',
      subtitle: '89% Utilization',
      icon: CalendarDays,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border border-teal-500/20'
    },
    {
      title: 'Active Turf Players',
      value: '18.6k Users',
      increase: '+22.1%',
      trend: 'up',
      subtitle: '94% Repeat Rate',
      icon: Users,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border border-amber-500/20'
    }
  ];

  const recentBookings = [
    {
      id: 'BK-8901',
      venue: 'Drive-In Box Cricket Arena',
      user: 'Rahul Sharma',
      time: 'Today, 18:00 - 20:00',
      amount: '₹2,400',
      status: 'In Play',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=10b981&color=090d16'
    },
    {
      id: 'BK-8902',
      venue: 'City Center Floodlit Turf',
      user: 'Vikram Singh',
      time: 'Today, 19:00 - 21:00',
      amount: '₹3,000',
      status: 'Confirmed',
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=06b6d4&color=090d16'
    },
    {
      id: 'BK-8903',
      venue: 'Neon Night Sports Turf',
      user: 'Ananya Patel',
      time: 'Today, 21:00 - 22:30',
      amount: '₹1,800',
      status: 'Pending',
      avatar: 'https://ui-avatars.com/api/?name=Ananya+Patel&background=8b5cf6&color=090d16'
    },
    {
      id: 'BK-8904',
      venue: 'Drive-In Box Cricket Arena',
      user: 'Karan Desai',
      time: 'Today, 06:00 - 08:00',
      amount: '₹1,500',
      status: 'Completed',
      avatar: 'https://ui-avatars.com/api/?name=Karan+Desai&background=64748b&color=090d16'
    },
    {
      id: 'BK-8905',
      venue: 'Skyline Rooftop Turf',
      user: 'Priya Kumar',
      time: 'Today, 20:00 - 22:00',
      amount: '₹2,800',
      status: 'Confirmed',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Kumar&background=ec4899&color=090d16'
    }
  ];

  const quickLinks = [
    { name: 'Owner Requests', path: '/owner-requests', icon: FileText, count: 'New' },
    { name: 'Countries', path: '/countries', icon: Globe2, count: '10+' },
    { name: 'States', path: '/states', icon: Building2, count: '28+' },
    { name: 'Cities', path: '/cities', icon: MapPin, count: '64+' }
  ];

  return (
    <div className="space-y-7 text-white pb-12">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-[#0d1322] border border-slate-800 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="w-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles size={13} className="text-emerald-400" />
              Box Cricket Operations Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Super Admin Analytics & Control
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time telemetry across court reservations, peak slot density, revenue analytics, and regional operations.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex-1 sm:flex-initial bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3 px-4 transition-all hover:scale-105 active:scale-95 group"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={17} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      {item.name}
                      <ChevronRight size={12} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{item.count} Active</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#0d1322] rounded-2xl p-6 border border-slate-800 shadow-lg relative group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-sm group-hover:scale-105 transition-transform`}>
                <stat.icon size={22} strokeWidth={2.2} />
              </div>
              <span className="flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ArrowUpRight size={13} className="mr-0.5" />
                {stat.increase}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </h3>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs font-bold text-slate-300">{stat.title}</p>
                <span className="text-[11px] font-medium text-slate-500">{stat.subtitle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-[#0d1322] rounded-2xl border border-slate-800 shadow-lg p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" />
                Revenue & Booking Trajectory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time financial yield across all operating courts</p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${timeRange === 'week' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Weekly View
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${timeRange === 'month' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Monthly View
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeRange === 'week' ? REVENUE_DATA_WEEKLY : REVENUE_DATA_MONTHLY}>
                <defs>
                  <linearGradient id="emeraldDarkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#0d1322',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldDarkGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 mt-2 border-t border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Avg Daily Yield</span>
              <span className="font-extrabold text-white">₹64,500</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Peak Day</span>
              <span className="font-extrabold text-emerald-400">₹95,000 (Sat)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Slot Fill Rate</span>
              <span className="font-extrabold text-white">92.4%</span>
            </div>
          </div>
        </div>

        {/* Peak Hours Occupancy */}
        <div className="bg-[#0d1322] rounded-2xl border border-slate-800 shadow-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <Flame size={18} className="text-amber-400" />
                Peak Hour Occupancy
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Night Rush
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Slot reservation density by time of day</p>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOURLY_PEAK_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val} Slots Booked`, 'Volume']}
                    contentStyle={{
                      backgroundColor: '#0d1322',
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="slots" radius={[5, 5, 0, 0]}>
                    {HOURLY_PEAK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.peak ? '#10b981' : '#334155'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-300 font-medium flex items-center gap-2">
            <Activity size={15} className="text-emerald-400 shrink-0" />
            <span>Prime Hours: <strong>6:00 PM – 11:30 PM</strong> (96% booked)</span>
          </div>
        </div>
      </div>

      {/* Top Venues & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Venues Revenue Share */}
        <div className="bg-[#0d1322] rounded-2xl border border-slate-800 shadow-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-white">Top Revenue Venues</h2>
              <span className="text-xs text-slate-500 font-semibold">Share %</span>
            </div>

            <div className="h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={VENUE_SHARE_DATA}
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {VENUE_SHARE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val}% Share`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#0d1322',
                      borderRadius: '10px',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 pt-2">
              {VENUE_SHARE_DATA.map((venue, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: venue.color }} />
                    <span className="font-semibold text-slate-300">{venue.name}</span>
                  </div>
                  <span className="font-extrabold text-white">{venue.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Recent Bookings Table */}
        <div className="lg:col-span-2 bg-[#0d1322] rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-[#090e1a]">
              <div>
                <h2 className="text-base font-extrabold text-white">Recent Turf Bookings</h2>
                <p className="text-xs text-slate-400">Live booking telemetry feed</p>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-1.5 rounded-xl transition-colors border border-emerald-500/30 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090e1a] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Venue</th>
                    <th className="px-5 py-3.5">Slot Time</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentBookings.map((bk, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={bk.avatar}
                            alt={bk.user}
                            className="w-8 h-8 rounded-full border border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white">{bk.user}</p>
                            <p className="text-[10px] text-slate-500">{bk.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-300">{bk.venue}</td>
                      <td className="px-5 py-3.5 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-500" />
                          <span>{bk.time}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-emerald-400">{bk.amount}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${bk.status === 'Confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : bk.status === 'In Play'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : bk.status === 'Pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                        >
                          {bk.status === 'Confirmed' && <CheckCircle2 size={11} />}
                          {bk.status === 'In Play' && <Activity size={11} className="animate-pulse" />}
                          {bk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
