import { Loader2, Edit, Trash2, Eye } from 'lucide-react';
import type { CommonTableProps } from '../../types/table.types';
import { Pagination } from './Pagination';
import { SearchInput } from './SearchInput';

export function CommonTable<T>({ 
  data, 
  columns, 
  keyExtractor = (item: any) => item.id || Math.random().toString(), 
  loading = false,
  emptyMessage = "No data found.", 
  onView,
  onEdit,
  onDelete,
  customActions,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  pagination,
  onPageChange
}: CommonTableProps<T>) {

  const hasActions = Boolean(onView || onEdit || onDelete || customActions);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      {(onSearchChange !== undefined || searchValue !== undefined) && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
          {onSearchChange && (
            <SearchInput 
              value={searchValue || ''} 
              onChange={onSearchChange} 
              placeholder={searchPlaceholder} 
            />
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto relative min-h-[200px]">
          {loading && (
            <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          )}
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-700">
                {columns.map((col, idx) => (
                  <th key={String(col.key)} className={`p-4 ${idx === 0 ? 'pl-6' : ''}`}>
                    {col.label}
                  </th>
                ))}
                {hasActions && (
                  <th className="p-4 pr-6 text-right w-[150px]">Actions</th>
                )}
              </tr>
            </thead>
            
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
              {!loading && data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (hasActions ? 1 : 0)} className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr 
                    key={keyExtractor(item)} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    {columns.map((col, idx) => (
                      <td key={String(col.key)} className={`p-4 align-middle ${idx === 0 ? 'pl-6' : ''}`}>
                        {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                      </td>
                    ))}
                    
                    {hasActions && (
                      <td className="p-4 pr-6 align-middle text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {customActions && customActions(item)}
                          
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && onPageChange && (
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        )}
      </div>
    </div>
  );
}
