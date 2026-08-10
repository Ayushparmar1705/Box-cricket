import React, { useState } from 'react';
import { MapPin, Plus, Search, Filter, LayoutGrid, List as ListIcon, MoreVertical, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVenues } from '../../../hooks/useVenues';

export const OwnerVenues: React.FC = () => {
  const { data: venues, isLoading } = useVenues();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Venues</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Manage your sports venues, courts and availability.</p>
        </div>
        <Link to="/owner/venues/create" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={18} />
          Add Venue
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search venues..." 
            className="w-full h-10 pl-9 pr-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <Filter size={16} />
            Filters
          </button>
          
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {venues?.map((venue) => (
            <div key={venue.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-48 bg-slate-200 dark:bg-slate-800 relative">
                <img 
                  src={venue.cover_image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800'} 
                  alt={venue.venue_name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm backdrop-blur-md ${
                    venue.status === 'ACTIVE' 
                      ? 'bg-emerald-500/90 text-white' 
                      : venue.status === 'PENDING'
                      ? 'bg-amber-500/90 text-white'
                      : 'bg-rose-500/90 text-white'
                  }`}>
                    {venue.status}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <Link to={`/owner/venues/${venue.id}`} className="text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1">
                    {venue.venue_name}
                  </Link>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium mb-4">
                  <MapPin size={14} />
                  <span className="truncate">{venue.address}</span>
                </div>
                
                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Rating</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{venue.average_rating} ⭐ ({venue.total_reviews})</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Courts</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">N/A</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">Venue Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {venues?.map((venue) => (
                  <tr key={venue.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={venue.cover_image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800'} 
                          className="w-10 h-10 rounded-lg object-cover"
                          alt="Venue"
                        />
                        <Link to={`/owner/venues/${venue.id}`} className="font-semibold text-slate-900 dark:text-slate-100 hover:text-emerald-600">
                          {venue.venue_name}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="truncate max-w-[150px]">{venue.address}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        venue.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {venue.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">
                      {new Date(venue.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link to={`/owner/venues/${venue.id}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-xs mr-3">View</Link>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
