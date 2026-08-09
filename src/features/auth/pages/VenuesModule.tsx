import React, { useState } from 'react';
import type { Venue, VenueImage } from '../../../types/schema.types';
import { MOCK_VENUES, MOCK_VENUE_IMAGES } from '../../../data/mockData';
import { MapPin, Star, ExternalLink, Filter } from 'lucide-react';

export const VenuesModule: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [images] = useState<VenueImage[]>(MOCK_VENUE_IMAGES);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'BLOCKED'>('ALL');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const toggleVenueStatus = (id: string) => {
    setVenues((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const nextStatus: Venue['status'] = v.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
          return { ...v, status: nextStatus, isActive: nextStatus === 'ACTIVE' };
        }
        return v;
      })
    );
  };

  const filtered = venues.filter((v) => statusFilter === 'ALL' || v.status === statusFilter);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Venue Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review venue listing verification request statuses & operating locations</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-1 rounded-lg w-fit shadow-sm">
          <Filter size={14} className="text-gray-400 ml-2" />
          {(['ALL', 'ACTIVE', 'PENDING', 'BLOCKED'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v) => {
          const cover = images.find((img) => img.venueId === v.id && img.isCover)?.imageUrl || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop';
          return (
            <div key={v.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="h-44 w-full relative bg-gray-100 dark:bg-gray-800">
                <img src={cover} alt={v.venueName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-mono tracking-wider font-semibold border border-white/10">ID: {v.id}</div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 px-2 py-1 rounded text-xs font-bold text-amber-500 dark:text-amber-400 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <Star size={12} fill="currentColor" /> {v.averageRating}
                </div>
              </div>
              
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{v.venueName}</h3>
                  <div className="flex items-start gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>{v.address}</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center"><strong className="text-gray-500 dark:text-gray-400">Owner</strong> <span className="text-gray-900 dark:text-gray-200 font-medium">{v.ownerName}</span></div>
                  <div className="flex justify-between items-center"><strong className="text-gray-500 dark:text-gray-400">City</strong> <span className="text-gray-900 dark:text-gray-200 font-medium">{v.cityName}</span></div>
                  <div className="flex justify-between items-center"><strong className="text-gray-500 dark:text-gray-400">Hours</strong> <span className="text-gray-900 dark:text-gray-200 font-medium">{v.openingTime.slice(0, 5)} - {v.closingTime.slice(0, 5)}</span></div>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {v.amenityNames.map((am) => (
                    <span key={am} className="text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">{am}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  v.status === 'ACTIVE' 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>{v.status}</span>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setSelectedVenue(v)} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer">View</button>
                  <button
                    type="button"
                    onClick={() => toggleVenueStatus(v.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      v.status === 'ACTIVE' 
                        ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400' 
                        : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {v.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedVenue && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{selectedVenue.venueName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Detailed Venue Information</p>
            </div>
            
            <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-800/50"><strong className="text-gray-500 dark:text-gray-400">Owner ID:</strong> <span className="font-mono">{selectedVenue.ownerId}</span></div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-800/50"><strong className="text-gray-500 dark:text-gray-400">City ID:</strong> <span>{selectedVenue.cityId} ({selectedVenue.cityName})</span></div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-800/50"><strong className="text-gray-500 dark:text-gray-400">Coordinates:</strong> <span className="font-mono text-xs">{selectedVenue.latitude}, {selectedVenue.longitude}</span></div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-800/50"><strong className="text-gray-500 dark:text-gray-400">Email:</strong> <span>{selectedVenue.email}</span></div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-800/50"><strong className="text-gray-500 dark:text-gray-400">Phone:</strong> <span>{selectedVenue.contactNumber}</span></div>
              <div className="flex flex-col gap-1 pb-2 border-b border-gray-50 dark:border-gray-800/50">
                <strong className="text-gray-500 dark:text-gray-400">Cancellation Policy:</strong> 
                <span className="text-xs leading-relaxed">{selectedVenue.cancellationPolicy}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <strong className="text-gray-500 dark:text-gray-400">Location:</strong>
                <a href={selectedVenue.googleMapLink} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"><ExternalLink size={14} /> Open in Maps</a>
              </div>
            </div>
            
            <button type="button" className="mt-4 w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl text-sm font-bold transition-colors cursor-pointer" onClick={() => setSelectedVenue(null)}>Close Details</button>
          </div>
        </div>
      )}
    </div>
  );
};
