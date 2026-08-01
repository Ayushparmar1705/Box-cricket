import React from 'react';
import { X } from 'lucide-react';

export interface FormFieldOption {
    label: string;
    value: string | number;
}

export interface FormField {
    name: string;
    label: string;
    type: string; // 'text', 'email', 'textarea', 'select', 'radio', etc.
    placeholder?: string;
    value: any;
    onChange: (value: any) => void;
    options?: FormFieldOption[]; // For select, radio
}

interface AddModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onAdd: () => void;
    fields?: FormField[];
    children?: React.ReactNode; // Optional, for custom fields if needed
}

// A simple reusable modal with a title, close button, and Add button
export default function AddModal({ isOpen, title, onClose, onAdd, fields, children }: AddModalProps) {

    // Don't render anything if modal is closed
    if (!isOpen) return null;

    const isEditing = title.toLowerCase().includes('edit');

    const renderField = (field: FormField) => {
        const commonClasses = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#003365]";
        
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className={`${commonClasses} min-h-[100px] resize-y`}
                    />
                );
            case 'select':
                return (
                    <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className={`${commonClasses} bg-white`}
                    >
                        {field.placeholder && (
                            <option value="" disabled>{field.placeholder}</option>
                        )}
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            case 'radio':
                return (
                    <div className="flex flex-wrap gap-4 mt-1">
                        {field.options?.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={opt.value}
                                    checked={field.value === opt.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="w-4 h-4 text-[#003365] focus:ring-[#003365]"
                                />
                                <span className="text-sm text-slate-700">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                );
            default:
                return (
                    <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className={commonClasses}
                    />
                );
        }
    };

    return (
        // Dark background overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            {/* Modal box */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">

                {/* Header: title + close button */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-slate-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                    {fields && fields.map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                {field.label}
                            </label>
                            {renderField(field)}
                        </div>
                    ))}
                    {children}
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAdd}
                        className="px-4 py-2 bg-[#003365] text-white text-sm font-semibold rounded-lg hover:bg-[#004a8f] cursor-pointer transition-colors"
                    >
                        {isEditing ? 'Save Changes' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}
