import { Inbox } from 'lucide-react';

import CommonActionButtons from './CommonActionButtons';

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
                          <CommonActionButtons
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onRestore={onRestore}
                            onView={onView}
                            isActive={isActive}
                            theme={theme}
                          />
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
