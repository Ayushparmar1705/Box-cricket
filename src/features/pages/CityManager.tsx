import React, { useEffect, useState } from 'react';
import { MapPin, AlertTriangle, X, Building2, Globe2 } from 'lucide-react';
import CommonForm from '../../Components/Common/CommonForm';
import type { FormField } from '../../Components/Common/CommonForm';
import { CommonTable } from '../../Components/Common/CommonTable';
import type { TableColumn } from '../../Components/Common/CommonTable';
import Navbar from '../../Components/Common/Navbar';
import { fetchStatesApi } from '../services/stateService';
import { createCityApi, updateCityApi, changeCityStatusApi, fetchCitiesApi } from '../services/cityService';
import toast from 'react-hot-toast';
import CommonLoadingBar from '../../Components/Common/CommonLoadingBar';

interface CityData {
  id: number | string;
  name: string;
  countryName?: string;
  is_active: boolean;
  stateName?: string;
  [key: string]: any;
}

const CityManager: React.FC = () => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [cityToDelete, setcityToDelete] = useState<CityData | null>(null);
  const [filterActive, setfilterActive] = useState(true);
  const [formData, setFormData] = useState<{
    id: number;
    name: string;
    stateId: number;
    is_active: boolean | string;
  }>({
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
    try {
      const result = await changeCityStatusApi(cityToDelete.id);
      if (result && (result.status === 200 || result.success)) {
        toast.success(result.message || 'Status updated');
        setcityToDelete(null);
        fetchCities(filterActive);
      } else {
        toast.error(result?.error || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const fetchState = async () => {
    try {
      const res = await fetchStatesApi();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setStates(list);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const openAddModel = () => {
    setEditingId(null);
    setFormData({
      id: 0,
      name: '',
      stateId: states.length > 0 ? states[0].id : 0,
      is_active: true
    });
    setIsModelOpen(true);
  };

  const closeModal = () => {
    setIsModelOpen(false);
  };

  const fetchCities = async (status: boolean = filterActive) => {
    setLoadingData(true);
    setApiError('');
    try {
      const res = await fetchCitiesApi(status);
      const rawList = Array.isArray(res) ? res : (res?.data || []);
      const mappedList: CityData[] = rawList.map((item: any) => ({
        id: item.id,
        name: item.city_name || item.name || '',
        countryName: item.countryName || item.country_name || '',
        stateName: item.stateName || item.state_name || (item.state?.state_name) || '',
        is_active: item.is_active !== undefined ? item.is_active : true,
      }));
      setCities(mappedList);
    } catch (error) {
      console.error("Error while fetching cities:", error);
      setApiError("Failed to fetch cities");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCities(filterActive);
  }, []);

  const handleSubmit = async () => {
    const isActiveBool = typeof formData.is_active === 'string'
      ? formData.is_active === 'Active'
      : Boolean(formData.is_active);

    const payload = {
      state: Number(formData.stateId),
      city_name: formData.name,
      city_code: formData.name ? formData.name.substring(0, 3).toUpperCase() : 'CTY',
      is_active: isActiveBool
    };

    try {
      const result = editingId
        ? await updateCityApi(editingId, payload)
        : await createCityApi(payload);

      if (result) {
        toast.success(editingId ? "City updated successfully" : "City added successfully");
        closeModal();
        await fetchCities(filterActive);
      } else {
        toast.error(editingId ? "Error updating city" : "Error while adding city");
      }
    } catch (err: any) {
      toast.error(err.message || (editingId ? "Error updating city" : "Error while adding city"));
    }
  };

  const handleFilterDropdown = async (value: boolean) => {
    setfilterActive(value);
    await fetchCities(value);
  };

  const formFields: FormField[] = [
    {
      name: 'stateId',
      label: 'Select State',
      type: 'select',
      options: states.map((s: any) => ({
        value: s.id,
        label: s.state_name || s.name,
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
    const foundState = states.find((s: any) =>
      s.id === city.stateId ||
      s.id === city.state?.id ||
      (s.state_name || s.name)?.toLowerCase() === (city.stateName || city.state_name)?.toLowerCase()
    );
    setFormData({
      id: typeof city.id === 'number' ? city.id : parseInt(String(city.id), 10) || 0,
      name: city.name || '',
      stateId: foundState ? foundState.id : (states.length > 0 ? states[0].id : 0),
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
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
              isActive={filterActive}
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

      {/* Delete / Restore Confirmation Modal */}
      {cityToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200 p-7 text-center text-white">
            <div className={`w-14 h-14 ${cityToDelete.is_active ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} rounded-2xl flex items-center justify-center mx-auto mb-4 border`}>
              <AlertTriangle className={cityToDelete.is_active ? 'text-rose-400' : 'text-emerald-400'} size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5">
              {cityToDelete.is_active ? 'Confirm Deletion' : 'Confirm Restoration'}
            </h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Are you sure you want to {cityToDelete.is_active ? 'deactivate' : 'restore'}{' '}
              <span className="text-white font-bold">{cityToDelete.name}</span>?
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
                className={`flex-1 ${cityToDelete.is_active ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer`}
              >
                {cityToDelete.is_active ? 'Delete' : 'Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityManager;
