import React, { useEffect, useState } from 'react';
import { Building2, AlertTriangle, X, Globe2 } from 'lucide-react';
import CommonForm from '../../Components/Common/CommonForm';
import type { FormField } from '../../Components/Common/CommonForm';
import { CommonTable, type Table } from '../../Components/Common/CommonTable';
import Navbar from '../../Components/Common/Navbar';
import CommonLoadingBar from '../../Components/Common/CommonLoadingBar';
import {
  fetchStatesApi,
  filterState,
  createStateApi,
  updateStateApi,
  type StateItem,
  type StatePayload,
  deleteStateApi
} from '../services/stateService';
import { fetchCountriesApi, type CountryItem } from '../services/countryService';
import toast from 'react-hot-toast';

const initialFormState: StatePayload = {
  country: '',
  state_name: '',
  state_code: '',
  is_active: true
};

const StateManager: React.FC = () => {
  const [states, setStates] = useState<StateItem[]>([]);
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [filterActive, setFilterActive] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState<StatePayload>(initialFormState);
  const [stateToDelete, setStateToDelete] = useState<StateItem>();

  // Fetch States and Countries
  const loadData = async (status: boolean = true) => {
    setLoadingData(true);
    setApiError(null);

    try {
      const [statesRes, countriesRes] = await Promise.all([
        filterState(status), // Calls http://localhost:3035/api/state/status?status={true/false}
        fetchCountriesApi(true)
      ]);

      // Extract states list from API response
      const stateList = Array.isArray(statesRes)
        ? statesRes
        : (statesRes?.data || (statesRes as any)?.content || []);
      setStates(stateList);

      // Extract countries list for the dropdown
      const countryList = Array.isArray(countriesRes)
        ? countriesRes
        : (countriesRes?.data || []);
      setCountries(countryList);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setApiError(err?.message || 'Failed to fetch states');
      toast.error(err?.message || 'Failed to load states');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData(filterActive);
  }, [filterActive]);

  const handleFormChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      country: countries.length > 0 ? countries[0].id : '',
      state_name: '',
      state_code: '',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleEditClick = (item: StateItem) => {
    setEditingId(item.id);
    const matchedCountry = countries.find(
      (c) =>
        (c.country_name && item.country_name && c.country_name.trim().toLowerCase() === item.country_name.trim().toLowerCase()) ||
        (c.country_name && item.country?.country_name && c.country_name.trim().toLowerCase() === item.country?.country_name.trim().toLowerCase()) ||
        String(c.id) === String(item.country?.id || item.country || item.countryId)
    );
    setFormData({
      country: matchedCountry ? matchedCountry.id : (item.country?.id || item.country || (countries.length > 0 ? countries[0].id : '')),
      state_name: item.state_name || item.name || '',
      state_code: item.state_code || '',
      is_active: item.is_active ?? true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: StatePayload = {
        country: Number(formData.country),
        state_name: formData.state_name.trim(),
        state_code: formData.state_code.trim().toUpperCase(),
        is_active: formData.is_active
      };

      if (editingId) {
        await updateStateApi(editingId, payload);
        toast.success('State updated successfully!');
      } else {
        await createStateApi(payload);
        toast.success('State added successfully!');
      }

      closeModal();
      await loadData(filterActive);
    } catch (err: any) {
      console.error('Save state failed:', err);
      toast.error(err?.message || 'Failed to save state');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields: FormField[] = [
    {
      name: 'country',
      label: 'Select Country',
      type: 'select',
      options: countries.map((c) => ({
        value: String(c.id),
        label: `${c.country_code ? `[${c.country_code}] ` : ''}${c.country_name || c.name}`
      })),
      required: true,
      placeholder: 'Select target country'
    },
    {
      name: 'state_name',
      label: 'State Name',
      type: 'text',
      placeholder: 'e.g. Gujarat, Maharashtra, California',
      required: true,
      icon: <Building2 size={16} />
    },
    {
      name: 'state_code',
      label: 'State Code',
      type: 'text',
      placeholder: 'e.g. GJ, MH, CA',
      required: true
    },
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

  const cancelDelete = () => {
    setStateToDelete(undefined);
  };

  const confirmDelete = async () => {
    if (!stateToDelete) return;
    try {
      const result = await deleteStateApi(Number(stateToDelete.id));
      toast.success(result.message || 'Status updated successfully');
      setStateToDelete(undefined);
      await loadData(filterActive);
    } catch (err: any) {
      console.error('Delete state failed:', err);
      toast.error(err?.message || 'Failed to delete state');
    }
  };

  const handleDeleteClick = async (item: StateItem) => {
    setStateToDelete(item);
  };

  const tableColumns: Table<StateItem>[] = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'State Name',
      accessor: 'state_name',
      render: (item) => (
        <span className="font-bold text-white">{item.state_name || item.name}</span>
      )
    },
    {
      header: 'Code',
      accessor: 'state_code',
      render: (item) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-bold">
          {item.state_code || 'N/A'}
        </span>
      )
    },
    {
      header: 'Country',
      accessor: 'country_name',
      render: (item) => {
        const countryName =
          item.country_name ||
          item.country?.country_name ||
          (typeof item.country === 'string' ? item.country : null) ||
          countries.find((c) => String(c.id) === String(item.country?.id || item.countryId || item.country))?.country_name ||
          'N/A';

        const countryCode =
          item.country?.country_code ||
          countries.find(
            (c) =>
              (c.country_name && c.country_name.toLowerCase() === countryName.toLowerCase()) ||
              String(c.id) === String(item.country?.id || item.countryId || item.country)
          )?.country_code;

        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold">
            <Globe2 size={12} className="text-slate-400" />
            <span>{countryCode ? `[${countryCode}] ` : ''}{countryName}</span>
          </span>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (item) => {
        const isActive = item.is_active === false ? false : true;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isActive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
            />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    { header: 'Actions', accessor: 'actions' }
  ];

  return (
    <div className="w-full text-slate-100 space-y-6 pb-12">
      {/* Top Navbar */}
      <Navbar
        pageName="States"
        subtitle="Manage regional states, territories, and linked countries."
        buttonText="Add New State"
        onButtonClick={openAddModal}
        dropdownValue={filterActive}
        onDropdownChange={(val) => setFilterActive(Boolean(val))}
        icon={<Building2 size={20} className="text-emerald-400" />}
      />

      {/* Error Banner */}
      {apiError && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-lg">
          <AlertTriangle size={18} className="shrink-0" />
          <span>API Error: {apiError}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-[#0d1322] rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
        {/* Table Header Row */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#090e1a]">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
            <span>All States</span>
            <span className="text-xs bg-slate-900 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              {states.length} Total
            </span>
          </h2>
          {loadingData && (
            <span className="text-xs font-semibold text-emerald-400 animate-pulse flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Loading data...
            </span>
          )}
        </div>

        {/* Data Table */}
        <div className="p-3">
          {loadingData ? (
            <div className="py-12">
              <CommonLoadingBar />
            </div>
          ) : (
            <CommonTable
              columns={tableColumns}
              data={states}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isActive={filterActive}
            />
          )}
        </div>
      </div>

      {/* Add / Edit State Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden text-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />

            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors z-10 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="p-7 sm:p-8">
              <CommonForm
                title={editingId ? 'Edit State' : 'Add New State'}
                subtitle={
                  editingId
                    ? 'Update the state details below.'
                    : 'Fill in the details below to add a new state.'
                }
                fields={formFields}
                formData={{
                  ...formData,
                  is_active: formData.is_active ? 'Active' : 'Inactive'
                }}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                submitText={editingId ? 'Update State' : 'Save State'}
              />
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {stateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200 p-7 text-center text-white">
            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle className="text-rose-400" size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5">Confirm Deletion</h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="text-white font-bold"> This action cannot be undone.</span>
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={cancelDelete}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer"
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

export default StateManager;
