import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './features/pages/AdminLogin'
import SuperAdminDashboard from './features/pages/SuperAdminDashboard'
import CountryManager from './features/pages/CountryManager';
import StateManager from './features/pages/StateManager';
import CityManager from './features/pages/CityManager';
import AdminLayout from './Components/Layout/AdminLayout';

function App() {
  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/admin-login" replace />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* All routes inside AdminLayout will share the Sidebar & Header */}
        <Route element={<AdminLayout />}>
          <Route path="/admindashboard" element={<SuperAdminDashboard />} />
          <Route path="/countries" element={<CountryManager />} />
          <Route path="/states" element={<StateManager />} />
          <Route path="/cities" element={<CityManager />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
