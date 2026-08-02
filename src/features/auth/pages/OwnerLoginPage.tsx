import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import Authservice from '../service/Authservice';
import OwnerRequestService from '../service/OwnerRequestService';
import {
  Store,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  TrendingUp,
  CalendarCheck,
  CheckCircle2,
  User,
  Phone,
  Building,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export const OwnerLoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Login / Register Mode
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // --- LOGIN LOGIC ---
  const { form, handleSubmit: handleLoginSubmit, handleChange, loading: loginLoading, togglePasswordVisiblity, isHidden } = useLoginForm((data) => {
    const role = data?.data?.role || data?.role;
    if (role === 'Admin') {
      toast.error("Admins must login via the Admin Portal.");
      localStorage.removeItem("user");
      localStorage.removeItem("bc_admin_session");
      navigate('/login');
      return;
    }
    navigate('/owner/overview');
  });

  // --- REGISTRATION LOGIC ---
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regLoading, setRegLoading] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    businessName: '',
    businessType: 'Sole Proprietorship',
    gstNumber: '',
    documentType: 'AADHAR',
    documentUrl: ''
  });

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (regStep === 1) {
      if (!regForm.name || !regForm.email || !regForm.password || !regForm.phoneNumber) {
        return toast.error("Please fill in all personal details.");
      }
      setRegStep(2);
      return;
    }

    if (regStep === 2) {
      if (!regForm.businessName || !regForm.gstNumber || !regForm.documentUrl) {
        return toast.error("Please fill in all business details.");
      }

      setRegLoading(true);
      try {
        // 1. Create the User (Auth Service)
        const userRes = await Authservice.register({
          name: regForm.name,
          email: regForm.email,
          password: regForm.password,
          phoneNumber: regForm.phoneNumber,
          role: "Owner"
        });

        if (!userRes.success) {
          toast.error(userRes.message || "Failed to create user account.");
          setRegLoading(false);
          return;
        }

        // We assume the register API returns the created user ID in userRes.data.id or similar
        // If the backend doesn't return ID directly, we might need to login to get it. 
        // For now, let's assume `userRes.data?.id` or `userRes.data?.user?.id` exists.
        // Wait, looking at User.js in auth-service, it returns `message: "User registered successfully."` 
        // Let's actually login to get the token & ID, then submit owner request.

        const loginRes = await Authservice.login(regForm.email, regForm.password);
        if (!loginRes.success) {
          toast.error("Account created, but failed to log in automatically.");
          setMode('login');
          setRegLoading(false);
          return;
        }

        const userId = loginRes.data?.user?.id || loginRes.data?.id;

        // 2. Submit the Owner Request (KYC details)
        const reqPayload = {
          user_id: userId,
          business_name: regForm.businessName,
          business_type: regForm.businessType,
          gst_number: regForm.gstNumber,
          documents: [
            {
              documentType: regForm.documentType,
              documentUrl: regForm.documentUrl
            }
          ]
        };

        const reqRes = await OwnerRequestService.createRequest(reqPayload);
        const reqData = await reqRes.json();

        if (reqData.success) {
          toast.success("Partner Application submitted successfully! Please wait for admin approval.");
          // Log them in anyway (they can access empty dashboard until approved)
          localStorage.setItem("user", JSON.stringify(loginRes.data || loginRes));
          navigate('/owner/overview');
        } else {
          toast.error(reqData.message || "Failed to submit verification details.");
        }
      } catch (err: any) {
        toast.error("An error occurred during registration.");
      } finally {
        setRegLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-slate-50">

      {/* ── LEFT PANEL: Partner Brand & Value Prop ── */}
      <div className="hidden lg:flex bg-[#003365] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Soft radial gradient background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ background: 'radial-gradient(circle at top right, #004a8f, transparent 60%)' }}
        />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-extrabold text-[#003365] shadow-md">
            BC
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-lg tracking-tight leading-none">BoxCricket</span>
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">Partner Portal</span>
          </div>
        </div>

        {/* Title & Benefits */}
        <div className="relative z-10 my-auto flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
              Grow your venue revenue with BoxCricket.
            </h1>
            <p className="text-sm text-blue-100 mt-4 leading-relaxed max-w-md">
              Manage your turf bookings, set dynamic pricing, track live earnings, and streamline your entire sports facility operations in one place.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                <CalendarCheck size={16} />
              </div>
              <span className="font-medium text-sm">Automated slot management & live calendar</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                <TrendingUp size={16} />
              </div>
              <span className="font-medium text-sm">Real-time revenue tracking and analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                <Store size={16} />
              </div>
              <span className="font-medium text-sm">Multi-venue scale & staff role controls</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-6 border-t border-blue-800/50 flex items-center justify-between text-xs text-blue-300">
          <span>&copy; {new Date().getFullYear()} BoxCricket Partner Network</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-400" /> Trusted by 500+ turfs
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL: Owner Login/Register Form ── */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white relative overflow-y-auto">
        <div className="w-full max-w-[420px] my-auto">

          <div className="flex flex-col mb-8">
            <div className="lg:hidden w-12 h-12 rounded-xl bg-[#003365] flex items-center justify-center font-extrabold text-white mb-6 shadow-md">
              BC
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Partner Application'}
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              {mode === 'login'
                ? 'Sign in to your Partner Portal to manage your venues.'
                : 'Submit your business details and KYC documents to get started.'}
            </p>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    name="email"
                    type="email"
                    placeholder="owner@myvenue.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                  <a href="#" className="text-xs text-[#003365] hover:underline font-semibold">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    name="password"
                    type={isHidden ? 'password' : 'text'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-11 pr-11 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisiblity}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="h-11 mt-2 bg-[#003365] hover:bg-[#004a8f] active:bg-[#002244] disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-[#003365]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loginLoading ? <Loader2 size={18} className="animate-spin text-white" /> : (
                  <><span>Sign In</span><ArrowRight size={16} /></>
                )}
              </button>

              <div className="mt-6 text-center text-sm text-slate-500">
                Don't have a partner account? <button type="button" onClick={() => setMode('register')} className="font-bold text-[#003365] hover:underline cursor-pointer">Apply here</button>
              </div>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegSubmit} className="flex flex-col gap-4">

              {/* Registration Step Indicator */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex-1 h-1.5 rounded-full ${regStep >= 1 ? 'bg-[#003365]' : 'bg-slate-200'}`} />
                <div className={`flex-1 h-1.5 rounded-full ${regStep >= 2 ? 'bg-[#003365]' : 'bg-slate-200'}`} />
              </div>

              {regStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="name" type="text" placeholder="John Doe" value={regForm.name} onChange={handleRegChange} required className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-[#003365]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="email" type="email" placeholder="owner@myvenue.com" value={regForm.email} onChange={handleRegChange} required className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-[#003365]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="phoneNumber" type="tel" placeholder="+91 9999999999" value={regForm.phoneNumber} onChange={handleRegChange} required className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-[#003365]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="password" type={isHidden ? 'password' : 'text'} placeholder="••••••••" value={regForm.password} onChange={handleRegChange} required className="w-full h-11 pl-11 pr-11 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-[#003365]" />
                      <button type="button" onClick={() => setIsHidden(!isHidden)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="h-11 mt-2 bg-[#003365] text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    Continue to KYC <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {regStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Business Name</label>
                    <div className="relative">
                      <Building size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="businessName" type="text" placeholder="e.g. Skyline Arena" value={regForm.businessName} onChange={handleRegChange} required className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-[#003365]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase">Business Type</label>
                      <select name="businessType" value={regForm.businessType} onChange={handleRegChange} className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-[#003365]">
                        <option>Sole Proprietorship</option>
                        <option>Partnership</option>
                        <option>LLC</option>
                        <option>Private Limited</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase">GST Number</label>
                      <input name="gstNumber" type="text" placeholder="Optional" value={regForm.gstNumber} onChange={handleRegChange} className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-[#003365]" />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col gap-3 mt-2">
                    <span className="text-xs font-bold text-blue-900">Document Verification (KYC)</span>
                    <div className="grid grid-cols-3 gap-2">
                      <select name="documentType" value={regForm.documentType} onChange={handleRegChange} className="col-span-1 h-10 px-2 bg-white border border-blue-200 rounded-lg text-xs text-slate-800 outline-none">
                        <option value="AADHAR">Aadhar</option>
                        <option value="PAN">PAN</option>
                        <option value="GST">GST Cert.</option>
                        <option value="SHOP_LICENSE">Shop License</option>
                      </select>
                      <div className="col-span-2 relative">
                        <LinkIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input name="documentUrl" type="url" placeholder="Paste document URL (e.g. GDrive)" value={regForm.documentUrl} onChange={handleRegChange} required className="w-full h-10 pl-8 pr-3 bg-white border border-blue-200 rounded-lg text-xs outline-none focus:border-[#003365]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button type="button" onClick={() => setRegStep(1)} className="h-11 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">
                      Back
                    </button>
                    <button type="submit" disabled={regLoading} className="flex-1 h-11 bg-[#003365] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#004a8f] disabled:opacity-50">
                      {regLoading ? <Loader2 size={18} className="animate-spin text-white" /> : "Submit Application"}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center text-sm text-slate-500">
                Already have a partner account? <button type="button" onClick={() => { setMode('login'); setRegStep(1); }} className="font-bold text-[#003365] hover:underline cursor-pointer">Sign in</button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
