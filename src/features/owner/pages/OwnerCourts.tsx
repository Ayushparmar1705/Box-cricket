import React from 'react';
import { Plus, RefreshCw, Building2 } from 'lucide-react';
import { useCourt } from '../hook/useCourt';
import { CommonTable } from '../../../components/common/CommonTable';
import { CommonModal } from '../../../components/common/CommonModal';
import { CommonForm } from '../../../components/common/CommonForm';
import { DeleteConfirmationModal } from '../../../components/common/DeleteConfirmationModal';
import type { Court } from '../../../types/court';

export const OwnerCourts: React.FC = () => {
  const {
    courts,
    filteredCourts,
    venues,
    loading,
    submitting,
    refreshCourts,
    searchTerm,
    setSearchTerm,
    venueFilter,
    setVenueFilter,
    columns,
    formFields,
    initialFormValues,
    isModalOpen,
    selectedCourt,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormSubmit,
    deleteModalOpen,
    courtToDelete,
    handleOpenDelete,
    handleCloseDeleteModal,
    handleConfirmDelete,
  } = useCourt();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Court & Pitch Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {courts.length} Total Courts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure individual pitches, surfaces, hourly rates, and playing equipment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshCourts}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus size={18} />
            Add New Court
          </button>
        </div>
      </div>

      {/* ── Toolbar: Venue Filter + Search ─────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Building2 size={16} className="text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            Filter by Venue:
          </span>
          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white cursor-pointer"
          >
            <option value="all">All Venues</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.venue_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Courts Table ───────────────────────────────────── */}
      <CommonTable<Court>
        data={filteredCourts}
        columns={columns}
        keyExtractor={(item) => String(item.id)}
        loading={loading}
        emptyMessage="No courts found for this venue. Click 'Add New Court' to create one."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search court by pitch name..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* ── Add / Edit Court Modal ─────────────────────────── */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCourt ? 'Edit Court / Pitch' : 'Add New Court'}
        maxWidth="max-w-3xl"
      >
        <CommonForm
          fields={formFields}
          initialValues={initialFormValues}
          mode={selectedCourt ? 'edit' : 'add'}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          submitLabel={selectedCourt ? 'Update Court' : 'Create Court'}
        />
      </CommonModal>

      {/* ── Delete Confirmation Modal ─────────────────────── */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={courtToDelete?.court_name || courtToDelete?.name || 'this court'}
        loading={submitting}
      />
    </div>
  );
};

export default OwnerCourts;
