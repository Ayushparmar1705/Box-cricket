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
// Owner can also add new sport category directly inside the Court form modal.
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
  FileText,
  Tag,
  CheckCircle2,
  X,
  Trophy,
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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'MAINTENANCE'>('ALL');
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

  // Load venues, categories, and courts
  const loadData = async () => {
    setIsLoading(true);
    const [fetchedCourts, venuesRes, fetchedCategories] = await Promise.all([
      fetchCourtsApi(),
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
    setShowAddModal(true);
  };

  // Inline Category Creation inside Court Form Modal (Category Name only)
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

  // Submit Handler (Create or Edit Court)
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
      };

      if (editingCourt) {
        await updateCourtApi(editingCourt.id, payload);
        toast.success(`🎉 ${payload.court_name} updated successfully!`);
      } else {
        await createCourtApi(payload);
        toast.success(`🎉 ${payload.court_name} added to arena!`);
      }

      setShowAddModal(false);
      setEditingCourt(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Court Status (Active <-> Maintenance)
  const handleToggleStatus = async (crt: CourtItem) => {
    const nextStatus = crt.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE';
    try {
      await changeCourtStatusApi(crt.id, nextStatus);
      toast.success(`${crt.court_name || crt.courtNumber} marked as ${nextStatus}`);
      await loadData();
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
  const maintenanceCourtsCount = courts.filter((c) => c.status === 'MAINTENANCE').length;

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
              Manage parent venues, sport categories, surfaces (TURF, MAT, CONCRETE), player capacities, and court details.
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
              <option value="ACTIVE">Active Only</option>
              <option value="MAINTENANCE">Under Maintenance</option>
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
          <div className="text-[11px] font-bold text-rose-500 uppercase">Maintenance</div>
          <div className="text-xl font-extrabold text-rose-600 mt-1">{maintenanceCourtsCount}</div>
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

            return (
              <div
                key={crt.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
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

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${crt.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                    >
                      {crt.status}
                    </span>
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
                    onClick={() => setViewingCourt(crt)}
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
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${crt.status === 'ACTIVE'
                        ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      title={crt.status === 'ACTIVE' ? 'Set to Maintenance' : 'Activate Court'}
                    >
                      {crt.status === 'ACTIVE' ? 'Pause' : 'Activate'}
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
        subtitle="Specify parent venue, sport category, court label, surface material, player capacity, and description."
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

            {/* ── Inline Category Creator (by Owner) ── */}
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
            <label className="block font-bold text-slate-700">Operational Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
            >
              <option value="ACTIVE">ACTIVE (Available for Reservations)</option>
              <option value="MAINTENANCE">MAINTENANCE (Temporarily Closed)</option>
            </select>
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
                <span className="text-[10px] font-bold text-slate-400 uppercase">Operational Status</span>
                <p className="font-bold text-emerald-700 text-sm">{viewingCourt.status}</p>
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
