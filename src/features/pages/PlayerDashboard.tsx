import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Building2,
  Trophy,
  ShieldCheck,
  Star,
  Zap,
  Lock,
  Check,
  Calendar,
  Clock,
  MapPin,
  LogOut,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  X,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getStoredUser, getStoredRoles, logoutUser, type UserProfile } from '../services/authService';
import { fetchCitiesApi } from '../services/cityService';

const PlayerDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Stored player state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);

  // Modal State for "Make Owner Profile"
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [ownerFormData, setOwnerFormData] = useState({
    turfName: '',
    city: 'Mumbai',
    contactNumber: '',
    courtsCount: '2',
    address: ''
  });
  const [isSubmittingOwner, setIsSubmittingOwner] = useState(false);
  const [ownerRequestSent, setOwnerRequestSent] = useState(false);

  useEffect(() => {
    fetchCitiesApi()
      .then((res) => {
        console.log("City response = ", res);
        const list = Array.isArray(res) ? res : res?.data || [];
        setCitiesList(list);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    const storedRoles = getStoredRoles();
    setRoles(storedRoles);
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/player-login');
  };

  const handleOwnerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerFormData.turfName.trim()) {
      toast.error('Please enter your turf or business name');
      return;
    }
    if (!ownerFormData.contactNumber.trim()) {
      toast.error('Please enter contact number');
      return;
    }

    setIsSubmittingOwner(true);
    setTimeout(() => {
      setIsSubmittingOwner(false);
      setOwnerRequestSent(true);
      toast.success('🎉 Turf Owner request submitted! Role upgraded to Owner.');
      // Add OWNER role to local roles
      const updatedRoles = Array.from(new Set([...roles, 'TURF_OWNER', 'OWNER']));
      localStorage.setItem('roles', JSON.stringify(updatedRoles));
      setRoles(updatedRoles);
      setShowOwnerModal(false);
    }, 1200);
  };

  const playerName = user?.username || 'Player Champ';
  const playerEmail = user?.email || 'player@boxcricket.com';
  const playerPhone = user?.phone || '+91 98765 43210';

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* ── Background Glows & Ambience ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Top Navbar ── */}
      <header className="relative z-20 w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl px-4 sm:px-8 py-3.5 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Mode */}
          <div className="flex items-center gap-3">
            <Link to="/player-dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  BoxCricket
                  <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-bold uppercase tracking-wider">
                    Arena
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 block -mt-0.5">Player Portal</span>
              </div>
            </Link>
          </div>

          {/* Quick Header Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-300">
            <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Dashboard
            </span>
            <Link
              to="/player-profile"
              className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              My Profile
            </Link>
            <span className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 cursor-not-allowed flex items-center gap-1 opacity-70">
              <Calendar className="w-3.5 h-3.5" />
              Bookings (Soon)
            </span>
            <span className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 cursor-not-allowed flex items-center gap-1 opacity-70">
              <Trophy className="w-3.5 h-3.5" />
              Leagues (Soon)
            </span>
          </nav>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center gap-3">
            <Link
              to="/player-profile"
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {playerName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-none">{playerName}</div>
                <div className="text-[10px] text-emerald-400 font-medium">Player Profile →</div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Body ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 1. Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                <span>SEASON 2026 ACTIVE</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  {playerName}
                </span>{' '}
                🏏
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Track your box cricket match statistics, view upcoming turf bookings, and explore upcoming Arena memberships.
              </p>
            </div>

            {/* Quick Match Status Pill */}
            <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl shrink-0 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Upcoming Match</span>
                <span className="text-xs font-bold text-white">Tomorrow • 8:00 PM</span>
                <span className="text-[11px] text-emerald-400 block font-medium">Court B (Floodlights)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Grid: Player Profile Card & Match Performance Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT COLUMN: Player Profile with "Make Owner Profile" Button ════ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 sm:p-7 shadow-xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Profile Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">Player Profile</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active Player
                </span>
              </div>

              {/* Avatar & Main Info */}
              <div className="flex items-center gap-4 py-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
                    <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white">
                      {playerName.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-950 font-bold">
                    ✓
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">{playerName}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {playerEmail}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {playerPhone}
                  </p>
                </div>
              </div>

              {/* Profile Attribute Tags */}
              <div className="grid grid-cols-2 gap-3 py-4 border-t border-slate-800/80 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Specialization</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <span>All-Rounder</span> 🏏
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Player Rating</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>4.9 / 5.0</span>
                  </span>
                </div>
              </div>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 🌟 SPECIAL REQUESTED BUTTON: "Make Owner Profile"           */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-400 flex items-center justify-center text-slate-950 shrink-0 font-bold shadow-md shadow-amber-500/20">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Do you own or manage a Box Cricket turf?</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Upgrade your account to list your ground, set slot prices, and accept player bookings.
                      </p>
                    </div>
                  </div>

                  {ownerRequestSent ? (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Owner Profile Request Submitted</span>
                    </div>
                  ) : (
                    <Link
                      to="/player-profile?tab=owner"
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Make Owner Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ════ RIGHT COLUMN: Player Performance Statistics ════ */}
          <div className="lg:col-span-7 space-y-6">
            {/* 4 Stat Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">28</div>
                <div className="text-[11px] text-slate-400 font-medium">Matches Played</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">524</div>
                <div className="text-[11px] text-slate-400 font-medium">Total Runs</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">164.2</div>
                <div className="text-[11px] text-slate-400 font-medium">Strike Rate</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">6</div>
                <div className="text-[11px] text-slate-400 font-medium">MVP Badges</div>
              </div>
            </div>

            {/* Upcoming Turf Reservation Preview */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>My Active Turf Slot</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30">
                  Confirmed
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">Apex Neon Turf Arena</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Andheri Sports Complex, Court 2</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tomorrow, 08:00 PM - 09:30 PM (90 Mins)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toast('Slot details sent to registered phone & email', { icon: 'ℹ️' })}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. THREE MEMBERSHIP CARDS (DISABLED / FUTURE SCOPE)            */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>FUTURE SCOPE • COMING SOON</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Arena Pro Memberships
              </h2>
              <p className="text-xs text-slate-400">
                Tiered subscription passes designed for league players. Currently disabled while under development.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* CARD 1: Rookie Pass (Disabled) */}
            <div className="relative rounded-3xl p-6 bg-slate-900/60 border border-slate-800/80 shadow-xl opacity-75 hover:opacity-90 transition-opacity flex flex-col justify-between overflow-hidden">
              {/* Disabled Watermark / Overlay badge */}
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Disabled
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Rookie Pass</h3>
                  <p className="text-xs text-slate-400">Casual weekend cricketers</p>
                </div>

                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-2xl font-black text-slate-200">₹499</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>5% discount on weekday slots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>24-hr priority booking window</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Free standard match balls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Digital match score tracking</span>
                  </li>
                </ul>
              </div>

              {/* Disabled CTA Button */}
              <div className="pt-6">
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-400 bg-slate-800/80 border border-slate-700/60 cursor-not-allowed opacity-60 flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Future Scope (Locked)</span>
                </button>
              </div>
            </div>

            {/* CARD 2: Pro All-Rounder (Disabled - Featured Card) */}
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-slate-900/90 to-emerald-950/30 border border-emerald-500/30 shadow-xl opacity-80 hover:opacity-95 transition-opacity flex flex-col justify-between overflow-hidden">
              {/* Highlight badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Most Popular
                </span>
                <span className="px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Locked
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Pro All-Rounder</h3>
                  <p className="text-xs text-slate-400">Regular league teams & captains</p>
                </div>

                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-2xl font-black text-white">₹999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>15% off night & floodlight slots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>48-hr priority booking advance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>1 Free weekend tournament pass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Verified MVP badge on leaderboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Free locker room & equipment access</span>
                  </li>
                </ul>
              </div>

              {/* Disabled CTA Button */}
              <div className="pt-6">
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-400 bg-slate-800/80 border border-slate-700/60 cursor-not-allowed opacity-60 flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Future Scope (Locked)</span>
                </button>
              </div>
            </div>

            {/* CARD 3: Elite Legend (Disabled) */}
            <div className="relative rounded-3xl p-6 bg-slate-900/60 border border-slate-800/80 shadow-xl opacity-75 hover:opacity-90 transition-opacity flex flex-col justify-between overflow-hidden">
              {/* Disabled Watermark / Overlay badge */}
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Disabled
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Elite Legend</h3>
                  <p className="text-xs text-slate-400">Championship level players & clubs</p>
                </div>

                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-2xl font-black text-slate-200">₹1,999</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>25% off all turf bookings nationwide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Instant priority access at any hour</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Unlimited cash tournament entries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Air-conditioned VIP lounge entry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Live match video streaming support</span>
                  </li>
                </ul>
              </div>

              {/* Disabled CTA Button */}
              <div className="pt-6">
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-400 bg-slate-800/80 border border-slate-700/60 cursor-not-allowed opacity-60 flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Future Scope (Locked)</span>
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ── MODAL: "Make Owner Profile" ── */}
      {showOwnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <button
              onClick={() => setShowOwnerModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Turf Owner Onboarding</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Create Turf Owner Profile</h3>
              <p className="text-xs text-slate-400">
                Register your venue under your account. Once verified, you will manage turf courts, schedules, and revenue.
              </p>
            </div>

            <form onSubmit={handleOwnerFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Turf / Arena Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={ownerFormData.turfName}
                  onChange={(e) => setOwnerFormData({ ...ownerFormData, turfName: e.target.value })}
                  placeholder="e.g. Skyline Box Cricket Arena"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">City / Location</label>
                  <select
                    value={ownerFormData.city}
                    onChange={(e) => setOwnerFormData({ ...ownerFormData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {citiesList.length > 0 ? (
                      citiesList.map((c: any) => (

                        < option key={c.id || c.city_name} value={c.city_name || c.name} >
                          {c.city_name || c.name}
                        </option>
                      ))
                    ) : (
                      <option value="Mumbai">Mumbai</option>
                    )}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Total Courts</label>
                  <select
                    value={ownerFormData.courtsCount}
                    onChange={(e) => setOwnerFormData({ ...ownerFormData, courtsCount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="1">1 Court</option>
                    <option value="2">2 Courts</option>
                    <option value="3">3 Courts</option>
                    <option value="4+">4+ Courts</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Business Contact Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={ownerFormData.contactNumber}
                  onChange={(e) => setOwnerFormData({ ...ownerFormData, contactNumber: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOwnerModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOwner}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmittingOwner ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Submit Turf Owner Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div >
      )}

      {/* ── Footer ── */}
      <footer className="relative z-10 w-full border-t border-slate-900 bg-slate-950/70 py-5 px-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 BoxCricket Network • Player Dashboard & Match Center</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 font-medium">Turf Match Center v2.0</span>
            <span className="text-slate-600">•</span>
            <Link to="/player-login" className="hover:text-slate-300 transition-colors">Sign In Portal</Link>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default PlayerDashboard;
