import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Layers,
  DollarSign,
  User,
  LogOut,
  Plus,
  Search,
  Check,
  X,
  Phone,
  BadgeCheck,
  TrendingUp,
  Zap,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Menu,
  Tag,
  Info,
  Sparkles,
  Calculator
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
import toast from 'react-hot-toast';
import { logoutUser, type UserProfile } from '../services/authService';
import {
  fetchMyVenuesApi,
  type VenueItem
} from '../services/venueService';
import VenueManager from './VenueManager';

interface Turf {
  id: string;
  name: string;
  city: string;
  location: string;
  surface: string;
  hourlyRate: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'CLOSED';
  amenities: string[];
  openTime: string;
  closeTime: string;
  totalBookings: number;
  rating: number;
  courtsCount: number;
}

interface Booking {
  id: string;
  playerName: string;
  playerPhone: string;
  turfName: string;
  date: string;
  timeSlot: string;
  amount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

interface Court {
  id: string;
  turfId: string;
  turfName: string;
  courtNumber: string;
  surfaceType: string;
  floodlights: boolean;
  dimensions: string;
  status: 'ACTIVE' | 'MAINTENANCE';
}

interface PricingRule {
  id: string;
  name: string;
  type: 'PEAK_HOUR' | 'WEEKEND' | 'LONG_BOOKING' | 'NIGHT_SURCHARGE';
  condition: string;
  adjustmentType: 'PERCENT' | 'FLAT';
  value: number;
  isActive: boolean;
}

const INITIAL_TURFS: Turf[] = [];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-9041',
    playerName: 'Rohit Verma',
    playerPhone: '+91 98765 43210',
    turfName: 'Apex Arena Court A (Floodlit)',
    date: 'Today',
    timeSlot: '08:00 PM - 09:00 PM',
    amount: 1500,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
  },
  {
    id: 'BK-9042',
    playerName: 'Hardik Patel',
    playerPhone: '+91 98123 45678',
    turfName: 'Champions Cricket Turf B',
    date: 'Today',
    timeSlot: '09:00 PM - 10:00 PM',
    amount: 1200,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
  },
  {
    id: 'BK-9043',
    playerName: 'Kunal Shah',
    playerPhone: '+91 97234 56789',
    turfName: 'Apex Arena Court A (Floodlit)',
    date: 'Tomorrow',
    timeSlot: '07:00 PM - 08:00 PM',
    amount: 1500,
    paymentStatus: 'PENDING',
    bookingStatus: 'PENDING',
  },
  {
    id: 'BK-9044',
    playerName: 'Amit Sharma',
    playerPhone: '+91 96345 67890',
    turfName: 'Royal Box Cricket Ground',
    date: '12 Oct 2026',
    timeSlot: '06:00 PM - 07:00 PM',
    amount: 1400,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
  },
  {
    id: 'BK-9045',
    playerName: 'Vikram Joshi',
    playerPhone: '+91 99887 76655',
    turfName: 'Skyline Turf Arena #2',
    date: 'Tomorrow',
    timeSlot: '09:00 PM - 10:00 PM',
    amount: 1600,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
  },
  {
    id: 'BK-9046',
    playerName: 'Sameer Khan',
    playerPhone: '+91 91234 56780',
    turfName: 'Apex Arena Court A (Floodlit)',
    date: '14 Oct 2026',
    timeSlot: '07:00 PM - 08:00 PM',
    amount: 1500,
    paymentStatus: 'PENDING',
    bookingStatus: 'CANCELLED',
  },
];

const INITIAL_COURTS: Court[] = [
  {
    id: 'crt-1',
    turfId: 'turf-1',
    turfName: 'Apex Arena Court A',
    courtNumber: 'Court #1 (Night Arena)',
    surfaceType: 'High-Density Synthetic Turf',
    floodlights: true,
    dimensions: '100ft x 60ft x 25ft height',
    status: 'ACTIVE',
  },
  {
    id: 'crt-2',
    turfId: 'turf-1',
    turfName: 'Apex Arena Court B',
    courtNumber: 'Court #2 (Day & Night Arena)',
    surfaceType: 'Pro Cushion Turf Grass',
    floodlights: true,
    dimensions: '90ft x 55ft x 22ft height',
    status: 'ACTIVE',
  },
  {
    id: 'crt-3',
    turfId: 'turf-2',
    turfName: 'Champions Cricket Turf',
    courtNumber: 'Main Stadium Court',
    surfaceType: 'Rubber Infill Astroturf',
    floodlights: true,
    dimensions: '110ft x 65ft x 28ft height',
    status: 'ACTIVE',
  },
];

const INITIAL_PRICING_RULES: PricingRule[] = [
  {
    id: 'pr-1',
    name: 'Night Floodlight Surcharge',
    type: 'NIGHT_SURCHARGE',
    condition: 'Bookings between 07:00 PM - 12:00 AM',
    adjustmentType: 'FLAT',
    value: 300,
    isActive: true,
  },
  {
    id: 'pr-2',
    name: 'Weekend Prime Hours',
    type: 'WEEKEND',
    condition: 'Saturday & Sunday All Day',
    adjustmentType: 'PERCENT',
    value: 20,
    isActive: true,
  },
  {
    id: 'pr-3',
    name: 'Long Match Discount (3+ Hours)',
    type: 'LONG_BOOKING',
    condition: 'Continuous slot booking >= 3 Hours',
    adjustmentType: 'PERCENT',
    value: -10,
    isActive: true,
  },
];

const WEEKLY_ANALYTICS_DATA = [
  { day: 'Mon', revenue: 8400, slots: 6 },
  { day: 'Tue', revenue: 11200, slots: 8 },
  { day: 'Wed', revenue: 9800, slots: 7 },
  { day: 'Thu', revenue: 14500, slots: 10 },
  { day: 'Fri', revenue: 21000, slots: 14 },
  { day: 'Sat', revenue: 32500, slots: 21 },
  { day: 'Sun', revenue: 38900, slots: 25 },
];

type SidebarTab = 'dashboard' | 'venues' | 'slot' | 'courts' | 'pricing' | 'settings';

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  // Determine tab from current URL route
  const getTabFromPath = (pathname: string): SidebarTab => {
    const p = pathname.toLowerCase();
    if (p.includes('venue')) return 'venues';
    if (p.includes('slot')) return 'slot';
    if (p.includes('court')) return 'courts';
    if (p.includes('pricing')) return 'pricing';
    if (p.includes('setting')) return 'settings';
    return 'dashboard';
  };

  // Active Sidebar Navigation Tab
  const [activeTab, setActiveTab] = useState<SidebarTab>(() => getTabFromPath(location.pathname));
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sync activeTab whenever URL route changes
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // Core Data States
  const [turfs] = useState<Turf[]>(INITIAL_TURFS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);

  // Filters & Search State
  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Venue State
  const [showAddCourtModal, setShowAddCourtModal] = useState(false);
  const [apiVenues, setApiVenues] = useState<VenueItem[]>([]);

  // Calculator State for Pricing tab
  const [calcBaseRate, setCalcBaseRate] = useState<number>(1500);
  const [calcHours, setCalcHours] = useState<number>(2);
  const [calcIsWeekend, setCalcIsWeekend] = useState<boolean>(true);
  const [calcIsNight, setCalcIsNight] = useState<boolean>(true);

  // New Court Form State
  const [newCourt, setNewCourt] = useState({
    turfId: 'turf-1',
    courtNumber: '',
    surfaceType: 'Pro Synthetic Turf',
    dimensions: '100ft x 60ft x 25ft',
    floodlights: true,
  });

  // Load Owner's Venues
  const loadOwnerVenues = async () => {
    try {
      const data = await fetchMyVenuesApi();
      const list = Array.isArray(data) ? data : (data?.data || []);
      setApiVenues(list);
    } catch {
      setApiVenues([]);
    }
  };

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user_profile') || localStorage.getItem('user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        setUser(parsed);
      }
      const rawRoles = localStorage.getItem('roles');
      if (rawRoles) {
        setRoles(JSON.parse(rawRoles));
      }
    } catch {
      // ignore
    }

    loadOwnerVenues();
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/player-login');
  };

  const handleRoleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target.value;
    if (target === 'player') {
      toast.success('Switching to Player Portal...');
      navigate('/player-dashboard');
    } else if (target === 'profile') {
      navigate('/player-profile');
    } else if (target === 'admin') {
      navigate('/admindashboard');
    }
  };



  const handleCreateCourt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourt.courtNumber.trim()) return toast.error('Please enter Court Number / Designation');

    const created: Court = {
      id: `crt-${Date.now()}`,
      turfId: newCourt.turfId,
      turfName: turfs.find(t => t.id === newCourt.turfId)?.name || 'Apex Arena Court',
      courtNumber: newCourt.courtNumber,
      surfaceType: newCourt.surfaceType,
      floodlights: newCourt.floodlights,
      dimensions: newCourt.dimensions || '100ft x 60ft x 25ft',
      status: 'ACTIVE',
    };

    setCourts(prev => [created, ...prev]);
    toast.success(`🎉 ${newCourt.courtNumber} added to arena!`);
    setShowAddCourtModal(false);
    setNewCourt({
      turfId: turfs[0]?.id || 'turf-1',
      courtNumber: '',
      surfaceType: 'Pro Synthetic Turf',
      dimensions: '100ft x 60ft x 25ft',
      floodlights: true,
    });
  };

  const handleToggleRuleStatus = (id: string) => {
    setPricingRules(prev =>
      prev.map(r => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    toast.success('Pricing rule updated');
  };

  const handleUpdateBookingStatus = (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, bookingStatus: status, paymentStatus: status === 'CONFIRMED' ? 'PAID' : b.paymentStatus } : b))
    );
    toast.success(`Booking ${id} ${status.toLowerCase()}`);
  };

  const ownerName = user?.username || 'Turf Owner';
  const ownerEmail = user?.email || 'owner@boxcricket.com';

  const totalTurfs = apiVenues.length;
  const activeTurfs = apiVenues.filter(v => v.is_active !== false).length;
  const totalRevenue = bookings.reduce((sum, b) => (b.paymentStatus === 'PAID' ? sum + b.amount : sum), 0) + 145000;
  const totalBookingsCount = bookings.length + 172;

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesFilter = bookingFilter === 'ALL' || b.bookingStatus === bookingFilter;
      const matchesSearch =
        b.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.turfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.playerPhone.includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  }, [bookings, bookingFilter, searchTerm]);

  // Calculate pricing simulator result
  const calculatedEstimatedPrice = useMemo(() => {
    let subtotal = calcBaseRate * calcHours;
    let surcharge = 0;
    if (calcIsNight) surcharge += 300 * calcHours;
    if (calcIsWeekend) surcharge += subtotal * 0.20;
    if (calcHours >= 3) surcharge -= subtotal * 0.10;
    return Math.max(0, Math.round(subtotal + surcharge));
  }, [calcBaseRate, calcHours, calcIsWeekend, calcIsNight]);

  const navItems: { id: SidebarTab; label: string; icon: React.FC<{ className?: string }>; path: string; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/owner-dashboard' },
    { id: 'venues', label: 'Venues & Grounds', icon: Building2, path: '/owner-venues', count: apiVenues.length },
    { id: 'slot', label: 'Slot Bookings', icon: Calendar, path: '/owner-slots', count: bookings.filter(b => b.bookingStatus === 'PENDING').length },
    { id: 'courts', label: 'Courts & Arena', icon: Layers, path: '/owner-courts', count: courts.length },
    { id: 'pricing', label: 'Pricing Rules', icon: DollarSign, path: '/owner-pricing' },
    { id: 'settings', label: 'Owner Profile', icon: User, path: '/player-profile' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden antialiased">
      {/* ── Soft Ambient Glows (White Theme) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[25%] w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-[140px]" />
      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🧭 LEFT SIDEBAR NAVIGATION (WHITE LAYOUT)                     */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 shadow-sm flex flex-col justify-between transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-6 space-y-7">
          {/* Brand Logo & Tag */}
          <div className="flex items-center justify-between">
            <Link to="/owner-dashboard" className="flex items-center gap-3 group">
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
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Management
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isActive
                          ? 'bg-emerald-200/80 text-emerald-900'
                          : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Partner Support Card */}
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

        {/* Sidebar Footer User Info */}
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

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 💻 MAIN CONTENT AREA (WHITE LAYOUT)                           */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top Header Bar (White Layout) ── */}
        <header className="relative z-20 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 capitalize">
                  {navItems.find(n => n.id === activeTab)?.label}
                </h1>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">Owner Operations</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Box Cricket Partner Portal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action button */}
            <button
              onClick={() => {
                setActiveTab('venues');
                navigate('/owner-venues');
              }}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hidden md:flex"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Venue</span>
            </button>

            {/* Role Switcher Select Dropdown */}
            <select
              value="owner"
              onChange={handleRoleSwitch}
              className="bg-white text-emerald-800 border border-emerald-300 hover:border-emerald-400 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
            >
              <option value="owner">Role: Turf Owner 🏏</option>
              <option value="player">Switch to Player Portal</option>
              <option value="profile">Profile Settings</option>
              {(roles.includes('SUPERADMIN') || roles.includes('ADMIN')) && (
                <option value="admin">Super Admin Panel</option>
              )}
            </select>

            <Link
              to="/player-profile"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold shadow-xs flex items-center justify-center"
              title="Profile Settings"
            >
              <User className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </header>

        {/* ── Main Body Container ── */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 1: DASHBOARD OVERVIEW                                      */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-emerald-100/60 to-amber-100/40 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      <span>BOX CRICKET OWNER COMMAND CENTER</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Welcome back,{' '}
                      <span className="text-emerald-700">
                        {ownerName}
                      </span>{' '}
                      🏏
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                      Track your box cricket arena performance, inspect night floodlight slot bookings, manage court surface specifications, and adjust surge pricing rules.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    <button
                      onClick={() => {
                        setActiveTab('venues');
                        navigate('/owner-venues');
                      }}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Manage Venues</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('slot');
                        navigate('/owner-slots');
                      }}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>View Slots</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Key KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-emerald-200 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Venues</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalTurfs}</span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <Check className="w-3 h-3" />
                      {activeTurfs} Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Registered box cricket grounds</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-blue-200 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slot Bookings</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalBookingsCount}</span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <TrendingUp className="w-3 h-3" />
                      +18% growth
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Night & day slot reservations</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-amber-200 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Revenue</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Gross player slot fees collected</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-purple-200 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Courts & Lighting</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{courts.length}</span>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Floodlit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Courts across all box venues</p>
                </div>
              </div>

              {/* Weekly Analytics Chart & Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Revenue & Slot Trends Chart */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span>Weekly Slot Revenue & Booking Trends</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Daily player footfall and gross ticket sales across your arenas
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Revenue (₹)
                      </span>
                    </div>
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
                      <div className="text-[11px] text-slate-500 font-medium">Average Slot Rate</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">₹1,450 / hr</div>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts & Arena Status */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Turf Operations Status</span>
                    </h3>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-emerald-900">Floodlights System</div>
                          <div className="text-[11px] text-emerald-700">Night LED illumination ready</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                          Active
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-800">Booking Engine</div>
                          <div className="text-[11px] text-slate-500">Live slot sync on port 3040</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Operational
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100/80 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-amber-900">Surge Pricing Rules</div>
                          <div className="text-[11px] text-amber-700">{pricingRules.filter(r => r.isActive).length} rules currently active</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                          Applied
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => {
                        setActiveTab('slot');
                        navigate('/owner-slots');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>Check Today's Reservations</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('pricing');
                        navigate('/owner-pricing');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>Simulate Slot Pricing</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Quick Table */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Recent Slot Bookings</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Latest player reservations across all arenas</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('slot');
                      navigate('/owner-slots');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                  >
                    <span>View All Slots</span>
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
                      {bookings.slice(0, 4).map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono">{b.id}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{b.playerName}</td>
                          <td className="py-3.5 px-4 text-slate-600">{b.turfName}</td>
                          <td className="py-3.5 px-4 text-slate-700 font-semibold">{b.timeSlot}</td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{b.amount}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${b.bookingStatus === 'CONFIRMED'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                            >
                              {b.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 2: VENUES MANAGEMENT                                       */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'venues' && (
            <VenueManager onVenuesUpdated={loadOwnerVenues} />
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 3: SLOT BOOKINGS MANAGEMENT                                */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'slot' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span>Slot Bookings & Match Schedule</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live slot reservations, player confirmations, and payment tracking.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search player, phone, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 w-48 sm:w-64 shadow-xs"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs">
                    {(['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setBookingFilter(st)}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${bookingFilter === st
                            ? 'bg-emerald-600 text-white font-bold shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slot Summary Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Total Bookings</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{bookings.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                  <div className="text-[11px] font-bold text-emerald-600 uppercase">Confirmed Matches</div>
                  <div className="text-xl font-extrabold text-emerald-700 mt-1">
                    {bookings.filter(b => b.bookingStatus === 'CONFIRMED').length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                  <div className="text-[11px] font-bold text-amber-600 uppercase">Pending Confirmation</div>
                  <div className="text-xl font-extrabold text-amber-700 mt-1">
                    {bookings.filter(b => b.bookingStatus === 'PENDING').length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Expected Revenue</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">
                    ₹{bookings.reduce((sum, b) => (b.bookingStatus !== 'CANCELLED' ? sum + b.amount : sum), 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Bookings Table (White Layout) */}
              <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-4 px-6">Booking ID</th>
                        <th className="py-4 px-6">Player Details</th>
                        <th className="py-4 px-6">Venue Ground</th>
                        <th className="py-4 px-6">Date & Slot</th>
                        <th className="py-4 px-6">Amount</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-400">
                            No slot bookings found matching filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map(b => (
                          <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-6 font-bold text-emerald-700 font-mono">{b.id}</td>
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-900">{b.playerName}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {b.playerPhone}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-slate-700 font-semibold">{b.turfName}</td>
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-800">{b.date}</div>
                              <div className="text-[11px] text-emerald-700 font-medium">{b.timeSlot}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-extrabold text-slate-900">₹{b.amount}</div>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${b.paymentStatus === 'PAID'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                                  }`}
                              >
                                {b.paymentStatus}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${b.bookingStatus === 'CONFIRMED'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : b.bookingStatus === 'PENDING'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}
                              >
                                {b.bookingStatus}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-2">
                              {b.bookingStatus === 'PENDING' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Confirm</span>
                                </button>
                              )}
                              {b.bookingStatus !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'CANCELLED')}
                                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 font-semibold text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Cancel</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 4: COURTS MANAGEMENT                                       */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'courts' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    <span>Courts & Ground Specifications ({courts.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Individual court layout specifications, floodlight lighting setup, and turf surfaces.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCourtModal(true)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Court</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courts.map(crt => (
                  <div
                    key={crt.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900">{crt.courtNumber}</h3>
                          <p className="text-xs text-slate-500">{crt.turfName}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${crt.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                      >
                        {crt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Surface Material</span>
                        <span className="text-slate-800 font-semibold block text-xs">{crt.surfaceType}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Floodlights</span>
                        <span className="text-amber-700 font-bold flex items-center gap-1 text-xs">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          {crt.floodlights ? 'LED Floodlit' : 'Daylight Only'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between text-slate-500">
                      <span>Boundary Dimensions:</span>
                      <span className="font-mono text-slate-800 font-bold">{crt.dimensions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 5: PRICING RULE MANAGEMENT                                 */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'pricing' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span>Dynamic Hourly Pricing & Surcharge Rules</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automate surge pricing for night floodlights, weekend peaks, and long match discounts.
                  </p>
                </div>
              </div>

              {/* Rules Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingRules.map(rule => (
                  <div
                    key={rule.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between hover:border-emerald-200 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center font-bold">
                          <Tag className="w-4 h-4" />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule.isActive}
                            onChange={() => handleToggleRuleStatus(rule.id)}
                            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 accent-emerald-600 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-700">
                            {rule.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </label>
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">{rule.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{rule.condition}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Adjustment Rate</span>
                        <span className="text-sm font-extrabold text-emerald-700">
                          {rule.adjustmentType === 'FLAT' ? `+₹${rule.value}` : `${rule.value > 0 ? '+' : ''}${rule.value}%`}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Applied automatically during player checkout</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Live Price Calculator Simulator */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Live Slot Price Estimator</h3>
                      <p className="text-xs text-slate-500">Test how active surge rules calculate final player fees</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Simulator
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Base Rate per Hour (₹)</label>
                    <input
                      type="number"
                      value={calcBaseRate}
                      onChange={(e) => setCalcBaseRate(Number(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Duration (Hours)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={calcHours}
                      onChange={(e) => setCalcHours(Number(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Weekend Prime Slot?</label>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        checked={calcIsWeekend}
                        onChange={(e) => setCalcIsWeekend(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500/20 accent-emerald-600"
                      />
                      <span className="text-xs text-slate-600 font-semibold">Saturday / Sunday (+20%)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Night Floodlight Slot?</label>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        checked={calcIsNight}
                        onChange={(e) => setCalcIsNight(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500/20 accent-emerald-600"
                      />
                      <span className="text-xs text-slate-600 font-semibold">After 07:00 PM (+₹300/hr)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Estimated Match Price</span>
                    <span className="text-2xl font-extrabold text-slate-900">₹{calculatedEstimatedPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Base: ₹{(calcBaseRate * calcHours).toLocaleString()} • Adjustments: ₹{(calculatedEstimatedPrice - (calcBaseRate * calcHours)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 6: PROFILE SETTINGS                                        */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>Owner Account & Verification Settings</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Business registration, contact details, and document verification vault.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Owner Business Profile</h3>
                      <p className="text-xs text-slate-500">Official details registered on BoxCricket Arena</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Business Owner Name</span>
                      <span className="text-slate-900 font-bold text-sm block">{ownerName}</span>
                    </div>

                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Official Contact Email</span>
                      <span className="text-slate-900 font-bold text-sm block">{ownerEmail}</span>
                    </div>

                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Business Type</span>
                      <span className="text-slate-900 font-bold text-sm block">Turf Owner (Solo / Partnership)</span>
                    </div>

                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Document Verification</span>
                      <span className="text-emerald-700 font-bold text-sm block flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Aadhaar & PAN Approved
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Link
                      to="/player-profile"
                      className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all flex items-center gap-2"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Edit Full Profile & Re-upload Documents</span>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Owner Support & Assistance</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Need help configuring surge pricing rules or adding new ground locations? Reach out to BoxCricket Partner Care.
                  </p>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <div className="text-slate-700 font-bold">Partner Desk Hotline</div>
                    <div className="text-emerald-700 font-bold text-sm">+91 1800 420 6969</div>
                    <div className="text-slate-400 text-[11px]">Mon - Sat • 09:00 AM - 08:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🚀 MODALS (WHITE LAYOUT)                                      */}
      {/* ═════════════════════════════════════════════════════════════ */}



      {/* ── Add New Court Modal (White Layout) ── */}
      {showAddCourtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Court Ground</h3>
                  <p className="text-xs text-slate-500">Configure court designation and surface specs</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCourtModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-50 border border-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourt} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Select Parent Turf Venue</label>
                <select
                  value={newCourt.turfId}
                  onChange={(e) => setNewCourt({ ...newCourt, turfId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {turfs.length > 0 ? (
                    turfs.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                    ))
                  ) : (
                    <option value="turf-1">Main Arena Ground</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Court Designation / Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Court #3 (Floodlit Arena)"
                  value={newCourt.courtNumber}
                  onChange={(e) => setNewCourt({ ...newCourt, courtNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Surface Type</label>
                  <select
                    value={newCourt.surfaceType}
                    onChange={(e) => setNewCourt({ ...newCourt, surfaceType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Pro Synthetic Turf">Pro Synthetic Turf</option>
                    <option value="Ultra Cushion Grass">Ultra Cushion Grass</option>
                    <option value="Heavy Duty Mat">Heavy Duty Mat</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Dimensions</label>
                  <input
                    type="text"
                    placeholder="100ft x 60ft x 25ft"
                    value={newCourt.dimensions}
                    onChange={(e) => setNewCourt({ ...newCourt, dimensions: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourtModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Add Court
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default OwnerDashboard;
