import { useEffect, type FC, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  theme?: 'dark' | 'light';
  showCloseButton?: boolean;
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

export const CommonModal: FC<CommonModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'md',
  theme = 'light',
  showCloseButton = true,
}) => {
  const isLight = theme === 'light';

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${maxWidthMap[maxWidth]} rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 border transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#0d1322] border-slate-800 text-white'
        }`}
      >
        {/* Subtle accent bar at top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div
            className={`px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b ${
              isLight ? 'border-slate-100' : 'border-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-3 pr-8">
              {icon && (
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 ${
                    isLight
                      ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                      : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3
                    className={`text-base sm:text-lg font-bold tracking-tight ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p
                    className={`text-xs mt-0.5 ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  isLight
                    ? 'text-slate-400 hover:text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-white bg-slate-900 border-slate-800 hover:bg-slate-800'
                }`}
                title="Close"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
