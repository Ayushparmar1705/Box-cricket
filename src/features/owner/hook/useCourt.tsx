import React, { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Layers, Building2, Tag, IndianRupee, Sun, Award } from 'lucide-react';
import { ownerCourtService } from '../services/ownerCourtService';
import type { Court } from '../../../types/court';
import type { Venue } from '../../../types/venue';
import type { Column } from '../../../types/table.types';
import type { FormField } from '../../../types/form.types';

export const useCourt = () => {
  // ── 1. Data States ─────────────────────────────────────────────
  const [courts, setCourts] = useState<Court[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ── 2. Search & Filters ─────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [venueFilter, setVenueFilter] = useState<string | number>('all');

  // ── 3. Modal States (Add / Edit) ────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  // ── 4. Delete Modal States ──────────────────────────────────────
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [courtToDelete, setCourtToDelete] = useState<Court | null>(null);

  // ── 5. Fetch Functions ──────────────────────────────────────────
  const loadCourts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ownerCourtService.getMyCourts();
      setCourts(data);
    } catch (err: any) {
      console.error('Error loading courts:', err);
      setError(err.message || 'Failed to load courts');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDependencies = useCallback(async () => {
    try {
      const [venueList, catList] = await Promise.all([
        ownerCourtService.getVenues(),
        ownerCourtService.getCategories(),
      ]);
      setVenues(venueList);
      setCategories(catList);
    } catch (err) {
      console.error('Error loading dependencies for courts:', err);
    }
  }, []);

  useEffect(() => {
    loadCourts();
    loadDependencies();
  }, [loadCourts, loadDependencies]);

  // ── 6. Filtered Courts ──────────────────────────────────────────
  const filteredCourts = useMemo(() => {
    return courts.filter((c) => {
      const nameMatch = (c.court_name || c.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const venueMatch = venueFilter === 'all' || String(c.venue_id) === String(venueFilter);
      return nameMatch && venueMatch;
    });
  }, [courts, searchTerm, venueFilter]);

  // ── 7. Helper: Venue & Category Name Lookups ────────────────────
  const getVenueName = useCallback(
    (venueId: string | number) => {
      const found = venues.find((v) => String(v.id) === String(venueId));
      return found?.venue_name || 'Main Turf Arena';
    },
    [venues]
  );

  const getCategoryName = useCallback(
    (catId: string | number) => {
      const found = categories.find((c) => String(c.id) === String(catId));
      return found?.name || 'Box Cricket';
    },
    [categories]
  );

  // ── 8. Table Columns Definition ─────────────────────────────────
  const columns: Column<Court>[] = useMemo(
    () => [
      {
        key: 'court_name',
        label: 'Court / Pitch',
        render: (c) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">
                {c.court_name || c.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {c.surface_type || c.surface || 'Turf Surface'}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'venue_id',
        label: 'Venue',
        render: (c) => (
          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium text-xs">
            <Building2 size={13} className="text-slate-400" />
            {c.venue_name || getVenueName(c.venue_id)}
          </span>
        ),
      },
      {
        key: 'category_id',
        label: 'Sport Category',
        render: (c) => (
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            {c.category_name || c.category || getCategoryName(c.category_id || '')}
          </span>
        ),
      },
      {
        key: 'price_per_hour',
        label: 'Base Rate / Hr',
        render: (c) => (
          <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
            ₹{c.price_per_hour || 1000}
          </div>
        ),
      },
      {
        key: 'features',
        label: 'Amenities',
        render: (c) => (
          <div className="flex items-center gap-1.5">
            {c.has_floodlights && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
                title="Floodlights Available"
              >
                Lights
              </span>
            )}
            {c.has_scoreboard && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40"
                title="Scoreboard Available"
              >
                Scoreboard
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (c) => (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              c.status === 'ACTIVE'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
            }`}
          >
            {c.status || 'ACTIVE'}
          </span>
        ),
      },
    ],
    [getVenueName, getCategoryName]
  );

  // ── 9. Form Fields Configuration for CommonForm ─────────────────
  const formFields: FormField[] = useMemo(
    () => [
      {
        name: 'court_name',
        label: 'Court / Pitch Name',
        type: 'text',
        required: true,
        halfWidth: true,
        placeholder: 'e.g. Court A (Main Turf)',
      },
      {
        name: 'venue_id',
        label: 'Select Venue',
        type: 'select',
        required: true,
        halfWidth: true,
        options: venues.map((v) => ({ label: v.venue_name, value: String(v.id) })),
      },
      {
        name: 'category_id',
        label: 'Sport / Category',
        type: 'select',
        required: true,
        halfWidth: true,
        options: categories.map((cat) => ({ label: cat.name, value: String(cat.id) })),
      },
      {
        name: 'surface_type',
        label: 'Surface Material',
        type: 'select',
        halfWidth: true,
        options: [
          { label: 'Artificial Turf / Grass', value: 'Artificial Turf' },
          { label: 'Astro Turf', value: 'Astro Turf' },
          { label: 'Synthetic Vinyl', value: 'Synthetic Vinyl' },
          { label: 'Wooden Hardwood', value: 'Wooden Hardwood' },
          { label: 'Clay Court', value: 'Clay Court' },
        ],
      },
      {
        name: 'price_per_hour',
        label: 'Hourly Base Price (₹)',
        type: 'number',
        required: true,
        halfWidth: true,
        placeholder: '1200',
      },
      {
        name: 'max_players',
        label: 'Capacity (Max Players)',
        type: 'number',
        halfWidth: true,
        placeholder: '14',
      },
      {
        name: 'dimensions',
        label: 'Dimensions',
        type: 'text',
        halfWidth: true,
        placeholder: 'e.g. 100 x 60 ft',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        halfWidth: true,
        options: [
          { label: 'Active (Open for bookings)', value: 'ACTIVE' },
          { label: 'Maintenance (Temporarily closed)', value: 'MAINTENANCE' },
          { label: 'Inactive', value: 'INACTIVE' },
        ],
      },
      {
        name: 'has_floodlights',
        label: 'Night Floodlights',
        type: 'checkbox',
        placeholder: 'Floodlights installed for night play',
        halfWidth: true,
      },
      {
        name: 'has_scoreboard',
        label: 'Digital / Manual Scoreboard',
        type: 'checkbox',
        placeholder: 'Scoreboard available at court',
        halfWidth: true,
      },
    ],
    [venues, categories]
  );

  // ── 10. Initial Form Values ─────────────────────────────────────
  const initialFormValues = useMemo(() => {
    if (selectedCourt) {
      return {
        court_name: selectedCourt.court_name || selectedCourt.name || '',
        venue_id: selectedCourt.venue_id ? String(selectedCourt.venue_id) : (venues[0]?.id ? String(venues[0].id) : '1'),
        category_id: selectedCourt.category_id ? String(selectedCourt.category_id) : (categories[0]?.id ? String(categories[0].id) : '1'),
        surface_type: selectedCourt.surface_type || selectedCourt.surface || 'Artificial Turf',
        price_per_hour: selectedCourt.price_per_hour || 1200,
        max_players: selectedCourt.max_players || 14,
        dimensions: selectedCourt.dimensions || '100 x 60 ft',
        status: selectedCourt.status || 'ACTIVE',
        has_floodlights: selectedCourt.has_floodlights ?? true,
        has_scoreboard: selectedCourt.has_scoreboard ?? true,
      };
    }
    return {
      court_name: '',
      venue_id: venues[0]?.id ? String(venues[0].id) : '1',
      category_id: categories[0]?.id ? String(categories[0].id) : '1',
      surface_type: 'Artificial Turf',
      price_per_hour: 1200,
      max_players: 14,
      dimensions: '100 x 60 ft',
      status: 'ACTIVE',
      has_floodlights: true,
      has_scoreboard: true,
    };
  }, [selectedCourt, venues, categories]);

  // ── 11. Modal Actions (Add / Edit / Submit) ──────────────────────
  const handleOpenAdd = () => {
    setSelectedCourt(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (court: Court) => {
    setSelectedCourt(court);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCourt(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData: any): Promise<boolean> => {
    setSubmitting(true);
    try {
      if (selectedCourt) {
        await ownerCourtService.updateCourt(selectedCourt.id, formData);
        toast.success('Court updated successfully!');
      } else {
        await ownerCourtService.createCourt(formData);
        toast.success('Court created successfully!');
      }
      await loadCourts();
      handleCloseModal();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to save court');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ── 12. Delete Modal Actions ────────────────────────────────────
  const handleOpenDelete = (court: Court) => {
    setCourtToDelete(court);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setCourtToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async (): Promise<boolean> => {
    if (!courtToDelete) return false;
    setSubmitting(true);
    try {
      await ownerCourtService.deleteCourt(courtToDelete.id);
      toast.success('Court deleted successfully!');
      await loadCourts();
      handleCloseDeleteModal();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete court');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // Data & Loading
    courts,
    filteredCourts,
    venues,
    categories,
    loading,
    submitting,
    error,
    refreshCourts: loadCourts,

    // Search & Filter
    searchTerm,
    setSearchTerm,
    venueFilter,
    setVenueFilter,

    // Table & Form Configurations
    columns,
    formFields,
    initialFormValues,

    // Add / Edit Modal
    isModalOpen,
    selectedCourt,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormSubmit,

    // Delete Modal
    deleteModalOpen,
    courtToDelete,
    handleOpenDelete,
    handleCloseDeleteModal,
    handleConfirmDelete,
  };
};

export default useCourt;
