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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length || 1} className="py-10 px-6">
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
                <tr className="hover:bg-slate-50/80 transition-colors" key={rowIndex}>
                  {columns.map((column, colIndex: number) => {
                    const fieldKey = column.key || column.id || '';
                    return (
                      <td key={colIndex} className="p-5 text-center text-sm text-slate-700">
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
                <td colSpan={columns.length || 1} className="py-12 px-6 text-center text-slate-400 font-medium">
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