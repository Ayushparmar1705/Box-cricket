// ============================================================================
// File: PricingManager.tsx
// Description: UI UX Pro Max - Dynamic Hourly Pricing & Surcharge Rules Manager
// Integrates with backend facility-service at: http://localhost:3040/api/pricing
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  RefreshCw,
  Clock,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Filter,
  Search,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Services
import {
  fetchAllPricingRulesApi,
  createPricingRuleApi,
  updatePricingRuleApi,
  deletePricingRuleApi,
  type PricingRuleItem,
  type PricingRulePayload,
  type DayType,
} from '../services/pricingService';
import { fetchCourtsApi, type CourtItem } from '../services/courtService';

// Common Modals & Loading
import CommonModal from '../../Components/Common/CommonModal';
import CommonConfirmModal from '../../Components/Common/CommonConfirmModal';
import CommonLoadingBar from '../../Components/Common/CommonLoadingBar';

export default function PricingManager() {
  // ── 1. Data States ──────────────────────────────────────────────────────────
  const [pricingRules, setPricingRules] = useState<PricingRuleItem[]>([]);
  const [courts, setCourts] = useState<CourtItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  // ── 2. Filters & Search ─────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCourtFilter, setSelectedCourtFilter] = useState<string>('ALL');
  const [selectedDayTypeFilter, setSelectedDayTypeFilter] = useState<string>('ALL');

  // ── 3. Modals State ─────────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<PricingRuleItem | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<PricingRuleItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ── 4. Form State ───────────────────────────────────────────────────────────
  const initialForm: PricingRulePayload = {
    court_id: 1,
    day_type: 'WEEKDAY',
    start_time: '09:00',
    end_time: '18:00',
    price: 800,
    valid_from: '',
    valid_to: '',
  };
  const [formData, setFormData] = useState<PricingRulePayload>(initialForm);

  // ── 5. Load Data from Backend ───────────────────────────────────────────────
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedRules, fetchedCourts] = await Promise.all([
        fetchAllPricingRulesApi().catch(() => []),
        fetchCourtsApi().catch(() => []),
      ]);

      setPricingRules(fetchedRules);
      setCourts(fetchedCourts);

      // Default the form court to the first available court if present
      if (fetchedCourts.length > 0) {
        initialForm.court_id = Number(fetchedCourts[0].id);
      }
    } catch (err: any) {
      console.error('Error loading pricing data:', err);
      toast.error('Failed to load pricing rules from server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── 7. Map Court Names to Pricing Rules for Display ─────────────────────────
  const courtsMap = useMemo(() => {
    const map = new Map<number, { name: string; venue: string }>();
    courts.forEach((c) => {
      map.set(Number(c.id), {
        name: c.court_name || c.courtNumber || `Court #${c.id}`,
        venue: c.venue_name || 'Arena Ground',
      });
    });
    return map;
  }, [courts]);

  // ── 8. Filtered Pricing Rules ───────────────────────────────────────────────
  const filteredRules = useMemo(() => {
    return pricingRules.filter((rule) => {
      // Court Filter
      if (selectedCourtFilter !== 'ALL' && String(rule.court_id) !== String(selectedCourtFilter)) {
        return false;
      }
      // Day Type Filter
      if (selectedDayTypeFilter !== 'ALL' && rule.day_type !== selectedDayTypeFilter) {
        return false;
      }
      // Search Keyword
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const courtInfo = courtsMap.get(rule.court_id);
        const matchCourt = courtInfo?.name.toLowerCase().includes(query) || false;
        const matchVenue = courtInfo?.venue.toLowerCase().includes(query) || false;
        const matchPrice = String(rule.price).includes(query);
        const matchDay = rule.day_type.toLowerCase().includes(query);
        const matchTime = `${rule.start_time} ${rule.end_time}`.toLowerCase().includes(query);
        return matchCourt || matchVenue || matchPrice || matchDay || matchTime;
      }
      return true;
    });
  }, [pricingRules, selectedCourtFilter, selectedDayTypeFilter, searchTerm, courtsMap]);

  // ── 9. Executive Metrics Computation ────────────────────────────────────────
  const metrics = useMemo(() => {
    const total = pricingRules.length;
    const weekdayRules = pricingRules.filter((r) => r.day_type === 'WEEKDAY');
    const weekendRules = pricingRules.filter((r) => r.day_type === 'WEEKEND');
    const holidayRules = pricingRules.filter((r) => r.day_type === 'HOLIDAY');

    const avgWeekdayPrice = weekdayRules.length
      ? Math.round(weekdayRules.reduce((sum, r) => sum + r.price, 0) / weekdayRules.length)
      : 0;

    const avgWeekendPrice = weekendRules.length
      ? Math.round(weekendRules.reduce((sum, r) => sum + r.price, 0) / weekendRules.length)
      : 0;

    return {
      total,
      weekdayCount: weekdayRules.length,
      weekendCount: weekendRules.length,
      holidayCount: holidayRules.length,
      avgWeekdayPrice,
      avgWeekendPrice,
    };
  }, [pricingRules]);

  // ── 10. Modal Open Handlers ─────────────────────────────────────────────────
  const handleOpenAdd = () => {
    const defaultCourtId = courts[0] ? Number(courts[0].id) : 1;
    setFormData({
      ...initialForm,
      court_id: defaultCourtId,
      day_type: 'WEEKDAY',
      start_time: '09:00',
      end_time: '18:00',
      price: 800,
      valid_from: '',
      valid_to: '',
    });
    setEditingRule(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (rule: PricingRuleItem) => {
    setEditingRule(rule);
    setFormData({
      court_id: rule.court_id,
      day_type: rule.day_type,
      start_time: rule.start_time.substring(0, 5), // "09:00:00" -> "09:00"
      end_time: rule.end_time.substring(0, 5),     // "18:00:00" -> "18:00"
      price: rule.price,
      valid_from: rule.valid_from || '',
      valid_to: rule.valid_to || '',
    });
    setShowAddModal(true);
  };

  // ── 11. Submit Handler (Create or Update Rule) ──────────────────────────────
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.court_id) {
      return toast.error('Please select a target court');
    }
    if (!formData.start_time || !formData.end_time) {
      return toast.error('Start time and end time are required');
    }
    if (formData.start_time >= formData.end_time) {
      return toast.error('Start time must be earlier than end time');
    }
    if (!formData.price || formData.price <= 0) {
      return toast.error('Price must be greater than 0');
    }
    if (formData.valid_from && formData.valid_to && formData.valid_from > formData.valid_to) {
      return toast.error('Valid from date cannot be after valid to date');
    }

    setIsSubmitting(true);
    setIsActionLoading(true);

    try {
      if (editingRule) {
        // Update existing rule via PUT /api/pricing/{id}
        await updatePricingRuleApi(editingRule.id, formData);
        toast.success('🎉 Pricing rule updated successfully!');
      } else {
        // Create new rule via POST /api/pricing/create
        await createPricingRuleApi(formData);
        toast.success('🎉 New pricing rule configured!');
      }

      setShowAddModal(false);
      setEditingRule(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
      setIsActionLoading(false);
    }
  };

  // ── 12. Delete Handler ──────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return;
    setIsActionLoading(true);
    try {
      await deletePricingRuleApi(ruleToDelete.id);
      toast.success('Pricing rule removed successfully');
      setRuleToDelete(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete pricing rule');
    } finally {
      setIsActionLoading(false);
    }
  };

  // ── Helper: Badge Color by Day Type ─────────────────────────────────────────
  const getDayTypeBadge = (dayType: DayType) => {
    switch (dayType) {
      case 'WEEKDAY':
        return {
          label: 'Weekday (Mon - Fri)',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'WEEKEND':
        return {
          label: 'Weekend Peak (Sat - Sun)',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
        };
      case 'HOLIDAY':
        return {
          label: 'Holiday Special Rate',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ── Header & Action Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </span>
            <span>Court Pricing Rules & Hourly Rates</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure dynamic time-window prices, weekday/weekend peak rates, and holiday specials.
          </p>
        </div>

        <div className="flex items-center gap-3 ml-auto flex-wrap sm:flex-nowrap">
          {/* Refresh Button */}
          <button
            onClick={loadData}
            disabled={isLoading || isActionLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh pricing rules"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Add New Pricing Rule Button */}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pricing Rule</span>
          </button>
        </div>
      </div>

      {/* ── Executive Metrics Summary Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Rules</div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.total}</div>
          <div className="text-[11px] text-slate-500">Configured in arena</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Avg Weekday Rate</div>
          <div className="text-2xl font-extrabold text-emerald-700">₹{metrics.avgWeekdayPrice.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{metrics.weekdayCount} rules active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Avg Weekend Rate</div>
          <div className="text-2xl font-extrabold text-indigo-700">₹{metrics.avgWeekendPrice.toLocaleString()}</div>
          <div className="text-[11px] text-indigo-600 font-semibold">{metrics.weekendCount} rules active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Holiday Rules</div>
          <div className="text-2xl font-extrabold text-amber-700">{metrics.holidayCount}</div>
          <div className="text-[11px] text-slate-500">Special seasonal rates</div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by court, price, or time window..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="w-4 h-4 text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Court Filter */}
          {courts.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCourtFilter}
                onChange={(e) => setSelectedCourtFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer max-w-[150px] truncate"
              >
                <option value="ALL">All Courts</option>
                {courts.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.court_name || c.courtNumber}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Day Type Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDayTypeFilter}
              onChange={(e) => setSelectedDayTypeFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Day Types</option>
              <option value="WEEKDAY">Weekday</option>
              <option value="WEEKEND">Weekend</option>
              <option value="HOLIDAY">Holiday</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Action Loading Overlay ── */}
      {isActionLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs">
          <div className="p-6 rounded-3xl bg-white shadow-xl border border-slate-200 flex flex-col items-center gap-2">
            <CommonLoadingBar className="w-20 h-20" />
            <p className="text-xs font-bold text-slate-700 animate-pulse">
              Processing pricing rules...
            </p>
          </div>
        </div>
      )}

      {/* ── Rules Grid Display ── */}
      {isLoading ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <CommonLoadingBar className="w-24 h-24" />
          <h3 className="text-sm font-bold text-slate-800 animate-pulse">
            Loading Pricing Rules from Backend...
          </h3>
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="p-12 text-center space-y-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Pricing Rules Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || selectedCourtFilter !== 'ALL' || selectedDayTypeFilter !== 'ALL'
              ? 'No pricing rules match your active filters. Try clearing your filters.'
              : 'Click "Add Pricing Rule" above to configure your first hourly rate window.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pricing Rule</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRules.map((rule) => {
            const courtInfo = courtsMap.get(rule.court_id);
            const dayBadge = getDayTypeBadge(rule.day_type);

            return (
              <div
                key={rule.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Header Banner */}
                <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-50/50 to-white">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${dayBadge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dayBadge.dot}`} />
                      <span>{dayBadge.label}</span>
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 pt-1">
                      {courtInfo?.name || `Court #${rule.court_id}`}
                    </h3>
                    <p className="text-[11px] text-slate-500">{courtInfo?.venue || 'Arena Ground'}</p>
                  </div>

                  {/* Price Chip */}
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-emerald-700">₹{rule.price.toLocaleString()}</div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">per hour</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-2.5">
                    {/* Time Window */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-600 font-semibold">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Slot Time Window:</span>
                      </div>
                      <span className="font-extrabold text-slate-900">
                        {rule.start_time.substring(0, 5)} - {rule.end_time.substring(0, 5)}
                      </span>
                    </div>

                    {/* Validity Date Range (if set) */}
                    {(rule.valid_from || rule.valid_to) && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-600 font-semibold">
                          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>Validity Range:</span>
                        </div>
                        <span className="font-extrabold text-slate-900">
                          {rule.valid_from || 'Always'} → {rule.valid_to || 'Ongoing'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rule ID snippet & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono font-bold" title={`Rule #${rule.id}`}>
                      Rule #{rule.id}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(rule)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
                        title="Edit pricing rule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setRuleToDelete(rule)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                        title="Delete pricing rule"
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


      {/* ── MODAL: Create / Edit Pricing Rule ── */}
      <CommonModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingRule(null);
        }}
        title={editingRule ? 'Edit Pricing Rule' : 'Configure New Pricing Rule'}
        subtitle="Set the court, day category, start and end time window, and hourly booking rate."
        icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
        maxWidth="lg"
        theme="light"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
          {/* Target Court */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Target Court <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.court_id}
              onChange={(e) => setFormData({ ...formData, court_id: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
            >
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.court_name || c.courtNumber} ({c.venue_name || 'Arena Ground'})
                </option>
              ))}
            </select>
          </div>

          {/* Day Type Selection (Cards/Pills) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Applicable Day Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['WEEKDAY', 'WEEKEND', 'HOLIDAY'] as DayType[]).map((type) => {
                const isSelected = formData.day_type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, day_type: type })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {type === 'WEEKDAY' ? 'Weekday' : type === 'WEEKEND' ? 'Weekend' : 'Holiday'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Window (Start Time & End Time) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                End Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Time Window Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400">Presets:</span>
            {[
              { label: 'Morning (06:00 - 12:00)', start: '06:00', end: '12:00' },
              { label: 'Afternoon (12:00 - 18:00)', start: '12:00', end: '18:00' },
              { label: 'Prime Night (18:00 - 23:59)', start: '18:00', end: '23:59' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setFormData({ ...formData, start_time: p.start, end_time: p.end })}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Hourly Price Input */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Hourly Price (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-slate-400 text-sm">₹</span>
              <input
                type="number"
                min={1}
                step="0.5"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                placeholder="e.g. 850"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Quick Price Suggestion Chips */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400">Suggested:</span>
              {[600, 800, 1000, 1200, 1500].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setFormData({ ...formData, price: rate })}
                  className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200 transition-colors cursor-pointer"
                >
                  ₹{rate}
                </button>
              ))}
            </div>
          </div>

          {/* Effective Date Range (Optional) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-600">Valid From (Optional)</label>
              <input
                type="date"
                value={formData.valid_from || ''}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-600">Valid To (Optional)</label>
              <input
                type="date"
                value={formData.valid_to || ''}
                onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setEditingRule(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin text-white" />}
              <span>{editingRule ? 'Update Rule' : 'Save Rule'}</span>
            </button>
          </div>
        </form>
      </CommonModal>

      {/* ── MODAL: Delete Confirmation ── */}
      <CommonConfirmModal
        isOpen={ruleToDelete !== null}
        onClose={() => setRuleToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Pricing Rule?"
        message={`Are you sure you want to delete this pricing rule for ${courtsMap.get(ruleToDelete?.court_id || 0)?.name || 'Court'
          } (${ruleToDelete?.day_type} at ₹${ruleToDelete?.price}/hr)? This action cannot be undone.`}
        confirmText="Yes, Delete Rule"
        cancelText="Cancel"
        type="delete"
        isLoading={isActionLoading}
      />
    </div>
  );
}
