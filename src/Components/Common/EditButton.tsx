import React from 'react';
import { Edit2 } from 'lucide-react';

/**
 * ============================================================================
 * EditButton Component (Fresher Level / Beginner Friendly)
 * ============================================================================
 * A reusable Edit / Update button that can be used on any table row or form.
 *
 * Example Usage:
 * <EditButton onClick={() => handleEdit(item)} />
 * <EditButton onClick={() => handleEdit(item)} label="Edit" theme="light" />
 */
export interface EditButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;                  // Optional text next to the icon (e.g. "Edit")
  disabled?: boolean;              // Disables the button if true
  theme?: 'dark' | 'light';        // Light mode or Dark mode styling (default: 'light')
  className?: string;              // Custom extra CSS classes
  title?: string;                  // Tooltip on hover (default: "Edit Record")
}

export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  label,
  disabled = false,
  theme = 'light',
  className = '',
  title = 'Edit Record',
}) => {
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${isLight
          ? 'text-cyan-700 bg-cyan-50/80 hover:bg-cyan-100/90 border-cyan-200 hover:border-cyan-300'
          : 'text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/50 border-cyan-800/60 hover:border-cyan-700'
        } ${className}`}
    >
      <Edit2 size={14} className="flex-shrink-0" />
      {label && <span>{label}</span>}
    </button>
  );
};

export default EditButton;
