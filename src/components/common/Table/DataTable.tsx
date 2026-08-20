import React from 'react';
import { Loader2, Inbox } from 'lucide-react';

export interface DataTableColumn<T = any> {
  id?: string;
  key?: string;
  title?: string;
  label?: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  values?: T[];
  data?: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  values,
  data,
  loading = false,
  emptyMessage = 'No records found.',
  onRowClick,
}) => {
  const rows = values || data || [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
              {columns.map((col, idx) => {
                const colKey = col.id || col.key || String(idx);
                const colTitle = col.title || col.label || '';
                return (
                  <th
                    key={colKey}
                    className={`p-4 text-xs font-bold uppercase tracking-wider ${
                      idx === 0 ? 'pl-6' : ''
                    } ${idx === columns.length - 1 ? 'pr-6' : ''}`}
                  >
                    {colTitle}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 size={28} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox size={36} className="opacity-30" />
                    <p className="font-semibold text-sm text-slate-600 dark:text-slate-400">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row: any, rIdx: number) => {
                const rowKey = row?.id || row?._id || rIdx;
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick?.(row)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((col, cIdx) => {
                      const colKey = col.id || col.key || String(cIdx);
                      return (
                        <td
                          key={colKey}
                          className={`p-4 ${cIdx === 0 ? 'pl-6' : ''} ${
                            cIdx === columns.length - 1 ? 'pr-6' : ''
                          }`}
                        >
                          {col.render
                            ? col.render(row)
                            : row[col.id || col.key || ''] !== undefined
                            ? String(row[col.id || col.key || ''])
                            : '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
