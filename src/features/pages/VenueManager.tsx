import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── API Services ────────────────────────────────────────────────────────────
// All venue endpoints communicate with facility-service at http://localhost:3040/api/venues
import {
  createVenueApi,
  fetchMyVenuesApi,
  activateVenueApi,
  deactivateVenueApi,
  type VenueItem
} from '../services/venueService';
import { fetchCitiesApi, type CityItem } from '../services/cityService';

// ── Reusable Common Components ──────────────────────────────────────────────
import CommonTable, { type TableColumn } from '../../Components/Common/CommonTable';
import CommonModal from '../../Components/Common/CommonModal';
import CommonConfirmModal from '../../Components/Common/CommonConfirmModal';
import VenueLocationPicker from '../../Components/Common/VenueLocationPicker';

// ── Default Initial Form State (12 Venue Fields) ───────────────────────────
const initialVenueForm = {
  city_id: 1,                                                          // FK → cities table
  venue_name: '',                                                      // VARCHAR(150)
  description: '',                                                     // TEXT
  address: '',                                                         // TEXT (Street address)
  latitude: 23.04009,                                                  // DECIMAL (GPS Lat)
  longitude: 72.52904,                                                 // DECIMAL (GPS Lng)
  google_map_link: 'https://www.google.com/maps?q=23.04009,72.52904',  // TEXT
  contact_number: '',                                                  // VARCHAR
  email: '',                                                           // VARCHAR
  opening_time: '06:00:00',                                            // TIME
  closing_time: '23:00:00',                                            // TIME
  cancellation_policy: 'Free cancellation up to 4 hours before slot time', // TEXT
  image: null as File | null,                                          // Venue photo
};

interface VenueManagerProps {
  onVenuesUpdated?: () => void;
  showTitle?: boolean;
}

export default function VenueManager({ onVenuesUpdated, showTitle = true }: VenueManagerProps) {
  // ============================================================================
  // SECTION 1: COMPONENT STATE
  // Beginner note: useState holds current data that React displays on screen.
  // ============================================================================

  // 1. Venues fetched from backend (http://localhost:3040/api/venues)
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState<boolean>(true);

  // 2. Dropdown list of cities fetched from location-service
  const [availableCities, setAvailableCities] = useState<CityItem[]>([]);

  // 3. Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<boolean>(true); // true = Active, false = Deactivated

  // 4. Form state for adding a new venue
  const [venueForm, setVenueForm] = useState(initialVenueForm);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 5. Modals visibility state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueItem | null>(null); // For View Details modal
  const [venueToDelete, setVenueToDelete] = useState<VenueItem | null>(null); // For Confirm Delete modal
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // ============================================================================
  // SECTION 2: API CALLS (VERY LOW TOUGHNESS / BEGINNER FRIENDLY)
  // ============================================================================

  /**
   * API CALL #1: Load Owner's Venues
   * Calls: GET http://localhost:3040/api/venues?status=true/false
   */
  const loadVenues = async (status: boolean = filterActive) => {
    setIsLoadingVenues(true);
    try {
      const response = await fetchMyVenuesApi(status);
      const list = Array.isArray(response) ? response : (response?.data || []);
      setVenues(list);
      if (onVenuesUpdated) onVenuesUpdated();
    } catch {
      setVenues([]);
    } finally {
      setIsLoadingVenues(false);
    }
  };

  /**
   * Run once on page load:
   * 1. Fetch cities for the City Dropdown
   * 2. Load the active venues table
   */
  useEffect(() => {
    // Fetch cities for city_id dropdown
    fetchCitiesApi(true)
      .then((res) => {
        const cityList = Array.isArray(res) ? res : (res?.data || []);
        setAvailableCities(cityList);
        if (cityList.length > 0) {
          setVenueForm((prev) => ({ ...prev, city_id: Number(cityList[0].id) }));
        }
      })
      .catch(() => {});

    loadVenues(filterActive);
  }, []);

  /**
   * API CALL #2: Add New Venue
   * Calls: POST http://localhost:3040/api/venues
   */
  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step 1: Simple validation
    if (!venueForm.venue_name.trim()) return toast.error('Please enter a Venue Name');
    if (!venueForm.contact_number.trim()) return toast.error('Please enter contact phone number');
    if (!venueForm.email.trim()) return toast.error('Please enter contact email');
    if (!venueForm.address.trim()) return toast.error('Please enter street address');

    setIsSubmitting(true);
    try {
      // Step 2: Send all 12 fields to http://localhost:3040/api/venues
      const response = await createVenueApi({
        venue_name: venueForm.venue_name.trim().slice(0, 150),
        name: venueForm.venue_name.trim().slice(0, 150),
        city_id: Number(venueForm.city_id),
        city: Number(venueForm.city_id),
        description: venueForm.description || `${venueForm.venue_name} - Box cricket arena`,
        address: venueForm.address,
        latitude: Number(venueForm.latitude) || 23.04009,
        longitude: Number(venueForm.longitude) || 72.52904,
        google_map_link: venueForm.google_map_link,
        contact_number: venueForm.contact_number,
        phone_number: venueForm.contact_number,
        email: venueForm.email,
        opening_time: venueForm.opening_time,
        closing_time: venueForm.closing_time,
        cancellation_policy: venueForm.cancellation_policy,
        image: venueForm.image,
      });

      // Step 3: Show success toast and reload table
      toast.success(response.message || `🎉 ${venueForm.venue_name} created successfully!`);
      await loadVenues(filterActive);

      // Step 4: Close modal and reset form
      setShowAddModal(false);
      setVenueForm({
        ...initialVenueForm,
        city_id: availableCities.length > 0 ? Number(availableCities[0].id) : 1,
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create venue');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * API CALL #3: Toggle Venue Status (Deactivate / Soft Delete OR Restore)
   * Calls: PUT http://localhost:3040/api/venues?venueid=ID&status=true/false
   */
  const handleConfirmStatusChange = async () => {
    if (!venueToDelete) return;
    setIsDeleting(true);
    try {
      if (venueToDelete.is_active === false) {
        // Activate (Restore)
        await activateVenueApi(venueToDelete.id);
        toast.success(`🎉 Venue "${venueToDelete.name}" activated!`);
      } else {
        // Deactivate (Delete)
        await deactivateVenueApi(venueToDelete.id);
        toast.success(`⚠️ Venue "${venueToDelete.name}" deactivated.`);
      }
      setVenueToDelete(null);
      await loadVenues(filterActive);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update venue status');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter venues based on user search box
  const filteredVenues = useMemo(() => {
    if (!searchQuery.trim()) return venues;
    const q = searchQuery.toLowerCase();
    return venues.filter(
      (v) =>
        (v.venue_name || v.name).toLowerCase().includes(q) ||
        (v.contact_number || v.phone_number || '').includes(q) ||
        (v.email || '').toLowerCase().includes(q)
    );
  }, [venues, searchQuery]);

  // ============================================================================
  // SECTION 3: TABLE COLUMNS CONFIGURATION
  // ============================================================================
  const venueColumns: TableColumn<VenueItem>[] = [
    {
      header: 'Venue & Address',
      accessor: 'name',
      render: (item: VenueItem) => {
        // Lookup city name using city_id
        const cityName =
          availableCities.find((c) => String(c.id) === String(item.city_id || item.city))
            ?.city_name || `City #${item.city_id || item.city}`;
        const venueTitle = item.venue_name || item.name;

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold overflow-hidden shadow-xs">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={venueTitle} className="w-full h-full object-cover" />
              ) : (
                <Building2 size={18} />
              )}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">{venueTitle}</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-emerald-600 shrink-0" />
                <span className="font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  {cityName}
                </span>
                {item.address && (
                  <span className="text-slate-500 truncate max-w-[180px]" title={item.address}>
                    • {item.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Timings',
      accessor: 'opening_time',
      render: (item: VenueItem) => (
        <div className="text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
            <Clock size={12} className="text-amber-500" />
            {item.opening_time} - {item.closing_time}
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">Daily Slots</span>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      accessor: 'phone_number',
      render: (item: VenueItem) => (
        <div className="text-xs space-y-0.5">
          <div className="font-semibold text-slate-800 flex items-center gap-1">
            <Phone size={12} className="text-emerald-600" />
            <span>{item.contact_number || item.phone_number}</span>
          </div>
          <div className="text-[11px] text-slate-500 truncate max-w-xs flex items-center gap-1">
            <Mail size={12} className="text-slate-400" />
            <span>{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'GPS & Map',
      accessor: 'google_map_link',
      render: (item: VenueItem) => (
        <div className="text-xs space-y-0.5">
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <MapPin size={11} className="text-emerald-600" />
            <span>
              {Number(item.latitude || 0).toFixed(4)}, {Number(item.longitude || 0).toFixed(4)}
            </span>
          </div>
          {item.google_map_link && (
            <a
              href={item.google_map_link}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 hover:text-emerald-700 font-semibold underline text-[11px] inline-flex items-center gap-0.5"
            >
              Open in Maps <ExternalLink size={10} />
            </a>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (item: VenueItem) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            item.is_active !== false
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.is_active !== false ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          <span>{item.is_active !== false ? 'Active' : 'Inactive'}</span>
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
    },
  ];

  // ============================================================================
  // SECTION 4: USER INTERFACE (UI) RENDER
  // ============================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Toolbar Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {showTitle && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>
                {filterActive ? 'My Active Venues' : 'Deactivated Venues'} ({filteredVenues.length})
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live box cricket grounds connected to facility service (http://localhost:3040/api/venues)
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 ml-auto flex-wrap sm:flex-nowrap">
          {/* Active / Inactive Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterActive ? 'true' : 'false'}
              onChange={(e) => {
                const isAct = e.target.value === 'true';
                setFilterActive(isAct);
                loadVenues(isAct);
              }}
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="true">Active Venues</option>
              <option value="false">Deactivated Venues</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => loadVenues(filterActive)}
            disabled={isLoadingVenues}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingVenues ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Open Add Venue Modal */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>List New Venue</span>
          </button>
        </div>
      </div>

      {/* ── Search Input ── */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search venue by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
        />
      </div>

      {/* ── Venues Table View ── */}
      {isLoadingVenues ? (
        <div className="p-12 text-center space-y-3 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Loading Venues from Facility Service...</h3>
        </div>
      ) : filteredVenues.length === 0 ? (
        <div className="p-12 text-center space-y-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <Building2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            {filterActive ? 'No Active Venues Found' : 'No Deactivated Venues Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterActive
              ? 'Click "List New Venue" above to add your first box cricket arena.'
              : 'There are no deactivated venues in the archive.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <CommonTable<VenueItem>
            columns={venueColumns}
            data={filteredVenues}
            onView={(item) => setSelectedVenue(item)}
            onEdit={(item) => setSelectedVenue(item)}
            onDelete={(item) => setVenueToDelete(item)}
            onRestore={(item) => setVenueToDelete(item)}
            isActive={filterActive}
            theme="light"
          />
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>Showing {filteredVenues.length} grounds ({filterActive ? 'Active' : 'Deactivated'})</span>
            <span>API: http://localhost:3040/api/venues</span>
          </div>
        </div>
      )}

      {/* ======================================================================== */}
      {/* MODAL 1: ADD NEW TURF (POST http://localhost:3040/api/venues)           */}
      {/* ======================================================================== */}
      <CommonModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="List New Box Cricket Turf"
        subtitle="Fill in ground specifications, timings, and select map coordinates"
        icon={<Building2 className="w-5 h-5" />}
        maxWidth="2xl"
        theme="light"
      >
        <form onSubmit={handleCreateVenue} className="space-y-4 text-xs">
          {/* Row 1: Venue Name & City Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Venue Name (venue_name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={150}
                placeholder="e.g. Apex Box Cricket Arena"
                value={venueForm.venue_name}
                onChange={(e) => setVenueForm({ ...venueForm, venue_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                City (city_id - Dropdown) <span className="text-rose-500">*</span>
              </label>
              <select
                value={venueForm.city_id}
                onChange={(e) => setVenueForm({ ...venueForm, city_id: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium cursor-pointer"
              >
                {availableCities.length > 0 ? (
                  availableCities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.city_name} (ID: {c.id})
                    </option>
                  ))
                ) : (
                  <option value={1}>Mumbai (Default ID: 1)</option>
                )}
              </select>
            </div>
          </div>

          {/* Row 2: Street Address */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Street Address (address) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Plot 12, Link Road, Near Sports Complex, Andheri West"
              value={venueForm.address}
              onChange={(e) => setVenueForm({ ...venueForm, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* Row 3: Venue Location Map & Coordinates Picker */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <VenueLocationPicker
              value={{
                address: venueForm.address,
                latitude: venueForm.latitude,
                longitude: venueForm.longitude,
              }}
              onChange={(loc) => {
                setVenueForm((prev) => ({
                  ...prev,
                  address: loc.address,
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                  google_map_link: `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`,
                }));
              }}
            />
          </div>

          {/* Row 4: Contact Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Contact Phone (contact_number) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={venueForm.contact_number}
                onChange={(e) => setVenueForm({ ...venueForm, contact_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Contact Email (email) <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="owner@apexarena.com"
                value={venueForm.email}
                onChange={(e) => setVenueForm({ ...venueForm, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 5: Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Opening Time (opening_time)
              </label>
              <input
                type="time"
                step="1"
                value={venueForm.opening_time}
                onChange={(e) => setVenueForm({ ...venueForm, opening_time: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Closing Time (closing_time)
              </label>
              <input
                type="time"
                step="1"
                value={venueForm.closing_time}
                onChange={(e) => setVenueForm({ ...venueForm, closing_time: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 6: Cancellation Policy */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Cancellation Policy (cancellation_policy)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Free cancellation up to 4 hours before slot time. No refund for no-shows."
              value={venueForm.cancellation_policy}
              onChange={(e) => setVenueForm({ ...venueForm, cancellation_policy: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
            />
          </div>

          {/* Row 7: Description */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Description (description)
            </label>
            <textarea
              rows={2}
              placeholder="Ground dimensions (e.g. 100ft x 60ft), high-density turf, LED floodlights..."
              value={venueForm.description}
              onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
            />
          </div>

          {/* Row 8: Venue Photo */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Venue Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setVenueForm({ ...venueForm, image: file });
              }}
              className="w-full text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            />
          </div>

          {/* Form Submit & Cancel Buttons */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to API...</span>
                </>
              ) : (
                <span>Submit Venue</span>
              )}
            </button>
          </div>
        </form>
      </CommonModal>

      {/* ======================================================================== */}
      {/* MODAL 2: VIEW VENUE DETAILS                                             */}
      {/* ======================================================================== */}
      <CommonModal
        isOpen={!!selectedVenue}
        onClose={() => setSelectedVenue(null)}
        title={selectedVenue?.venue_name || selectedVenue?.name}
        subtitle={selectedVenue ? `Venue ID #${selectedVenue.id} • Owner #${selectedVenue.owner_id}` : undefined}
        icon={<Building2 className="w-5 h-5" />}
        maxWidth="2xl"
        theme="light"
      >
        {selectedVenue && (
          <div className="space-y-5 text-xs">
            {selectedVenue.imageUrl && (
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={selectedVenue.imageUrl}
                  alt={selectedVenue.venue_name || selectedVenue.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 4 Details Grid Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">City</span>
                <p className="font-bold text-slate-900 text-sm">
                  {availableCities.find((c) => String(c.id) === String(selectedVenue.city_id || selectedVenue.city))
                    ?.city_name || `City #${selectedVenue.city_id || selectedVenue.city}`}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Operating Timings</span>
                <p className="font-bold text-emerald-700 text-sm">
                  {selectedVenue.opening_time} - {selectedVenue.closing_time}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Phone</span>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedVenue.contact_number || selectedVenue.phone_number}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                <p className="font-bold text-slate-900 text-sm truncate">{selectedVenue.email}</p>
              </div>
            </div>

            {/* Street Address */}
            {selectedVenue.address && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Street Address</span>
                <p className="text-slate-800 font-medium">{selectedVenue.address}</p>
              </div>
            )}

            {/* Description */}
            {selectedVenue.description && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Description</span>
                <p className="text-slate-700">{selectedVenue.description}</p>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedVenue(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </CommonModal>

      {/* ======================================================================== */}
      {/* MODAL 3: CONFIRM DELETE / RESTORE                                        */}
      {/* ======================================================================== */}
      <CommonConfirmModal
        isOpen={!!venueToDelete}
        onClose={() => setVenueToDelete(null)}
        onConfirm={handleConfirmStatusChange}
        type={venueToDelete?.is_active === false ? 'activate' : 'deactivate'}
        title={venueToDelete?.is_active === false ? 'Confirm Activation' : 'Confirm Deactivation'}
        message={
          <p>
            Are you sure you want to{' '}
            <span className="font-semibold text-slate-800">
              {venueToDelete?.is_active === false ? 'activate' : 'deactivate'}
            </span>{' '}
            venue{' '}
            <span className="font-bold text-slate-900">
              "{venueToDelete?.venue_name || venueToDelete?.name}"
            </span>
            ?
          </p>
        }
        confirmText={venueToDelete?.is_active === false ? 'Activate' : 'Deactivate'}
        isLoading={isDeleting}
        theme="light"
      />
    </div>
  );
}
