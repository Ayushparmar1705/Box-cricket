import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Loader2, Save } from 'lucide-react';
import { useCreateVenue } from '../../../hooks/useVenues';
import type { Venue } from '../../../types/venue';
import toast from 'react-hot-toast';

export const OwnerVenueForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const createVenue = useCreateVenue();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Venue>>({
    venue_name: '',
    description: '',
    address: '',
    contact_number: '',
    email: '',
    opening_time: '06:00',
    closing_time: '23:00',
    cancellation_policy: '',
    status: 'ACTIVE',
    is_active: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        // Implement update logic
        toast.success("Venue updated successfully");
      } else {
        await createVenue.mutateAsync(formData);
        toast.success("Venue created successfully");
      }
      navigate('/owner/venues');
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition shadow-sm cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {isEdit ? 'Edit Venue' : 'Add New Venue'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Fill in the details for your sports facility.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? 'Save Changes' : 'Save Venue'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Venue Name</label>
              <input 
                name="venue_name"
                required
                value={formData.venue_name}
                onChange={handleChange}
                placeholder="e.g. Premium Box Cricket"
                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Description</label>
              <textarea 
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your venue..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 resize-none" 
              />
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Location & Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Full Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address..."
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100" 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Contact Email</label>
              <input 
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@venue.com"
                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Contact Phone</label>
              <input 
                name="contact_number"
                type="tel"
                required
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="+91 XXXXXXXXXX"
                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100" 
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Opening Time</label>
              <input 
                name="opening_time"
                type="time"
                required
                value={formData.opening_time}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-mono" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Closing Time</label>
              <input 
                name="closing_time"
                type="time"
                required
                value={formData.closing_time}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-mono" 
              />
            </div>
            
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              >
                <option value="ACTIVE">Active (Live for Bookings)</option>
                <option value="PENDING">Pending (Draft)</option>
                <option value="BLOCKED">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
