import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchCountriesApi, createCountryApi } from '../services/countryService';

export interface Country {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
}

export const useCountry = () => {
  // --- STATE MANAGEMENT ---
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [countryToDelete, setCountryToDelete] = useState<Country | null>(null);

  // Default form state matches the modified Country interface
  const initialFormState = {
    name: '',
    code: '',
    is_active: true
  };
  const [formData, setFormData] = useState<Record<string, any>>(initialFormState);

  // --- API CALLS ---
  const fetchCountries = async () => {
    setLoadingData(true);
    setApiError(null);
    try {
      const data = await fetchCountriesApi();
      setCountries(data);
    } catch (err: any) {
      setApiError(err.message || 'An error occurred while fetching data');
      console.error("Error fetching countries:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // --- HANDLERS ---
  const handleFormChange = (name: string, value: any) => {
    // If the select returns string "Active", convert it to boolean for the state
    if (name === 'is_active') {
      value = value === 'Active' || value === true;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Fake local edit (TODO: Connect to update API)
        setCountries(countries.map(c =>
          c.id === editingId ? { ...c, ...formData } as Country : c
        ));
        closeModal();
      } else {
        // Integrate create API
        await createCountryApi({
          name: formData.name,
          code: formData.code,
          is_active: formData.is_active
        });
        
        // Success Toast!
        toast.success('Country added successfully!', {
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: 'bold'
          }
        });
        
        // Refetch countries after successful creation
        await fetchCountries();
        closeModal();
      }
    } catch (err: any) {
      setApiError(err.message || 'Failed to save country');
      toast.error('Failed to add country', {
        style: {
          background: '#EF4444',
          color: '#fff',
          fontWeight: 'bold'
        }
      });
      console.error(err);
    }
  };

  const handleEditClick = (country: Country) => {
    setFormData({
      name: country.name,
      code: country.code,
      is_active: country.is_active
    });
    setEditingId(country.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (country: Country) => {
    // Open the custom delete confirmation modal
    setCountryToDelete(country);
  };

  const confirmDelete = () => {
    if (countryToDelete) {
      // TODO: Connect to DELETE API when ready
      setCountries(countries.filter(c => c.id !== countryToDelete.id));
      setCountryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setCountryToDelete(null);
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
    }, 200); // Wait for modal exit animation
  };

  return {
    countries,
    loadingData,
    apiError,
    isModalOpen,
    editingId,
    countryToDelete,
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
