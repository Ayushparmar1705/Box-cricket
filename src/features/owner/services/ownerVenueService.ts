import Api from '../../../Api';
import type { Venue } from '../../../types/venue';

// Helper to safely get the current logged in owner's ID
export const getStoredOwner = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      const user = parsed?.user || parsed?.data?.user || parsed?.data || parsed;
      return user;
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
  }
  return null;
};

export const getOwnerId = (): string | number => {
  const owner = getStoredOwner();
  return owner?.id || 1;
};

export const ownerVenueService = {
  // 1. Fetch all venues belonging to the logged in owner
  getMyVenues: async (): Promise<Venue[]> => {
    const ownerId = getOwnerId();
    const response = await fetch(Api.getVenuesByOwnerId(ownerId));
    if (!response.ok) {
      throw new Error('Failed to fetch venues');
    }
    const result = await response.json();
    const list = Array.isArray(result?.data) ? result.data : [];

    // Map backend properties to consistent Venue type
    return list.map((item: any) => ({
      id: item.id,
      owner_id: item.ownerId || item.owner_id || ownerId,
      city_id: item.cityId || item.city_id,
      venue_name: item.venueName || item.venue_name || 'Unnamed Venue',
      description: item.description || '',
      address: item.address || '',
      contact_number: item.contactNumber || item.contact_number || '',
      email: item.email || '',
      opening_time: item.openingTime || item.opening_time || '06:00:00',
      closing_time: item.closingTime || item.closing_time || '23:00:00',
      cancellation_policy: item.cancellationPolicy || item.cancellation_policy || '',
      status: item.status || 'ACTIVE',
      is_active: item.isActive ?? item.is_active ?? true,
      created_at: item.createdAt || item.created_at || new Date().toISOString(),
      updated_at: item.updatedAt || item.updated_at || new Date().toISOString(),
      latitude: item.latitude ? Number(item.latitude) : undefined,
      longitude: item.longitude ? Number(item.longitude) : undefined,
      google_map_link: item.googleMapLink || item.google_map_link || '',
      category_id: item.categoryId || item.category_id,
      cover_image: item.images?.[0]?.imageUrl || item.imageUrl || '',
      images: item.images?.map((img: any) => img.imageUrl) || [],
    }));
  },

  // 2. Create a new venue
  createVenue: async (formData: any): Promise<any> => {
    const ownerId = getOwnerId();
    const form = new FormData();

    form.append('venueName', formData.venue_name || formData.venueName || '');
    form.append('description', formData.description || '');
    form.append('address', formData.address || '');
    form.append('cityId', String(formData.city_id || formData.cityId || 1));
    form.append('contactNumber', formData.contact_number || formData.contactNumber || '');
    form.append('email', formData.email || '');

    const opTime = formData.opening_time || formData.openingTime || '06:00';
    form.append('openingTime', opTime.length === 5 ? `${opTime}:00` : opTime);

    const clTime = formData.closing_time || formData.closingTime || '23:00';
    form.append('closingTime', clTime.length === 5 ? `${clTime}:00` : clTime);

    form.append('cancellationPolicy', formData.cancellation_policy || formData.cancellationPolicy || 'Standard 24h cancellation');
    form.append('ownerId', String(ownerId));

    if (formData.latitude) form.append('latitude', String(formData.latitude));
    if (formData.longitude) form.append('longitude', String(formData.longitude));
    if (formData.latitude && formData.longitude) {
      form.append('googleMapLink', `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`);
    }

    // Handle image file
    const fileObj = formData.imageUrl || formData.image || formData.file;
    if (fileObj instanceof File) {
      form.append('imageUrl', fileObj);
    }

    const response = await fetch(Api.addVenue, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create venue');
    }

    return await response.json();
  },

  // 3. Fetch active cities for selection dropdown
  getCities: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await fetch(Api.getCity('ACTIVE'));
      if (!response.ok) return [];
      const result = await response.json();
      return Array.isArray(result?.data) ? result.data : [];
    } catch {
      return [];
    }
  },


  getCategory: async () => {
    try {
      const response = await fetch(Api.getCategory('Active'));
      const data = await response.json();
      return data;

    } catch (err) {
      return err;
    }
  }
};
