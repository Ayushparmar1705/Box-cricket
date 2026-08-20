import React, { useState, useEffect } from 'react';
import { CommonModal } from '../../../components/common/CommonModal';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import type { Venue } from '../../../types/venue';
import MapPicker from './MapPicker';

interface OwnerVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<boolean>;
  selectedVenue: Venue | null;
  cities: { id: number; name: string }[];
  submitting?: boolean;
}

export const OwnerVenueModal: React.FC<OwnerVenueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedVenue,
  cities,
  submitting = false,
}) => {
  const [formData, setFormData] = useState({
    venue_name: '',
    city_id: '',
    address: '',
    contact_number: '',
    email: '',
    opening_time: '06:00',
    closing_time: '23:00',
    description: '',
    cancellation_policy: 'Full refund if cancelled 24 hours prior to booking.',
  });

  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 19.0760,
    longitude: 72.8777,
  });

  // Prefill form when editing or opening
  useEffect(() => {
    if (selectedVenue) {
      setFormData({
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
          selectedVenue.cancellation_policy || 'Full refund if cancelled 24 hours prior to booking.',
      });
      if (selectedVenue.latitude && selectedVenue.longitude) {
        setCoords({
          latitude: Number(selectedVenue.latitude),
          longitude: Number(selectedVenue.longitude),
        });
      }
    } else {
      setFormData({
        venue_name: '',
        city_id: cities[0]?.id ? String(cities[0].id) : '1',
        address: '',
        contact_number: '',
        email: '',
        opening_time: '06:00',
        closing_time: '23:00',
        description: '',
        cancellation_policy: 'Full refund if cancelled 24 hours prior to booking.',
      });
      setCoords({
        latitude: 19.0760,
        longitude: 72.8777,
      });
    }
  }, [selectedVenue, cities, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (loc: { latitude: number; longitude: number; address?: string }) => {
    setCoords({
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    if (loc.address) {
      setFormData((prev) => ({ ...prev, address: loc.address || prev.address }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.venue_name || !formData.address || !formData.contact_number) {
      alert('Please fill in Venue Name, Address, and Contact Number.');
      return;
    }

    const payload = {
      ...formData,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedVenue ? 'Edit Venue' : 'Add New Venue'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Venue Name & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Venue Name *
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="venue_name"
                value={formData.venue_name}
                onChange={handleChange}
                placeholder="e.g. Apex Box Cricket Arena"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              City *
            </label>
            <select
              name="city_id"
              value={formData.city_id}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white cursor-pointer"
            >
              {cities.length > 0 ? (
                cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option value="1">Default City</option>
              )}
            </select>
          </div>
        </div>

        {/* Section 2: MapTiler Location Picker & Coordinates */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Ground Location (MapTiler Cloud)
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Drag marker or search area</span>
          </div>

          {/* Location Map Picker code */}
          <MapPicker></MapPicker>
        </div>

        {/* Section 3: Complete Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Complete Address *
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Plot 42, Ring Road, Near Sports Complex"
              required
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>
        </div>

        {/* Section 4: Contact Number & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contact Phone *
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. contact@apexcricket.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Opening & Closing Timings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Opening Time
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="time"
                name="opening_time"
                value={formData.opening_time}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Closing Time
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="time"
                name="closing_time"
                value={formData.closing_time}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Venue Description
          </label>
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Highlight special turf quality, floodlights, parking facilities, etc."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>
        </div>

        {/* Section 7: Cancellation Policy */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Cancellation Policy
          </label>
          <div className="relative">
            <ShieldAlert size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              name="cancellation_policy"
              value={formData.cancellation_policy}
              onChange={handleChange}
              placeholder="e.g. 100% refund before 24 hours"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-sm shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Saving...' : selectedVenue ? 'Update Venue' : 'Create Venue'}
          </button>
        </div>
      </form>
    </CommonModal>
  );
};

export default OwnerVenueModal;
