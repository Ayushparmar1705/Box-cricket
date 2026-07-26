import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './features/auth/pages/LoginPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import { MetricsOverview } from './features/dashboard/components/MetricsOverview';
import { OwnerApprovalModule } from './features/dashboard/components/OwnerApprovalModule';
import { VenuesModule } from './features/dashboard/components/VenuesModule';
import { CourtsModule } from './features/dashboard/components/CourtsModule';
import { BookingsModule } from './features/dashboard/components/BookingsModule';
import { PaymentsModule } from './features/dashboard/components/PaymentsModule';
import { MasterDataModule } from './features/dashboard/components/MasterDataModule';
import { UsersStaffModule } from './features/dashboard/components/UsersStaffModule';
import { AuditLogsModule } from './features/dashboard/components/AuditLogsModule';

/* Check if user is logged in */
function isAuthenticated() {
  return Boolean(localStorage.getItem('bc_admin_session') || localStorage.getItem('user'));
}

/* Redirect to login if not authenticated */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

/* Redirect to dashboard if already logged in */
function PublicRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <Navigate to="/dashboard/overview" replace /> : <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Login */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Dashboard layout with nested child routes — each is its own page */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview"        element={<MetricsOverview />} />
          <Route path="owner-approvals" element={<OwnerApprovalModule />} />
          <Route path="venues"          element={<VenuesModule />} />
          <Route path="courts"          element={<CourtsModule />} />
          <Route path="bookings"        element={<BookingsModule />} />
          <Route path="payments"        element={<PaymentsModule />} />
          <Route path="master-data"     element={<MasterDataModule />} />
          <Route path="users-staff"     element={<UsersStaffModule />} />
          <Route path="audit-logs"      element={<AuditLogsModule />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? '/dashboard/overview' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
