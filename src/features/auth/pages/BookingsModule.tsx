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
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Slots & Live Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor daily slot status matrix and review reservation audit status</p>
        </div>
        <div className="flex bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 p-1 rounded-lg w-fit shadow-sm">
          <button
            type="button"
            onClick={() => setTab('BOOKINGS')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              tab === 'BOOKINGS' 
                ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('SLOTS')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              tab === 'SLOTS' 
                ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
            }`}
          >
            Lock Matrix ({slots.length})
          </button>
        </div>
      </div>

      {tab === 'BOOKINGS' ? (
        <>
          <div className="flex bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 p-1 rounded-lg w-fit shadow-sm">
            {(['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filter === f 
                    ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Ref ID</th>
                    <th className="px-6 py-4">Player Info</th>
                    <th className="px-6 py-4">Venue & Court</th>
                    <th className="px-6 py-4">Schedule</th>
                    <th className="px-6 py-4">Payable</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-gray-100">{b.bookingReference}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{b.playerName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{b.playerPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800 dark:text-gray-200">{b.venueName}</div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-semibold mt-1">{b.courtName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
                          <Calendar size={14} className="text-gray-400" /> {b.slotDate}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Clock size={12} /> {b.slotTimes.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                        <div>₹{b.totalAmount}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 mt-1">
                          <CreditCard size={12} /> {b.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                            b.bookingStatus === 'CONFIRMED' 
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                              : b.bookingStatus === 'PENDING' 
                                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' 
                                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                          }`}>
                          {b.bookingStatus === 'CONFIRMED' && <CheckCircle2 size={12} />}
                          {b.bookingStatus === 'CANCELLED' && <XCircle size={12} />}
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {b.bookingStatus === 'PENDING' && (
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                              className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold cursor-pointer border border-emerald-200 dark:border-emerald-500/30 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {b.bookingStatus !== 'CANCELLED' && (
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                              className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold cursor-pointer border border-rose-200 dark:border-rose-500/30 transition-colors"
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
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-5">Advisory Lock Grid Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {slots.map((s) => (
              <div
                key={s.id}
                className={`p-5 rounded-2xl border flex flex-col gap-1.5 text-xs transition-shadow hover:shadow-md ${
                  s.status === 'AVAILABLE' 
                    ? 'bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                    : s.status === 'LOCKED' 
                      ? 'bg-amber-50/50 dark:bg-amber-500/5 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' 
                      : s.status === 'BOOKED' 
                        ? 'bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-800 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' 
                        : 'bg-rose-50/50 dark:bg-rose-500/5 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                  }`}
              >
                <div className="font-bold text-sm text-gray-900 dark:text-gray-100">{s.startTime} - {s.endTime}</div>
                <div className="font-bold uppercase tracking-wider text-[10px] opacity-80">{s.status}</div>
                <div className="font-bold text-gray-900 dark:text-gray-100 mt-1">₹{s.price} <span className="text-gray-500 dark:text-gray-400 font-normal">/ hr</span></div>
                {s.lockedBy && <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-2 bg-white/50 dark:bg-black/20 p-1.5 rounded truncate">Locked: {s.lockedBy}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
