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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Venue Management</h2>
          <p className="text-xs text-slate-500 mt-1">Review venue listing verification request statuses & operating locations</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 p-1 rounded-xl w-fit">
          <Filter size={13} className="text-slate-400 ml-2" />
          {(['ALL', 'ACTIVE', 'PENDING', 'BLOCKED'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === s ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((v) => {
          const cover = images.find((img) => img.venueId === v.id && img.isCover)?.imageUrl || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop';
          return (
            <div key={v.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="h-40 w-full relative bg-slate-100">
                <img src={cover} alt={v.venueName} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">ID: {v.id}</div>
                <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 bg-white/95 px-2 py-0.5 rounded text-xs font-bold text-amber-500 border border-slate-200 shadow-sm">
                  <Star size={12} fill="currentColor" /> {v.averageRating}
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{v.venueName}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><MapPin size={12} className="text-slate-400" />{v.address}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col gap-1">
                  <div className="flex justify-between"><strong>Owner:</strong> <span className="text-slate-600">{v.ownerName}</span></div>
                  <div className="flex justify-between"><strong>City:</strong> <span className="text-slate-600">{v.cityName}</span></div>
                  <div className="flex justify-between"><strong>Hours:</strong> <span className="text-slate-600">{v.openingTime.slice(0, 5)} - {v.closingTime.slice(0, 5)}</span></div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {v.amenityNames.map((am) => (
                    <span key={am} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/50">{am}</span>
                  ))}
                </div>
              </div>
              <div className="p-3 border-t border-slate-150 bg-slate-50 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                  v.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>{v.status}</span>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setSelectedVenue(v)} className="px-2 py-1 bg-slate-200 hover:bg-slate-350 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer">View</button>
                  <button
                    type="button"
                    onClick={() => toggleVenueStatus(v.id)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer border ${
                      v.status === 'ACTIVE' ? 'bg-red-50 text-red-750 border-red-200' : 'bg-emerald-50 text-emerald-750 border-emerald-200'
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl flex flex-col gap-3">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">{selectedVenue.venueName}</h3>
            <div className="text-xs text-slate-700 flex flex-col gap-1.5 font-mono">
              <div><strong>Owner ID:</strong> {selectedVenue.ownerId}</div>
              <div><strong>City ID:</strong> {selectedVenue.cityId} ({selectedVenue.cityName})</div>
              <div><strong>GPS Coordinates:</strong> {selectedVenue.latitude}, {selectedVenue.longitude}</div>
              <div><strong>Contact Email:</strong> {selectedVenue.email}</div>
              <div><strong>Contact Phone:</strong> {selectedVenue.contactNumber}</div>
              <div><strong>Cancellation:</strong> {selectedVenue.cancellationPolicy}</div>
              <div>
                <strong>Google Maps Link:</strong>{' '}
                <a href={selectedVenue.googleMapLink} target="_blank" rel="noreferrer" className="text-emerald-600 underline flex items-center gap-0.5"><ExternalLink size={10} /> View Link</a>
              </div>
            </div>
            <button type="button" className="mt-2 w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer" onClick={() => setSelectedVenue(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
