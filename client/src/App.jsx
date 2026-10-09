import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResourcesPage from './pages/ResourcePage';
import SnippetsPage from './pages/SnippetsPage';
import TasksPage from './pages/TasksPage';
// Temporary pages until we build the CRUD interfaces
function ComingSoon({ title }) {
  return (
    <main className="page-container">
      <h1>{title}</h1>
      <p>This section is coming soon.</p>
    </main>
  );
}
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <p>Loading DevShelf...</p>;
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? '/resources' : '/login'}
            replace
          />
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/resources" replace />
            : <LoginPage />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated
            ? <Navigate to="/resources" replace />
            : <RegisterPage />
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/resources"
          element={
            <>
              <Navbar />
              <ResourcesPage />
            </>
          }
        />
        <Route
          path="/snippets"
          element={
            <>
              <Navbar />
              <SnippetsPage />
            </>
          }
        />
        <Route
          path="/tasks"
          element={
            <>
              <Navbar />
              <TasksPage />
            </>
          }
        />
      </Route>
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}