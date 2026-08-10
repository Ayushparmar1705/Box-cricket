import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  User,
  Phone,
  Gamepad2,
  CheckCircle2
} from 'lucide-react';

export const UserAuthPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    form,
    handleChange,
    loading,
    handleSubmit,
    isLoginMode,
    handleToggleMode,
    togglePasswordVisiblity,
    isHidden
  } = useUserAuth((data) => {
    // Navigate to respective dashboard based on user role
    const role = data.data.user.role;
    if (role === 'Owner') {
      navigate('/owner/dashboard');
    } else {
      navigate('/home/discover');
    }
  });

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-gray-50 dark:bg-[#0B1120]">

      {/* ── LEFT PANEL: Marketing & Image ── */}
      <div className="hidden lg:flex flex-col justify-end p-12 relative overflow-hidden bg-emerald-900">
        <img
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2000"
          alt="Cricket Match"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent"></div>

        <div className="relative z-10 text-white max-w-xl">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/30">
            <Gamepad2 size={28} className="text-white" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Book premium turfs instantly.
          </h1>

          <p className="text-emerald-100 text-lg leading-relaxed mb-10 font-medium">
            Join the community of passionate players. Discover venues, book slots in real-time, and play without interruptions.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <span className="text-sm font-semibold text-emerald-50">Instant Booking</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <span className="text-sm font-semibold text-emerald-50">Verified Venues</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <span className="text-sm font-semibold text-emerald-50">Secure Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <span className="text-sm font-semibold text-emerald-50">Exclusive Coupons</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Auth Form ── */}
      <div className="flex flex-col justify-center p-6 sm:p-12 lg:px-20 bg-gray-50 dark:bg-[#0B1120] relative overflow-y-auto max-h-screen">

        <div className="w-full max-w-[400px] mx-auto bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-200/90 dark:border-gray-800">

          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              {isLoginMode ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
              {isLoginMode
                ? 'Enter your credentials to access your account.'
                : 'Join BoxCricket as a player to book turfs.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {!isLoginMode && (
              <div className="flex flex-col gap-5 animate-in fade-in duration-300">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wide">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required={!isLoginMode}
                      className="w-full h-11 pl-10 pr-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wide">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      name="phoneNumber"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required={!isLoginMode}
                      className="w-full h-11 pl-10 pr-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  placeholder="player@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full h-11 pl-10 pr-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wide flex items-center justify-between">
                <span>Password</span>
                {isLoginMode && <a href="#" className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold">Forgot?</a>}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  name="password"
                  type={isHidden ? 'password' : 'text'}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full h-11 pl-10 pr-10 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisiblity}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isLoginMode ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle Form Mode */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={handleToggleMode}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
            >
              {isLoginMode ? 'Sign up now' : 'Sign in instead'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
