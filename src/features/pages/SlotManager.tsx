// ============================================================================
// File: SlotManager.tsx
// Description: Slot Bookings & Match Schedule Management Page
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Check,
  X,
  Phone,
  Clock,
  IndianRupee,
  RefreshCw,
  Building2,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface Booking {
  id: string;
  playerName: string;
  playerPhone: string;
  turfName: string;
  date: string;
  timeSlot: string;
  amount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-9041',
    playerName: 'Rohit Verma',
    playerPhone: '+91 98765 43210',
    turfName: 'Apex Arena Court A',
    date: 'Today, 18 Oct',
    timeSlot: '07:00 PM - 09:00 PM',
    amount: 3200,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
  },
  {
    id: 'BK-9042',
    playerName: 'Aditya Sharma',
    playerPhone: '+91 98221 11223',
    turfName: 'Apex Arena Court B',
    date: 'Today, 18 Oct',
    timeSlot: '09:00 PM - 11:00 PM',
    amount: 3600,
    paymentStatus: 'PENDING',
    bookingStatus: 'PENDING',
  },
  {
    id: 'BK-9043',
    playerName: 'Kunal Patil',
    playerPhone: '+91 97654 32109',
    turfName: 'Champions Cricket Turf',
    date: 'Tomorrow, 19 Oct',
    timeSlot: '06:00 AM - 08:00 AM',
    amount: 2400,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
  },
  {
    id: 'BK-9044',
    playerName: 'Siddharth Roy',
    playerPhone: '+91 99887 76655',
    turfName: 'Apex Arena Court A',
    date: 'Tomorrow, 19 Oct',
    timeSlot: '08:00 PM - 10:00 PM',
    amount: 3200,
    paymentStatus: 'PENDING',
    bookingStatus: 'CANCELLED',
  },
];

export default function SlotManager() {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem('boxcricket_bookings');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_BOOKINGS;
  });

  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const saveBookings = (updated: Booking[]) => {
    setBookings(updated);
    try {
      localStorage.setItem('boxcricket_bookings', JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const handleUpdateBookingStatus = (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    const updated = bookings.map((b) =>
      b.id === id
        ? {
            ...b,
            bookingStatus: status,
            paymentStatus: status === 'CONFIRMED' ? ('PAID' as const) : b.paymentStatus,
          }
        : b
    );
    saveBookings(updated);
    toast.success(`Booking ${id} ${status.toLowerCase()}`);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesFilter = bookingFilter === 'ALL' || b.bookingStatus === bookingFilter;
      const matchesSearch =
        b.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.turfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.playerPhone.includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  }, [bookings, bookingFilter, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Toolbar Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Slot Bookings & Match Schedule</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live slot reservations, player confirmations, and payment tracking across all arenas.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search player, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 w-48 sm:w-64 shadow-xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs">
            {(['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setBookingFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  bookingFilter === st
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total Bookings</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{bookings.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase">Confirmed Matches</div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1">
            {bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase">Pending Confirmation</div>
          <div className="text-xl font-extrabold text-amber-700 mt-1">
            {bookings.filter((b) => b.bookingStatus === 'PENDING').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Expected Revenue</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            ₹
            {bookings
              .reduce((sum, b) => (b.bookingStatus !== 'CANCELLED' ? sum + b.amount : sum), 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── Bookings Table ── */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-4 px-6">Booking ID</th>
                <th className="py-4 px-6">Player Details</th>
                <th className="py-4 px-6">Venue Ground</th>
                <th className="py-4 px-6">Date & Slot</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No slot bookings found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-emerald-700 font-mono">{b.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{b.playerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {b.playerPhone}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-semibold">{b.turfName}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{b.date}</div>
                      <div className="text-[11px] text-emerald-700 font-medium">{b.timeSlot}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-900">₹{b.amount}</div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          b.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          b.bookingStatus === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : b.bookingStatus === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {b.bookingStatus === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                      )}
                      {b.bookingStatus !== 'CANCELLED' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'CANCELLED')}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 font-semibold text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
