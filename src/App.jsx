import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext.jsx';

import Layout from './components/layout/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import POSPage from './pages/POSPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import KitchenPage from './pages/KitchenPage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ActivityLogsPage from './pages/ActivityLogsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

// Each role's sensible landing page — used both for the bare "/" redirect
// and for bouncing a user away from a route their role can't access.
// Matches the real backend's defaultRouteFor() from the Phase 2 refactor.
function defaultRouteFor(role) {
  if (role === 'kitchen') return '/kitchen';
  if (role === 'cashier') return '/pos';
  return '/dashboard';
}

// roles: array of allowed roles, or omitted/empty to allow any authenticated user.
function Guard({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={defaultRouteFor(user.role)} replace />;
  }
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  return (
    <>
      {/* react-hot-toast's own portal component — renders toast
          notifications above everything else regardless of where
          toast.success()/toast.error() is called from in the tree. */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#33312D', color: '#F6F6F4',
            borderRadius: '12px', fontSize: '13px', fontWeight: 500,
          },
        }}
      />

      <Routes>
        <Route
          path="/login"
          element={
            // If already logged in, don't show the login page again —
            // bounce straight to that role's default page.
            !loading && user ? <Navigate to={defaultRouteFor(user.role)} replace /> : <LoginPage />
          }
        />

        {/* Layout is a parent route: everything nested inside it renders
            through Layout's <Outlet/>, sharing the sidebar/topbar chrome. */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to={user ? defaultRouteFor(user.role) : '/login'} replace />} />
          <Route path="dashboard" element={<Guard roles={['admin']}><DashboardPage /></Guard>} />
          <Route path="pos" element={<Guard roles={['admin', 'cashier']}><POSPage /></Guard>} />
          <Route path="orders" element={<Guard roles={['admin', 'cashier']}><OrdersPage /></Guard>} />
          <Route path="kitchen" element={<Guard roles={['admin', 'kitchen']}><KitchenPage /></Guard>} />
          <Route path="menu" element={<Guard roles={['admin']}><MenuPage /></Guard>} />
          <Route path="reports" element={<Guard roles={['admin']}><ReportsPage /></Guard>} />
          <Route path="users" element={<Guard roles={['admin']}><UsersPage /></Guard>} />
          <Route path="activity-logs" element={<Guard roles={['admin']}><ActivityLogsPage /></Guard>} />
          <Route path="settings" element={<Guard roles={['admin']}><SettingsPage /></Guard>} />
        </Route>

        {/* Catch-all — anything unmatched bounces to root, which itself
            redirects based on auth state. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
