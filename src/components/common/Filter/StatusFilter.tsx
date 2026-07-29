export type StatusOption = 'all' | 'active' | 'inactive';

interface StatusFilterProps {
    value: StatusOption;
    onChange: (status: StatusOption) => void;
}

const options: { label: string; value: StatusOption }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
    return (
        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {options.map((opt) => {
                const isSelected = value === opt.value;

                const selectedStyles =
                    opt.value === 'active'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : opt.value === 'inactive'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-white text-slate-700 shadow-sm';

                const idleStyles =
                    opt.value === 'active'
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : opt.value === 'inactive'
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-slate-500 hover:bg-slate-200';

                return (
                    <button
                        key={opt.value}
                        id={`status-filter-${opt.value}`}
                        onClick={() => onChange(opt.value)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                            isSelected ? selectedStyles : idleStyles
                        }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
