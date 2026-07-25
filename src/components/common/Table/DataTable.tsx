interface Column<T> {
  key: string;
  title: string;
  render?: (value: T) => React.ReactNode;
}
interface DataTableProps<T> {
  columns: Column<T>[];
  values: T[];
  loading: boolean;
  emptyMessage: string;
}

export default function DataTable<T>({ columns, values, loading = false, emptyMessage = "No data found.",
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

                  className={`px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 align-center`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {values.map((data, index) => (

              <tr className={'p-5'} key={index}>
                <td className="p-5 text-center">{data.businessName}</td>
                <td className="p-5 text-center">{data.businessType}</td>
                <td className="p-5 text-center">{data.gstNumber}</td>
                <td className={`p-5 text-center ${data.status === 'Pending' ? 'text-yellow-600' : data.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>{data.status}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}