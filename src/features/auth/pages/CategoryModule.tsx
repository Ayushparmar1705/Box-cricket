import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import useCategory from '../hooks/useCategory';
import AddModal from '../../dashboard/components/AddModel';
import DataTable from '../../../components/common/Table/DataTable';
import StatusFilter from '../../../components/common/Filter/StatusFilter';
import type { StatusOption } from '../../../components/common/Filter/StatusFilter';

// ── Category Page ───────────────────────────────────────────
// Shows categories in DataTable with Add and Delete functionality.

export default function CategoryModule() {
    const {
        result,
        isOpen,
        categoryName,
        setCategoryName,
        openModal,
        closeModal,
        handleAdd,
        handleDelete,
    } = useCategory();

    // UI-only filter state — logic will be wired later
    const [activeFilter, setActiveFilter] = useState<StatusOption>('all');

    const columns = [
        {
            id: 'name',
            title: 'Category Name',
        },
        {
            id: 'actions',
            title: 'Actions',
            render: (row: any) => (
                <button
                    onClick={() => handleDelete(row.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="Delete"
                >
                    <Trash2 size={15} />
                </button>
            ),
        },
    ];

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Categories</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage sport / venue categories</p>
                </div>
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-4 py-2 bg-[#003365] text-white text-sm font-semibold rounded-lg hover:bg-[#004a8f] cursor-pointer"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            {/* Status Filter — UI only */}
            <div className="mb-4">
                <StatusFilter value={activeFilter} onChange={setActiveFilter} />
            </div>

            {/* Common DataTable Component */}
            <DataTable
                columns={columns}
                values={result}
                loading={false}
                emptyMessage="No categories found. Click 'Add Category' to create one."
            />

            {/* Add Category Modal */}
            <AddModal
                isOpen={isOpen}
                title="Add New Category"
                onClose={closeModal}
                onAdd={handleAdd}
            >
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Category Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Box Cricket"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#003365]"
                    />
                </div>
            </AddModal>
        </div>
    );
}
