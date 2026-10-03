import React from 'react';
import { Plus, Filter, ChevronDown, Layers } from 'lucide-react';

export interface NavbarProps {
  pageName: string;
  subtitle?: string;
  buttonText: string;
  onButtonClick: () => void;
  dropdownValue: boolean;
  onDropdownChange: (value: boolean) => void;
  showDropdown?: boolean;
  showButton?: boolean;
  icon?: React.ReactNode;
}

export default function Navbar({
  pageName,
  subtitle,
  buttonText,
  onButtonClick,
  dropdownValue,
  onDropdownChange,
  showDropdown = true,
  showButton = true,
  icon
}: NavbarProps) {
  return (
    <div className="w-full bg-[#0d1322] rounded-2xl border border-slate-800/80 shadow-xl p-5 sm:p-6 mb-6 transition-all text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon, Title & Subtitle */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/5 flex-shrink-0 mt-0.5 sm:mt-0">
            {icon || <Layers size={22} className="text-emerald-400" />}
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {pageName}
            </h1>
            {subtitle ? (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">
                Manage and configure records for {pageName.toLowerCase()}
              </p>
            )}
          </div>
        </div>

        {/* Right: Status Filter & Action Button */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Status Filter Dropdown */}
          {showDropdown && (
            <div className="relative flex-1 sm:flex-initial min-w-[135px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Filter size={13} />
              </div>
              <select
                aria-label="Filter status"
                value={dropdownValue.toString()}
                onChange={(e) => {
                  onDropdownChange(e.target.value === 'true');
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold pl-8 pr-8 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="true" className="bg-slate-900 text-white">Active Only</option>
                <option value="false" className="bg-slate-900 text-white">Inactive Only</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>
          )}

          {/* Add / Action Button */}
          {showButton && (
            <button
              type="button"
              onClick={onButtonClick}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex-shrink-0 cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.8} />
              <span>{buttonText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
