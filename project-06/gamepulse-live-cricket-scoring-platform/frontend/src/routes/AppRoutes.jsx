import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Home from '../pages/public/Home';
import Scoreboard from '../pages/public/Scoreboard';
import Tournaments from '../pages/public/Tournaments';
import Leaderboards from '../pages/public/Leaderboards';
import SearchPage from '../pages/public/SearchPage';
import ScorerDashboard from '../pages/admin/ScorerDashboard';
import CreateMatch from '../pages/admin/CreateMatch';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

const ProtectedRoute = ({ children, requireScorer = false, requireAdmin = false }) => {
  const { user, isScorer, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireScorer && !isScorer) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scoreboard/:id" element={<Scoreboard />} />
      <Route path="/tournaments" element={<Tournaments />} />
      <Route path="/leaderboards" element={<Leaderboards />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Scorer & Admin Routes */}
      <Route
        path="/scorer"
        element={
          <ProtectedRoute requireScorer={true}>
            <ScorerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scorer/:id"
        element={
          <ProtectedRoute requireScorer={true}>
            <ScorerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-match"
        element={
          <ProtectedRoute requireScorer={true}>
            <CreateMatch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
