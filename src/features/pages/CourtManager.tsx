// ============================================================================
// File: CourtManager.tsx
// Description: Comprehensive Court & Ground Specifications Manager
// Database Columns:
//   - venue_id: FK -> venues (Parent venue)
//   - category_id: FK -> categories (Sport category)
//   - court_name: VARCHAR (Court name/label)
//   - surface_type: ENUM('TURF','MAT','CONCRETE')
//   - max_players: INTEGER (Player capacity)
//   - description: TEXT (Description)
// Supports multiple court images upload via Cloudinary & http://localhost:3040/api/court/create
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  RefreshCw,
  Filter,
  Building2,
  Edit2,
  Trash2,
  ArrowLeft,
  Eye,
  Users,
  Tag,
  CheckCircle2,
  X,
  Trophy,
  Upload,
  Image as ImageIcon,
  Camera,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Services
import {
  fetchCourtsApi,
  createCourtApi,
  updateCourtApi,
  changeCourtStatusApi,
  deleteCourtApi,
  type CourtItem,
  type CourtPayload,
  type SurfaceType,
} from '../services/courtService';
import { fetchMyVenuesApi, type VenueItem } from '../services/venueService';

// Common Components
import CommonModal from '../../Components/Common/CommonModal';
import CommonConfirmModal from '../../Components/Common/CommonConfirmModal';
import { create, view, type CategoryItem } from '../services/categoryService';

interface CourtManagerProps {
  onCourtsUpdated?: (count: number) => void;
  showTitle?: boolean;
  standalone?: boolean;
}

export default function CourtManager({
  onCourtsUpdated,
  showTitle = true,
  standalone = false,
}: CourtManagerProps) {
  const navigate = useNavigate();

  // Data state
  const [courts, setCourts] = useState<CourtItem[]>([]);
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [selectedVenueFilter, setSelectedVenueFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingCourt, setEditingCourt] = useState<CourtItem | null>(null);
  const [viewingCourt, setViewingCourt] = useState<CourtItem | null>(null);
  const [courtToDelete, setCourtToDelete] = useState<CourtItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Inline Category Addition inside Court Form Modal
  const [showAddCategoryInline, setShowAddCategoryInline] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  // Court Image Upload State
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Function called when files are selected for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    selected.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" is not a valid image file`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 10MB limit`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setFilePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  // Function called when removing a selected file
  const removeSelectedFiles = (index: number) => {
    if (filePreviews[index]) {
      URL.revokeObjectURL(filePreviews[index]);
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all selected files
  const clearSelectedFiles = () => {
    filePreviews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setFilePreviews([]);
  };

  // Form State matching the database columns
  const initialForm: CourtPayload = {
    venue_id: '',
    venue_name: '',
    category_id: '',
    category_name: '',
    court_name: '',
    surface_type: 'TURF',
    max_players: 14,
    description: '',
    status: 'ACTIVE',
  };

  const [formData, setFormData] = useState<CourtPayload>(initialForm);

  // Fetch courts from backend using active filters: venueId, isActive, search
  const fetchFilteredCourts = async (
    vFilter = selectedVenueFilter,
    sFilter = statusFilter,
    searchVal = searchTerm
  ) => {
    try {
      const activeParam = sFilter === 'ALL' ? undefined : sFilter === 'ACTIVE';
      const venueParam = vFilter !== 'ALL' ? vFilter : undefined;
      const searchParam = searchVal.trim() || undefined;

      const fetched = await fetchCourtsApi({
        venueId: venueParam,
        isActive: activeParam,
        search: searchParam,
      });

      setCourts(fetched);
      if (onCourtsUpdated) {
        onCourtsUpdated(fetched.length);
      }
    } catch (err) {
      console.error('Error fetching filtered courts from backend:', err);
    }
  };

  // Debounce backend query on filter/search change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilteredCourts(selectedVenueFilter, statusFilter, searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedVenueFilter, statusFilter, searchTerm]);

  // Load venues, categories, and initial courts
  const loadData = async () => {
    setIsLoading(true);
    const [fetchedCourts, venuesRes, fetchedCategories] = await Promise.all([
      fetchCourtsApi().catch(() => []),
      fetchMyVenuesApi().catch(() => ({ data: [] })),
      view().catch(() => []),
    ]);

    setCourts(fetchedCourts);
    const venueList = Array.isArray(venuesRes) ? venuesRes : (venuesRes?.data || []);
    setVenues(venueList);
    setCategories(fetchedCategories);

    if (onCourtsUpdated) {
      onCourtsUpdated(fetchedCourts.length);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered courts computation
  const filteredCourts = courts.filter((crt) => {
    // Status Filter
    if (statusFilter !== 'ALL' && crt.status !== statusFilter) return false;

    // Venue Filter
    if (selectedVenueFilter !== 'ALL' && String(crt.venue_id) !== String(selectedVenueFilter)) {
      return false;
    }

    // Category Filter
    if (selectedCategoryFilter !== 'ALL' && String(crt.category_id) !== String(selectedCategoryFilter)) {
      return false;
    }

    // Search Query
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const matchName = (crt.court_name || crt.courtNumber || '').toLowerCase().includes(query);
      const matchVenue = (crt.venue_name || crt.turfName || '').toLowerCase().includes(query);
      const matchCat = (crt.category_name || '').toLowerCase().includes(query);
      const matchSurface = (crt.surface_type || '').toLowerCase().includes(query);
      const matchDesc = (crt.description || '').toLowerCase().includes(query);
      return matchName || matchVenue || matchCat || matchSurface || matchDesc;
    }

    return true;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    const defaultVenue = venues[0];
    const defaultCat = categories[0];
    const catName = defaultCat ? (defaultCat.category_name || defaultCat.name) : 'Box Cricket';
    setFormData({
      ...initialForm,
      venue_id: defaultVenue ? String(defaultVenue.id) : '1',
      venue_name: defaultVenue ? (defaultVenue.venue_name || defaultVenue.name) : 'Apex Arena Ground',
      category_id: defaultCat ? String(defaultCat.id) : 'cat-1',
      category_name: catName || 'Box Cricket',
    });
    setEditingCourt(null);
    setShowAddCategoryInline(false);
    setNewCatName('');
    clearSelectedFiles();
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (crt: CourtItem) => {
    setEditingCourt(crt);
    setFormData({
      venue_id: crt.venue_id || crt.turfId || '',
      venue_name: crt.venue_name || crt.turfName || '',
      category_id: crt.category_id || '',
      category_name: crt.category_name || '',
      court_name: crt.court_name || crt.courtNumber || '',
      surface_type: crt.surface_type || 'TURF',
      max_players: crt.max_players || 14,
      description: crt.description || '',
      status: crt.status || 'ACTIVE',
    });
    setShowAddCategoryInline(false);
    clearSelectedFiles();
    setShowAddModal(true);
  };

  // Inline Category Creation inside Court Form Modal
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmedName = newCatName.trim();
    if (!trimmedName) {
      return toast.error('Please enter a category name');
    }

    setIsAddingCategory(true);
    try {
      await create({
        category_name: trimmedName,
      });

      // Fetch updated categories list from backend
      const updatedCats = await view();
      if (Array.isArray(updatedCats) && updatedCats.length > 0) {
        setCategories(updatedCats);
        const matched = updatedCats.find(
          (c) => (c.category_name || c.name)?.toLowerCase() === trimmedName.toLowerCase()
        );
        if (matched) {
          setFormData((prev) => ({
            ...prev,
            category_id: String(matched.id),
            category_name: matched.category_name || matched.name || trimmedName,
          }));
        }
      } else {
        const fallbackCat = { id: `cat-${Date.now()}`, category_name: trimmedName, name: trimmedName };
        setCategories((prev) => [fallbackCat, ...prev]);
        setFormData((prev) => ({
          ...prev,
          category_id: String(fallbackCat.id),
          category_name: trimmedName,
        }));
      }

      toast.success(`🎉 Category "${trimmedName}" added & selected!`);
      setNewCatName('');
      setShowAddCategoryInline(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Submit Handler (Create or Edit Court with multipart images via http://localhost:3040/api/court/create)
  const handleSubmitCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.court_name.trim()) {
      return toast.error('Please enter court name/label');
    }
    if (!formData.venue_id) {
      return toast.error('Please select a parent venue');
    }
    if (!formData.category_id) {
      return toast.error('Please select a sport category');
    }

    setIsSubmitting(true);
    try {
      const matchedVenue = venues.find((v) => String(v.id) === String(formData.venue_id));
      const matchedCategory = categories.find((c) => String(c.id) === String(formData.category_id));

      const payload: CourtPayload = {
        ...formData,
        venue_name: matchedVenue ? (matchedVenue.venue_name || matchedVenue.name) : formData.venue_name,
        category_name: matchedCategory ? (matchedCategory.category_name || matchedCategory.name) : formData.category_name,
        max_players: Number(formData.max_players) || 12,
        files: files,
        images: files,
      };

      if (editingCourt) {
        await updateCourtApi(editingCourt.id, payload);
        toast.success(`🎉 ${payload.court_name} updated successfully!`);
      } else {
        // Calls POST http://localhost:3040/api/court/create
        await createCourtApi(payload);
        toast.success(
          files.length > 0
            ? `🎉 ${payload.court_name} created with ${files.length} images!`
            : `🎉 ${payload.court_name} added to arena!`
        );
      }

      clearSelectedFiles();
      setShowAddModal(false);
      setEditingCourt(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Court Status (Active <-> Inactive)
  const handleToggleStatus = async (crt: CourtItem) => {
    const nextStatus = crt.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await changeCourtStatusApi(crt.id, nextStatus);
      toast.success(`${crt.court_name || crt.courtNumber} marked as ${nextStatus === 'ACTIVE' ? 'Active' : 'Inactive'}`);
      await fetchFilteredCourts();
    } catch (err: any) {
      toast.error('Failed to change status');
    }
  };

  // Delete Court Handler
  const handleConfirmDelete = async () => {
    if (!courtToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteCourtApi(courtToDelete.id);
      toast.success(`Court "${courtToDelete.court_name || courtToDelete.courtNumber}" removed.`);
      setCourtToDelete(null);
      await loadData();
    } catch (err: any) {
      toast.error('Failed to delete court');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const activeCourtsCount = courts.filter((c) => c.status === 'ACTIVE').length;
  const turfCourtsCount = courts.filter((c) => c.surface_type === 'TURF').length;
  const inactiveCourtsCount = courts.filter((c) => c.status === 'INACTIVE').length;

  // Surface badge styling helper
  const getSurfaceBadge = (type: SurfaceType | string) => {
    switch (type) {
      case 'TURF':
        return {
          label: 'TURF (Synthetic Grass)',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'MAT':
        return {
          label: 'MAT (Rubber/Astro)',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'CONCRETE':
        return {
          label: 'CONCRETE (Hard Court)',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      default:
        return {
          label: type || 'TURF',
          badge: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${standalone ? 'p-6 max-w-7xl mx-auto' : ''}`}>
      {/* ── Standalone Navigation Bar (when accessed directly) ── */}
      {standalone && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Owner Dashboard</span>
          </button>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Box Cricket Arena Ground Operations
          </span>
        </div>
      )}

      {/* ── Toolbar Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {showTitle && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Courts & Ground Specifications ({courts.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage parent venues, sport categories, surfaces (TURF, MAT, CONCRETE), capacities, and photos.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 ml-auto flex-wrap sm:flex-nowrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Venue Filter Dropdown */}
          {venues.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs text-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedVenueFilter}
                onChange={(e) => setSelectedVenueFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="ALL">All Venues</option>
                {venues.map((v) => (
                  <option key={v.id} value={String(v.id)}>
                    {v.venue_name || v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Filter Dropdown */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs text-xs">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer max-w-[130px] truncate"
              >
                <option value="ALL">All Sports</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.category_name || c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh Courts"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Add New Court Button */}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Court</span>
          </button>
        </div>
      </div>

      {/* ── Metric Summary Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total Courts</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{courts.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase">Operational & Active</div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1">{activeCourtsCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-bold text-indigo-600 uppercase">Turf Grass Courts</div>
          <div className="text-xl font-extrabold text-indigo-600 mt-1">{turfCourtsCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-bold text-rose-500 uppercase">Inactive Courts</div>
          <div className="text-xl font-extrabold text-rose-600 mt-1">{inactiveCourtsCount}</div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search courts by court name, parent venue, sport category, or surface type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
        />
      </div>

      {/* ── Courts Grid Display ── */}
      {isLoading ? (
        <div className="p-12 text-center space-y-3 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Loading Courts & Arena Specifications...</h3>
        </div>
      ) : filteredCourts.length === 0 ? (
        <div className="p-12 text-center space-y-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <Layers className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Courts Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? `No courts match "${searchTerm}". Try resetting your search filter.`
              : 'Click "Add New Court" above to configure your first playing turf or ground.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((crt) => {
            const surfaceInfo = getSurfaceBadge(crt.surface_type);
            const displayName = crt.court_name || crt.courtNumber || 'Unnamed Court';
            const displayVenue = crt.venue_name || crt.turfName || 'Main Venue';
            const displayCategory = crt.category_name || 'Sport Category';
            const firstImage =
              crt.images && crt.images.length > 0
                ? crt.images[0].imageUrl || (crt.images[0] as any).image_url
                : null;

            return (
              <div
                key={crt.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Court Image Banner */}
                {firstImage ? (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={firstImage}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-black/70 text-white backdrop-blur-xs flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                      <span>{crt.images!.length} {crt.images!.length === 1 ? 'Photo' : 'Photos'}</span>
                    </span>
                    <span
                      className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 backdrop-blur-xs ${
                        crt.status === 'ACTIVE'
                          ? 'bg-emerald-500/90 text-white shadow-xs'
                          : 'bg-rose-500/90 text-white shadow-xs'
                      }`}
                    >
                      {crt.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ) : (
                  <div className="relative h-20 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 flex items-end justify-between">
                    <div className="flex items-center gap-1.5 text-white/90 text-xs font-semibold">
                      <Layers className="w-4 h-4 text-emerald-200" />
                      <span>{surfaceInfo.label}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                        crt.status === 'ACTIVE'
                          ? 'bg-emerald-400 text-emerald-950 font-bold'
                          : 'bg-rose-400 text-rose-950 font-bold'
                      }`}
                    >
                      {crt.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                            {displayName}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{displayVenue}</span>
                          </p>
                        </div>
                      </div>

                      {!firstImage && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                            crt.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {crt.status}
                        </span>
                      )}
                    </div>

                    {/* Sport Category & Surface */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <Trophy className="w-3 h-3 text-emerald-600" />
                        {displayCategory}
                      </span>

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${surfaceInfo.badge}`}
                      >
                        {surfaceInfo.label}
                      </span>
                    </div>

                    {/* Capacity & Description */}
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          Player Capacity:
                        </span>
                        <span className="font-extrabold text-slate-900">
                          {crt.max_players ? `${crt.max_players} Players` : 'Standard'}
                        </span>
                      </div>

                      {crt.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {crt.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons Strip */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhotoIdx(0);
                        setViewingCourt(crt);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
                      title="View Specifications"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(crt)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          crt.status === 'ACTIVE'
                            ? 'border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100'
                            : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                        title={crt.status === 'ACTIVE' ? 'Deactivate Court' : 'Activate Court'}
                      >
                        {crt.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(crt)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
                        title="Edit Court"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCourtToDelete(crt)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                        title="Delete Court"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: Add / Edit Court ── */}
      <CommonModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingCourt(null);
        }}
        title={editingCourt ? `Edit Court: ${editingCourt.court_name || editingCourt.courtNumber}` : 'Add New Court Ground'}
        subtitle="Specify parent venue, sport category, court label, surface material, player capacity, description, and photos."
        icon={<Layers className="w-5 h-5" />}
        maxWidth="xl"
        theme="light"
      >
        <form onSubmit={handleSubmitCourt} className="space-y-4 text-xs">
          {/* Parent Venue (venue_id FK -> venues) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Parent Venue (venue_id) <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.venue_id}
              onChange={(e) => {
                const selected = venues.find((v) => String(v.id) === e.target.value);
                setFormData({
                  ...formData,
                  venue_id: e.target.value,
                  venue_name: selected ? (selected.venue_name || selected.name) : '',
                });
              }}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="" disabled>-- Select Parent Venue --</option>
              {venues.length > 0 ? (
                venues.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.venue_name || t.name} (ID: #{t.id})
                  </option>
                ))
              ) : (
                <option value="1">Apex Arena Ground (Default Venue)</option>
              )}
            </select>
          </div>

          {/* Sport Category (category_id FK -> categories) with inline Owner Add */}
          <div className="space-y-2 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sport Category (category_id)</span>
                <span className="text-rose-500">*</span>
              </label>

              {!showAddCategoryInline && (
                <button
                  type="button"
                  onClick={() => setShowAddCategoryInline(true)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs hover:shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Sport Category</span>
                </button>
              )}
            </div>

            {/* Dropdown to select category */}
            <select
              value={formData.category_id}
              onChange={(e) => {
                const selected = categories.find((c) => String(c.id) === e.target.value);
                setFormData({
                  ...formData,
                  category_id: e.target.value,
                  category_name: selected ? (selected.category_name || selected.name || '') : '',
                });
              }}
              required
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="" disabled>-- Select Sport Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.category_name || c.name}
                </option>
              ))}
            </select>

            {/* Inline Category Creator */}
            {showAddCategoryInline && (
              <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-3 mt-2 shadow-xs">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    Add New Sport Category
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryInline(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Category Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pickleball, Box Cricket, Football"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateCategory(e);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 outline-none font-medium"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryInline(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isAddingCategory || !newCatName.trim()}
                    onClick={handleCreateCategory}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                  >
                    {isAddingCategory ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    <span>Save & Select Category</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Court Name (court_name VARCHAR) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Court Name / Label (court_name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Court #1 (Night Arena) or Pitch A"
              value={formData.court_name}
              onChange={(e) => setFormData({ ...formData, court_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
            />
          </div>

          {/* Surface Type ENUM & Max Players */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* surface_type ENUM('TURF','MAT','CONCRETE') */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Surface Type (surface_type) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.surface_type}
                onChange={(e) => setFormData({ ...formData, surface_type: e.target.value as SurfaceType })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
              >
                <option value="TURF">TURF (Synthetic Turf Grass)</option>
                <option value="MAT">MAT (Shock Absorbing Mat)</option>
                <option value="CONCRETE">CONCRETE (Hard Concrete Pitch)</option>
              </select>
            </div>

            {/* max_players INTEGER */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Player Capacity (max_players) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="2"
                  max="100"
                  required
                  placeholder="e.g. 14"
                  value={formData.max_players}
                  onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-12 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs pointer-events-none">
                  Players
                </span>
              </div>
            </div>
          </div>

          {/* Description (description TEXT) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Court Description (description)
            </label>
            <textarea
              rows={3}
              placeholder="Provide court features, boundary dimensions, LED floodlights, or playing rules..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium resize-none"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* ── Multiple Court Images Upload (Cloudinary via http://localhost:3040/api/court/create) ── */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Court Photos & Images</span>
                <span className="text-[11px] font-normal text-slate-500">
                  (Upload multiple turf/pitch photos)
                </span>
              </label>
              {files.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelectedFiles}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  Clear All ({files.length})
                </button>
              )}
            </div>

            {/* Drop / Browse Upload Area */}
            <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group">
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <p className="font-bold text-slate-800 text-xs">
                Click to browse or drop court photos
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPG, WebP up to 10MB per file (Saved to Cloudinary)
              </p>
            </label>

            {/* Selected New Previews Grid with removeSelectedFiles */}
            {filePreviews.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-emerald-800 block">
                  Selected Photos for Upload ({filePreviews.length})
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {filePreviews.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-2xs"
                    >
                      <img
                        src={url}
                        alt={`Court preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedFiles(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 shadow-xs cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white">
                        Photo #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Uploaded Images when Editing */}
            {editingCourt && editingCourt.images && editingCourt.images.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-emerald-100">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Current Photos in Arena ({editingCourt.images.length})
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {editingCourt.images.map((img, i) => {
                    const src = img.imageUrl || (img as any).image_url;
                    return (
                      <div
                        key={img.id || i}
                        className="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200"
                      >
                        <img src={src} alt="Court" className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setEditingCourt(null);
              }}
              className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{editingCourt ? 'Save Changes' : 'Add Court Ground'}</span>
            </button>
          </div>
        </form>
      </CommonModal>

      {/* ── MODAL: View Court Details ── */}
      <CommonModal
        isOpen={!!viewingCourt}
        onClose={() => setViewingCourt(null)}
        title={viewingCourt?.court_name || viewingCourt?.courtNumber}
        subtitle={viewingCourt?.venue_name || viewingCourt?.turfName}
        icon={<Layers className="w-5 h-5" />}
        maxWidth="md"
        theme="light"
      >
        {viewingCourt && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                <p className={`font-bold text-sm ${viewingCourt.status === 'ACTIVE' ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {viewingCourt.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sport Category</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                  {viewingCourt.category_name || 'Standard'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Surface Material</span>
                <p className="font-bold text-slate-900 text-xs">
                  {getSurfaceBadge(viewingCourt.surface_type).label}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Max Players</span>
                <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  {viewingCourt.max_players} Players
                </p>
              </div>
            </div>

            {/* Court Photos Gallery */}
            {viewingCourt.images && viewingCourt.images.length > 0 && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Court Photos ({viewingCourt.images.length})</span>
                </span>

                {/* Main Large Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-200">
                  <img
                    src={
                      viewingCourt.images[activePhotoIdx]?.imageUrl ||
                      (viewingCourt.images[activePhotoIdx] as any)?.image_url ||
                      viewingCourt.images[0]?.imageUrl
                    }
                    alt="Court View"
                    className="w-full h-full object-cover"
                  />
                  {viewingCourt.images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none">
                      <button
                        type="button"
                        onClick={() =>
                          setActivePhotoIdx((prev) =>
                            prev === 0 ? viewingCourt.images!.length - 1 : prev - 1
                          )
                        }
                        className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 pointer-events-auto cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActivePhotoIdx((prev) =>
                            prev === viewingCourt.images!.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 pointer-events-auto cursor-pointer transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white">
                    {activePhotoIdx + 1} / {viewingCourt.images.length}
                  </span>
                </div>

                {/* Thumbnails strip */}
                {viewingCourt.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5">
                    {viewingCourt.images.map((img, idx) => {
                      const src = img.imageUrl || (img as any).image_url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`relative rounded-xl overflow-hidden shrink-0 w-16 h-12 border-2 transition-all cursor-pointer ${
                            activePhotoIdx === idx
                              ? 'border-emerald-500 scale-105 shadow-2xs'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {viewingCourt.description && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Court Description</span>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {viewingCourt.description}
                </p>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-emerald-950">Synchronized with match booking engine</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                Port 3040
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingCourt(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </CommonModal>

      {/* ── MODAL: Confirm Delete Court ── */}
      <CommonConfirmModal
        isOpen={!!courtToDelete}
        onClose={() => setCourtToDelete(null)}
        onConfirm={handleConfirmDelete}
        type="deactivate"
        title="Remove Court Ground"
        message={
          <p>
            Are you sure you want to remove court{' '}
            <span className="font-bold text-slate-900">
              "{courtToDelete?.court_name || courtToDelete?.courtNumber}"
            </span>{' '}
            from{' '}
            <span className="font-semibold text-slate-800">
              {courtToDelete?.venue_name || courtToDelete?.turfName}
            </span>?
          </p>
        }
        confirmText="Yes, Remove Court"
        isLoading={isSubmitting}
        theme="light"
      />
    </div>
  );
}
