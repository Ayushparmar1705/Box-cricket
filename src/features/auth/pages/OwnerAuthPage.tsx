import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerAuth } from '../hooks/useOwnerAuth';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  User,
  Phone,
  FileText,
  Briefcase,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export const OwnerAuthPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { 
    form, 
    handleChange, 
    loading, 
    handleSubmit,
    isLoginMode,
    registrationStep,
    handleToggleMode,
    handleNextStep,
    handlePrevStep,
    togglePasswordVisiblity,
    isHidden
  } = useOwnerAuth(() => {
    navigate('/owner/dashboard');
  });

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-white">
      
      {/* ── LEFT PANEL: Marketing & Image ── */}
      <div className="hidden lg:flex flex-col justify-end p-12 relative overflow-hidden bg-slate-900">
        {/* High quality sports turf image */}
        <img 
          src="https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=2000" 
          alt="Cricket Turf"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-1000 hover:scale-105"
        />
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        
        <div className="relative z-10 text-white max-w-xl">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-indigo-500/30">
            <Building2 size={28} className="text-white" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Grow your turf business with BoxCricket.
          </h1>
          
          <p className="text-slate-300 text-lg leading-relaxed mb-10 font-medium">
            Join thousands of venue owners who manage their bookings, automate pricing, and analyze revenue in one powerful platform.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-10">
             <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-400" size={20} />
                <span className="text-sm font-semibold text-slate-200">Zero Setup Fees</span>
             </div>
             <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-400" size={20} />
                <span className="text-sm font-semibold text-slate-200">Instant Payouts</span>
             </div>
             <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-400" size={20} />
                <span className="text-sm font-semibold text-slate-200">24/7 Support</span>
             </div>
             <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-400" size={20} />
                <span className="text-sm font-semibold text-slate-200">Smart Analytics</span>
             </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-slate-300 border-t border-slate-700/60 pt-8">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=11" className="w-10 h-10 rounded-full border-2 border-slate-900" alt="User" />
              <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full border-2 border-slate-900" alt="User" />
              <img src="https://i.pravatar.cc/100?img=15" className="w-10 h-10 rounded-full border-2 border-slate-900" alt="User" />
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold tracking-wider">
                +2k
              </div>
            </div>
            <span className="text-slate-400">Trusted by top venue owners nationwide</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Auth Form ── */}
      <div className="flex flex-col justify-center p-6 sm:p-12 lg:px-20 bg-white relative overflow-y-auto max-h-screen">
        
        <div className="w-full max-w-[420px] mx-auto">
          
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoginMode ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              {isLoginMode 
                ? 'Enter your details to access your owner dashboard.' 
                : 'Enter your basic and business details to get started.'}
            </p>
          </div>

          {/* Step indicator for Registration */}
          {!isLoginMode && (
            <div className="flex items-center gap-2 mb-8">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${registrationStep >= 1 ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${registrationStep >= 2 ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* LOGIN OR REGISTRATION STEP 1 (Basic Details) */}
            {(isLoginMode || (!isLoginMode && registrationStep === 1)) && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {!isLoginMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide">Full Name</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          name="full_name"
                          type="text"
                          placeholder="John Doe"
                          value={form.full_name}
                          onChange={handleChange}
                          required={!isLoginMode}
                          className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          name="phone_number"
                          type="tel"
                          placeholder="+91..."
                          value={form.phone_number}
                          onChange={handleChange}
                          required={!isLoginMode}
                          className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      name="email"
                      type="email"
                      placeholder="owner@business.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide flex items-center justify-between">
                    <span>Password</span>
                    {isLoginMode && <a href="#" className="text-[10px] text-indigo-600 hover:underline font-bold">Forgot?</a>}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      name="password"
                      type={isHidden ? 'password' : 'text'}
                      placeholder="••••••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-10 pr-10 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisiblity}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* REGISTRATION STEP 2 (Business Details) */}
            {!isLoginMode && registrationStep === 2 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-2 duration-300">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide">Business Name</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      name="business_name"
                      type="text"
                      placeholder="e.g. Metro Sports Arena"
                      value={form.business_name}
                      onChange={handleChange}
                      required={!isLoginMode}
                      className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide">Business Type</label>
                  <div className="relative">
                    <select
                      name="business_type"
                      value={form.business_type}
                      onChange={handleChange}
                      required={!isLoginMode}
                      className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium appearance-none shadow-sm"
                    >
                      <option value="">Select Type</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Private Limited">Private Limited</option>
                      <option value="LLP">LLP</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide">GST Number</label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      name="gst_number"
                      type="text"
                      placeholder="GSTIN..."
                      value={form.gst_number}
                      onChange={handleChange}
                      required={!isLoginMode}
                      className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium uppercase shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide">Remarks (Optional)</label>
                  <input
                    name="admin_remark"
                    type="text"
                    placeholder="Any additional info..."
                    value={form.admin_remark}
                    onChange={handleChange}
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm"
                  />
                </div>

              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              {!isLoginMode && registrationStep === 2 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="h-11 px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 shadow-sm"
                >
                  <ArrowLeft size={16} />
                </button>
              )}

              {(!isLoginMode && registrationStep === 1) ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="h-11 flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLoginMode ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
                      {!isLoginMode && <ArrowRight size={16} />}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Toggle Form Mode */}
          <div className="mt-10 text-center text-sm text-slate-500 font-medium">
            {isLoginMode ? "Don't have an owner account?" : "Already a registered partner?"}{' '}
            <button
              type="button"
              onClick={handleToggleMode}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer transition-colors"
            >
              {isLoginMode ? 'Sign up now' : 'Sign in instead'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
