import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select...",
    className = "",
}: {
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { id: string | number; name: string }[];
    placeholder?: string;
    className?: string;
}) {
    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 pr-10 outline-none appearance-none shadow-sm transition-all hover:border-emerald-300 cursor-pointer"
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                </div>
            </div>
        </div>
    );
}
