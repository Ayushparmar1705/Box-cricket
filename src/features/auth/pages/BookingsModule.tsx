import React, { useState } from 'react';
import type { Booking, Slot } from '../../../types/schema.types';
import { MOCK_BOOKINGS, MOCK_SLOTS } from '../../../data/mockData';
import { Calendar, Clock, CreditCard, CheckCircle2, XCircle } from 'lucide-react';

export const BookingsModule: React.FC<{ onNotify?: (msg: string, type?: 'success' | 'info' | 'error') => void }> = ({ onNotify }) => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [slots] = useState<Slot[]>(MOCK_SLOTS);
  const [tab, setTab] = useState<'BOOKINGS' | 'SLOTS'>('BOOKINGS');
  const [filter, setFilter] = useState('ALL');

  const updateBookingStatus = (id: string, status: Booking['bookingStatus']) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updated = {
            ...b,
            bookingStatus: status,
            paymentStatus: status === 'CONFIRMED' ? ('SUCCESS' as const) : b.paymentStatus,
          };
          onNotify?.(`Booking reference ${b.bookingReference} status updated to ${status}`, 'success');
          return updated;
        }
        return b;
      })
    );
  };

  const filtered = bookings.filter((b) => filter === 'ALL' || b.bookingStatus === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Slots & Live Bookings Engine</h2>
          <p className="text-xs text-slate-500 mt-1">Monitor daily slot status matrix and review reservation audit status</p>
        </div>
        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setTab('BOOKINGS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'BOOKINGS' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('SLOTS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'SLOTS' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Lock Matrix ({slots.length})
          </button>
        </div>
      </div>

      {tab === 'BOOKINGS' ? (
        <>
          <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl w-fit">
            {(['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filter === f ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Ref ID</th>
                  <th className="px-5 py-3.5">Player Info</th>
                  <th className="px-5 py-3.5">Venue & Court</th>
                  <th className="px-5 py-3.5">Schedule</th>
                  <th className="px-5 py-3.5">Payable</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{b.bookingReference}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-950">{b.playerName}</div>
                      <div className="text-xs text-slate-400">{b.playerPhone}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800">{b.venueName}</div>
                      <div className="text-xs text-emerald-600 font-mono">{b.courtName}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Calendar size={13} className="text-slate-400" /> {b.slotDate}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Clock size={12} /> {b.slotTimes.join(', ')}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-700">
                      <div>₹{b.totalAmount}</div>
                      <div className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5 mt-0.5">
                        <CreditCard size={10} /> {b.paymentMethod}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${b.bookingStatus === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          b.bookingStatus === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {b.bookingStatus === 'CONFIRMED' && <CheckCircle2 size={12} />}
                        {b.bookingStatus === 'CANCELLED' && <XCircle size={12} />}
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {b.bookingStatus === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {b.bookingStatus !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                            className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-bold hover:bg-red-100 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Advisory Lock Grid Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {slots.map((s) => (
              <div
                key={s.id}
                className={`p-4 rounded-xl border flex flex-col gap-1 text-xs ${s.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    s.status === 'LOCKED' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      s.status === 'BOOKED' ? 'bg-blue-55 text-blue-800 border-blue-200' :
                        'bg-red-50 text-red-800 border-red-200'
                  }`}
              >
                <div className="font-bold text-sm text-slate-900">{s.startTime} - {s.endTime}</div>
                <div className="font-extrabold uppercase">{s.status}</div>
                <div className="font-semibold text-emerald-600">₹{s.price} / hr</div>
                {s.lockedBy && <div className="text-[10px] text-slate-500 font-mono mt-1">Locked: {s.lockedBy}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
