import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Edit, Trash2, MapPin, Clock, Phone, Mail, Star, Layers, Settings2, Trash } from 'lucide-react';
import { useVenue, useDeleteVenue } from '../../../hooks/useVenues';
import toast from 'react-hot-toast';

export const OwnerVenueDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: venue, isLoading } = useVenue(id || '');
  const deleteVenue = useDeleteVenue();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'courts' | 'analytics'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
          <MapPin size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Venue not found</h2>
        <button onClick={() => navigate('/owner/venues')} className="text-emerald-600 font-bold hover:underline">Go back to venues</button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteVenue.mutateAsync(id || '');
      toast.success("Venue deactivated successfully.");
      navigate('/owner/venues');
    } catch (e) {
      toast.error("Failed to delete venue");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition shadow-sm cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{venue.venue_name}</h1>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                venue.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                {venue.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/owner/venues/${venue.id}/edit`} className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2">
            <Edit size={16} /> Edit
          </Link>
          <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition flex items-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 mt-2">
        {(['overview', 'courts', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="h-64 w-full bg-slate-100 dark:bg-slate-800 relative">
                <img 
                  src={venue.cover_image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800'} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">About Venue</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {venue.description || 'No description provided.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-slate-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-0.5">Address</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{venue.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="text-slate-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-0.5">Operating Hours</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{venue.opening_time.slice(0,5)} - {venue.closing_time.slice(0,5)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-slate-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-0.5">Contact</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{venue.contact_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="text-slate-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-0.5">Email</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{venue.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Venue Statistics</h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><Star size={16} /> Rating</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{venue.average_rating} ({venue.total_reviews})</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><Layers size={16} /> Total Courts</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">0</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><Settings2 size={16} /> Bookings</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-4">
              <Trash size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Delete Venue?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-bold">{venue.venue_name}</span>? This action may affect its courts, bookings, and associated data. (It will be marked as inactive).
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
