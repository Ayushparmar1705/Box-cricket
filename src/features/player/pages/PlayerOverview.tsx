import React from 'react';
import { MapPin, Star } from 'lucide-react';

export const PlayerOverview: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Discover Venues</h1>
        <p className="text-gray-500 dark:text-gray-400">Find and book the best box cricket turfs near you.</p>
      </div>

      {/* Placeholder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md dark:shadow-none transition-shadow cursor-pointer group">
            <div className="h-48 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=600&sig=${i}`}
                alt="Turf"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-800">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                4.8
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Premium Turf Arena {i}</h3>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-lg leading-tight">₹1200<span className="text-xs text-gray-500 dark:text-gray-400 font-normal">/hr</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                <MapPin size={14} className="text-gray-400 dark:text-gray-500" />
                <span>Andheri West, Mumbai</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
