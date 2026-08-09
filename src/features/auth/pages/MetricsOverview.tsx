import React, { useState } from 'react';
import {
  MOCK_BOOKINGS,
  MOCK_VENUES,
  MOCK_USERS,
  MOCK_PAYMENTS,
} from '../../../data/mockData';
import { CreditCard, Calendar, Building2, Users, ArrowUpRight, ArrowDownRight, Activity, DollarSign, UserPlus, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { name: 'Jan', total: 120000 },
  { name: 'Feb', total: 150000 },
  { name: 'Mar', total: 180000 },
  { name: 'Apr', total: 220000 },
  { name: 'May', total: 280000 },
  { name: 'Jun', total: 310000 },
  { name: 'Jul', total: 380000 },
];

const bookingsData = [
  { name: 'Mon', count: 45 },
  { name: 'Tue', count: 52 },
  { name: 'Wed', count: 38 },
  { name: 'Thu', count: 65 },
  { name: 'Fri', count: 88 },
  { name: 'Sat', count: 110 },
  { name: 'Sun', count: 105 },
];

export const MetricsOverview: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const totalRevenue = MOCK_PAYMENTS.reduce((sum: number, p) => sum + (p.paymentStatus === 'SUCCESS' ? p.amount : 0), 0);
  const totalBookings = MOCK_BOOKINGS.length;
  const activeVenues = MOCK_VENUES.filter((v) => v.status === 'ACTIVE').length;
  const totalPlayers = MOCK_USERS.filter((u) => u.role === 'PLAYER').length;

  const kpis = [
    { 
      title: 'Total Revenue', 
      value: `₹${totalRevenue.toLocaleString('en-IN')}`, 
      icon: DollarSign, 
      trend: '+12.5%', 
      isPositive: true,
      compare: 'vs last month' 
    },
    { 
      title: 'Active Bookings', 
      value: totalBookings.toString(), 
      icon: Calendar, 
      trend: '+18.2%', 
      isPositive: true,
      compare: 'vs last month' 
    },
    { 
      title: 'Total Players', 
      value: totalPlayers.toString(), 
      icon: Users, 
      trend: '+4.3%', 
      isPositive: true,
      compare: 'vs last month' 
    },
    { 
      title: 'Active Venues', 
      value: activeVenues.toString(), 
      icon: Building2, 
      trend: '-1.2%', 
      isPositive: false,
      compare: 'vs last month' 
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg p-1 shadow-sm">
          {['24h', '7d', '30d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                timeRange === range 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                  <Icon size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  kpi.isPositive 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>
                  {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.trend}
                </div>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{kpi.title}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{kpi.value}</h2>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{kpi.compare}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Revenue Overview</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monthly recurring revenue growth</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6', fontSize: '12px', padding: '10px' }}
                  itemStyle={{ color: '#818cf8', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Bookings Chart */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Weekly Bookings</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bookings by day of week</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#374151', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Recent Activity</h3>
          <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">View All</button>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex flex-shrink-0 items-center justify-center text-blue-600 dark:text-blue-400">
               <UserPlus size={18} />
             </div>
             <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-200 font-medium">New User Registration</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Arjun Mehta joined the platform</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><Clock size={12}/> 5 mins ago</span>
             </div>
          </div>
          
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400">
               <CreditCard size={18} />
             </div>
             <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-200 font-medium">Payment Received</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">₹1,500 for booking at Metro Sports Arena</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><Clock size={12}/> 12 mins ago</span>
             </div>
          </div>
          
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-500/10 flex flex-shrink-0 items-center justify-center text-rose-600 dark:text-rose-400">
               <Activity size={18} />
             </div>
             <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-200 font-medium">Venue Approval Pending</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Skyline Turf has submitted KYC documents</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><Clock size={12}/> 2 hours ago</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

