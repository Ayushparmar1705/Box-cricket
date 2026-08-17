import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

const LoginPage = lazy(() => import('./features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const MetricsOverview = lazy(() => import('./features/auth/pages/MetricsOverview').then(module => ({ default: module.MetricsOverview })));
const OwnerApprovalModule = lazy(() => import('./features/auth/pages/OwnerApprovalModule'));
const VenuesModule = lazy(() => import('./features/auth/pages/VenuesModule').then(module => ({ default: module.VenuesModule })));
const CourtsModule = lazy(() => import('./features/auth/pages/CourtsModule').then(module => ({ default: module.CourtsModule })));
const BookingsModule = lazy(() => import('./features/auth/pages/BookingsModule').then(module => ({ default: module.BookingsModule })));
const PaymentsModule = lazy(() => import('./features/auth/pages/PaymentsModule').then(module => ({ default: module.PaymentsModule })));
const MasterDataModule = lazy(() => import('./features/auth/pages/MasterDataModule').then(module => ({ default: module.MasterDataModule })));

// Owner Routes
const OwnerDashboardPage = lazy(() => import('./features/owner/pages/OwnerDashboardPage').then(module => ({ default: module.OwnerDashboardPage })));
const OwnerOverview = lazy(() => import('./features/owner/pages/OwnerOverview').then(module => ({ default: module.OwnerOverview })));
const OwnerVenues = lazy(() => import('./features/owner/pages/OwnerVenues').then(module => ({ default: module.OwnerVenues })));
const OwnerCourts = lazy(() => import('./features/owner/pages/OwnerCourts').then(module => ({ default: module.OwnerCourts })));
const OwnerBookings = lazy(() => import('./features/owner/pages/OwnerBookings').then(module => ({ default: module.OwnerBookings })));

const UsersStaffModule = lazy(() => import('./features/auth/pages/UsersStaffModule').then(module => ({ default: module.UsersStaffModule })));
const AuditLogsModule = lazy(() => import('./features/auth/pages/AuditLogsModule').then(module => ({ default: module.AuditLogsModule })));
const CategoryModule = lazy(() => import('./features/auth/pages/CategoryModule'));
const CityModule = lazy(() => import('./features/auth/pages/CityModule'));
const UserAuthPage = lazy(() => import('./features/auth/pages/UserAuthPage').then(module => ({ default: module.UserAuthPage })));

// Player Routes
const PlayerDashboardPage = lazy(() => import('./features/player/pages/PlayerDashboardPage').then(module => ({ default: module.PlayerDashboardPage })));
const PlayerOverview = lazy(() => import('./features/player/pages/PlayerOverview').then(module => ({ default: module.PlayerOverview })));
const PlayerProfile = lazy(() => import('./features/player/pages/PlayerProfile').then(module => ({ default: module.PlayerProfile })));


/* Check if user is logged in */
function isAuthenticated() {
  return Boolean(localStorage.getItem('bc_admin_session') || localStorage.getItem('user'));
}

/* Get appropriate redirect path based on user role */
function getRedirectPath() {
  if (localStorage.getItem('bc_admin_session')) {
    return '/dashboard/overview';
  }

  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      const user = userData?.user || userData?.data?.user || userData;

      if (user?.role === 'Owner') {
        return '/owner/dashboard';
      } else if (user?.role === 'Player' || user?.role === 'User') {
        return '/home/discover';
      }
    } catch (e) {
      console.error('Error parsing user data from localStorage', e);
    }
  }
  return '/dashboard/overview'; // Fallback
}

/* Redirect to login if not authenticated */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

/* Redirect to appropriate dashboard if already logged in */
function PublicRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <Navigate to={getRedirectPath()} replace /> : <>{children}</>;
}

function App() {
  useEffect(() => {
    if (isAuthenticated()) {
      // User is authenticated
    }
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center text-lg text-gray-500">Loading...</div>}>
          <Routes>
            {/* Admin Login */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

            {/* User Auth (Registration & Login) */}
            <Route path="/user-auth" element={<PublicRoute><UserAuthPage /></PublicRoute>} />

            {/* Owner App */}
            <Route path="/owner" element={<ProtectedRoute><OwnerDashboardPage /></ProtectedRoute>}>
              <Route index element={<Navigate to="/owner/dashboard" replace />} />
              <Route path="dashboard" element={<OwnerOverview />} />
              <Route path="venues" element={<OwnerVenues />} />
              <Route path="courts" element={<OwnerCourts />} />
              <Route path="bookings" element={<OwnerBookings />} />
              <Route path="analytics" element={<div className="p-8 text-slate-500 font-bold">Analytics coming soon...</div>} />
            </Route>

            {/* Player App (Normal Users) */}
            <Route path="/home" element={<ProtectedRoute><PlayerDashboardPage /></ProtectedRoute>}>
              <Route index element={<Navigate to="/home/discover" replace />} />
              <Route path="discover" element={<PlayerOverview />} />
              <Route path="profile" element={<PlayerProfile />} />
              {/* Placeholder for bookings */}
              <Route path="bookings" element={<div className="p-8 text-slate-500 font-bold">My Bookings coming soon...</div>} />
            </Route>

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
            <Route path="*" element={<Navigate to={isAuthenticated() ? getRedirectPath() : '/login'} replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
