// ── React & Hooks ────────────────────────────────────────────────────────────
// useState: Saves data that can change over time. When updated, React re-renders the UI.
// useEffect: Runs code automatically when the page/component loads.
// useCallback: Keeps a function from being recreated on every single re-render.
// useMemo: Remembers a calculated value so React doesn't re-calculate it on every render.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Building2, MapPin, Phone, Mail, Clock } from 'lucide-react';

// ── Services & Types ──────────────────────────────────────────────────────────
import { ownerVenueService } from '../services/ownerVenueService';
import type { Venue } from '../../../types/venue';
import type { Column } from '../../../types/table.types';
import type { FormField } from '../../../types/form.types';

/**
 * useVenue - A custom React Hook that manages all states and operations 
 * for Owner Venues (Fetching, Creating, Editing, and Deleting).
 * 
 * Design for Freshers: Everything is step-by-step with clear state groups.
 */
export const useVenue = () => {
  // ── 1. Data States (Data stored in React memory) ───────────────────────────
  const [venues, setVenues] = useState<Venue[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Spinner/loader state
  const [submitting, setSubmitting] = useState<boolean>(false); // Button spinner state
  const [error, setError] = useState<string | null>(null);

  // ── 2. Search & Filter State ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState<string>('');

  // ── 3. Add / Edit Modal States ────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  // ── 4. Delete Confirmation Modal States ──────────────────────────────────
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);

  // ── 5. Fetch Functions (Reading data from backend) ───────────────────────
  
  // loadVenues: Fetches the venue list belonging to the current owner
  const loadVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ownerVenueService.getMyVenues();
      setVenues(data);
    } catch (err: any) {
      console.error('Error loading venues:', err);
      setError(err.message || 'Failed to load venues');
    } finally {
      setLoading(false);
    }
  }, []);

  // loadCities: Fetches all available cities for the dropdown
  const loadCities = useCallback(async () => {
    try {
      const cityList = await ownerVenueService.getCities();
      setCities(cityList);
    } catch (err) {
      console.error('Error loading cities:', err);
    }
  }, []);

  // Trigger loading cities and venues as soon as this component loads
  useEffect(() => {
    loadVenues();
    loadCities();
  }, [loadVenues, loadCities]);

  // ── 6. Search Filtering (Computes filtered venues locally) ────────────────
  const filteredVenues = useMemo(() => {
    // If search box is empty, return everything
    if (!searchTerm.trim()) return venues;
    
    const term = searchTerm.toLowerCase();
    return venues.filter((v) => {
      const nameMatch = (v.venue_name || '').toLowerCase().includes(term);
      const addressMatch = (v.address || '').toLowerCase().includes(term);
      return nameMatch || addressMatch;
    });
  }, [venues, searchTerm]);

  // ── 7. Helper: City Name Lookup ───────────────────────────────────────────
  const getCityName = useCallback(
    (cityId: string | number) => {
      const found = cities.find((c) => String(c.id) === String(cityId));
      return found?.name || 'Ahmedabad';
    },
    [cities]
  );

  // ── 8. Table Columns Definition (How the data table is structured) ─────────
  const columns: Column<Venue>[] = useMemo(
    () => [
      {
        key: 'venue_name',
        label: 'Venue Name',
        render: (v) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">{v.venue_name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                {v.address || 'No address set'}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'city_id',
        label: 'City',
        render: (v) => (
          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium text-xs">
            <MapPin size={13} className="text-slate-400" />
            {getCityName(v.city_id)}
          </span>
        ),
      },
      {
        key: 'contact_number',
        label: 'Contact',
        render: (v) => (
          <div className="text-xs space-y-0.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Phone size={12} className="text-slate-400" />
              <span>{v.contact_number || '-'}</span>
            </div>
            {v.email && (
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Mail size={12} className="text-slate-400" />
                <span className="truncate max-w-[150px]">{v.email}</span>
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'opening_time',
        label: 'Operating Hours',
        render: (v) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono">
            <Clock size={13} className="text-slate-400" />
            <span>
              {(v.opening_time || '06:00').slice(0, 5)} - {(v.closing_time || '23:00').slice(0, 5)}
            </span>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (v) => (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              v.status === 'ACTIVE'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
            }`}
          >
            {v.status || 'ACTIVE'}
          </span>
        ),
      },
    ],
    [getCityName]
  );

  // ── 9. Form Fields Configuration for CommonForm ────────────────────────────
  // This defines the structure of inputs displayed in the popup form.
  const formFields: FormField[] = useMemo(
    () => [
      {
        name: 'venue_name',
        label: 'Venue Name',
        type: 'text',
        required: true,
        halfWidth: true,
        placeholder: 'e.g. Apex Box Cricket Arena',
      },
      {
        name: 'city_id',
        label: 'City',
        type: 'select',
        required: true,
        halfWidth: true,
        options: cities.map((c) => ({ label: c.name, value: String(c.id) })),
      },
      {
        name: 'imageUrl',
        label: 'Venue Cover Image',
        type: 'file',
        accept: 'image/*',
        halfWidth: true,
      },
      {
        name: 'contact_number',
        label: 'Contact Phone',
        type: 'text',
        required: true,
        halfWidth: true,
        placeholder: 'e.g. +91 9876543210',
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        halfWidth: true,
        placeholder: 'e.g. contact@apexcricket.com',
      },
      {
        name: 'opening_time',
        label: 'Opening Time',
        type: 'time',
        halfWidth: true,
      },
      {
        name: 'closing_time',
        label: 'Closing Time',
        type: 'time',
        halfWidth: true,
      },
      {
        name: 'location',
        label: 'Ground Location (MapTiler Cloud)',
        type: 'location',
      },
      {
        name: 'address',
        label: 'Complete Address',
        type: 'textarea',
        required: true,
        placeholder: 'e.g. Plot 42, Ring Road, Near Sports Complex',
      },
      {
        name: 'description',
        label: 'Venue Description',
        type: 'textarea',
        placeholder: 'Highlight special turf quality, floodlights, parking facilities, etc.',
      },
      {
        name: 'cancellation_policy',
        label: 'Cancellation Policy',
        type: 'text',
        placeholder: 'e.g. Full refund if cancelled 24 hours prior to booking.',
      },
    ],
    [cities]
  );

  // ── 10. Initial Form Values (Prefilling values for new/existing venues) ────
  const initialFormValues = useMemo(() => {
    // EDIT MODE: If selectedVenue is set, fill values from that venue
    if (selectedVenue) {
      return {
        venue_name: selectedVenue.venue_name || '',
        city_id: selectedVenue.city_id
          ? String(selectedVenue.city_id)
          : cities[0]?.id
          ? String(cities[0].id)
          : '1',
        address: selectedVenue.address || '',
        contact_number: selectedVenue.contact_number || '',
        email: selectedVenue.email || '',
        opening_time: (selectedVenue.opening_time || '06:00').slice(0, 5),
        closing_time: (selectedVenue.closing_time || '23:00').slice(0, 5),
        description: selectedVenue.description || '',
        cancellation_policy:
          selectedVenue.cancellation_policy ||
          'Full refund if cancelled 24 hours prior to booking.',
        latitude: selectedVenue.latitude ? Number(selectedVenue.latitude) : 23.0225,
        longitude: selectedVenue.longitude ? Number(selectedVenue.longitude) : 72.5714,
      };
    }
    
    // ADD MODE: Otherwise, load defaults for a blank form
    return {
      venue_name: '',
      city_id: cities[0]?.id ? String(cities[0].id) : '1',
      address: '',
      contact_number: '',
      email: '',
      opening_time: '06:00',
      closing_time: '23:00',
      description: '',
      cancellation_policy: 'Full refund if cancelled 24 hours prior to booking.',
      latitude: 23.0225,
      longitude: 72.5714,
    };
  }, [selectedVenue, cities]);

  // ── 11. Modal Actions (Opening and Closing Popups) ────────────────────────
  
  // Opens modal in "Add" mode
  const handleOpenAdd = () => {
    setSelectedVenue(null);
    setIsModalOpen(true);
  };

  // Opens modal in "Edit" mode with existing values prefilled
  const handleOpenEdit = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  // Closes the Add/Edit modal
  const handleCloseModal = () => {
    setSelectedVenue(null);
    setIsModalOpen(false);
  };

  // ── 12. Save Handler (Triggered on submitting the Form) ───────────────────
  const handleFormSubmit = async (formData: any): Promise<boolean> => {
    setSubmitting(true);
    try {
      if (selectedVenue) {
        // EDIT MODE: Update existing local array directly
        setVenues((prev) =>
          prev.map((v) => (String(v.id) === String(selectedVenue.id) ? { ...v, ...formData } : v))
        );
        toast.success('Venue updated successfully!');
      } else {
        // ADD MODE: Post new details to the database and reload list
        await ownerVenueService.createVenue(formData);
        toast.success('Venue added successfully!');
        await loadVenues();
      }
      handleCloseModal();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to save venue');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ── 13. Delete Modal Actions ──────────────────────────────────────────────
  const handleOpenDelete = (venue: Venue) => {
    setVenueToDelete(venue);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setVenueToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async (): Promise<boolean> => {
    if (!venueToDelete) return false;
    setSubmitting(true);
    try {
      // Remove venue from local array list
      setVenues((prev) => prev.filter((v) => String(v.id) !== String(venueToDelete.id)));
      toast.success('Venue deleted successfully!');
      handleCloseDeleteModal();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete venue');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ── 14. Return Everything to the Component ────────────────────────────────
  return {
    // Data List & Loading Indicators
    venues,
    filteredVenues,
    cities,
    loading,
    submitting,
    error,
    refreshVenues: loadVenues,

    // Search value and search setter function
    searchTerm,
    setSearchTerm,

    // Table & Form configurations
    columns,
    formFields,
    initialFormValues,

    // Add / Edit Modal handlers and states
    isModalOpen,
    selectedVenue,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormSubmit,

    // Delete confirmation dialog states and actions
    deleteModalOpen,
    venueToDelete,
    handleOpenDelete,
    handleCloseDeleteModal,
    handleConfirmDelete,
  };
};

export default useVenue;
