import React from 'react';
import { Edit2, Trash2, Inbox, Undo } from 'lucide-react';

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
  isActive?: boolean;
}

export function CommonTable<T extends { id?: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  isActive,
}: CommonTableProps<T>) {
  return (
    <div className="w-full bg-[#0d1322] rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl text-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          {/* --- TABLE HEADER --- */}
          <thead className="bg-[#090e1a] border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4 w-14 text-center">#</th>
              {columns.map((col, index) => (
                <th key={index} className="px-5 py-4 font-bold text-slate-300">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* --- TABLE BODY --- */}
          <tbody className="divide-y divide-slate-800/60 bg-[#0d1322]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-16 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800">
                      <Inbox size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-300">No records found</p>
                    <p className="text-xs text-slate-500">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={item.id ?? rowIndex}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Row Number */}
                  <td className="px-5 py-4 text-center font-mono text-xs text-slate-500 group-hover:text-emerald-400 transition-colors">
                    {rowIndex + 1}
                  </td>

                  {/* Render each column cell */}
                  {columns.map((col, colIndex) => {
                    if (col.accessor === 'actions') {
                      return (
                        <td key={colIndex} className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            {isActive ? (
                              <>
                                {onEdit && (
                                  <button
                                    type="button"
                                    onClick={() => onEdit(item)}
                                    className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 active:bg-cyan-500/20 rounded-xl transition-all border border-transparent hover:border-cyan-500/30 cursor-pointer"
                                    title="Edit Record"
                                  >
                                    <Edit2 size={15} />
                                  </button>
                                )}

                                {onDelete && (
                                  <button
                                    type="button"
                                    onClick={() => onDelete(item)}
                                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 active:bg-rose-500/20 rounded-xl transition-all border border-transparent hover:border-rose-500/30 cursor-pointer"
                                    title="Delete Record"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                )}
                              </>
                            ) : (
                              onDelete && (
                                <button
                                  type="button"
                                  onClick={() => onDelete(item)}
                                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 active:bg-rose-500/20 rounded-xl transition-all border border-transparent hover:border-rose-500/30 cursor-pointer"
                                  title="Restore Record"
                                >
                                  <Undo size={15} />
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      );
                    }

                    const cellValue = (item as any)[col.accessor];

                    return (
                      <td key={colIndex} className="px-5 py-4 text-slate-200 font-medium">
                        {col.render ? col.render(item) : String(cellValue ?? '')}
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
