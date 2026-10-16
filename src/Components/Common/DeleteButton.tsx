import React from 'react';
import { Trash2, Undo } from 'lucide-react';

/**
 * ============================================================================
 * DeleteButton Component (Fresher Level / Beginner Friendly)
 * ============================================================================
 * A reusable Delete / Restore button that handles:
 * 1. Soft-Delete / Deactivate (Red color + Trash icon)
 * 2. Restore / Activate (Green color + Undo/Restore icon)
 *
 * Example Usage:
 * // Delete Button:
 * <DeleteButton onClick={() => handleDelete(item)} />
 *
 * // Restore Button:
 * <DeleteButton onClick={() => handleRestore(item)} isRestore={true} label="Restore" />
 */
export interface DeleteButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isRestore?: boolean;             // If true: shows green Restore button. If false: shows red Delete button.
  label?: string;                  // Optional text label (e.g. "Delete" or "Restore")
  disabled?: boolean;              // Disables button if true
  theme?: 'dark' | 'light';        // Light mode or Dark mode styling (default: 'light')
  className?: string;              // Custom extra CSS classes
  title?: string;                  // Tooltip on hover
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  isRestore = false,
  label,
  disabled = false,
  theme = 'light',
  className = '',
  title,
}) => {
  const isLight = theme === 'light';

  // Default tooltip based on whether it is a delete or restore action
  const buttonTitle = title || (isRestore ? 'Restore Record' : 'Delete Record');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={buttonTitle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
        isRestore
          ? isLight
            ? 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200 hover:border-emerald-300'
            : 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-800/60 hover:border-emerald-700'
          : isLight
          ? 'text-rose-700 bg-rose-50/80 hover:bg-rose-100/90 border-rose-200 hover:border-rose-300'
          : 'text-rose-400 bg-rose-950/40 hover:bg-rose-900/50 border-rose-800/60 hover:border-rose-700'
      } ${className}`}
    >
      {isRestore ? (
        <Undo size={14} className="flex-shrink-0" />
      ) : (
        <Trash2 size={14} className="flex-shrink-0" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};

export default DeleteButton;
