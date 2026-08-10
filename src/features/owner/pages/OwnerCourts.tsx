import React from 'react';
import { Layers, Plus } from 'lucide-react';

export const OwnerCourts: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Courts</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage individual playing areas within your venues.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={18} />
          Add Court
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mt-4">
        <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-4">
          <Layers size={48} className="opacity-20" />
          <p className="font-medium text-lg">No courts added yet.</p>
          <button className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Click here to create your first court</button>
        </div>
      </div>
    </div>
  );
};
