import { useState, useEffect } from 'react';
import { fetchStatesApi } from '../services/stateService';
import { fetchCountriesApi } from '../services/countryService';

export interface StateData {
  id: number;
  name: string;
  code: string;
  country_id?: number; // Optional until backend is strictly confirmed
  is_active: boolean;
}

export const useStateData = () => {
  const [states, setStates] = useState<StateData[]>([]);
  const [countries, setCountries] = useState<{ value: string, label: string }[]>([]); // For the dropdown

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [loadingData, setLoadingData] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [stateToDelete, setStateToDelete] = useState<StateData | null>(null);

  // Default form state
  const initialFormState = {
    name: '',
    code: '',
    country_id: '',
    is_active: true
  };
  const [formData, setFormData] = useState<Record<string, any>>(initialFormState);

  // --- API CALLS ---
  const fetchAllData = async (page = 0) => {
    setLoadingData(true);
    setApiError(null);

    try {
      // 1. Fetch the states for the current page
      const statesData = await fetchStatesApi(page, pageSize);
      setStates(statesData || []);


      // If we received 10 items (pageSize), assume there is a next page
      setHasNextPage((statesData || []).length === pageSize);

      // 2. Fetch the countries for the dropdown (only if we haven't yet)
      if (countries.length === 0) {
        const countriesData = await fetchCountriesApi();
        if (Array.isArray(countriesData)) {
          setCountries(countriesData.map((c: any) => ({
            value: String(c.id),
            label: c.name
          })));
        }
      }

    } catch (err: any) {
      setApiError(err.message || 'Failed to load data from the server');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- HANDLERS ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0) {
      setCurrentPage(newPage);
      fetchAllData(newPage);
    }
  };

  const handleFormChange = (name: string, value: any) => {
    if (name === 'is_active') {
      value = value === 'Active' || value === true;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Fake local state update until API is ready
    if (editingId) {
      setStates(states.map(s =>
        s.id === editingId ? { ...s, ...formData, id: editingId } as StateData : s
      ));
    } else {
      const newState: StateData = {
        id: Date.now(),
        name: formData.name,
        code: formData.code,
        country_id: formData.country_id,
        is_active: formData.is_active
      };
      setStates([...states, newState]);
    }

    closeModal();
  };

  const handleEditClick = (state: StateData) => {
    setFormData({
      name: state.name,
      code: state.code,
      country_id: state.country_id || '',
      is_active: state.is_active
    });
    setEditingId(state.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (state: StateData) => {
    setStateToDelete(state);
  };

  const confirmDelete = () => {
    if (stateToDelete) {
      setStates(states.filter(s => s.id !== stateToDelete.id));
      setStateToDelete(null);
    }
  };

  const cancelDelete = () => {
    setStateToDelete(null);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData(initialFormState);
    }, 200);
  };

  return {
    states,
    countries,
    loadingData,
    apiError,
    isModalOpen,
    editingId,
    stateToDelete,
    formData,
    currentPage,
    hasNextPage,
    handlePageChange,
    handleFormChange,
    handleSubmit,
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    openAddModal,
    closeModal
  };
};
