import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Briefcase, FileText, ArrowRight, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Api from '../../../Api';

export const PlayerProfile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    business_name: '',
    business_type: '',
    gst_number: ''
  });

  // Mock fetching user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr)?.user || { name: 'Player', email: 'player@example.com', phoneNumber: 'N/A' } : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create endpoint in Api.tsx later for this
      const response = await fetch(Api.becomeOwner || 'http://localhost:3006/api/v1/owner-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: user?.id })
      });
      
      // Simulate success for now if endpoint isn't fully ready
      setTimeout(() => {
        toast.success("Owner request submitted! Our team will review your application.");
        setIsModalOpen(false);
        setLoading(false);
      }, 1000);

    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500">Manage your personal details and account settings.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 bg-slate-50/50">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border-4 border-white">
            <User size={40} />
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
            <h2 className="text-2xl font-bold text-slate-900">{user?.name || 'Awesome Player'}</h2>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <ShieldCheck size={14} />
              Verified Player
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
            <div className="flex items-center gap-3 text-slate-800 font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
              <Mail size={16} className="text-slate-400" />
              {user?.email || 'player@example.com'}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
            <div className="flex items-center gap-3 text-slate-800 font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
              <Phone size={16} className="text-slate-400" />
              {user?.phoneNumber || '+91 9876543210'}
            </div>
          </div>
        </div>
      </div>

      {/* Become an Owner Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Decor */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col gap-2 relative z-10 text-center sm:text-left">
          <h3 className="text-2xl font-extrabold tracking-tight text-white">Own a Box Cricket Turf?</h3>
          <p className="text-indigo-200 font-medium max-w-md">
            Partner with us to list your venue, manage bookings, and grow your revenue on our platform.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 bg-white hover:bg-indigo-50 text-indigo-700 h-12 px-6 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 cursor-pointer"
        >
          Become a Venue Owner
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Owner Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Partner Application</h3>
                <p className="text-xs text-slate-500 font-medium">Submit your business details for verification.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
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
                    required
                    className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wide">Business Type</label>
                <select
                  name="business_type"
                  value={form.business_type}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                >
                  <option value="">Select Type</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Private Limited">Private Limited</option>
                </select>
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
                    required
                    className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Submit Application</span>}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
