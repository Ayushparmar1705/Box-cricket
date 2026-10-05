import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, Globe2 } from 'lucide-react';
import CommonForm from '../../Components/Common/CommonForm';
import type { FormField } from '../../Components/Common/CommonForm';
import { CommonTable, type Table } from '../../Components/Common/CommonTable';
import Navbar from '../../Components/Common/Navbar';
import CommonLoadingBar from '../../Components/Common/CommonLoadingBar';
import {
  createCountryApi,
  updateCountryApi,
  changeCountryStatusApi,
  filterCountry
} from '../services/countryService';
import toast from 'react-hot-toast';

export interface Country {
  id: number | string;
  country_name: string;
  country_code: string;
  is_active?: boolean;
  [key: string]: any;
}

const initialFormState = {
  country_name: '',
  country_code: '',
  is_active: true
};

const CountryManager: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [filterActive, setFilterActive] = useState<boolean>(true);

  // Modal & Edit state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  // Delete Confirmation state
  const [countryToDelete, setCountryToDelete] = useState<Country | null>(null);

  // Form State
  const [formData, setFormData] = useState(initialFormState);

  const fetchCountries = async (filter: boolean) => {
    setLoadingData(true);
    setApiError(null);
    try {
      const result = await filterCountry(filter);
      const list = Array.isArray(result) ? result : (result?.data || (result as any)?.content || []);
      setCountries(list);
    } catch (err: any) {
      console.error('Error fetching countries:', err);
      setApiError(err?.message || 'Failed to fetch countries');
      toast.error('Failed to load countries');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCountries(filterActive);
  }, [filterActive]);

  const handleFormChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleEditClick = (country: Country) => {
    setEditingId(country.id);
    setFormData({
      country_name: country.country_name || (country as any).name || '',
      country_code: country.country_code || (country as any).code || '',
      is_active: country.is_active ?? true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        country_name: formData.country_name.trim(),
        country_code: formData.country_code.trim().toUpperCase(),
        is_active: formData.is_active
      };

      if (editingId) {
        await updateCountryApi(editingId, payload);
        toast.success('Country updated successfully!');
      } else {
        await createCountryApi(payload);
        toast.success('Country added successfully!');
      }

      closeModal();
      await fetchCountries(filterActive);
    } catch (err: any) {
      console.error('Save failed:', err);
      setApiError(err?.message || 'Failed to save country');
      toast.error(err?.message || 'Failed to save country');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (country: Country) => {
    setCountryToDelete(country);
  };

  const cancelDelete = () => {
    setCountryToDelete(null);
  };

  const confirmDelete = async () => {
    if (!countryToDelete) return;

    try {
      const result = await changeCountryStatusApi(countryToDelete.id);
      toast.success(result.message);
      setCountryToDelete(null);
      await fetchCountries(filterActive);
    } catch (err: any) {
      console.error('Country status change failed:', err);
      toast.error(err?.message || 'Failed to change country status');
      setCountryToDelete(null);
    }
  };

  const formFields: FormField[] = [
    {
      name: 'country_name',
      label: 'Country Name',
      type: 'text',
      placeholder: 'e.g. India, Australia, United Arab Emirates',
      required: true,
      icon: <Globe2 size={16} />
    },
    {
      name: 'country_code',
      label: 'Country Code',
      type: 'text',
      placeholder: 'e.g. IN, AU, AE',
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

  const tableColumns: Table<Country>[] = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Country Name',
      accessor: 'country_name',
      render: (item) => (
        <span className="font-bold text-white">{item.country_name || item.name}</span>
      )
    },
    {
      header: 'Code',
      accessor: 'country_code',
      render: (item) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-bold">
          {item.country_code || item.code}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (item) => {
        console.log(item)
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

  const dropdownchange = (e: boolean) => {
    setFilterActive(e);
  };

  return (
    <div className="w-full text-slate-100 space-y-6 pb-12">
      {/* Top Navbar */}
      <Navbar
        pageName="Countries"
        subtitle="Manage supported countries, regional codes, and operational status."
        buttonText="Add New Country"
        onButtonClick={openAddModal}
        dropdownValue={filterActive}
        onDropdownChange={dropdownchange}
        icon={<Globe2 size={20} className="text-emerald-400" />}
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
            <span>All Countries</span>
            <span className="text-xs bg-slate-900 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              {countries.length} Total
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
              data={countries}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isActive={filterActive}
            />
          )}
        </div>
      </div>

      {/* Add / Edit Country Modal */}
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
                title={editingId ? 'Edit Country' : 'Add New Country'}
                subtitle={
                  editingId
                    ? 'Update the country details below.'
                    : 'Fill in the details below to add a new country.'
                }
                fields={formFields}
                formData={{
                  ...formData,
                  is_active: formData.is_active ? 'Active' : 'Inactive'
                }}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                submitText={editingId ? 'Update Country' : 'Save Country'}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {countryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200 p-7 text-center text-white">
            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle className="text-rose-400" size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5">Confirm Deletion</h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="text-white font-bold">{countryToDelete.country_name || (countryToDelete as any).name}</span>? This action cannot be undone.
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

export default CountryManager;
