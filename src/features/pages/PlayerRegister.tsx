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
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden font-sans">
      {/* ── Background Glows ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-emerald-500/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] md:w-[650px] md:h-[650px] bg-teal-500/10 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/player-login" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">BoxCricket</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                  Arena
                </span>
              </div>
              <span className="text-[11px] text-slate-400 tracking-wide block">Player Match Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Already have an account?</span>
            <Link
              to="/player-login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 border border-emerald-500/20 transition-all hover:border-emerald-500/40 shadow-sm"
            >
              <span>Sign In</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* ════ LEFT COLUMN: Clean Minimal Brand Side ════ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>PLAYER REGISTRATION</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Create Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Player Account.
                </span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Join BoxCricket Arena to book courts in seconds, enter tournaments, and track your match performance.
              </p>
            </div>

            {/* Quick clean benefits */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Instant Turf Booking</h4>
                  <p className="text-[11px] text-slate-400">Reserve slots in real time under floodlights</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Tournaments & Leagues</h4>
                  <p className="text-[11px] text-slate-400">Compete in cash-prize weekend tournaments</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Player Stats & Scores</h4>
                  <p className="text-[11px] text-slate-400">Track runs, strike rate, and MVP trophies</p>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <div className="flex text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-semibold text-slate-300">4.9/5</span>
              <span>• Trusted by 15,000+ players</span>
            </div>
          </div>

          {/* ════ RIGHT COLUMN: Clean Single-Card Signup Form ════ */}
          <div className="lg:col-span-7 w-full max-w-md mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-2xl">

              {/* Form Navigation Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => navigate('/player-login')}
                    className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white font-medium transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold transition-all shadow-sm"
                  >
                    Register
                  </button>
                </div>

                <span className="text-[11px] text-emerald-400 font-semibold tracking-wide">
                  New Player
                </span>
              </div>

              {/* Headline */}
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Player Registration</span>
                  <span className="text-xl">🏏</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your details to create your player account.
                </p>
              </div>

              {/* Form containing strictly name, email, phone, password */}
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSignup();
                }}
              >
                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label htmlFor="player-name" className="block text-xs font-semibold text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* 2. Email */}
                <div className="space-y-1.5">
                  <label htmlFor="player-email" className="block text-xs font-semibold text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* 3. Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="player-phone" className="block text-xs font-semibold text-slate-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* 4. Password */}
                <div className="space-y-1.5">
                  <label htmlFor="player-password" className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
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
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
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
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <Link
                    to="/player-login"
                    className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
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
      <footer className="relative z-10 w-full border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 BoxCricket Network. Official Turf Management & League Portal.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-slate-400 transition-colors">Fair Play Rules</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlayerRegister;
