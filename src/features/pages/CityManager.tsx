import React from 'react';
import { Plus, X, AlertTriangle } from 'lucide-react';
import CommonForm from '../../Components/Common/CommonForm';
import type { FormField } from '../../Components/Common/CommonForm';
import { CommonTable } from '../../Components/Common/CommonTable';
import type { TableColumn } from '../../Components/Common/CommonTable';
import { useCityData } from '../hooks/useCityData';
import type { CityData } from '../hooks/useCityData';

const CityManager: React.FC = () => {
  const {
    cities,
    states,
    loadingData,
    apiError,
    isModalOpen,
    editingId,
    cityToDelete,
    formData,
    handleFormChange,
    handleSubmit,
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    openAddModal,
    closeModal
  } = useCityData();

  const formFields: FormField[] = [
    { 
      name: 'stateId', 
      label: 'Select State', 
      type: 'select', 
      options: states, // Populated from API via hook
      required: true 
    },
    { name: 'name', label: 'City Name', type: 'text', placeholder: 'e.g. Mumbai', required: true },
    {
      name: 'is_active',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      required: true
    }
  ];

  const tableColumns: TableColumn<CityData>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'City Name', accessor: 'name' },
    { header: 'State', accessor: 'stateName' },
    { header: 'Country', accessor: 'countryName' },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${item.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {item.is_active ? "Active" : "Inactive"}
        </span>
      )
    },
    { header: 'Actions', accessor: 'actions' }
  ];

  return (
    <div className="w-full text-gray-900">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">City Manager</h1>
          <p className="text-sm text-gray-500 mt-2">Manage cities, regions, and their statuses.</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add New City
        </button>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm font-medium flex items-center gap-3 shadow-sm">
          <AlertTriangle size={18} />
          <span>API Error: {apiError}</span>
        </div>
      )}

      {/* Table Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-transparent"></div>
        
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
            All Cities
            <span className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full font-semibold shadow-sm">
              {cities.length} Total
            </span>
          </h2>
          {loadingData && (
            <span className="text-sm font-semibold text-emerald-400 animate-pulse flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              Loading data...
            </span>
          )}
        </div>

        <div className="p-2">
          <CommonTable
            columns={tableColumns}
            data={cities}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md shadow-xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400"></div>
            
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <CommonForm
                title={editingId ? "Edit City" : "Add New City"}
                subtitle={editingId ? "Update the city details below." : "Fill in the details below to add a new city."}
                fields={formFields}
                formData={{
                  ...formData,
                  is_active: formData.is_active ? 'Active' : 'Inactive'
                }}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                submitText={editingId ? "Update City" : "Save City"}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {cityToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm shadow-xl relative animate-in zoom-in-95 duration-200 p-8 text-center">
            
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-500 text-sm mb-8">
              Are you sure you want to delete <span className="text-gray-900 font-bold">{cityToDelete.name}</span>? This action cannot be undone.
            </p>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={cancelDelete}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-all shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityManager;
