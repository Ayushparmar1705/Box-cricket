import Loadingbarcomponent from '../Loadingbarcomponent';

export interface Column<T> {
  key?: string;
  id?: string;
  title: string;
  render?: (value: T) => React.ReactNode;
}
export type ColumnConfig<T> = Column<T>;

export interface DataTableProps<T> {
  columns: Column<T>[];
  values: T[];
  loading: boolean;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  values,
  loading = false,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-left"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {loading ? (
              <tr>
                <td colSpan={columns.length || 1} className="py-12 px-6">
                  <Loadingbarcomponent
                    label="Loading data, please wait..."
                    subtext="Fetching latest records..."
                    variant="amazon"
                    size="md"
                  />
                </td>
              </tr>
            ) : values && values.length > 0 ? (
              values.map((row: any, rowIndex: number) => (
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors w-full group" key={rowIndex}>
                  {columns.map((column, colIndex: number) => {
                    const fieldKey = column.key || column.id || '';
                    return (
                      <td key={colIndex} className="px-6 py-4 text-left text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {column.render
                          ? column.render(row)
                          : fieldKey && row[fieldKey] !== undefined && row[fieldKey] !== null
                            ? String(row[fieldKey])
                            : ''}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length || 1} className="py-16 px-6 text-center text-gray-400 dark:text-gray-500 text-sm font-medium">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}