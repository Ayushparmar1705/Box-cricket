import Api from '../../../Api';
import type { Court } from '../../../types/court';
import { ownerVenueService } from './ownerVenueService';

const COURTS_STORAGE_KEY = 'box_cricket_owner_courts';

// Helper to get cached courts from localStorage
const getStoredCourts = (): Court[] => {
  try {
    const raw = localStorage.getItem(COURTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored courts:', e);
  }
  return [
    {
      id: '1',
      venue_id: '1',
      venue_name: 'Apex Arena Alpha',
      category_id: '1',
      category_name: 'Box Cricket',
      name: 'Pitch 1 (Main Turf)',
      court_name: 'Pitch 1 (Main Turf)',
      surface: 'Artificial Turf',
      surface_type: 'Artificial Turf',
      price_per_hour: 1200,
      dimensions: '100 x 60 ft',
      max_players: 16,
      has_floodlights: true,
      has_scoreboard: true,
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      venue_id: '1',
      venue_name: 'Apex Arena Alpha',
      category_id: '1',
      category_name: 'Box Cricket',
      name: 'Pitch 2 (Practice Turf)',
      court_name: 'Pitch 2 (Practice Turf)',
      surface: 'Astro Turf',
      surface_type: 'Astro Turf',
      price_per_hour: 900,
      dimensions: '80 x 50 ft',
      max_players: 12,
      has_floodlights: true,
      has_scoreboard: false,
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

const saveStoredCourts = (courts: Court[]) => {
  try {
    localStorage.setItem(COURTS_STORAGE_KEY, JSON.stringify(courts));
  } catch (e) {
    console.error('Error saving courts to storage:', e);
  }
};

export const ownerCourtService = {
  // 1. Fetch all courts
  getMyCourts: async (): Promise<Court[]> => {
    // If backend court API endpoint exists in future, fetch here:
    // const response = await fetch(Api.getCourtsByOwner(ownerId));
    // For now, load stored / managed courts:
    return getStoredCourts();
  },

  // 2. Create a new court
  createCourt: async (formData: any): Promise<Court> => {
    const courts = getStoredCourts();
    const newCourt: Court = {
      id: Date.now().toString(),
      venue_id: formData.venue_id || formData.venueId || '1',
      venue_name: formData.venue_name,
      category_id: formData.category_id || formData.categoryId || '1',
      category_name: formData.category_name,
      name: formData.court_name || formData.name || 'New Court',
      court_name: formData.court_name || formData.name || 'New Court',
      surface: formData.surface_type || formData.surface || 'Artificial Turf',
      surface_type: formData.surface_type || formData.surface || 'Artificial Turf',
      price_per_hour: Number(formData.price_per_hour || 1000),
      dimensions: formData.dimensions || '100 x 60 ft',
      max_players: Number(formData.max_players || 14),
      has_floodlights: Boolean(formData.has_floodlights ?? true),
      has_scoreboard: Boolean(formData.has_scoreboard ?? true),
      status: formData.status || 'ACTIVE',
      is_active: formData.status !== 'INACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newCourt, ...courts];
    saveStoredCourts(updated);
    return newCourt;
  },

  // 3. Update an existing court
  updateCourt: async (id: string | number, formData: any): Promise<Court> => {
    const courts = getStoredCourts();
    const index = courts.findIndex((c) => String(c.id) === String(id));
    if (index === -1) throw new Error('Court not found');

    const updatedCourt: Court = {
      ...courts[index],
      venue_id: formData.venue_id || courts[index].venue_id,
      category_id: formData.category_id || courts[index].category_id,
      name: formData.court_name || formData.name || courts[index].name,
      court_name: formData.court_name || formData.name || courts[index].name,
      surface: formData.surface_type || formData.surface || courts[index].surface,
      surface_type: formData.surface_type || formData.surface || courts[index].surface_type,
      price_per_hour: Number(formData.price_per_hour ?? courts[index].price_per_hour),
      dimensions: formData.dimensions || courts[index].dimensions,
      max_players: Number(formData.max_players ?? courts[index].max_players),
      has_floodlights: Boolean(formData.has_floodlights ?? courts[index].has_floodlights),
      has_scoreboard: Boolean(formData.has_scoreboard ?? courts[index].has_scoreboard),
      status: formData.status || courts[index].status,
      is_active: formData.status ? formData.status !== 'INACTIVE' : courts[index].is_active,
      updated_at: new Date().toISOString(),
    };

    courts[index] = updatedCourt;
    saveStoredCourts(courts);
    return updatedCourt;
  },

  // 4. Delete a court
  deleteCourt: async (id: string | number): Promise<boolean> => {
    const courts = getStoredCourts();
    const filtered = courts.filter((c) => String(c.id) !== String(id));
    saveStoredCourts(filtered);
    return true;
  },

  // 5. Fetch helper options (venues & categories)
  getVenues: async () => {
    return ownerVenueService.getMyVenues();
  },

  getCategories: async () => {
    const res = await ownerVenueService.getCategory();
    return Array.isArray(res?.data) ? res.data : [];
  },
};
