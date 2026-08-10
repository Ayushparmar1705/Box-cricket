import React from 'react';
import { CalendarDays, Filter } from 'lucide-react';

export const OwnerBookings: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">View and manage all reservations across your venues.</p>
        </div>
        <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mt-4">
        <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-4">
          <CalendarDays size={48} className="opacity-20" />
          <p className="font-medium text-lg">No bookings found matching your criteria.</p>
        </div>
      </div>
    </div>
  );
};
