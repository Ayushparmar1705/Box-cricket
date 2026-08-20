// ── React & Lucide Icons ──────────────────────────────────────────────────────
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';

// ── Custom Hooks & Shared Components ──────────────────────────────────────────
import { useVenue } from '../hook/useVenue';
import { CommonTable } from '../../../components/common/CommonTable';
import { CommonModal } from '../../../components/common/CommonModal';
import { CommonForm } from '../../../components/common/CommonForm';
import { DeleteConfirmationModal } from '../../../components/common/DeleteConfirmationModal';

// ── Types ─────────────────────────────────────────────────────────────────────
import type { Venue } from '../../../types/venue';

/**
 * OwnerVenues - React Page Component for Owners to manage their Box Cricket Venues.
 * 
 * Design for Freshers:
 * - We fetch states & handlers from the `useVenue()` hook (Lines 11-33).
 * - The JSX layout is divided into 4 clear sections:
 *   1. Header (with statistics and "Add New Venue" action button)
 *   2. Main Venues Data Grid/Table
 *   3. Pop-up form modal for Adding or Editing venue profiles
 *   4. Pop-up dialog to confirm deletion of venues
 */
export const OwnerVenues: React.FC = () => {
  // Destructure (extract) everything we need from our custom useVenue hook
  const {
    venues,
    filteredVenues,
    loading,
    submitting,
    refreshVenues,
    searchTerm,
    setSearchTerm,
    columns,
    formFields,
    initialFormValues,
    isModalOpen,
    selectedVenue,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormSubmit,
    deleteModalOpen,
    venueToDelete,
    handleOpenDelete,
    handleCloseDeleteModal,
    handleConfirmDelete,
  } = useVenue();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* ── 1. Page Header Section ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              My Venues
            </h1>
            {/* Total counter pill */}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {venues.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your sports venues, operating schedules, and ground locations.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={refreshVenues}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Add New Venue Action Button */}
          <button
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus size={18} />
            Add New Venue
          </button>
        </div>
      </div>

      {/* ── 2. Data Table Section ─────────────────────────────────────────── */}
      {/* Renders filtered venues inside our custom reusable data table component */}
      <CommonTable<Venue>
        data={filteredVenues}
        columns={columns}
        keyExtractor={(item) => String(item.id)}
        loading={loading}
        emptyMessage="No venues found. Click 'Add New Venue' to list your sports arena."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search venues by name or address..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* ── 3. Add / Edit Pop-up Form Modal ──────────────────────────────── */}
      {/* Appears when clicking 'Add' or 'Edit' on a venue profile */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedVenue ? 'Edit Venue' : 'Add New Venue'} // Update header title dynamically
        maxWidth="max-w-3xl"
      >
        <CommonForm
          fields={formFields}
          initialValues={initialFormValues}
          mode={selectedVenue ? 'edit' : 'add'}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          submitLabel={selectedVenue ? 'Update Venue' : 'Create Venue'} // Dynamic submit button label
        />
      </CommonModal>

      {/* ── 4. Delete Confirmation Dialog ─────────────────────────────────── */}
      {/* Prompts the user to confirm before removing a venue profile */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={venueToDelete?.venue_name || 'this venue'}
        loading={submitting}
      />
    </div>
  );
};

export default OwnerVenues;
