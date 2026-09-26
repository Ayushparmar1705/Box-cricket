import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

// 1. Define how a single column should be structured
export interface TableColumn<T> {
  header: string;             // The title shown at the top of the table (e.g., "Country Name")
  accessor: keyof T | 'actions'; // The key in the data object to display (e.g., "name", "id", or "actions")
  render?: (item: T) => React.ReactNode; // Optional function to custom render a cell
}

// 2. Define the properties our CommonTable expects
interface CommonTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

/**
 * A highly reusable Table component.
 * Freshers: We use a generic type <T> so this table can accept ANY shape of data!
 */
export function CommonTable<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
}: CommonTableProps<T>) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          
          {/* Table Header */}
          <thead className="text-gray-500 font-semibold border-b border-gray-200 uppercase text-xs tracking-wider">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 font-medium text-gray-700">
                      {/* If the column is 'actions', render Edit/Delete buttons */}
                      {col.accessor === 'actions' ? (
                        <div className="flex items-center gap-3">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="text-blue-600 hover:text-blue-700 p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200 opacity-70 group-hover:opacity-100"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="text-rose-600 hover:text-rose-700 p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-transparent hover:border-rose-200 opacity-70 group-hover:opacity-100"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ) : (
                        /* Otherwise, render custom function or just the raw text */
                        col.render ? col.render(item) : String(item[col.accessor as keyof T] || '')
                      )}
                    </td>
                  ))}
                  
                </tr>
              ))
            )}
          </tbody>
          
        </table>
      </div>
    </div>
  );
}
