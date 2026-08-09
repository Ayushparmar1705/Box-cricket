import { Plus, Trash2, Edit2 } from 'lucide-react';
import useCity from '../hooks/useCity';
import AddModal from '../../dashboard/components/AddModel';
import DataTable from '../../../components/common/Table/DataTable';
import StatusFilter from '../../../components/common/Filter/StatusFilter';

// ── City Page ───────────────────────────────────────────
// Shows cities in DataTable with Add, Edit and Delete functionality.

export default function CityModule() {
    const {
        result,
        isOpen,
        cityName,
        setCityName,
        stateName,
        setStateName,
        openModal,
        openEditModal,
        closeModal,
        handleAdd,
        handleDelete,
        activeFilter,
        setActiveFilter,
        editingId
    } = useCity();

    const columns = [
        {
            id: 'name',
            title: 'City Name',
            render: (row: any) => (
                <div className="font-semibold text-gray-900 dark:text-gray-100">{row.name}</div>
            )
        },
        {
            id: 'state',
            title: 'State',
            render: (row: any) => (
                <div className="text-gray-600 dark:text-gray-400 font-medium">{row.state}</div>
            )
        },
        {
            id: 'status',
            title: 'Status',
            render: (row: any) => {
                const isActive = !row.deletedAt;
                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isActive
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                        }`}
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            title: 'Actions',
            render: (row: any) => {
                const isActive = !row.deletedAt;
                return isActive ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => openEditModal(row.id, row.name, row.state)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg cursor-pointer transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-600 italic">Deleted</span>
                );
            },
        },
    ];

    const formFields = [
        {
            name: 'cityName',
            label: 'City Name',
            type: 'text',
            placeholder: 'e.g. Mumbai',
            value: cityName,
            onChange: setCityName
        },
        {
            name: 'stateName',
            label: 'State Name',
            type: 'text',
            placeholder: 'e.g. Maharashtra',
            value: stateName,
            onChange: setStateName
        }
    ];

    return (
        <div className="w-full animate-in fade-in duration-500 pb-10">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Cities</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage operational cities and states</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <StatusFilter value={activeFilter} onChange={setActiveFilter} />
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm"
                    >
                        <Plus size={16} />
                        Add City
                    </button>
                </div>
            </div>

            {/* Common DataTable Component */}
            <DataTable
                columns={columns}
                values={result}
                loading={false}
                emptyMessage="No cities found. Click 'Add City' to create one."
            />

            {/* Add/Edit City Modal */}
            <AddModal
                isOpen={isOpen}
                title={editingId ? "Edit City" : "Add New City"}
                onClose={closeModal}
                onAdd={handleAdd}
                fields={formFields}
            />
        </div>
    );
}
