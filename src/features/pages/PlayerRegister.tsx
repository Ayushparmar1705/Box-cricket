import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Trophy,
  Zap,
  ShieldCheck,
  ChevronRight,
  Star,
} from 'lucide-react';
import { usePlayerAuth } from '../hooks/usePlayerAuth';

const PlayerRegister: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    showPassword,
    setShowPassword,
    handleAuthChange,
    handleSignup,
    signupFormData
  } = usePlayerAuth();

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
              <span className="text-[11px] text-slate-500 tracking-wide block">Player Match Portal</span>
            </div>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">Already have an account?</span>
            <Link
              to="/player-login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all shadow-xs cursor-pointer"
            >
              <span>Sign In</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* ════ LEFT COLUMN: Clean Minimal Brand Side ════ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>PLAYER REGISTRATION</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Create Your{' '}
                <span className="text-emerald-600">
                  Player Account.
                </span>
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                Join BoxCricket Arena to book courts in seconds, enter tournaments, and track your personal performance.
              </p>
            </div>

            {/* Quick clean benefits */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant Turf Booking</h4>
                  <p className="text-[11px] text-slate-500">Reserve slots in real time under floodlights</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Weekend Tournaments</h4>
                  <p className="text-[11px] text-slate-500">Compete for trophies, cash prizes and rank</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Player Stats & Scores</h4>
                  <p className="text-[11px] text-slate-500">Track runs, strike rate, and MVP trophies</p>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
              <div className="flex text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-bold text-slate-800">4.9/5</span>
              <span>• Trusted by 15,000+ players</span>
            </div>
          </div>

          {/* ════ RIGHT COLUMN: Clean Single-Card Signup Form ════ */}
          <div className="lg:col-span-7 w-full max-w-md mx-auto">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />

              {/* Form Navigation Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate('/player-login')}
                    className="px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-xs transition-all cursor-default"
                  >
                    Register
                  </button>
                </div>

                <span className="text-[11px] text-emerald-700 font-semibold tracking-wide bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  New Player
                </span>
              </div>

              {/* Headline */}
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Player Registration</span>
                  <span className="text-xl">🏏</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your details to create your player account.
                </p>
              </div>

              {/* Form containing name, email, phone, password */}
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSignup();
                }}
              >
                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label htmlFor="player-name" className="block text-xs font-bold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="player-name"
                      name="name"
                      type="text"
                      required
                      value={signupFormData.name}
                      onChange={(e) => handleAuthChange(e)}
                      placeholder="Rohit Sharma"
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* 2. Email */}
                <div className="space-y-1.5">
                  <label htmlFor="player-email" className="block text-xs font-bold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="player-email"
                      name="email"
                      type="email"
                      required
                      value={signupFormData.email}
                      onChange={(e) => handleAuthChange(e)}
                      placeholder="rohit@example.com"
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* 3. Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="player-phone" className="block text-xs font-bold text-slate-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="player-phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={10}
                      value={signupFormData.phone}
                      onChange={(e) => handleAuthChange(e)}
                      placeholder="9876543210"
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* 4. Password */}
                <div className="space-y-1.5">
                  <label htmlFor="player-password" className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="player-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupFormData.password}
                      onChange={(e) => handleAuthChange(e)}
                      placeholder="Min. 6 characters"
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

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Player Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Footer Switch */}
              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <Link
                    to="/player-login"
                    className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 ml-1"
                  >
                    Sign In →
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span>© 2026 BoxCricket Network. Official Turf Management & League Portal.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-slate-700 transition-colors">Fair Play Rules</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlayerRegister;
