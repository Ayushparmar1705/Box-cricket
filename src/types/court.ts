export type CourtStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Court {
  id: string | number;
  venue_id: string | number;
  venue_name?: string;
  category_id?: string | number;
  category_name?: string;
  name: string;
  court_name?: string;
  category?: string; // e.g. Box Cricket, Turf Football
  surface?: string; // e.g. Artificial Grass, Vinyl, Wooden
  surface_type?: string;
  price_per_hour?: number;
  dimensions?: string;
  max_players?: number;
  has_floodlights?: boolean;
  has_scoreboard?: boolean;
  status: CourtStatus;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
