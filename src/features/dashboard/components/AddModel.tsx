import React from 'react';
import { X } from 'lucide-react';

interface AddModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onAdd: () => void;
    children: React.ReactNode; // the form fields go here
}

// A simple reusable modal with a title, close button, and Add button
export default function AddModal({ isOpen, title, onClose, onAdd, children }: AddModalProps) {

    // Don't render anything if modal is closed
    if (!isOpen) return null;

    return (
        // Dark background overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            {/* Modal box */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

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

                {/* Form fields passed from parent */}
                <div className="space-y-4">
                    {children}
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAdd}
                        className="px-4 py-2 bg-[#003365] text-white text-sm font-semibold rounded-lg hover:bg-[#004a8f] cursor-pointer"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
