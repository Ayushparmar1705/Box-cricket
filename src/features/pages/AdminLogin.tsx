import React from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';

const AdminLogin: React.FC = () => {
  const { 
    email, setEmail, 
    password, setPassword, 
    showPassword, setShowPassword, 
    handleSubmit, isLoading, error 
  } = useLogin();

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">

      {/* Left side: Brand / Graphic Area */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden items-center justify-center p-12">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

        <div className="relative z-10 text-white max-w-xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-8 border border-white/20">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Box Cricket <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Operations Hub
            </span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Manage court bookings, monitor revenue analytics, and oversee your entire turf operations from a single, secure dashboard.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-emerald-400 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Real-time Analytics</h4>
                <p className="text-sm text-gray-400">Track turf utilization dynamically.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Secure Access</h4>
                <p className="text-sm text-gray-400">Enterprise-grade security controls.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        <div className="w-full max-w-[420px] animate-fade-in-up">

          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden inline-flex items-center justify-center p-3 bg-gray-900 rounded-2xl mb-6 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to your administrative account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5 group">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                  placeholder="admin@boxcricket.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-12 text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Protected by reCAPTCHA and subject to the{' '}
            <a href="#" className="font-medium text-gray-900 hover:underline">Privacy Policy</a>{' '}
            and{' '}
            <a href="#" className="font-medium text-gray-900 hover:underline">Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
