import React from 'react';
import { Inbox, Edit2, Trash2, Undo, Eye } from 'lucide-react';

export interface Table<T = any> {
  header: string;
  accessor: string;
  render?: (item: T) => React.ReactNode;
}

export type TableColumn<T = any> = Table<T>;
export type Column<T = any> = Table<T>;

export interface CommonTableProps<T = any> {
  columns: Table<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
  onView?: (item: T) => void;
  isActive?: boolean;
  theme?: 'dark' | 'light';
}

export function CommonTable<T extends { id?: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onRestore,
  onView,
  isActive = true,
  theme = 'dark',
}: CommonTableProps<T>) {
  const isLight = theme === 'light';

  return (
    <div
      className={`w-full rounded-2xl border overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm text-slate-800'
          : 'bg-[#0d1322] border-slate-800/80 shadow-xl text-slate-100'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          {/* --- TABLE HEADER --- */}
          <thead
            className={`border-b text-[11px] font-bold uppercase tracking-wider ${
              isLight
                ? 'bg-slate-50/90 border-slate-200 text-slate-500'
                : 'bg-[#090e1a] border-slate-800 text-slate-400'
            }`}
          >
            <tr>
              <th className="px-5 py-4 w-14 text-center">#</th>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-5 py-4 font-bold ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* --- TABLE BODY --- */}
          <tbody
            className={`divide-y ${
              isLight
                ? 'divide-slate-100 bg-white'
                : 'divide-slate-800/60 bg-[#0d1322]'
            }`}
          >
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className={`px-6 py-16 text-center ${
                    isLight ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                        isLight
                          ? 'bg-slate-100 text-slate-400 border-slate-200'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      <Inbox size={24} />
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        isLight ? 'text-slate-800' : 'text-slate-300'
                      }`}
                    >
                      No records found
                    </p>
                    <p
                      className={`text-xs ${
                        isLight ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={item.id ?? rowIndex}
                  className={`transition-colors group ${
                    isLight
                      ? 'hover:bg-slate-50/90 border-b border-slate-100/60'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  {/* Row Number */}
                  <td
                    className={`px-5 py-4 text-center font-mono text-xs transition-colors ${
                      isLight
                        ? 'text-slate-400 group-hover:text-emerald-600'
                        : 'text-slate-500 group-hover:text-emerald-400'
                    }`}
                  >
                    {rowIndex + 1}
                  </td>

                  {/* Render each column cell */}
                  {columns.map((col, colIndex) => {
                    if (col.render) {
                      return (
                        <td key={colIndex} className="px-5 py-4">
                          {col.render(item)}
                        </td>
                      );
                    }

                    if (col.accessor === 'actions') {
                      return (
                        <td key={colIndex} className="px-5 py-4">
                          <div className="flex items-center gap-1.5 flex-nowrap">
                            {onView && (
                              <button
                                type="button"
                                onClick={() => onView(item)}
                                className={`p-2 rounded-xl transition-all border cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold ${
                                  isLight
                                    ? 'text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border-slate-200'
                                    : 'text-slate-300 hover:text-emerald-400 bg-slate-900/60 hover:bg-emerald-500/10 border-slate-800'
                                }`}
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                            )}

                            {isActive ? (
                              <>
                                {onEdit && (
                                  <button
                                    type="button"
                                    onClick={() => onEdit(item)}
                                    className={`p-2 rounded-xl transition-all border cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold ${
                                      isLight
                                        ? 'text-cyan-700 bg-cyan-50/80 hover:bg-cyan-100/90 border-cyan-200'
                                        : 'text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/50 border-cyan-800/60'
                                    }`}
                                    title="Edit Record"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                )}

                                {onDelete && (
                                  <button
                                    type="button"
                                    onClick={() => onDelete(item)}
                                    className={`p-2 rounded-xl transition-all border cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold ${
                                      isLight
                                        ? 'text-rose-700 bg-rose-50/80 hover:bg-rose-100/90 border-rose-200'
                                        : 'text-rose-400 bg-rose-950/40 hover:bg-rose-900/50 border-rose-800/60'
                                    }`}
                                    title="Delete Record"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </>
                            ) : (
                              (onRestore || onDelete) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onRestore ? onRestore(item) : onDelete ? onDelete(item) : undefined
                                  }
                                  className={`p-2 rounded-xl transition-all border cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold ${
                                    isLight
                                      ? 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200'
                                      : 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-800/60'
                                  }`}
                                  title="Restore Record"
                                >
                                  <Undo size={14} />
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      );
                    }

                    const cellValue = (item as any)[col.accessor];

                    return (
                      <td
                        key={colIndex}
                        className={`px-5 py-4 font-medium ${
                          isLight ? 'text-slate-700' : 'text-slate-200'
                        }`}
                      >
                        {String(cellValue ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CommonTable;
