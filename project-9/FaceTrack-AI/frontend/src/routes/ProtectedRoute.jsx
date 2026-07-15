// FaceTrack AI — ProtectedRoute (Phase 1).
// Requires an authenticated user; otherwise redirects to /login.
// Waits for the initial auth check so we don't flash the login page.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';
import LoadingScreen from '../components/common/LoadingScreen';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  return children;
}
