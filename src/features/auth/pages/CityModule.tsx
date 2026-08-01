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
                <div className="font-medium text-slate-900">{row.name}</div>
            )
        },
        {
            id: 'state',
            title: 'State',
            render: (row: any) => (
                <div className="text-slate-600">{row.state}</div>
            )
        },
        {
            id: 'status',
            title: 'Status',
            render: (row: any) => {
                const isActive = !row.deletedAt;
                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isActive
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
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
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => openEditModal(row.id, row.name, row.state)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={17} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={17} />
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400 italic">Deleted</span>
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
        <div className="w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Cities</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage operational cities and states</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <StatusFilter value={activeFilter} onChange={setActiveFilter} />
                    <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block"></div>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#003365] text-white text-sm font-semibold rounded-lg hover:bg-[#004a8f] cursor-pointer shadow-sm transition-all"
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
