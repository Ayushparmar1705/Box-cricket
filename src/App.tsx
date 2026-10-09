import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './features/pages/AdminLogin'
import SuperAdminDashboard from './features/pages/SuperAdminDashboard'
import CountryManager from './features/pages/CountryManager';
import StateManager from './features/pages/StateManager';
import CityManager from './features/pages/CityManager';
import OwnerRequestManager from './features/pages/OwnerRequestManager';
import AdminLayout from './Components/Layout/AdminLayout';
import PlayerLogin from './features/pages/PlayerLogin';
import PlayerRegister from './features/pages/PlayerRegister';
import PlayerDashboard from './features/pages/PlayerDashboard';
import PlayerProfile from './features/pages/PlayerProfile';

function App() {
  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/player-login" replace />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/player-login" element={<PlayerLogin />} />
        <Route path="/player-register" element={<PlayerRegister />} />
        <Route path="/player-dashboard" element={<PlayerDashboard />} />
        <Route path="/player-profile" element={<PlayerProfile />} />
        <Route path="/profile" element={<PlayerProfile />} />
        <Route path="/login" element={<Navigate to="/player-login" replace />} />
        <Route path="/register" element={<Navigate to="/player-register" replace />} />

        {/* All routes inside AdminLayout will share the Sidebar & Header */}
        <Route element={<AdminLayout />}>
          <Route path="/admindashboard" element={<SuperAdminDashboard />} />
          <Route path="/owner-requests" element={<OwnerRequestManager />} />
          <Route path="/countries" element={<CountryManager />} />
          <Route path="/states" element={<StateManager />} />
          <Route path="/cities" element={<CityManager />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
