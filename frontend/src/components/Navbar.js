// Navigation Bar Component
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';
import { FiLogOut, FiMenu } from 'react-icons/fi';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  const navItems = {
    admin: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Bins', path: '/bins' },
      { name: 'Complaints', path: '/complaints' },
      { name: 'Routes', path: '/routes' },
      { name: 'Reports', path: '/reports' }
    ],
    worker: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'My Routes', path: '/routes' },
      { name: 'Bins', path: '/bins' },
      { name: 'Complaints', path: '/complaints' }
    ],
    citizen: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Report Issue', path: '/complaints' },
      { name: 'Nearby Bins', path: '/bins' }
    ]
  };

  const items = navItems[user.role] || [];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <h2>♻️ WasteManager</h2>
        </Link>

        <div className="navbar-menu">
          {items.map((item) => (
            <Link key={item.path} to={item.path} className="nav-link">
              {item.name}
            </Link>
          ))}
        </div>

        <div className="navbar-user">
          <span className="user-info">
            {user.name} ({user.role})
          </span>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
