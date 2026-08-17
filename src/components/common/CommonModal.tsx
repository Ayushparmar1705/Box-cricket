import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  preventCloseOnOverlayClick?: boolean;
}

export const CommonModal: React.FC<CommonModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-2xl',
  preventCloseOnOverlayClick = false
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (!preventCloseOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 mt-16 sm:mt-0">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={handleOverlayClick}
      />
      
      <div 
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col relative z-50 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          {title && (
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h3>
          )}
          <button 
            onClick={onClose}
            className="p-2 ml-auto rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 w-full max-h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
