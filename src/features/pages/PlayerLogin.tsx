import React from 'react';
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
  Calendar
} from 'lucide-react';
import { usePlayerAuth } from '../hooks/usePlayerAuth';
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
    handleLogin
  } = usePlayerAuth();



  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden font-sans">
      {/* ── Background Glows & Ambience ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-emerald-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] md:w-[650px] md:h-[650px] bg-cyan-500/12 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[30%] w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[120px]" />
        {/* Subtle Pitch Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Top Navigation Bar ── */}
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
            <span className="text-xs text-slate-400 hidden sm:inline">New to Box Cricket?</span>
            <Link
              to="/player-register"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 border border-emerald-500/20 transition-all hover:border-emerald-500/40 shadow-sm"
            >
              <span>Create Account</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ════ LEFT COLUMN: Brand Story & Live Arena Showcase ════ */}
          <div className="lg:col-span-6 space-y-6 lg:pr-4">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE NIGHT SESSIONS OPEN • FLOODLIGHTS ACTIVE</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Step Onto The Turf.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Unleash Your Game.
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                India’s premier box cricket network. Reserve floodlit courts in 30 seconds, join competitive weekend tournaments, and track your batting strike rate.
              </p>
            </div>

            {/* Live Turf Match Status Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Court #3 • Match In Progress</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-cyan-500/20">
                  Over 8.2 / 10
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Batting Team</div>
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>Thunder Strikers</span>
                    <span className="text-xs text-emerald-400 font-mono">86/3</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Target</div>
                  <div className="text-base font-bold text-amber-400 font-mono">98 Runs (Need 12 off 10)</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Apex Turf Arena, Court 3</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Next Slot: 9:00 PM</span>
                </div>
              </div>
            </div>

            {/* Feature Perks Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Instant Booking</h4>
                  <p className="text-[11px] text-slate-400">Real-time turf slot lock in 30s</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Career Stats</h4>
                  <p className="text-[11px] text-slate-400">Track runs, MVP & strike rate</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Squad Matchup</h4>
                  <p className="text-[11px] text-slate-400">Build teams & split court fees</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Fair Play Arena</h4>
                  <p className="text-[11px] text-slate-400">Verified umpires & rules</p>
                </div>
              </div>
            </div>

            {/* Social Trust Banner */}
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <img
                  className="w-7 h-7 rounded-full border-2 border-slate-900"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60"
                  alt="Player"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-slate-900"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60"
                  alt="Player"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-slate-900"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60"
                  alt="Player"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-slate-300">4.9/5</span>
                <span>(15,000+ Box Cricket matches played)</span>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN: High-End Player Login Card ════ */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-2xl relative">

              {/* Header inside Form Card */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold transition-all shadow-sm"
                    >
                      Player Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/player-register')}
                      className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white font-medium transition-all"
                    >
                      Register
                    </button>
                  </div>


                </div>

                <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Welcome Back, Champ!</span>
                  <span className="text-xl">🏏</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your credentials to manage your turf bookings and match history.
                </p>
              </div>

              {/* Login Form */}
              <form
                className="space-y-4"
                onSubmit={handleLogin}
              >
                {/* Email or Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="player-email" className="block text-xs font-semibold text-slate-300">
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="player-email"
                      type="email"
                      name="email"
                      value={loginFormData.email}
                      onChange={handleLoginChange}
                      placeholder="player@boxcricket.com or 9876543210"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="player-password" className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"

                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="player-password"
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={loginFormData.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
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

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 transition-colors accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400">Keep me signed in</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Encrypted 256-bit</span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
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
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <span className="bg-slate-900 px-3">or fast access with</span>
                </div>
              </div>

              {/* Social / Fast Access Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => toast('Google Sign-In integration ready for production client ID.', { icon: 'ℹ️' })}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  onClick={() => toast('SMS OTP Gateway ready for player phone verification.', { icon: '📱' })}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
                >
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span>Mobile OTP</span>
                </button>
              </div>

              {/* Bottom Footer Switch */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
                <p className="text-xs text-slate-400">
                  Don't have a player account yet?{' '}
                  <Link
                    to="/player-register"
                    className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
                  >
                    Create Free Profile →
                  </Link>
                </p>


              </div>

            </div>
          </div>

        </div>
      </main>




      {/* ── Page Footer ── */}
      <footer className="relative z-10 w-full border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 BoxCricket Network. Official Turf Management & League Portal.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-slate-400 transition-colors">Turf Fair Play Rules</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Support & Disputes</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlayerLogin;
