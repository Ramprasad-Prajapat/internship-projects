// FaceTrack AI — RoleBasedRoute (Phase 1).
// Restricts a route to specific roles. A logged-in user with the wrong role is
// redirected to their own dashboard. Assumes it is nested inside ProtectedRoute.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardPathForRole } from '../utils/constants';
import LoadingScreen from '../components/common/LoadingScreen';

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { role, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!allowedRoles.includes(role)) {
    return <Navigate to={dashboardPathForRole(role)} replace />;
  }

  return children;
}
