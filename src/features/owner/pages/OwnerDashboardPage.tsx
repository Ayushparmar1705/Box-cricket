import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, Layers, CalendarDays, Calendar, 
  IndianRupee, TrendingUp, PieChart, Users, UserCog, Bell, 
  User, Settings, HelpCircle, LogOut 
} from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/user-auth');
  };

  const navGroups = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
        { name: 'Venues', path: '/owner/venues', icon: MapPin },
        { name: 'Courts', path: '/owner/courts', icon: Layers },
        { name: 'Bookings', path: '/owner/bookings', icon: CalendarDays },
        { name: 'Calendar', path: '/owner/calendar', icon: Calendar },
      ]
    },
    {
      title: 'Business',
      items: [
        { name: 'Pricing', path: '/owner/pricing', icon: IndianRupee },
        { name: 'Revenue', path: '/owner/revenue', icon: TrendingUp },
        { name: 'Analytics', path: '/owner/analytics', icon: PieChart },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Customers', path: '/owner/customers', icon: Users },
        { name: 'Staff', path: '/owner/staff', icon: UserCog },
        { name: 'Notifications', path: '/owner/notifications', icon: Bell },
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'Profile', path: '/owner/profile', icon: User },
        { name: 'Settings', path: '/owner/settings', icon: Settings },
        { name: 'Help & Support', path: '/owner/support', icon: HelpCircle },
      ]
    }
  ];

  const mobileNavItems = navGroups[0].items.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 overflow-y-auto z-40">
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-extrabold text-white shadow-sm">
            OW
          </div>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-lg tracking-tight">Owner Portal</span>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-3">{group.title}</h3>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = location.pathname.includes(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : ''} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile / Tablet Header */}
        <header className="lg:hidden h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-extrabold text-white shadow-sm">
              OW
            </div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-lg tracking-tight">Owner Portal</span>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-rose-600 transition">
            <LogOut size={20} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 z-50 pb-safe">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
