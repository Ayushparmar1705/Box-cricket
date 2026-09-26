import React from 'react';
import { 
  MapPin, CalendarDays, IndianRupee,
  ArrowUpRight, ArrowDownRight, Clock, MoreVertical,
  Activity, CheckCircle2, AlertCircle
} from 'lucide-react';


const SuperAdminDashboard: React.FC = () => {

  const stats = [
    { title: "Total Revenue", value: "₹4.2L", increase: "+18.2%", trend: "up", icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Active Venues", value: "42", increase: "+3", trend: "up", icon: MapPin, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Bookings Today", value: "1,248", increase: "+12.5%", trend: "up", icon: CalendarDays, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Cancellations", value: "12", increase: "-2.4%", trend: "down", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const recentBookings = [
    { id: "BK-8901", venue: "Drive-In Box Cricket", user: "Rahul Sharma", time: "18:00 - 20:00", amount: "₹2,400", status: "Confirmed", avatar: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=f3f4f6" },
    { id: "BK-8902", venue: "City Center Turf", user: "Vikram Singh", time: "19:00 - 21:00", amount: "₹3,000", status: "In Play", avatar: "https://ui-avatars.com/api/?name=Vikram+Singh&background=f3f4f6" },
    { id: "BK-8903", venue: "Neon Sports Arena", user: "Ananya Patel", time: "21:00 - 22:30", amount: "₹1,800", status: "Pending", avatar: "https://ui-avatars.com/api/?name=Ananya+Patel&background=f3f4f6" },
    { id: "BK-8904", venue: "Drive-In Box Cricket", user: "Karan Desai", time: "06:00 - 08:00", amount: "₹1,500", status: "Completed", avatar: "https://ui-avatars.com/api/?name=Karan+Desai&background=f3f4f6" },
    { id: "BK-8905", venue: "Skyline Turf", user: "Priya Kumar", time: "20:00 - 22:00", amount: "₹2,800", status: "Confirmed", avatar: "https://ui-avatars.com/api/?name=Priya+Kumar&background=f3f4f6" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-gray-50 to-white transition-transform group-hover:scale-150 duration-500 ease-out z-0"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} shadow-inner`}>
                  <stat.icon className={stat.color} size={22} />
                </div>
                <span className={`flex items-center text-sm font-semibold px-2 py-1 rounded-md ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                  {stat.increase}
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500">Weekly performance metrics</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none">
              <option className="bg-white">This Week</option>
              <option className="bg-white">Last Week</option>
              <option className="bg-white">This Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <div className="text-center">
              <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-gray-500">Revenue Chart</p>
              <p className="text-xs text-gray-400 mt-1">Data visualization is loading...</p>
            </div>
          </div>
        </div>

        {/* Quick Stats / Top Venues */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Performing Venues</h2>
          <div className="space-y-6">
            {[
              { name: "Drive-In Box Cricket", revenue: "₹1.2L", bookings: 142, progress: 85, color: "bg-emerald-500" },
              { name: "City Center Turf", revenue: "₹85k", bookings: 98, progress: 65, color: "bg-blue-500" },
              { name: "Neon Sports Arena", revenue: "₹64k", bookings: 76, progress: 45, color: "bg-indigo-500" },
              { name: "Skyline Turf", revenue: "₹42k", bookings: 45, progress: 30, color: "bg-purple-500" }
            ].map((venue, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">{venue.name}</span>
                  <span className="font-bold text-gray-900">{venue.revenue}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-1 overflow-hidden">
                  <div className={`${venue.color} h-2 rounded-full shadow-sm`} style={{ width: `${venue.progress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500">{venue.bookings} bookings this month</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
          <button className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-lg transition-colors border border-emerald-500/20">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Venue</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map((bk, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={bk.avatar} alt={bk.user} className="w-8 h-8 rounded-full border border-gray-200" />
                      <div>
                        <p className="font-semibold text-gray-900">{bk.user}</p>
                        <p className="text-xs text-gray-500">{bk.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{bk.venue}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={14} className="text-gray-400" />
                      {bk.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{bk.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                      ${bk.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
                        bk.status === 'In Play' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 
                        bk.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 
                        'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                      {bk.status === 'Confirmed' && <CheckCircle2 size={12} />}
                      {bk.status === 'In Play' && <Activity size={12} />}
                      {bk.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-emerald-500 transition-colors p-1 opacity-0 group-hover:opacity-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
