import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  Zap,
  Shield,
  CheckCircle2,
  LockKeyhole,
  Database,
  Globe,
  Activity,
} from 'lucide-react';

/**
 * Big-Tech Corporate Split Layout Login Page
 * Left side: Corporate Trust & Infrastructure status (Amazon AWS / TCS style).
 * Right side: Centered, clean, minimal White Admin Login Card.
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { form, setField, fillDemoCredentials, handleSubmit } = useLoginForm(() => {
    navigate('/dashboard');
  });

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-slate-50">
      
      {/* ── LEFT PANEL: Enterprise Identity & Tech Infrastructure ── */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#0B1528] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Subtle grid accent */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        
        {/* Brand/Console Identity */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-extrabold text-white shadow-md">
            BC
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-lg tracking-tight leading-none">BoxCricket</span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Enterprise Console v2.0</span>
          </div>
        </div>

        {/* Console Title & Live Status Features */}
        <div className="relative z-10 my-auto flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
              Super Admin Console
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Secure enterprise operations hub for multi-court booking, automated dynamic pricing schedules, and secure payment settlement.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Security & Infrastructure Status
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={18} />
              <div>
                <div className="text-xs font-bold text-slate-200">SOC 2 Type II Certified</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Automated compliance mapping & audit logs.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <Activity className="text-emerald-400 shrink-0 mt-0.5" size={18} />
              <div>
                <div className="text-xs font-bold text-slate-200">Real-Time Booking Lock Engine</div>
                <div className="text-[10px] text-slate-400 mt-0.5">PostgreSQL Advisory Locks active for slot conflicts.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <Database className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <div>
                <div className="text-xs font-bold text-slate-200">Live PostgreSQL Database</div>
                <div className="text-[10px] text-slate-400 mt-0.5">3NF Normalized schema · 24 tables active.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5"><Database size={13} className="text-emerald-400" /> 24 Tables</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><Globe size={13} className="text-blue-400" /> 8 Cities</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">100% Uptime</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: Secure White Admin Login Form ── */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative">
        {/* Subtle decorative dot grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Perfectly proportioned admin login card */}
        <div className="w-full max-w-[390px] bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xl shadow-slate-200/50 z-10">
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Super Admin Sign In</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage users, approvals, venues, and platform settings</p>
          </div>

          {/* Error Alert */}
          {form.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span className="font-semibold">{form.error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide flex items-center justify-between">
                <span>Corporate Email</span>
                <span className="text-[10px] text-slate-400 font-mono font-normal">admin@boxcricket.app</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="admin@boxcricket.app"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  required
                  className="w-full h-10 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide flex items-center justify-between">
                <span>Password</span>
                <a href="#" className="text-[10px] text-emerald-600 hover:underline font-semibold">Forgot?</a>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={form.showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  required
                  className="w-full h-10 pl-10 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setField('showPassword', !form.showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {form.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Workstation & Security Info */}
            <div className="flex items-center justify-between text-xs text-slate-600 py-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setField('rememberMe', e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-0 w-4 h-4"
                />
                <span>Remember me</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <LockKeyhole size={11} className="text-emerald-600" /> 2FA Active
              </span>
            </div>

            {/* Demo Quick Fill Box */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-emerald-950 font-bold">
                <span className="flex items-center gap-1">
                  <Zap size={13} className="text-emerald-600" /> Demo Admin Quick Fill
                </span>
                <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  SUPER ADMIN
                </span>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-600/15 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Click to Fill Credentials</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={form.isLoading}
              className="h-10 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              {form.isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badges */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><Shield size={12} className="text-emerald-600" /> SOC 2 Certified</span>
            <span>•</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600" /> TLS 1.3 Encrypted</span>
          </div>

        </div>
      </div>
    </div>
  );
};
