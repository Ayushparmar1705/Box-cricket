import React from 'react';
import { User, Mail, Phone, ShieldCheck, Briefcase, FileText, ArrowRight, X, Loader2 } from 'lucide-react';
import useProfile from '../hook/useProfile';

export const PlayerProfile: React.FC = () => {
  const {
    user,
    isModalOpen,
    setIsModalOpen,
    loading,
    step,
    setStep,
    form,
    handleChange,
    handleFileChange,
    handleNext,
    handleSubmit
  } = useProfile();

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 sm:p-8 border-b border-slate-100 bg-white">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Partner Application</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Submit your details to start hosting.</p>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); setStep(1); }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Visual Stepper */}
            <div className="px-6 sm:px-8 pt-6 pb-2 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full"></div>
                {/* Active Progress */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: step === 1 ? '0%' : '100%' }}
                ></div>

                {/* Step 1 Node */}
                <div className="relative flex flex-col items-center gap-2 bg-slate-50 px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-50 transition-colors duration-300 ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <Briefcase size={16} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>Business</span>
                </div>

                {/* Step 2 Node */}
                <div className="relative flex flex-col items-center gap-2 bg-slate-50 px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-50 transition-colors duration-300 ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <FileText size={16} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>Documents</span>
                </div>
              </div>
            </div>

            {/* Scrollable Form Area */}
            <div className="overflow-y-auto p-6 sm:p-8 bg-white flex-1">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {step === 1 ? (
                  <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Business Name</label>
                      <div className="relative group">
                        <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                        <input
                          name="business_name"
                          type="text"
                          placeholder="e.g. Metro Sports Arena"
                          value={form.business_name}
                          onChange={handleChange}
                          required
                          className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold placeholder:font-normal placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Business Type</label>
                      <select
                        name="business_type"
                        value={form.business_type}
                        onChange={handleChange}
                        required
                        className="w-full h-14 px-4 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold appearance-none"
                      >
                        <option value="" disabled className="font-normal">Select Business Structure</option>
                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Private Limited">Private Limited</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">GST Number</label>
                      <div className="relative group">
                        <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                        <input
                          name="gst_number"
                          type="text"
                          placeholder="22AAAAA0000A1Z5"
                          value={form.gst_number}
                          onChange={handleChange}
                          required
                          className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold uppercase tracking-wider placeholder:font-normal placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
                      <ShieldCheck className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                      <p className="text-xs font-medium text-indigo-900 leading-relaxed">
                        Please upload your business and identity documents. They are securely encrypted and required for verification.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Aadhar Upload */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-700 tracking-wide uppercase">Aadhar Card</label>
                        <div className={`relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${form.documents.AADHAR ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400'}`}>
                          <input type="file" onChange={(e) => handleFileChange('AADHAR', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                          {form.documents.AADHAR ? (
                            <div className="flex flex-col items-center gap-1.5 relative z-10 p-2 text-center">
                              <ShieldCheck size={20} className="text-indigo-600" />
                              <p className="text-[10px] font-bold text-indigo-900 truncate w-full px-2">{form.documents.AADHAR.name}</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5 pointer-events-none relative z-10 p-2 text-center">
                              <FileText size={20} className="text-slate-400" />
                              <p className="text-[10px] font-bold text-slate-500">Upload Aadhar</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PAN Upload */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-700 tracking-wide uppercase">PAN Card</label>
                        <div className={`relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${form.documents.PAN ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400'}`}>
                          <input type="file" onChange={(e) => handleFileChange('PAN', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                          {form.documents.PAN ? (
                            <div className="flex flex-col items-center gap-1.5 relative z-10 p-2 text-center">
                              <ShieldCheck size={20} className="text-indigo-600" />
                              <p className="text-[10px] font-bold text-indigo-900 truncate w-full px-2">{form.documents.PAN.name}</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5 pointer-events-none relative z-10 p-2 text-center">
                              <FileText size={20} className="text-slate-400" />
                              <p className="text-[10px] font-bold text-slate-500">Upload PAN</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* GST Upload */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-700 tracking-wide uppercase">GST Certificate</label>
                        <div className={`relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${form.documents.GST ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400'}`}>
                          <input type="file" onChange={(e) => handleFileChange('GST', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                          {form.documents.GST ? (
                            <div className="flex flex-col items-center gap-1.5 relative z-10 p-2 text-center">
                              <ShieldCheck size={20} className="text-indigo-600" />
                              <p className="text-[10px] font-bold text-indigo-900 truncate w-full px-2">{form.documents.GST.name}</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5 pointer-events-none relative z-10 p-2 text-center">
                              <FileText size={20} className="text-slate-400" />
                              <p className="text-[10px] font-bold text-slate-500">Upload GST</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shop License Upload */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-700 tracking-wide uppercase">Shop License</label>
                        <div className={`relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${form.documents.SHOP_LICENSE ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400'}`}>
                          <input type="file" onChange={(e) => handleFileChange('SHOP_LICENSE', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                          {form.documents.SHOP_LICENSE ? (
                            <div className="flex flex-col items-center gap-1.5 relative z-10 p-2 text-center">
                              <ShieldCheck size={20} className="text-indigo-600" />
                              <p className="text-[10px] font-bold text-indigo-900 truncate w-full px-2">{form.documents.SHOP_LICENSE.name}</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5 pointer-events-none relative z-10 p-2 text-center">
                              <FileText size={20} className="text-slate-400" />
                              <p className="text-[10px] font-bold text-slate-500">Upload License</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-4 pt-6 border-t border-slate-100">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={loading}
                      className="h-14 px-8 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold rounded-2xl transition-all shadow-sm cursor-pointer"
                    >
                      Back
                    </button>
                  )}

                  {step === 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className={`flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      <span>Continue to Documents</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Submit Application</span>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
