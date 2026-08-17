import React, { useState } from 'react';
import { MapPin, Plus, Loader2 } from 'lucide-react';
import { useVenues, useCreateVenue, useUpdateVenue, useDeleteVenue } from '../../../hooks/useVenues';
import { CommonModal } from '../../../components/common/CommonModal';
import { CommonForm } from '../../../components/common/CommonForm';
import { CommonTable } from '../../../components/common/CommonTable';
import type { FormField } from '../../../types/form.types';
import toast from 'react-hot-toast';
import Cityservice from '../../auth/service/Cityservice';

export const OwnerVenues = () => {
  const userStr = localStorage.getItem('user');
  let ownerId: string | number | undefined;
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      ownerId = userData?.user?.id || userData?.data?.user?.id || userData?.data?.id || userData?.id;
    } catch (e) {
      console.error('Error reading user data from localStorage', e);
    }
  }

  const { data: venuesData, isLoading } = useVenues(ownerId);
  const { mutateAsync: createVenue } = useCreateVenue();
  const { mutateAsync: updateVenue } = useUpdateVenue();
  const { mutateAsync: deleteVenue } = useDeleteVenue();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [searchValue, setSearchValue] = useState('');
  const [cities, setCities] = useState<{label: string, value: any}[]>([]);

  React.useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await Cityservice.getCity('ACTIVE');
        const data = await response.json();
        if (data?.data && Array.isArray(data.data)) {
          setCities(data.data.map((c: any) => ({ label: c.name, value: c.id })));
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };
    fetchCities();
  }, []);

  // Extract venues array (assuming API might wrap it or return directly)
  const venues = Array.isArray(venuesData) ? venuesData : venuesData?.data || [];
  
  const filteredVenues = venues.filter((v: any) => 
    (v.venue_name || v.venueName || '').toLowerCase().includes(searchValue.toLowerCase()) ||
    (v.address || '').toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleOpenModal = (venue?: any) => {
    setSelectedVenue(venue || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVenue(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedVenue) {
        await updateVenue({ id: selectedVenue.id, data: formData });
        toast.success("Venue updated successfully");
      } else {
        await createVenue(formData);
        toast.success("Venue created successfully");
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleDelete = async (venue: any) => {
    const venueName = venue.venue_name || venue.venueName || "this venue";
    if (window.confirm(`Are you sure you want to delete ${venueName}?`)) {
      try {
        await deleteVenue(venue.id);
        toast.success("Venue deleted successfully");
      } catch (error: any) {
        toast.error("Failed to delete venue");
      }
    }
  };

  const columns = [
    {
      key: 'venue_name',
      label: 'Venue Name',
      render: (v: any) => (
        <div className="font-semibold text-slate-900 dark:text-slate-100">{v.venue_name || v.venueName}</div>
      )
    },
    {
      key: 'address',
      label: 'Location',
      render: (v: any) => (
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <MapPin size={14} className="text-slate-400" />
          <span className="truncate max-w-[200px]">{v.address}</span>
        </div>
      )
    },
    {
      key: 'contact_number',
      label: 'Contact',
      render: (v: any) => <span>{v.contact_number || v.contactNumber || '-'}</span>
    },
    {
      key: 'email',
      label: 'Email',
      render: (v: any) => <span>{v.email || '-'}</span>
    }
  ];


  const formFields: FormField<any>[] = [
    { name: 'venue_name', label: 'Venue Name', type: 'text', required: true, placeholder: 'e.g. Premium Box Cricket' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your venue...' },
    { name: 'address', label: 'Full Address', type: 'text', required: true, placeholder: 'Venue address...' },
    { name: 'location', label: 'Location Map', type: 'location', halfWidth: false },
    { name: 'city_id', label: 'City', type: 'select', required: true, halfWidth: true, options: cities },
    { name: 'contact_number', label: 'Contact Phone', type: 'text', required: true, halfWidth: true, placeholder: '+91 XXXXXXXXXX' },
    { name: 'email', label: 'Contact Email', type: 'email', required: true, halfWidth: true, placeholder: 'hello@venue.com' },
    { name: 'opening_time', label: 'Opening Time', type: 'time', required: true, halfWidth: true },
    { name: 'closing_time', label: 'Closing Time', type: 'time', required: true, halfWidth: true },
    { name: 'Venue_amenities', label: 'Amenities (JSON format)', type: 'text', placeholder: 'e.g. ["WiFi", "Parking"]' },
    { name: 'cancellation_policy', label: 'Cancellation Policy', type: 'textarea', placeholder: 'Describe your cancellation rules...' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Venues</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Manage your sports venues and facilities.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Add Venue
        </button>
      </div>

      <CommonTable
        data={filteredVenues}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="No venues found."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search venues by name or address..."
        onEdit={(venue) => handleOpenModal(venue)}
        onDelete={(venue) => handleDelete(venue)}
      />

      <CommonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedVenue ? 'Edit Venue' : 'Add New Venue'}
      >
        <CommonForm
          fields={formFields}
          initialValues={selectedVenue || { opening_time: '06:00', closing_time: '23:00' }}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          mode={selectedVenue ? 'edit' : 'add'}
          submitLabel={selectedVenue ? 'Save Changes' : 'Create Venue'}
        />
      </CommonModal>
    </div>
  );
};
