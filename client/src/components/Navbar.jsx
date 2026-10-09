import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <NavLink to="/resources" className="brand">
        <span className="brand-icon">D</span>
        <span>DevShelf</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/resources" className={getLinkClass}>
          Resources
        </NavLink>

        <NavLink to="/snippets" className={getLinkClass}>
          Snippets
        </NavLink>

        <NavLink to="/tasks" className={getLinkClass}>
          Tasks
        </NavLink>
      </div>

      <div className="nav-user">
        <span className="user-name">
          {user?.userName || 'Developer'}
        </span>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
