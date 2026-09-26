import { useState, useEffect } from 'react';
import { fetchCitiesApi } from '../services/cityService';
import { fetchStatesApi } from '../services/stateService';

export interface CityData {
  id: number;
  name: string;
  stateId?: number;
  stateName?: string;
  countryId?: number;
  countryName?: string;
  is_active: boolean;
  created_at?: string;
}

export const useCityData = () => {
  // --- STATE MANAGEMENT ---
  const [cities, setCities] = useState<CityData[]>([]);
  const [states, setStates] = useState<{ value: string, label: string }[]>([]); // For the dropdown

  const [loadingData, setLoadingData] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [cityToDelete, setCityToDelete] = useState<CityData | null>(null);

  // Default form state
  const initialFormState = {
    name: '',
    stateId: '',
    is_active: true
  };
  const [formData, setFormData] = useState<Record<string, any>>(initialFormState);

  // --- API CALLS ---
  const fetchAllData = async () => {
    setLoadingData(true);
    setApiError(null);
    try {
      // We also need states for the dropdown!
      const [citiesData, statesData] = await Promise.all([
        fetchCitiesApi().catch(() => []), // Fallback to empty if not implemented on backend yet
        fetchStatesApi().catch(() => [])
      ]);

      // Handle paginated response structure if present
      if (citiesData && citiesData.content) {
        setCities(citiesData.content);
      } else if (Array.isArray(citiesData)) {
        setCities(citiesData);
      }

      const statesArray = statesData && statesData.content ? statesData.content : (Array.isArray(statesData) ? statesData : []);

      // Map states to the dropdown format { value, label }
      if (statesArray.length > 0) {
        setStates(statesArray.map((s: any) => ({
          value: String(s.id),
          label: s.name
        })));
      }

    } catch (err: any) {
      setApiError(err.message || 'An error occurred while fetching data');
      console.error("Error fetching cities:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- HANDLERS ---
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
      setCities(cities.map(c =>
        c.id === editingId ? { ...c, ...formData, id: editingId } as CityData : c
      ));
    } else {
      const newCity: CityData = {
        id: Date.now(),
        name: formData.name,
        stateId: formData.stateId,
        is_active: formData.is_active
      };
      setCities([...cities, newCity]);
    }

    closeModal();
  };

  const handleEditClick = (city: CityData) => {
    setFormData({
      name: city.name,
      stateId: city.stateId || '',
      is_active: city.is_active
    });
    setEditingId(city.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (city: CityData) => {
    setCityToDelete(city);
  };

  const confirmDelete = () => {
    if (cityToDelete) {
      setCities(cities.filter(c => c.id !== cityToDelete.id));
      setCityToDelete(null);
    }
  };

  const cancelDelete = () => {
    setCityToDelete(null);
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
  };
};
