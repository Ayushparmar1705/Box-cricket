import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './features/pages/AdminLogin';
import SuperAdminDashboard from './features/pages/SuperAdminDashboard';
import CountryManager from './features/pages/CountryManager';
import StateManager from './features/pages/StateManager';
import CityManager from './features/pages/CityManager';
import OwnerRequestManager from './features/pages/OwnerRequestManager';
import AdminLayout from './Components/Layout/AdminLayout';
import OwnerLayout from './Components/Layout/OwnerLayout';
import PlayerLogin from './features/pages/PlayerLogin';
import PlayerRegister from './features/pages/PlayerRegister';
import PlayerDashboard from './features/pages/PlayerDashboard';
import PlayerProfile from './features/pages/PlayerProfile';
import OwnerDashboard from './features/pages/OwnerDashboard';
import VenueManager from './features/pages/VenueManager';
import CourtManager from './features/pages/CourtManager';
import SlotManager from './features/pages/SlotManager';
import PricingManager from './features/pages/PricingManager';

function App() {
  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <Routes>
        {/* Public & Player Authentication Routes */}
        <Route path="/" element={<Navigate to="/player-login" replace />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/player-login" element={<PlayerLogin />} />
        <Route path="/player-register" element={<PlayerRegister />} />
        <Route path="/login" element={<Navigate to="/player-login" replace />} />
        <Route path="/register" element={<Navigate to="/player-register" replace />} />

        {/* Player App Routes */}
        <Route path="/player-dashboard" element={<PlayerDashboard />} />
        <Route path="/player-profile" element={<PlayerProfile />} />
        <Route path="/profile" element={<PlayerProfile />} />

        {/* Owner Portal Routes - All share OwnerLayout (sidebar + header) */}
        <Route element={<OwnerLayout />}>
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/owner-venues" element={<VenueManager />} />
          <Route path="/owner-courts" element={<CourtManager />} />
          <Route path="/owner-slots" element={<SlotManager />} />
          <Route path="/owner-pricing" element={<PricingManager />} />
          <Route path="/owner-profile" element={<PlayerProfile />} />
        </Route>

        {/* Super Admin Panel Routes - All share AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admindashboard" element={<SuperAdminDashboard />} />
          <Route path="/owner-requests" element={<OwnerRequestManager />} />
          <Route path="/countries" element={<CountryManager />} />
          <Route path="/states" element={<StateManager />} />
          <Route path="/cities" element={<CityManager />} />
          <Route path="/venues" element={<VenueManager />} />
          <Route path="/courts" element={<CourtManager />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
