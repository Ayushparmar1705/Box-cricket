import type { Venue } from '../types/venue';

// Mocked initial data
const MOCK_VENUES: Venue[] = [
  {
    id: '1',
    owner_id: '2',
    city_id: 'mum_1',
    venue_name: 'Premium Box Cricket Andheri',
    description: 'A premium box cricket turf featuring high-quality artificial grass, floodlights, and professional scoreboards.',
    address: 'Link Road, Andheri West',
    contact_number: '9876543210',
    email: 'contact@premiumboxandheri.com',
    opening_time: '06:00:00',
    closing_time: '23:59:00',
    cancellation_policy: 'Strict 24 hour cancellation.',
    status: 'ACTIVE',
    average_rating: 4.8,
    total_reviews: 124,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cover_image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
    amenities: ['Parking', 'Washroom', 'Floodlights', 'Drinking Water']
  },
  {
    id: '2',
    owner_id: '2',
    city_id: 'mum_2',
    venue_name: 'Bandra Turf Arena',
    description: 'Spacious turf suitable for 6v6 matches. Located centrally in Bandra.',
    address: 'Bandra Kurla Complex, Bandra East',
    contact_number: '9876543211',
    email: 'info@bandraturf.com',
    opening_time: '05:00:00',
    closing_time: '22:00:00',
    cancellation_policy: 'Flexible 12 hour cancellation.',
    status: 'ACTIVE',
    average_rating: 4.5,
    total_reviews: 89,
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
    cover_image: 'https://images.unsplash.com/photo-1588636734005-7f97fb5eddf0?auto=format&fit=crop&q=80&w=800',
    amenities: ['Washroom', 'Floodlights', 'Cafeteria']
  }
];

export const venueService = {
  getVenues: async (): Promise<Venue[]> => {
    // Simulating API call
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_VENUES), 800));
  },
  getVenueById: async (id: string): Promise<Venue> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const venue = MOCK_VENUES.find(v => v.id === id);
        if (venue) resolve(venue);
        else reject(new Error('Venue not found'));
      }, 500);
    });
  },
  createVenue: async (data: Partial<Venue>): Promise<Venue> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVenue = { ...data, id: String(Date.now()), is_active: true, status: 'ACTIVE' } as Venue;
        MOCK_VENUES.push(newVenue);
        resolve(newVenue);
      }, 800);
    });
  },
  updateVenue: async (id: string, data: Partial<Venue>): Promise<Venue> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_VENUES.findIndex(v => v.id === id);
        if (index > -1) {
          MOCK_VENUES[index] = { ...MOCK_VENUES[index], ...data, updated_at: new Date().toISOString() };
          resolve(MOCK_VENUES[index]);
        } else reject(new Error('Venue not found'));
      }, 800);
    });
  },
  deleteVenue: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_VENUES.findIndex(v => v.id === id);
        if (index > -1) {
          MOCK_VENUES[index].is_active = false;
          MOCK_VENUES[index].status = 'BLOCKED';
        }
        resolve();
      }, 800);
    });
  }
};
