import { useState, useEffect } from 'react';
import { ownerVenueService, getStoredOwner } from '../services/ownerVenueService';
import type { Venue } from '../../../types/venue';

export const useDashboard = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [owner, setOwner] = useState<any>(null);

  useEffect(() => {
    const user = getStoredOwner();
    setOwner(user);

    const fetchOverview = async () => {
      setLoading(true);
      try {
        const data = await ownerVenueService.getMyVenues();
        setVenues(data);
      } catch (err) {
        console.error('Error fetching dashboard overview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const totalVenues = venues.length;
  const activeVenues = venues.filter((v) => v.status === 'ACTIVE' || v.is_active).length;
  const recentVenues = venues.slice(0, 5);

  return {
    owner,
    venues,
    recentVenues,
    totalVenues,
    activeVenues,
    loading,
  };
};

export default useDashboard;
