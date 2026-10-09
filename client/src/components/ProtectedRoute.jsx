import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Wait until the saved session has been checked
  if (loading) {
    return <p>Loading DevShelf...</p>;
  }

  // Redirect logged-out users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow authenticated users to access the page
  return <Outlet />;
}
