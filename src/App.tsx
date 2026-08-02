import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const LoginPage = lazy(() => import('./features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const MetricsOverview = lazy(() => import('./features/auth/pages/MetricsOverview').then(module => ({ default: module.MetricsOverview })));
const OwnerApprovalModule = lazy(() => import('./features/auth/pages/OwnerApprovalModule'));
const VenuesModule = lazy(() => import('./features/auth/pages/VenuesModule').then(module => ({ default: module.VenuesModule })));
const CourtsModule = lazy(() => import('./features/auth/pages/CourtsModule').then(module => ({ default: module.CourtsModule })));
const BookingsModule = lazy(() => import('./features/auth/pages/BookingsModule').then(module => ({ default: module.BookingsModule })));
const PaymentsModule = lazy(() => import('./features/auth/pages/PaymentsModule').then(module => ({ default: module.PaymentsModule })));
const MasterDataModule = lazy(() => import('./features/auth/pages/MasterDataModule').then(module => ({ default: module.MasterDataModule })));
const UsersStaffModule = lazy(() => import('./features/auth/pages/UsersStaffModule').then(module => ({ default: module.UsersStaffModule })));
const AuditLogsModule = lazy(() => import('./features/auth/pages/AuditLogsModule').then(module => ({ default: module.AuditLogsModule })));
const CategoryModule = lazy(() => import('./features/auth/pages/CategoryModule'));
const CityModule = lazy(() => import('./features/auth/pages/CityModule'));
const OwnerAuthPage = lazy(() => import('./features/auth/pages/OwnerAuthPage').then(module => ({ default: module.OwnerAuthPage })));


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
      <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center text-lg text-gray-500">Loading...</div>}>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          
          {/* Owner Auth */}
          <Route path="/owner-auth" element={<PublicRoute><OwnerAuthPage /></PublicRoute>} />

          {/* Dashboard layout with nested child routes — each is its own page */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<MetricsOverview />} />
            <Route path="owner-approvals" element={<OwnerApprovalModule />} />
            <Route path="venues" element={<VenuesModule />} />
            <Route path="courts" element={<CourtsModule />} />
            <Route path="bookings" element={<BookingsModule />} />
            <Route path="payments" element={<PaymentsModule />} />
            <Route path="master-data" element={<MasterDataModule />} />
            <Route path="users-staff" element={<UsersStaffModule />} />
            <Route path="categories" element={<CategoryModule />} />
            <Route path="cities" element={<CityModule />} />
            <Route path="audit-logs" element={<AuditLogsModule />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={isAuthenticated() ? '/dashboard/overview' : '/login'} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
