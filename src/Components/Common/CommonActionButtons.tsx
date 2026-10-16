import { Eye } from 'lucide-react';
import { EditButton } from './EditButton';
import { DeleteButton } from './DeleteButton';

export interface CommonActionButtonsProps<T = any> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
  onView?: (item: T) => void;
  isActive?: boolean;
  theme?: 'dark' | 'light';
  showLabels?: boolean;
}

export const CommonActionButtons = <T extends any>({
  item,
  onEdit,
  onDelete,
  onRestore,
  onView,
  isActive = true,
  theme = 'light',
  showLabels = false,
}: CommonActionButtonsProps<T>) => {
  const isLight = theme === 'light';

  return (
    <div className="flex items-center gap-1.5 flex-nowrap">
      {/* View Details Button */}
      {onView && (
        <button
          type="button"
          onClick={() => onView(item)}
          className={`p-2 rounded-xl transition-all border cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold ${
            isLight
              ? 'text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-200 shadow-xs'
              : 'text-slate-300 hover:text-emerald-400 bg-slate-900/60 hover:bg-emerald-500/10 border-slate-800 hover:border-emerald-500/30'
          }`}
          title="View Details"
        >
          <Eye size={14} />
          {showLabels && <span>View</span>}
        </button>
      )}

      {/* Common Edit Button */}
      {onEdit && (
        <EditButton
          onClick={() => onEdit(item)}
          theme={theme}
          label={showLabels ? 'Edit' : undefined}
        />
      )}

      {/* Common Delete / Restore Button */}
      {isActive ? (
        onDelete && (
          <DeleteButton
            onClick={() => onDelete(item)}
            isRestore={false}
            theme={theme}
            label={showLabels ? 'Delete' : undefined}
          />
        )
      ) : (
        (onRestore || onDelete) && (
          <DeleteButton
            onClick={() => (onRestore ? onRestore(item) : onDelete ? onDelete(item) : undefined)}
            isRestore={true}
            theme={theme}
            label={showLabels ? 'Restore' : undefined}
          />
        )
      )}
    </div>
  );
};

export default CommonActionButtons;
