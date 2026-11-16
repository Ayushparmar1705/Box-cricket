import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Trophy,
  Zap,
  ShieldCheck,
  Star,
  Users,
  Flame,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  Activity,
  KeyRound
} from 'lucide-react';
import { usePlayerAuth } from '../hooks/usePlayerAuth';
import CommonModal from '../../Components/Common/CommonModal';
import toast from 'react-hot-toast';

const PlayerLogin: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleLoginChange,
    loginFormData,
    setLoginFormData,
    handleLogin
  } = usePlayerAuth();

  // Interactive modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // OTP Login modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  // Quick Demo fill handler
  const handleQuickDemoFill = () => {
    if (setLoginFormData) {
      setLoginFormData({
        email: 'player@boxcricket.com',
        password: 'Player@123'
      });
      toast.success('Demo player credentials applied! Click below to sign in.', {
        icon: '⚡',
        duration: 3500
      });
    }
  };

  // Forgot Password submit handler
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) {
      toast.error('Please enter your registered email or phone');
      return;
    }
    setIsSubmittingForgot(true);
    setTimeout(() => {
      setIsSubmittingForgot(false);
      setForgotSent(true);
      toast.success(`Password reset link sent to ${forgotInput}`);
    }, 1200);
  };

  // OTP Login send code handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpPhone.trim() || otpPhone.trim().length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsOtpLoading(true);
    setTimeout(() => {
      setIsOtpLoading(false);
      setOtpStep('code');
      toast.success('6-digit security code sent to ' + otpPhone, { icon: '📱' });
    }, 1000);
  };

  // OTP verification handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      toast.error('Please enter complete 6-digit OTP code');
      return;
    }
    setIsOtpLoading(true);
    setTimeout(() => {
      setIsOtpLoading(false);
      localStorage.setItem('token', 'demo-player-otp-token-' + Date.now());
      localStorage.setItem('roles', JSON.stringify(['PLAYER']));
      localStorage.setItem(
        'boxcricket_user',
        JSON.stringify({
          phone: otpPhone,
          username: 'Player_' + otpPhone.slice(-4),
          roles: ['PLAYER']
        })
      );
      toast.success('OTP verified! Entering Arena...');
      setShowOtpModal(false);
      navigate('/player-dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white relative">
      {/* ── Top Navigation Bar ── */}
      <header className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/player-login" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm text-white group-hover:bg-emerald-700 transition-colors">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  BoxCricket
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                  Arena
                </span>
              </div>
              <span className="text-[11px] text-slate-500 tracking-wide block">Player Match & Turf Portal</span>
            </div>
          </Link>

          {/* Right Navigation Links */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>42 Turfs Open Tonight</span>
            </div>

            <Link
              to="/player-register"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
            >
              <span>Create Account</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ════ LEFT COLUMN: Brand Story & Real-time Turf Atmosphere ════ */}
          <div className="lg:col-span-6 space-y-6 lg:pr-2">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="tracking-wide uppercase text-[11px] font-bold">
                Floodlights Active • Instant Court Booking Open
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Step Onto The Turf.{' '}
                <span className="text-emerald-600">
                  Own Every Ball.
                </span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                India’s premier box cricket platform. Reserve pro-grade AstroTurf in 30 seconds, join competitive weekend leagues, and monitor your personal batting strike rate.
              </p>
            </div>

            {/* Live Turf Pulse Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Apex Turf Arena • Court #2 (Floodlit)
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Fast Turf ⚡
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Next Open Night Slot</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">08:30 PM - 09:30 PM</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pitch Pace</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-700">High Bounce • 125kph</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Link Road, Andheri West, Mumbai</span>
                </div>
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Instant Lock Enabled</span>
                </div>
              </div>
            </div>

            {/* Feature Perks 4-Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">30s Instant Lock</h4>
                  <p className="text-[11px] text-slate-500">Zero double-booking guarantee</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Career Stats & MVP</h4>
                  <p className="text-[11px] text-slate-500">Track runs, strike rate & wickets</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Squad Split Bill</h4>
                  <p className="text-[11px] text-slate-500">Share court fees with teammates</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Pro Floodlights</h4>
                  <p className="text-[11px] text-slate-500">High-lumen LED verified courts</p>
                </div>
              </div>
            </div>

            {/* Social Trust Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
              <div className="flex -space-x-2">
                <img
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60"
                  alt="Player"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60"
                  alt="Player"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60"
                  alt="Player"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-bold text-slate-800">4.9/5 Rating</span>
                <span>• 50,000+ matches played</span>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN: Clean Elevated Login Card ════ */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />

              {/* Segmented Tab Bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs w-full sm:w-auto">
                  <button
                    type="button"
                    className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-xs text-xs cursor-default"
                  >
                    Player Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/player-register')}
                    className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 font-semibold transition-colors text-xs cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* Card Title */}
              <div className="mb-5">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Welcome Back!</span>
                  <span className="text-xl">🏏</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Sign in to manage your turf bookings, tournament passes, and match statistics.
                </p>
              </div>

              {/* Quick Demo Credentials Pill */}
              <div className="mb-5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-950 text-[11px] block">Test User Demo Pass</span>
                    <span className="text-[10px] text-emerald-700">player@boxcricket.com</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  ⚡ Auto-Fill
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email / Phone Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="player-email"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="player-email"
                      type="text"
                      name="email"
                      value={loginFormData.email}
                      onChange={handleLoginChange}
                      required
                      placeholder="player@boxcricket.com or 9876543210"
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="player-password"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotSent(false);
                        setShowForgotModal(true);
                      }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="player-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={loginFormData.password}
                      onChange={handleLoginChange}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Security Badge */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 focus:ring-offset-0 transition-colors accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium">Keep me signed in</span>
                  </label>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL</span>
                  </span>
                </div>

                {/* Primary CTA Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating Player...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Arena & Book Slots</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <span className="bg-white px-3">or instant access with</span>
                </div>
              </div>

              {/* Fast Social & OTP Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Google Single Sign-On initialized for Arena players.');
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('phone');
                    setOtpCode(['', '', '', '', '', '']);
                    setShowOtpModal(true);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
                >
                  <Flame className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mobile OTP</span>
                </button>
              </div>

              {/* Bottom Footer Switch */}
              <div className="mt-6 pt-4 border-t border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-600">
                  Don't have a player account yet?{' '}
                  <Link
                    to="/player-register"
                    className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 ml-1"
                  >
                    Create Free Profile →
                  </Link>
                </p>

                <p className="text-[11px] text-slate-500 pt-1">
                  Are you a Turf Owner or Facility Admin?{' '}
                  <Link
                    to="/admin-login"
                    className="text-slate-700 hover:text-emerald-600 font-semibold underline underline-offset-2 ml-0.5"
                  >
                    Switch to Staff Portal
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── MODAL: Forgot Password Recovery ── */}
      <CommonModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Player Password"
        subtitle="We'll send you an encrypted recovery code or magic link."
        icon={<KeyRound className="w-5 h-5 text-emerald-600" />}
        maxWidth="sm"
        theme="light"
      >
        {forgotSent ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Check Your Inbox / SMS</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instructions have been sent to <span className="text-slate-900 font-semibold">{forgotInput}</span>. Click the link to update your credentials.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-left pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Registered Email or Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="e.g. player@boxcricket.com or 9876543210"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingForgot}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmittingForgot ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </div>
          </form>
        )}
      </CommonModal>

      {/* ── MODAL: Mobile OTP Fast Sign-In ── */}
      <CommonModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        title="Mobile OTP Sign-In"
        subtitle="Instant passwordless login via phone verification."
        icon={<Phone className="w-5 h-5 text-emerald-600" />}
        maxWidth="sm"
        theme="light"
      >
        {otpStep === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700 block">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-semibold text-xs">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={otpPhone}
                  onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono tracking-wider"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                A 6-digit confirmation code will be dispatched via SMS.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isOtpLoading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isOtpLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send OTP Code</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Enter 6-Digit Security Code
                </label>
                <button
                  type="button"
                  onClick={() => setOtpStep('phone')}
                  className="text-[11px] text-emerald-600 hover:underline font-semibold"
                >
                  Change Number
                </button>
              </div>

              {/* 6-box input */}
              <div className="flex items-center justify-between gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-box-${index}`}
                    type="text"
                    maxLength={1}
                    value={otpCode[index]}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const next = [...otpCode];
                      next[index] = val;
                      setOtpCode(next);
                      if (val && index < 5) {
                        const nextBox = document.getElementById(`otp-box-${index + 1}`);
                        nextBox?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                        const prevBox = document.getElementById(`otp-box-${index - 1}`);
                        prevBox?.focus();
                      }
                    }}
                    className="w-10 h-11 text-center bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                ))}
              </div>

              {/* Demo Fill Helper */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">Demo Code: 123456</span>
                <button
                  type="button"
                  onClick={() => setOtpCode(['1', '2', '3', '4', '5', '6'])}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  Fill Demo OTP
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOtpStep('phone')}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isOtpLoading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isOtpLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Enter</span>
                )}
              </button>
            </div>
          </form>
        )}
      </CommonModal>

      {/* ── Page Footer ── */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>© 2026 BoxCricket Arena Network. Official Turf Management & League Portal.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-slate-700 transition-colors">Turf Fair Play Rules</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Support & Disputes</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlayerLogin;
