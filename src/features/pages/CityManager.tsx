import React, { useEffect, useState } from 'react';
import { MapPin, AlertTriangle, X, Building2, Globe2 } from 'lucide-react';
import CommonForm from '../../Components/Common/CommonForm';
import type { FormField } from '../../Components/Common/CommonForm';
import { CommonTable } from '../../Components/Common/CommonTable';
import type { TableColumn } from '../../Components/Common/CommonTable';
import Navbar from '../../Components/Common/Navbar';
import { fetchStatesApi } from '../services/stateService';
import { addCityApi, changeStatusApi, fetchCitiesApi } from '../services/cityService';
import toast from 'react-hot-toast';
import CommonLoadingBar from '../../Components/Common/CommonLoadingBar';

interface CityData {
  id: number;
  name: string;
  countryName?: string;
  is_active: boolean;
  stateName?: string;
}

const CityManager: React.FC = () => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [cityToDelete, setcityToDelete] = useState<CityData | null>(null);
  const [filterActive, setfilterActive] = useState(true);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    stateId: 0,
    is_active: true
  });
  const handleFormChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };
  const cancelDelete = () => {
    setcityToDelete(null);
  };

  const confirmDelete = async () => {
    if (!cityToDelete) return;
    const result = await changeStatusApi(cityToDelete.id);
    if (result && (result.status === 200 || result.success)) {
      toast.success(result.message || 'Status updated');
      setcityToDelete(null);
      fetchCities();
    } else {
      toast.error(result?.error || 'Failed to update status');
    }
  };

  const fetchState = async () => {
    const data = await fetchStatesApi();
    setStates(data);
    console.log(data);

  }

  useEffect(() => {
    fetchState();
  }, []);

  const openAddModel = () => {
    setEditingId(null);
    setIsModelOpen(true);

  }

  const closeModal = () => {
    setIsModelOpen(false);
  }

  const fetchCities = async () => {
    setLoadingData(true);
    try {
      const data = await fetchCitiesApi();
      setCities(data);
    } catch (error) {
      console.error("Error while fetching cities:", error);
      setApiError("Failed to fetch cities");
    } finally {
      setLoadingData(false);
    }

  }

  useEffect(() => {
    fetchCities();
  }, []);

  const handleSubmit = async () => {
    const result = await addCityApi(formData);
    if (result) {
      toast.success("City Added succesfully");
      closeModal();
      await fetchCities();
    } else {
      toast.error("Error while adding city");
    }
  }

  const handleFilterDropdown = async (value: boolean) => {
    setfilterActive(value);
    if (value === true) {
      await fetchCities();
    } else {
      await fetchCities();
    }
  }

  const formFields: FormField[] = [
    {
      name: 'stateId',
      label: 'Select State',
      type: 'select',
      options: states.map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
      required: true,
      placeholder: 'Choose governing state'
    },
    {
      name: 'name',
      label: 'City Name',
      type: 'text',
      placeholder: 'e.g. Mumbai, Ahmedabad, Sydney, London',
      required: true,
      icon: <MapPin size={16} />
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
    },

  ];
  const handleEditClick = (city: CityData) => {
    setEditingId(city.id);
    setFormData({
      id: city.id,
      name: city.name,
      stateId: states.find((s: any) => s.name === city.stateName)?.id || 0,
      is_active: city.is_active
    });
    setIsModelOpen(true);
  };

  const handleDeleteClick = (item: CityData) => {
    setcityToDelete(item);
  };

  const tableColumns: TableColumn<CityData>[] = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'City Name',
      accessor: 'name',
      render: (item: CityData) => (
        <span className="font-bold text-white">{item.name}</span>
      )
    },
    {
      header: 'State',
      accessor: 'stateName',
      render: (item: CityData) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold">
          <Building2 size={12} className="text-slate-400" />
          <span>{item.stateName || 'State Region'}</span>
        </span>
      )
    },
    {
      header: 'Country',
      accessor: 'countryName',
      render: (item: CityData) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-400 text-xs font-medium">
          <Globe2 size={12} className="text-slate-500" />
          <span>{item.countryName || 'Global'}</span>
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (item: CityData) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${item.is_active
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
          />
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { header: 'Actions', accessor: 'actions' }
  ];

  return (
    <div className="w-full text-slate-100 space-y-6 pb-12">
      {/* Top Navbar */}
      <Navbar
        pageName="Cities"
        subtitle="Manage municipal areas, turf booking clusters, and metropolitan operations."
        buttonText="Add New City"
        onButtonClick={openAddModel}
        dropdownValue={filterActive}
        onDropdownChange={handleFilterDropdown}
        icon={<MapPin size={20} className="text-emerald-400" />}
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
            <span>All Cities</span>
            <span className="text-xs bg-slate-900 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              {cities.length} Total
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
              data={cities}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Add / Edit City Modal */}
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
                title={editingId ? 'Edit City' : 'Add New City'}
                subtitle={
                  editingId
                    ? 'Update the city details below.'
                    : 'Fill in the details below to add a new city.'
                }
                fields={formFields}
                formData={{
                  ...formData,
                  is_active: formData.is_active ? 'Active' : 'Inactive'
                }}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                submitText={editingId ? 'Update City' : 'Save City'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {cityToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200 p-7 text-center text-white">
            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle className="text-rose-400" size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5">Confirm Deletion</h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="text-white font-bold">{cityToDelete.name}</span>? This action cannot be undone.
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

export default CityManager;
