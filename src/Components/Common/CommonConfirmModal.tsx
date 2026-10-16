import type { FC, ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, Trash2, Undo } from 'lucide-react';

export interface CommonConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: ReactNode;
  itemName?: string;
  type?: 'delete' | 'restore' | 'activate' | 'deactivate' | 'warning';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  theme?: 'dark' | 'light';
}

export const CommonConfirmModal: FC<CommonConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  type = 'delete',
  confirmText,
  cancelText = 'Cancel',
  isLoading = false,
  theme = 'light',
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  const isPositive = type === 'restore' || type === 'activate';

  // Defaults based on type
  const defaultTitle =
    title ||
    (type === 'delete'
      ? 'Confirm Deletion'
      : type === 'deactivate'
      ? 'Confirm Deactivation'
      : type === 'activate'
      ? 'Confirm Activation'
      : type === 'restore'
      ? 'Confirm Restoration'
      : 'Confirm Action');

  const defaultConfirmText =
    confirmText ||
    (type === 'delete'
      ? 'Delete'
      : type === 'deactivate'
      ? 'Deactivate'
      : type === 'activate'
      ? 'Activate'
      : type === 'restore'
      ? 'Restore'
      : 'Confirm');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        className={`w-full max-w-sm rounded-3xl p-6 sm:p-7 text-center relative shadow-2xl animate-in zoom-in-95 duration-200 border transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#0d1322] border-slate-800 text-white'
        }`}
      >
        {/* Status Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border transition-all ${
            isPositive
              ? isLight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : isLight
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          {isPositive ? (
            <CheckCircle2 size={28} />
          ) : (
            <AlertTriangle size={28} />
          )}
        </div>

        {/* Title */}
        <h3
          className={`text-lg font-bold mb-1.5 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          {defaultTitle}
        </h3>

        {/* Message */}
        <div
          className={`text-xs mb-6 leading-relaxed ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          {message ? (
            message
          ) : (
            <p>
              Are you sure you want to{' '}
              <span className="font-semibold">{type}</span>{' '}
              {itemName && (
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  "{itemName}"
                </span>
              )}
              ?
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60 text-white ${
              isPositive
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
            }`}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isPositive ? (
              <>
                <Undo size={14} />
                <span>{defaultConfirmText}</span>
              </>
            ) : (
              <>
                <Trash2 size={14} />
                <span>{defaultConfirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonConfirmModal;
